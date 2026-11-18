import { createHash } from "node:crypto";
import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "../server.mjs";
import { getPilotLesson } from "../teaching/pilot-lessons.mjs";
import { browserOptions } from "./browser-options.mjs";

const workspace = fileURLToPath(new URL("../../../", import.meta.url));
const cache = resolve(workspace, ".runtime/lesson-005-production");
const output = resolve(workspace, "apps/teaching-pilot/prompt-005/production");
const stagedVideo = resolve(cache, "lesson-005-staged.mp4");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  resolve(
    workspace,
    ".runtime/media-tools/node_modules/ffmpeg-static/ffmpeg.exe",
  );
const voice = process.env.LESSON_VOICE || "Microsoft Zira Desktop";
const assembleOnly = process.argv.includes("--assemble-only");
const refreshSource = process.argv.includes("--refresh-source");
const renderOnly =
  assembleOnly || refreshSource || process.argv.includes("--render-only");
if (!existsSync(ffmpeg))
  throw new Error(
    "Set FFMPEG_PATH to a local FFmpeg executable. See the production README.",
  );
await mkdir(cache, { recursive: true });
await mkdir(output, { recursive: true });
const lesson = getPilotLesson(5);
const seconds = (text) =>
  text.split(":").reduce((value, part) => value * 60 + Number(part), 0);
const scenes = lesson.narration.map((beat, index) => ({
  ...beat,
  index,
  wav: resolve(cache, `scene-${index + 1}.wav`),
  marks: resolve(cache, `scene-${index + 1}-words.json`),
  video: resolve(cache, `scene-${index + 1}.webm`),
  encoded: resolve(cache, `scene-${index + 1}.mp4`),
}));
async function run(command, args, name, cwd = cache) {
  let log = "";
  const code = await new Promise((done, reject) => {
    const child = spawn(command, args, {
      cwd,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (chunk) => {
      log += chunk;
    });
    child.stderr.on("data", (chunk) => {
      log += chunk;
    });
    child.once("error", reject);
    child.once("exit", done);
  });
  await writeFile(resolve(cache, `${name}.log`), log);
  if (code !== 0)
    throw new Error(`${name} failed (${code}). ${log.slice(-2500)}`);
  return log;
}
if (renderOnly) {
  const saved = JSON.parse(
    await readFile(resolve(cache, "narration.json"), "utf8"),
  );
  if (
    saved.scenes.some((scene, index) => scene.speech !== scenes[index]?.speech)
  )
    throw new Error(
      "Cached speech differs from the narration. Rebuild without --render-only.",
    );
} else {
  await writeFile(
    resolve(cache, "narration.json"),
    JSON.stringify({ scenes }, null, 2),
  );
  await run(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      fileURLToPath(new URL("./synthesize-narration.ps1", import.meta.url)),
      "-ManifestPath",
      resolve(cache, "narration.json"),
      "-VoiceName",
      voice,
    ],
    "narration",
  );
  console.log(`Narration rendered with ${voice}.`);
}

