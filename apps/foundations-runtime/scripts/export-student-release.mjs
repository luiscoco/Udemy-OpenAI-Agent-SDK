import { readdir, readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createZip } from "../zip.mjs";
import { pilotLessons } from "../teaching/pilot-lessons.mjs";

const apps = fileURLToPath(new URL("../../", import.meta.url));
const destination = resolve(apps, "student-release");
await mkdir(destination, { recursive: true });
const files = {};
const productionFolder = resolve(apps, "teaching-pilot/prompt-005/production");
const production = JSON.parse(
  await readFile(resolve(productionFolder, "production.json"), "utf8"),
);
for (const [name, expected] of [
  ["lesson-005.mp4", production.videoSha256],
  ["captions.srt", production.captionSha256],
]) {
  const actual = createHash("sha256")
    .update(await readFile(resolve(productionFolder, name)))
    .digest("hex");
  if (!production.audioVerified || actual !== expected)
    throw new Error(
      "Finish producing and verifying Prompt 5 before exporting the student release.",
    );
}
const excludedDirectories = new Set([
  "node_modules",
  ".git",
  ".cache",
  ".runtime",
  ".venv",
  "__pycache__",
  "recordings",
  "generated",
  "test-results",
  "playwright-report",
  "uploads",
]);
async function collect(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name))
        await collect(
          resolve(directory, entry.name),
          `${prefix}/${entry.name}`,
        );
    } else {
      if (entry.name.startsWith(".env") && entry.name !== ".env.example")
        continue;
      if (/\.(?:db|sqlite|sqlite3|log|webm|mp4|wav|pyc)$/i.test(entry.name))
        continue;
      const contents = await readFile(resolve(directory, entry.name));
      files[`${prefix}/${entry.name}`] = /\.(?:md|html|txt)$/i.test(entry.name)
        ? contents
            .toString("utf8")
            .replaceAll(
              "C:\\OpenAI Agent SDK Master 200 AI-Powered Implementation Prompts",
              ".",
            )
        : contents;
    }
  }
}
await collect(resolve(apps, "foundations-runtime"), "apps/foundations-runtime");
const appFolders = (await readdir(apps, { withFileTypes: true })).filter(
  (entry) => entry.isDirectory() && /^prompt-\d{3}-/.test(entry.name),
);
for (const entry of appFolders)
  await collect(resolve(apps, entry.name), `apps/${entry.name}`);
for (const name of [
  "package.json",
  "package-lock.json",
  ".gitignore",
  "Dockerfile",
])
  files[`apps/${name}`] = await readFile(resolve(apps, name));
files["apps/.env.example"] =
  "# Optional configuration for live model requests\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-6-astra\n";

