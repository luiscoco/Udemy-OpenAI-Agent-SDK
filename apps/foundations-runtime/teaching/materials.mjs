import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { getPilotLesson } from "./pilot-lessons.mjs";
import { createZip } from "../zip.mjs";
import { highlightCode, languageFor } from "../public/syntax/highlight.js";

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const list = (items) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
const headingLink = (url, text) =>
  `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
const identifier = (number) => String(number).padStart(3, "0");
export const runCommands = (number) =>
  `Set-Location '.\\apps'\nnpm ci\nnpm run lesson:${number}`;

export async function pilotSourceMap(number) {
  const lesson = getPilotLesson(number);
  return Promise.all(
    lesson.sources.map(async (reference) => {
      const text = await readFile(
        new URL(`../${reference.path}`, import.meta.url),
        "utf8",
      );
      const lines = text.split(/\r?\n/);
      const index = lines.findIndex((line) => line.includes(reference.needle));
      if (index < 0)
        throw new Error(
          `Refresh the teaching source reference for ${reference.path}.`,
        );
      return {
        ...reference,
        line: index + 1,
        sha256: createHash("sha256").update(text).digest("hex"),
        excerpt: lines.slice(index, index + 25).join("\n"),
        text,
      };
    }),
  );
}

function pageShell(lesson, view, body, { offline = false } = {}) {
  const title = `Prompt ${lesson.number} — ${view === "student" ? "Student worksheet" : "Instructor guide"}`;
  const asset = offline ? "assets/" : "/";
  const logo = offline ? "assets/openai-icon.svg" : "/assets/openai-icon.svg";
  const student = offline
    ? "student-worksheet.html"
    : `/pilot-guide?prompt=${lesson.number}&view=student`;
  const instructor = offline
    ? "instructor-guide.html"
    : `/pilot-guide?prompt=${lesson.number}&view=instructor`;
  const lab = offline
    ? `http://localhost:${3100 + lesson.number}`
    : `/?prompt=${lesson.number}#application-lab`;
  const download = offline
    ? ""
    : headingLink(
        `/api/pilot-pack?prompt=${lesson.number}`,
        "Download teaching pack",
      );
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="${logo}"><link rel="stylesheet" href="${asset}pilot.css"><link rel="stylesheet" href="${offline ? "assets/syntax.css" : "/syntax/theme.css"}">${offline ? "" : '<script type="module" src="/pilot-guide.js"></script>'}</head><body class="pilot-guide"><main class="pilot-shell"><header class="pilot-brand"><a href="${lab}">Agent Academy<span>OpenAI Agents SDK</span></a><span>Prompt ${lesson.number} · ${escapeHtml(lesson.duration)}</span></header><nav class="pilot-nav" aria-label="Teaching materials">${headingLink(student, "Student worksheet")}${headingLink(instructor, "Instructor guide")}${headingLink(lab, "Application lab")}${download}${offline ? "" : '<button type="button" data-pilot-theme-toggle aria-pressed="false">Dark mode</button><button type="button" id="guide-print">Print</button>'}</nav><section class="pilot-guide-hero"><div><h1>${escapeHtml(lesson.title)}</h1><p class="pilot-lead">${escapeHtml(lesson.objective)}</p></div><img class="pilot-icon" src="${logo}" alt="OpenAI icon" width="96" height="96"></section>${body}<footer class="pilot-footer"><p>Agent Academy teaching materials. The OpenAI icon belongs to OpenAI.</p><p>${offline ? "Use your browser's Print command to print or save this guide as a PDF." : "Use the student worksheet for practice and the instructor guide for narration, storyboards and answer keys."}</p></footer></main></body></html>`;
}

function sourceSections(lesson, sources, offline) {
  return sources
    .map(
      (source) =>
        `<article class="pilot-card"><h3>${escapeHtml(source.label)}</h3><p>${escapeHtml(source.path)} · line ${source.line}</p><pre class="syntax-code" data-language="${languageFor(source.path)}"><code>${highlightCode(source.excerpt, source.path)}</code></pre><p>${headingLink(offline ? `source/${source.key}` : `/api/source?prompt=${lesson.number}&name=${encodeURIComponent(source.key)}`, "Read the complete source")}</p></article>`,
    )
    .join("");
}

export async function renderPilotGuide(number, view = "student", options = {}) {
  if (!["student", "instructor"].includes(view))
    throw new Error("Choose a student or instructor guide.");
  const lesson = getPilotLesson(number);
  const sources = await pilotSourceMap(number);
  const run = `<section id="run" class="pilot-section"><h2>Run the application</h2>${list(lesson.prerequisites)}<pre class="syntax-code" data-language="powershell"><code>${highlightCode(runCommands(number), "powershell")}</code></pre><p>Open http://localhost:${3100 + number}. Keep the terminal running while you use the application. Stop it with Ctrl+C.</p><p>${escapeHtml(lesson.execution)}</p></section>`;
  const learning = `<section id="learning" class="pilot-section"><h2>Learning goal</h2><p>${escapeHtml(lesson.objective)}</p><aside class="pilot-note"><h3>Predict before you run</h3><p>${escapeHtml(lesson.prediction)}</p></aside></section>`;
  const workflow = `<section id="workflow" class="pilot-section"><h2>Follow the workflow</h2><ol class="pilot-workflow">${lesson.workflow.map((step) => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.detail)}</p></li>`).join("")}</ol></section>`;
  const scenarios = `<section class="pilot-section"><h2>Compare the scenarios</h2><div class="pilot-table"><table><thead><tr><th>Scenario</th><th>Action</th><th>Expected evidence</th></tr></thead><tbody>${lesson.scenarios.map((scenario) => `<tr><th scope="row">${escapeHtml(scenario.name)}</th><td>${escapeHtml(scenario.action)}</td><td>${escapeHtml(scenario.expected)}</td></tr>`).join("")}</tbody></table></div></section>`;
  const exercises = `<section id="exercises" class="pilot-section"><h2>Student exercises</h2>${lesson.exercises.map((exercise, index) => `<article class="pilot-card"><h3>${index + 1}. ${escapeHtml(exercise.title)}</h3><p>${escapeHtml(exercise.task)}</p><p><strong>Submit</strong> ${escapeHtml(exercise.evidence)}</p><div class="pilot-writing-space" aria-label="Space for your observations"><p>Your observations</p><div></div><div></div><div></div></div></article>`).join("")}<h3>Explain what happened</h3><ol>${lesson.assessment.map((item) => `<li>${escapeHtml(item.question)}<div class="pilot-answer-line"></div></li>`).join("")}</ol></section>`;
  const references = `<section class="pilot-section"><h2>References</h2><ul>${lesson.references.map((reference) => `<li>${headingLink(reference.url, reference.title)}</li>`).join("")}</ul></section>`;
  let body = learning + run + workflow + scenarios;
  if (view === "student") body += exercises + references;
  else {
    const fileLink = (name) =>
      options.offline
        ? name
        : `/api/pilot-file?prompt=${number}&file=${encodeURIComponent(name)}`;
    body += `<section class="pilot-section"><h2>Instructor preparation</h2>${list(lesson.instructor.preparation)}</section><section id="narration" class="pilot-section"><h2>Narration script</h2><p>${headingLink(fileLink("narration.txt"), "Download narration text")}</p>${lesson.narration.map((beat) => `<article class="pilot-card"><h3>${beat.start}–${beat.end} · ${escapeHtml(beat.screen)}</h3><p class="pilot-stage-direction">${escapeHtml(beat.action)}</p><p>${escapeHtml(beat.speech)}</p><p><strong>Check the screen</strong> ${escapeHtml(beat.evidence)}</p></article>`).join("")}</section><section id="storyboard" class="pilot-section"><h2>Storyboard</h2><p>${headingLink(fileLink("storyboard.csv"), "Download storyboard CSV")}</p><div class="pilot-table"><table><thead><tr><th>Time</th><th>Screen and action</th><th>Evidence to show</th></tr></thead><tbody>${lesson.narration.map((beat) => `<tr><td>${beat.start}–${beat.end}</td><td><strong>${escapeHtml(beat.screen)}</strong><p>${escapeHtml(beat.action)}</p></td><td>${escapeHtml(beat.evidence)}</td></tr>`).join("")}</tbody></table></div></section><section class="pilot-section"><h2>Source walkthrough</h2>${sourceSections(lesson, sources, options.offline)}</section><section class="pilot-section"><h2>Instructor notes</h2><h3>Concepts to clarify</h3>${list(lesson.instructor.misconceptions)}<h3>Troubleshooting</h3>${list(lesson.instructor.troubleshooting)}<h3>Assessment rubric</h3>${list(lesson.instructor.rubric)}</section><section id="answers" class="pilot-section"><h2>Answer key</h2>${lesson.exercises.map((exercise) => `<article class="pilot-card"><h3>${escapeHtml(exercise.title)}</h3><p>${escapeHtml(exercise.answer)}</p></article>`).join("")}<dl>${lesson.assessment.map((item) => `<dt>${escapeHtml(item.question)}</dt><dd>${escapeHtml(item.answer)}</dd>`).join("")}</dl></section>${references}`;
  }
  return pageShell(lesson, view, body, options);
}

export async function teachingFiles(number) {
  const lesson = getPilotLesson(number);
  const sources = await pilotSourceMap(number);
  const narration = lesson.narration
    .map(
      (beat) =>
        `${beat.start}–${beat.end} | ${beat.screen}\n\nScreen action\n${beat.action}\n\nNarration\n${beat.speech}\n\nExpected evidence\n${beat.evidence}`,
    )
    .join("\n\n---\n\n");
  const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const storyboard = [
    ["Start", "End", "Screen", "Action", "Narration", "Expected evidence"],
    ...lesson.narration.map((beat) => [
      beat.start,
      beat.end,
      beat.screen,
      beat.action,
      beat.speech,
      beat.evidence,
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  const files = {
    "README.md": `# Prompt ${number} — ${lesson.title}\n\n${lesson.objective}\n\nOpen student-worksheet.html for the printable student guide. Open instructor-guide.html for the narration, storyboard, answer key and instructor notes. Narration is also supplied as narration.txt and the storyboard as storyboard.csv.\n\n## Run the application\n\nUse the complete course workspace. From its apps directory run npm ci and npm run lesson:${number}. Open http://localhost:${3100 + number}.\n\n${lesson.execution}\n\nThe source directory contains reference snapshots. Run the application in the complete workspace so its shared runtime and installed dependencies are available. source-map.json records the source paths, line anchors and SHA-256 hashes used to prepare this pack.\n\nThe application visuals follow the user-provided C32 reference. The OpenAI icon was downloaded unchanged from https://developers.openai.com/favicon.svg and belongs to OpenAI.\n`,
    "narration.txt": `Prompt ${number} — ${lesson.title}\n\nLearning objective\n${lesson.objective}\n\nExecution scope\n${lesson.execution}\n\n${narration}\n`,
    "storyboard.csv": storyboard,
    "student-worksheet.html": await renderPilotGuide(number, "student", {
      offline: true,
    }),
    "instructor-guide.html": await renderPilotGuide(number, "instructor", {
      offline: true,
    }),
    "source-map.json": JSON.stringify(
      sources.map(({ text, excerpt, ...reference }) => reference),
      null,
      2,
    ),
    "lesson.json": JSON.stringify(lesson, null, 2),
    "assets/syntax.css": await readFile(
      new URL("../public/syntax/theme.css", import.meta.url),
    ),
    "assets/pilot.css": await readFile(
      new URL("../public/pilot.css", import.meta.url),
    ),
    "assets/openai-icon.svg": await readFile(
      new URL("../public/assets/openai-icon.svg", import.meta.url),
    ),
  };
  for (const source of sources) files[`source/${source.key}`] = source.text;
  return files;
}

export async function teachingArchive(number) {
  return {
    filename: `prompt-${identifier(number)}-teaching-pack.zip`,
    bytes: createZip(await teachingFiles(number)),
  };
}
