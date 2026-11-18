import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const apps = fileURLToPath(new URL("../../", import.meta.url));
const directory = resolve(apps, ".runtime", "python");
const python = resolve(directory, "python.exe");
const archive = resolve(apps, ".runtime", "python-3.12.10.zip");
const bootstrap = resolve(apps, ".runtime", "get-pip.py");

async function download(url, path) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok)
    throw new Error(
      `Download failed with HTTP ${response.status} from ${new URL(url).hostname}.`,
    );
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
}

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: apps,
      env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Setup command exited with ${code}.`)),
    );
  });
}

if (process.platform !== "win32" || process.arch !== "x64")
  throw new Error(
    "This setup downloads Windows x64 Python. On other platforms, install requirements-python.txt in a Python 3.12 environment and set CLASSROOM_PYTHON.",
  );
await mkdir(directory, { recursive: true });
try {
  await access(python);
} catch {
  console.log("Downloading portable Python 3.12.10 from python.org.");
  try {
    await access(archive);
  } catch {
    await download(
      "https://www.python.org/ftp/python/3.12.10/python-3.12.10-embed-amd64.zip",
      archive,
    );
  }
  await run(
    "pwsh.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "$ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath $env:CLASSROOM_ARCHIVE -DestinationPath $env:CLASSROOM_PYTHON_ROOT -Force",
    ],
    {
      ...process.env,
      CLASSROOM_ARCHIVE: archive,
      CLASSROOM_PYTHON_ROOT: directory,
    },
  );
}
const pthPath = resolve(directory, "python312._pth");
let pth = (await readFile(pthPath, "utf8")).replace(
  "#import site",
  "import site",
);
if (!pth.includes("Lib/site-packages")) pth += "\nLib/site-packages\n";
await writeFile(pthPath, pth);
await mkdir(resolve(directory, "Lib", "site-packages"), { recursive: true });
try {
  await access(resolve(directory, "Lib", "site-packages", "pip"));
} catch {
  console.log("Preparing pip from the official PyPA bootstrap.");
  await download("https://bootstrap.pypa.io/get-pip.py", bootstrap);
  await run(python, [bootstrap, "--no-warn-script-location"]);
}
await run(python, [
  "-m",
  "pip",
  "install",
  "--disable-pip-version-check",
  "--no-warn-script-location",
  "-r",
  resolve(apps, "foundations-runtime", "requirements-python.txt"),
]);
console.log(`Workspace Python is ready at ${python}`);