for (const lesson of pilotLessons) {
  const folder = `prompt-${String(lesson.number).padStart(3, "0")}`;
  const original = await readFile(
    resolve(apps, "teaching-pilot", folder, "student-worksheet.html"),
    "utf8",
  );
  files[`apps/teaching-pilot/${folder}/student-worksheet.html`] = original
    .replaceAll(
      "C:\\OpenAI Agent SDK Master 200 AI-Powered Implementation Prompts\\apps",
      ".\\apps",
    )
    .replace('<a href="instructor-guide.html">Instructor guide</a>', "");
  for (const asset of ["pilot.css", "syntax.css", "openai-icon.svg"])
    files[`apps/teaching-pilot/${folder}/assets/${asset}`] = await readFile(
      resolve(apps, "teaching-pilot", folder, "assets", asset),
    );
}
files["apps/teaching-pilot/assets/pilot.css"] = await readFile(
  resolve(apps, "foundations-runtime/public/pilot.css"),
);
files["apps/teaching-pilot/index.html"] =
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent Academy — Student lessons</title><link rel="stylesheet" href="assets/pilot.css"><body class="pilot-guide"><main class="pilot-shell"><h1>Agent Academy student lessons</h1><p>Start an application from the apps directory, then open its printed localhost URL. This bundle contains 200 applications and ${pilotLessons.length} student worksheets.</p><nav class="pilot-nav"><a href="prompt-005/production/index.html">Watch Prompt 5</a></nav>${pilotLessons.map((lesson) => `<article class="pilot-card"><h2>Prompt ${lesson.number} · ${lesson.title}</h2><a href="prompt-${String(lesson.number).padStart(3, "0")}/student-worksheet.html">Open student worksheet</a><pre>npm run lesson:${lesson.number}</pre></article>`).join("")}</main></body></html>`;
for (const name of [
  "lesson-005.mp4",
  "captions.srt",
  "captions.vtt",
  "index.html",
  "preview.png",
  "production.json",
])
  files[`apps/teaching-pilot/prompt-005/production/${name}`] = await readFile(
    resolve(apps, "teaching-pilot/prompt-005/production", name),
  );
files["README.md"] =
  `# Agent Academy student release\n\nThis bundle contains all 200 application folders, the shared runtime, syntax highlighting, ${pilotLessons.length} printable student worksheets and the narrated Prompt 5 video.\n\n## Start on Windows\n\nInstall Node.js 24 or later. Extract the ZIP to a normal folder. In Windows Terminal open that extracted folder, then run the following commands.\n\n\`\`\`powershell\nSet-Location .\\apps\nnpm ci\nnpm run lesson:5\n\`\`\`\n\nOpen http://localhost:3105. Keep the terminal running while using the app. Press Ctrl+C to stop it. Other lessons use npm run lesson:NUMBER, from 2 through 200, and port 3100 plus the lesson number. For example, lesson 12 opens http://localhost:3112.\n\nPrompt 1 has its own project. From apps, enter prompt-001-product-map, run npm ci and npm start, then open http://localhost:3101.\n\nClassroom mode uses the local fixtures described by each app. Prompts that execute Python require Python and the setup steps in their application README. Optional provider demonstrations have their own dependencies. Read the selected app's run guide when using those features.\n\n## Practice and expected results\n\nOpen apps/teaching-pilot/index.html to find the student worksheets and Prompt 5 video. Each worksheet contains the learning objective, scenarios, expected evidence, exercises and assessment questions. The app's execution evidence and knowledge check provide additional feedback.\n\nPrompt 5 compares result.finalOutput in TypeScript and result.final_output in Python. Prompt 12 resolves the selected user, language and application into instructions. Prompt 13 compares application-code prompt versions and language values. Prompt 14 compares actual base and cloned agent configurations.\n\n## Optional live configuration\n\nCreate a local .env from the selected app's .env.example and configure your own project credentials and accessible model. Restart that app before using Live API. The sample environment values in this release are examples for local configuration.\n\nThe narrated video uses a synthetic English voice, Microsoft Zira Desktop, and contains visible captions. Its classroom execution scope is explained in the narration.\n\nmanifest.json lists the packaged files and SHA-256 hashes.\n`;
if (appFolders.length !== 200)
  throw new Error(
    `Expected 200 application folders, found ${appFolders.length}.`,
  );
for (const name of Object.keys(files)) {
  if (
    name
      .split("/")
      .some((part) => part.startsWith(".env") && part !== ".env.example")
  )
    throw new Error(`Private environment file in release: ${name}`);
}
const manifest = {
  applications: appFolders.length,
  worksheets: pilotLessons.map((lesson) => lesson.number),
  files: Object.entries(files).map(([name, content]) => ({
    name,
    bytes: Buffer.byteLength(content),
    sha256: createHash("sha256").update(content).digest("hex"),
  })),
};
files["manifest.json"] = JSON.stringify(manifest, null, 2);
const archive = createZip(files);
await writeFile(resolve(destination, "agent-academy-student.zip.tmp"), archive);
await rename(
  resolve(destination, "agent-academy-student.zip.tmp"),
  resolve(destination, "agent-academy-student.zip"),
);
await writeFile(resolve(destination, "manifest.json"), files["manifest.json"]);
await writeFile(resolve(destination, "README.md"), files["README.md"]);
await writeFile(
  resolve(destination, "SHA256.txt"),
  `${createHash("sha256").update(archive).digest("hex")}  agent-academy-student.zip\n`,
);
console.log(
  `Exported ${appFolders.length} apps, ${pilotLessons.length} worksheets and Prompt 5 video in ${Object.keys(files).length} files (${archive.length} bytes).`,
);
