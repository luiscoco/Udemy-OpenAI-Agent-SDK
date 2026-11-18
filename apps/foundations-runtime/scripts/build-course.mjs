import { readFile, writeFile, mkdir } from "node:fs/promises";
import { courseModule, courseScenarios } from "../course/index.mjs";
const root = new URL("../../../", import.meta.url);
const prompts = JSON.parse(
  await readFile(new URL("output/infographic-prompts.json", root), "utf8"),
).filter((row) => row.number >= 95);
const catalog = prompts.map((row) => ({
  ...row,
  slug: row.title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  headline: row.title,
  summary: row.prompt,
  question: `What should you inspect in the ${row.title.toLowerCase()} exercise?`,
  answers: [
    "The execution evidence and scenario outcome",
    "Only the application title",
    "Only the source filename",
  ],
  correct: 0,
  explanation:
    "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
  live: false,
  category: row.section.replace(/^\d+\.\s*/, ""),
}));
await writeFile(
  new URL("apps/foundations-runtime/remaining-catalog.mjs", root),
  `export const remainingLessons = ${JSON.stringify(catalog, null, 2)};\n`,
);
const controls = Object.fromEntries(
  prompts.map((row) => [
    row.number,
    [
      {
        key: "scenario",
        label: row.title + " scenario",
        options: courseScenarios[row.number].map((value) => [
          value,
          value.replaceAll("-", " "),
        ]),
      },
    ],
  ]),
);
const hints = Object.fromEntries(
  prompts.map((row) => [
    row.number,
    `Compare the scenarios, then expand the evidence. ${[131, 153, 154, 161, 166, 168, 187, 188, 189, 190, 191].includes(row.number) ? "Provider behavior uses labeled fixtures. Companion integration code describes live setup." : "Classroom model decisions are deterministic. SDK calls and application operations execute locally."}`,
  ]),
);
await writeFile(
  new URL("apps/foundations-runtime/public/remaining-lessons.js", root),
  `export const remainingControls=${JSON.stringify(controls, null, 2)};\nexport const remainingHints=${JSON.stringify(hints, null, 2)};\nexport function remainingPreview(number,input){return JSON.stringify({prompt:number,scenario:input.scenario??remainingControls[number][0].options[0][0],execution:'Local SDK and application exercise'},null,2);}\n`,
);
const pkg = JSON.parse(
  await readFile(new URL("apps/package.json", root), "utf8"),
);
for (const lesson of catalog) {
  const pythonSetup = [161, 162, 163, 164, 165, 190, 191].includes(
    lesson.number,
  )
    ? "npm run setup:python\n"
    : "";
  const folder = `prompt-${String(lesson.number).padStart(3, "0")}-${lesson.slug}`;
  const path = new URL(`apps/${folder}/`, root);
  await mkdir(path, { recursive: true });
  await writeFile(
    new URL("server.mjs", path),
    `import { startLesson } from '../foundations-runtime/server.mjs';\nstartLesson(${lesson.number});\n`,
  );
  await writeFile(
    new URL("package.json", path),
    JSON.stringify(
      {
        name: folder,
        private: true,
        type: "module",
        engines: { node: ">=24.0.0" },
        scripts: {
          start: "node --env-file-if-exists=.env server.mjs",
          dev: "node --watch --env-file-if-exists=.env server.mjs",
          record: `node ../foundations-runtime/scripts/record.mjs ${lesson.number}`,
        },
      },
      null,
      2,
    ) + "\n",
  );
  await writeFile(
    new URL(".env.example", path),
    `PORT=${3100 + lesson.number}\n# Classroom exercises run without an API key.\n# Companion live clients read credentials on the server.\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-6-astra\n`,
  );
  await writeFile(
    new URL("README.md", path),
    `# Prompt ${lesson.number} — ${lesson.title}\n\n${lesson.prompt}\n\n## Run in Windows Terminal\n\n\`\`\`powershell\nSet-Location 'C:\\OpenAI Agent SDK Master 200 AI-Powered Implementation Prompts\\apps'\nnpm install\n${pythonSetup}npm run lesson:${lesson.number}\n\`\`\`\n\nOpen http://localhost:${3100 + lesson.number}. Select a scenario, run the exercise, and expand its evidence.\n\n## Compare scenarios\n\n${courseScenarios[lesson.number].map((value) => `- ${value.replaceAll("-", " ")}`).join("\n")}\n\nThe classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [${courseModule(lesson.number)}.mjs](../foundations-runtime/course/${courseModule(lesson.number)}.mjs). Provider configuration and unavailable capabilities are identified in the evidence.\n\n## Capture a teaching video\n\n\`\`\`powershell\nnpm run record -- ${lesson.number}\n\`\`\`\n\nThe recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.\n\nFor live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).\n`,
  );
  pkg.scripts[`lesson:${lesson.number}`] =
    `node foundations-runtime/launch.mjs ${lesson.number}`;
}
pkg.scripts["record:remaining"] =
  "node foundations-runtime/scripts/record.mjs --remaining";
pkg.scripts["test:course"] =
  "node --test foundations-runtime/tests/course.test.mjs";
await writeFile(
  new URL("apps/package.json", root),
  JSON.stringify(pkg, null, 2) + "\n",
);
console.log(`Created ${catalog.length} applications through prompt 200.`);
