import { readFile } from "node:fs/promises";
import { createZip } from "../../foundations-runtime/zip.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
export const releases = JSON.parse(await read("../../foundations-runtime/releases.json"));

export async function starterFiles(language) {
  const common = {
    ".env.example": "OPENAI_API_KEY=\nOPENAI_MODEL=gpt-6-astra\n",
    ".gitignore": ".env\nnode_modules/\n.venv/\n__pycache__/\n",
  };
  if (language === "python")
    return {
      ...common,
      "main.py": await read("./examples/first_agent.py"),
      "requirements.txt": `openai-agents==${releases.python.version}\n`,
      "README.md":
        "# Python classroom agent\n\nRequires Python 3.10+. In PowerShell run\n\n```powershell\npy -3 -m venv .venv\n.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt\n$env:OPENAI_API_KEY = Read-Host 'API key'\n.\\.venv\\Scripts\\python.exe main.py\n```\n\nThe direct SDK dependency is pinned. To record the resolved transitive environment, run `.\\.venv\\Scripts\\python.exe -m pip freeze > requirements.lock.txt`. The script reads the process environment. API calls use your account.\n",
    };
  return {
    ...common,
    "main.ts": await read("./examples/first-agent.ts"),
    "package.json": await read("./examples/starter-typescript/package.json"),
    "package-lock.json": await read(
      "./examples/starter-typescript/package-lock.json",
    ),
    "README.md":
      "# TypeScript classroom agent\n\nRequires Node.js 24+. Native Node executes this example's erasable TypeScript syntax. In PowerShell run\n\n```powershell\nnpm ci\nCopy-Item .env.example .env\nnotepad .env\nnpm start\n```\n\nSet OPENAI_API_KEY in .env. OPENAI_MODEL selects a model available to your project. Direct dependencies and the transitive lockfile are pinned. API calls use your account.\n",
  };
}

export async function starterArchive(language) {
  return createZip(await starterFiles(language));
}

export async function verifyReleases(signal) {
  const urls = [releases.typescript.registry, releases.python.registry];
  const results = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url, { signal });
      if (!response.ok)
        throw new Error(`Package registry returned HTTP ${response.status}.`);
      return response.json();
    }),
  );
  return {
    checkedAt: new Date().toISOString(),
    typescript: results[0].version,
    python: results[1].info.version,
    pinnedTypescript: releases.typescript.version,
    pinnedPython: releases.python.version,
  };
}
