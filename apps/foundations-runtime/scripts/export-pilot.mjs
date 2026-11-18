import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { pilotLessons } from "../teaching/pilot-lessons.mjs";
import {
  teachingFiles,
  teachingArchive,
  escapeHtml,
} from "../teaching/materials.mjs";

const directory = fileURLToPath(
  new URL("../../teaching-pilot/", import.meta.url),
);
await mkdir(directory, { recursive: true });
await mkdir(resolve(directory, "assets"), { recursive: true });
await writeFile(
  resolve(directory, "assets/pilot.css"),
  await readFile(new URL("../public/pilot.css", import.meta.url)),
);
await writeFile(
  resolve(directory, "assets/openai-icon.svg"),
  await readFile(new URL("../public/assets/openai-icon.svg", import.meta.url)),
);
const index = [];
for (const lesson of pilotLessons) {
  const name = `prompt-${String(lesson.number).padStart(3, "0")}`;
  const folder = resolve(directory, name);
  const files = await teachingFiles(lesson.number);
  for (const [filename, content] of Object.entries(files)) {
    const target = resolve(folder, filename);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
  const archive = await teachingArchive(lesson.number);
  await writeFile(resolve(folder, archive.filename), archive.bytes);
  index.push({
    number: lesson.number,
    title: lesson.title,
    folder: name,
    archive: archive.filename,
    files: Object.keys(files),
    video: existsSync(resolve(folder, "production/index.html")),
  });
}
await writeFile(
  resolve(directory, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent Academy — Teaching pilot</title><link rel="icon" href="assets/openai-icon.svg"><link rel="stylesheet" href="assets/pilot.css"><body class="pilot-guide"><main class="pilot-shell"><header class="pilot-brand"><a href="index.html">Agent Academy<span>OpenAI Agents SDK</span></a><span>Teaching pilot</span></header><section class="pilot-guide-hero"><div><h1>Teach agents through runnable lessons</h1><p class="pilot-lead">${pilotLessons.length} lesson packages with narration, storyboards, student exercises and instructor notes.</p></div><img class="pilot-icon" src="assets/openai-icon.svg" alt="OpenAI icon" width="96" height="96"></section>${index.map((item) => `<article class="pilot-card"><h2>Prompt ${item.number} · ${escapeHtml(item.title)}</h2><nav class="pilot-nav"><a href="${item.folder}/student-worksheet.html">Student worksheet</a><a href="${item.folder}/instructor-guide.html">Instructor guide</a><a href="${item.folder}/narration.txt">Narration</a><a href="${item.folder}/storyboard.csv">Storyboard</a><a href="${item.folder}/${item.archive}" download>Download pack</a>${item.video ? `<a href="${item.folder}/production/index.html">Watch narrated lesson</a>` : ""}</nav><pre>npm run lesson:${item.number}</pre><p>Open http://localhost:${3100 + item.number} after starting the app from the course workspace's apps directory.</p></article>`).join("")}<footer class="pilot-footer">OpenAI icon belongs to OpenAI. Classroom and live execution details are documented in each lesson.</footer></main></body></html>`,
);
await writeFile(
  resolve(directory, "manifest.json"),
  JSON.stringify(
    {
      lessons: index,
      visualReference:
        "https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c32-app",
      iconSource: "https://developers.openai.com/favicon.svg",
    },
    null,
    2,
  ),
);
await writeFile(
  resolve(directory, "README.md"),
  `# OpenAI Agents SDK teaching pilot\n\nOpen index.html to browse the ${pilotLessons.length} packages, or start one application from the course workspace's apps directory.\n\n\`\`\`powershell\nSet-Location 'C:\\OpenAI Agent SDK Master 200 AI-Powered Implementation Prompts\\apps'\n${pilotLessons.map((lesson) => `npm run lesson:${lesson.number}`).join("\n")}\n\`\`\`\n\nRun each application in its own terminal. The default ports are ${pilotLessons.map((lesson) => 3100 + lesson.number).join(", ")}. Each application links to its student worksheet, instructor guide and downloadable teaching ZIP.\n\n## Package contents\n\nEach folder contains a printable student worksheet, an instructor guide with answer keys and assessment rubric, narration.txt, storyboard.csv, source snapshots, a SHA-256 source map and a ZIP archive. Recording and verification images are stored in each folder's recordings directory when generated. The ZIP contains teaching materials and source snapshots.\n\n## Narrated Prompt 5 video\n\nOpen prompt-005/production/index.html for the finished 1080p lesson with synthetic English narration and captions. Its README documents the reusable production format and rebuild command npm run produce:lesson5.\n\n## Recording the pilot\n\n\`\`\`powershell\nnpm run record:pilot\n# Capture only the new lessons\nnode foundations-runtime/scripts/record-pilot.mjs 12 13 14\n\`\`\`\n\nThe capture script compares classroom scenarios, opens relevant source, and uses the stored review's approval and rejection buttons in prompt 127. The WebM footage is silent. Use narration.txt to record the spoken explanation and time the edit with storyboard.csv.\n\n## Refreshing the materials\n\n\`\`\`powershell\nnpm run pilot:export\nnpm run test:pilot\nnpm run test:e2e -- pilot.spec.mjs\n\`\`\`\n\nThe export uses the current source files. The source-map hashes and tests help identify changes that need a matching walkthrough update.\n\n## Design reference\n\nThe interface follows the user-provided [C32 application](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c32-app), including its centered layout, blue and lavender cards, large text, section navigation and light/dark controls. The pilot uses the unchanged [official OpenAI documentation icon](https://developers.openai.com/favicon.svg). The OpenAI icon belongs to OpenAI.\n\nThe pilot styling applies to prompts ${pilotLessons.map((lesson) => lesson.number).join(", ")}. The classroom behavior and live configuration are explained in each lesson package.\n`,
);
console.log(`Exported ${index.length} teaching packages to ${directory}`);