function waveDuration(bytes) {
  let rate;
  for (let position = 12; position + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", position, position + 4);
    const size = bytes.readUInt32LE(position + 4);
    if (type === "fmt ") rate = bytes.readUInt32LE(position + 16);
    if (type === "data" && rate) return size / rate;
    position += 8 + size + (size % 2);
  }
  throw new Error("Narration WAV has no readable PCM duration.");
}
const productionStyle = `
body.production main { width: min(1660px, calc(100% - 100px)); }
body.production .pilot-brand, body.production main > header, body.production .pilot-nav,
body.production .pilot-prediction, body.production .knowledge, body.production .page-footer { display:none; }
body.production .intro { margin:20px 0; }
body.production .intro h1 { font-size:38px; }
body.production #summary { font-size:24px; }
body.production .pilot-workflow p { font-size:21px; }
body.production .pilot-workflow h3 { font-size:23px; }
body.production .pilot-workflow { margin-bottom:20px; }
body.production[data-focus="intro"] .lab, body.production[data-focus="intro"] .takeaway { display:none; }
body.production[data-focus="source"] .pilot-grid, body.production[data-focus="source"] .pilot-workflow,
body.production[data-focus="source"] .lab-heading, body.production[data-focus="source"] .takeaway { display:none; }
body.production[data-focus="source"] #summary { display:none; }
body.production[data-focus="source"] .intro { display:none; }
body.production[data-focus="source"] .pilot-source-details { margin:0; padding:12px; }
body.production[data-focus="source"] .pilot-source-details > summary { display:none; }
body.production #source-code { font-size:22px; line-height:1.5; max-height:780px; }
body.production .code-line::before { font-size:15px; }
body.production #source-note { display:none; }
body.production[data-focus="source"] .pilot-icon { width:64px; height:64px; flex-basis:64px; }
body.production[data-focus="result"] .pilot-config, body.production[data-focus="result"] .pilot-workflow,
body.production[data-focus="result"] .pilot-source-details, body.production[data-focus="result"] .takeaway { display:none; }
body.production[data-focus="result"] .pilot-grid { grid-template-columns:1fr; }
body.production[data-focus="result"] .timeline { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
body.production[data-focus="result"] .timeline p { display:none; }
body.production .result .code-answer { font-size:26px; }
body.production #evidence { font-size:22px; max-height:470px; }
body.production .pilot-config { font-size:22px; }
body.production .pilot-config .hint, body.production .pilot-scope { font-size:18px; }
body.production .pilot-writing-space, body.production .pilot-answer-line { display:none; }
body.production.pilot-guide { font-size:22px; }
body.production.pilot-guide .pilot-card { padding:22px; }
`;
if (!renderOnly || refreshSource) {
  const server = createApp({ number: 5, env: {} });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    ...browserOptions(),
    headless: true,
  });
  try {
    for (const scene of scenes) {
      if (refreshSource && ![2, 4].includes(scene.index)) continue;
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: cache, size: { width: 1920, height: 1080 } },
        reducedMotion: "reduce",
        bypassCSP: true,
      });
      try {
        const captureStart = Date.now();
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${origin}/?prompt=5`);
        await expect(page.locator("body")).toHaveAttribute(
          "data-ready",
          "true",
        );
        await page.addStyleTag({ content: productionStyle });
        const focus = async (value) => {
          await page.evaluate((value) => {
            document.body.classList.add("production");
            document.body.dataset.focus = value;
            scrollTo(0, 0);
          }, value);
        };
        const exercise = async () => {
          await page.locator("#run-button").click();
          await expect(page.locator("body")).toHaveAttribute(
            "data-complete",
            "true",
          );
          await page.locator("#result summary").click();
        };
        await focus(scene.index === 0 ? "intro" : "lab");
        scene.trimStart = Math.max(0, (Date.now() - captureStart) / 1000 - 0.1);
        await page.waitForTimeout(700);
        if ([1, 3, 4].includes(scene.index)) {
          if (scene.index === 3)
            await page
              .locator("#question")
              .selectOption("What is a function tool?");
          if (scene.index === 4)
            await page.locator("#language").selectOption("python");
          await exercise();
          await focus("result");
          await page.waitForTimeout(1500);
        }
        if ([2, 4].includes(scene.index)) {
          await page.locator(".pilot-source-details").evaluate((node) => {
            node.open = true;
          });
          await focus("source");
          await page
            .locator(
              `[data-file="${scene.index === 4 ? "first_agent.py" : "first-agent.ts"}"]`,
            )
            .click();
          expect(
            await page.locator('#source-code [class^="hljs-"]').count(),
          ).toBeGreaterThan(0);
        }
        if (scene.index === 5) {
          await page.goto(
            `${origin}/pilot-guide?prompt=5&view=student#exercises`,
          );
          await page.addStyleTag({ content: productionStyle });
          await page.evaluate(() => document.body.classList.add("production"));
          await page.locator("#exercises").scrollIntoViewIfNeeded();
        }
        await page.waitForTimeout(1300);
        await page.screenshot({
          path: resolve(output, `scene-${scene.index + 1}.png`),
        });
        if (errors.length) throw new Error(errors.join("\n"));
        const video = page.video();
        await context.close();
        await video.saveAs(scene.video);
        await video.delete();
        console.log(`Captured scene ${scene.index + 1}.`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
}

const cues = [];
let elapsed = 0;
for (const scene of scenes) {
  scene.audioDuration = waveDuration(await readFile(scene.wav));
  scene.duration = Math.max(
    seconds(scene.end) - seconds(scene.start),
    scene.audioDuration + 1.2,
  );
  scene.actualStart = elapsed;
  const marks = JSON.parse(
    (await readFile(scene.marks, "utf8")).replace(/^\uFEFF/, ""),
  );
  if (!marks.length)
    throw new Error(`Scene ${scene.index + 1} has no speech timing marks.`);
  let first = 0;
  for (let index = 1; index <= marks.length; index++) {
    const limit =
      index === marks.length ||
      marks[index].CharacterPosition - marks[first].CharacterPosition > 74 ||
      marks[index].AudioSeconds - marks[first].AudioSeconds > 5.3;
    if (!limit) continue;
    const text = scene.speech
      .slice(
        marks[first].CharacterPosition,
        index < marks.length
          ? marks[index].CharacterPosition
          : scene.speech.length,
      )
      .trim();
    cues.push({
      start: elapsed + 0.35 + marks[first].AudioSeconds,
      end:
        elapsed +
        0.35 +
        (index < marks.length
          ? marks[index].AudioSeconds
          : scene.audioDuration),
      text,
    });
    first = index;
  }
  if (!assembleOnly)
    await run(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "warning",
        "-y",
        "-ss",
        "0.15",
        "-i",
        scene.video,
        "-i",
        scene.wav,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-vf",
        `fps=30,tpad=stop_mode=clone:stop_duration=${scene.duration}`,
        "-af",
        "adelay=350,apad",
        "-t",
        String(scene.duration),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "20",
        "-threads",
        "2",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-ar",
        "48000",
        scene.encoded,
      ],
      `encode-scene-${scene.index + 1}`,
    );
  elapsed += scene.duration;
}
function timestamp(value, separator) {
  const ms = Math.round(value * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}${separator}${String(ms % 1000).padStart(3, "0")}`;
}
function wrapCaption(text) {
  const words = text.split(/\s+/);
  const lines = [""];
  for (const word of words) {
    if ((lines.at(-1) + " " + word).trim().length > 42) lines.push(word);
    else lines[lines.length - 1] = (lines.at(-1) + " " + word).trim();
  }
  return lines.join("\n");
}
const srt = cues
  .map(
    (cue, index) =>
      `${index + 1}\n${timestamp(cue.start, ",")} --> ${timestamp(cue.end, ",")}\n${wrapCaption(cue.text)}\n`,
  )
  .join("\n");
if (
  cues.some(
    (cue, index) =>
      cue.end <= cue.start || cue.start < (cues[index - 1]?.end ?? 0),
  )
) {
  throw new Error(
    "Caption timings must be increasing and have positive durations.",
  );
}
const assTime = (value) => timestamp(value, ".").slice(1, -1);
const ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Segoe UI,30,&H00FFFFFF,&H000000FF,&H90000000,&H90000000,0,0,0,0,100,100,0,0,3,3,0,2,50,50,28,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${cues.map((cue) => `Dialogue: 0,${assTime(cue.start)},${assTime(cue.end)},Default,,0,0,0,,${wrapCaption(cue.text).replaceAll("\n", "\\N")}`).join("\n")}\n`;
await writeFile(resolve(output, "captions.ass"), ass);
await writeFile(resolve(output, "captions.srt"), srt);
await writeFile(
  resolve(output, "captions.vtt"),
  "WEBVTT\n\n" +
    cues
      .map(
        (cue) =>
          `${timestamp(cue.start, ".")} --> ${timestamp(cue.end, ".")}\n${wrapCaption(cue.text)}\n`,
      )
      .join("\n"),
);
await writeFile(
  resolve(cache, "scenes.ffconcat"),
  "ffconcat version 1.0\n" +
    scenes.map((scene) => `file 'scene-${scene.index + 1}.mp4'`).join("\n"),
);
await run(
  ffmpeg,
  [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    resolve(cache, "scenes.ffconcat"),
    "-i",
    "captions.srt",
    "-map",
    "0:v",
    "-map",
    "0:a",
    "-map",
    "1:0",
    "-vf",
    "subtitles=captions.ass",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "20",
    "-threads",
    "2",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-ar",
    "48000",
    "-b:a",
    "128k",
    "-c:s",
    "mov_text",
    "-metadata:s:s:0",
    "language=eng",
    "-disposition:s:0",
    "0",
    "-movflags",
    "+faststart",
    stagedVideo,
  ],
  "render-final",
  output,
);
const audioCheck = await run(
  ffmpeg,
  [
    "-hide_banner",
    "-i",
    stagedVideo,
    "-vn",
    "-af",
    "volumedetect",
    "-f",
    "null",
    "-",
  ],
  "verify-audio",
);
if (!/mean_volume: -(?!inf)\d/.test(audioCheck))
  throw new Error("Final video has no measurable narration audio.");
await run(
  ffmpeg,
  [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    "-ss",
    "80",
    "-i",
    stagedVideo,
    "-frames:v",
    "1",
    resolve(output, "preview.png"),
  ],
  "preview",
);
const videoSha256 = createHash("sha256")
  .update(await readFile(stagedVideo))
  .digest("hex");
await rename(stagedVideo, resolve(output, "lesson-005.mp4"));
await writeFile(
  resolve(output, "production.json"),
  JSON.stringify(
    {
      prompt: 5,
      voice,
      syntheticNarration: true,
      durationSeconds: elapsed,
      width: 1920,
      height: 1080,
      captions:
        "Burned into video, embedded English subtitle track, SRT and VTT sidecars",
      cueCount: cues.length,
      scenes: scenes.map(
        ({ index, screen, speech, actualStart, duration, audioDuration }) => ({
          index,
          screen,
          speech,
          actualStart,
          duration,
          audioDuration,
        }),
      ),
      audioVerified: true,
      videoSha256,
      captionSha256: createHash("sha256").update(srt).digest("hex"),
    },
    null,
    2,
  ),
);
await writeFile(
  resolve(output, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prompt 5 — Narrated lesson</title><link rel="stylesheet" href="../assets/pilot.css"><body class="pilot-guide"><main class="pilot-shell"><h1>Run your first agent</h1><p>1080p classroom demonstration with synthetic English narration using ${voice} and visible captions.</p><video controls preload="metadata" poster="preview.png" style="width:100%;border-radius:16px" src="lesson-005.mp4"></video><nav class="pilot-nav"><a href="lesson-005.mp4" download>Download video</a><a href="captions.srt" download>Download SRT captions</a><a href="captions.vtt" download>Download VTT captions</a><a href="../student-worksheet.html">Student worksheet</a></nav></main></body></html>`,
);
await writeFile(
  resolve(output, "README.md"),
  `# Prompt 5 narrated lesson\n\nOpen index.html or lesson-005.mp4. The video uses synthetic English narration with ${voice}. It contains visible captions and an English subtitle track. Captions are also supplied as SRT and VTT files.\n\n## Rebuild on Windows\n\nFrom apps run npm run produce:lesson5. The renderer uses Playwright, Windows System.Speech and FFmpeg. Set FFMPEG_PATH to your FFmpeg executable if the workspace cache is absent. Set LESSON_VOICE to another installed English voice if desired.\n\nThe original narration and scene order come from teaching/pilot-lessons.mjs. The renderer records actual classroom actions, enlarges the source and result views, and holds the final frame of each scene while narration and reading time complete. Speech progress events provide caption timing. production.json records the actual scene durations.\n\n## Production template\n\nUse six scenes for the learning goal, first result, implementation walkthrough, controlled input comparison, language or configuration comparison, and student exercise. Capture at 1920 × 1080 and 30 fps. Use code at 22 pixels and narration captions at 30 pixels. Keep each scene focused on the evidence named by its narration. Compare source text and returned evidence before recording. Verify video dimensions, caption timing, decoded frames and audible-stream levels after rendering.\n\nThe footage uses local classroom fixtures. The executable source and live adapter are identified during narration.\n`,
);
console.log(
  `Produced ${resolve(output, "lesson-005.mp4")} (${elapsed.toFixed(1)} seconds, ${cues.length} captions).`,
);
