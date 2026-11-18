import { handoffHints } from "/handoff-lessons.js";
import { hostedHints } from "/hosted-lessons.js";
import { controlHints } from "/control-lessons.js";
import { toolsHints } from "/tools-lessons.js";
import { streamingHints } from "/streaming-lessons.js";
import { runtimeHints } from "/runtime-lessons.js";
import { structuredHints } from "/structured-lessons.js";
import { buildIdentity, specialists, responseStyles } from "/identity.js";
import { definitionControls, definitionPreview } from "/definitions.js";
import { contextHints } from "/context-lessons.js";
import { mountPilotLesson, updatePilotResult, resetPilotResult } from "/pilot-ui.js";
import {
  highlightLines,
  highlightElement,
  highlightJson,
  languageFor,
  renderAnswer,
} from "/syntax/highlight.js";

const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const options = (entries, selected) =>
  entries
    .map(
      ([value, label]) =>
        `<option value="${escape(value)}" ${value === selected ? "selected" : ""}>${escape(label)}</option>`,
    )
    .join("");
const field = (label, id, entries, selected) =>
  `<label class="field"><span class="field-label">${label}</span><select id="${id}">${options(entries, selected)}</select></label>`;
const questions = [
  "What is an AI agent?",
  "What is a function tool?",
  "Why pin dependencies?",
];
let state;
let mode = "classroom";
let result;
let index = 0;
let controller;
let playing = false;
let selectedSource;
let runGeneration = 0;

function api(path) {
  return `${path}${path.includes("?") ? "&" : "?"}prompt=${state.lesson.number}`;
}

function renderControls() {
  const number = state.lesson.number;
  const language = field("Example language", "language", [
    ["typescript", "TypeScript"],
    ["python", "Python"],
  ]);
  if (number === 2) {
    $("#exercise-controls").innerHTML = `<div class="fields">${language}${field(
      "Capability",
      "capability",
      Object.entries(state.capabilities).map(([key, value]) => [
        key,
        value.title,
      ]),
    )}</div><table class="comparison"><thead><tr><th>API</th><th>Python</th><th>TypeScript</th></tr></thead><tbody><tr><td>Install</td><td>openai-agents</td><td>@openai/agents + zod</td></tr><tr><td>Execute</td><td>await Runner.run(...)</td><td>await run(...)</td></tr><tr><td>Final answer</td><td>final_output</td><td>finalOutput</td></tr></tbody></table><p class="hint" id="capability-description"></p>`;
    $("#capability-description").textContent =
      state.capabilities.basics.difference;
  }
  if (number === 3) {
    $("#exercise-controls").innerHTML =
      `${language}<p class="hint">The starter includes executable source, exact SDK pins, and terminal instructions. TypeScript includes a transitive package lock. Python includes a pinned requirements file.</p><a id="download-starter" class="download">Download starter ↓</a><button id="verify-button" class="small-action">Check current releases ↗</button><p class="hint" id="release-status">Bundled release snapshot verified ${escape(state.releases.checkedAt)}. TypeScript ${escape(state.releases.typescript.version)} · Python ${escape(state.releases.python.version)}.</p>`;
    $("#verify-button").addEventListener("click", () =>
      start({ action: "verify" }, true),
    );
    updateDownload();
  }
  if (number === 4 || number === 8) {
    const faults =
      number === 4
        ? [
            ["missing", "Missing API key"],
            ["invalid", "API rejects credentials (fixture)"],
            ["configured", "Key present (fixture)"],
          ]
        : [
            ["imports", "Incorrect import"],
            ["installation", "Installation / registry failure (fixture)"],
            ["model", "Unavailable model (fixture)"],
            ["invalid", "Authentication failure (fixture)"],
            ["missing", "Missing configuration"],
            ["rate", "Rate limit (fixture)"],
          ];
    $("#exercise-controls").innerHTML =
      `${field("Failure scenario", "fault", faults)}<p class="hint">Configuration and import failures execute locally. HTTP and registry failures use labeled error fixtures. The recovery command is shown for discussion.</p><div class="notice">${state.configured ? "Server credential present. Use Live API to verify acceptance." : "This server has no API key configured. Classroom scenarios work immediately."}</div>`;
  }
  if (number === 5) {
    $("#exercise-controls").innerHTML = `${language}${field(
      "Classroom question",
      "question",
      questions.map((question) => [question, question]),
    )}<label class="field" id="custom-question-field" hidden><span class="field-label">Your live question</span><input id="custom-question" maxlength="1000" value="What is an AI agent?"></label><p class="hint">The source examples print one final response to the terminal. The in-app live runner also displays it here.</p>`;
  }
  if (number === 6 || number === 7) {
    $("#exercise-controls").innerHTML = `${field(
      "Club timetable lookup",
      "activity",
      [
        ["robotics", "Robotics club"],
        ["astronomy", "Astronomy club"],
        ["music", "Music club"],
      ],
    )}<p class="hint">The timetable lives in tools/club.mjs. Classroom mode runs that function and scripts the model decisions. Live API lets the model choose its tool calls.</p>${number === 7 ? '<div class="exercise-options" id="module-buttons"><button data-source="config.mjs">Configuration</button><button data-source="agents/club-agent.mjs">Agent</button><button data-source="tools/club.mjs">Tool</button><button data-source="services/club-service.mjs">Service</button><button data-source="tests/club.test.mjs">Tests</button></div>' : ""}`;
    document
      .querySelectorAll("[data-source]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          renderSource(button.dataset.source),
        ),
      );
  }
  if (number === 9) {
    $("#exercise-controls").innerHTML = `
      <div class="fields">
        <label class="field"><span class="field-label">Agent name</span><input id="agentName" maxlength="60" value="${escape(specialists.sql.defaultName)}"></label>
        ${field(
          "Responsibility",
          "specialist",
          Object.entries(specialists).map(([key, value]) => [key, value.label]),
        )}
      </div>
      <div class="fields">
        ${field(
          "Response style",
          "style",
          Object.entries(responseStyles).map(([key, value]) => [
            key,
            value.label,
          ]),
        )}
        ${field(
          "Test scenario",
          "scenario",
          Object.entries(specialists.sql.scenarios).map(([key, value]) => [
            key,
            value.label,
          ]),
        )}
      </div>
      <section class="identity-contract" aria-label="Current specialist contract">
        <h3>Responsibility &amp; boundaries</h3>
        <p id="identity-responsibility"></p><p id="identity-boundaries"></p>
        <details><summary>Inspect generated instructions</summary><pre id="identity-instructions"></pre></details>
      </section>
      <p class="identity-question" id="identity-question"></p>
      <label class="field" id="identity-custom-field" hidden><span class="field-label">Your live test question</span><input id="identity-custom-question" maxlength="1000" value="Explain SQL GROUP BY."></label>`;
    $("#agentName").addEventListener("input", () => {
      reset();
      renderIdentity();
    });
    $(".flow").innerHTML =
      '<div data-actor="application">Identity</div><span>→</span><div data-actor="sdk">Instructions</div><span>→</span><div data-actor="model">Response</div>';
    renderIdentity();
  }
  if (definitionControls[number]) {
    const hints = {
      ...contextHints,
      ...structuredHints,
      ...runtimeHints,
      ...streamingHints,
      ...toolsHints,
      ...controlHints,
      ...hostedHints,
      ...handoffHints,
      ...remainingHints,
      10: "Compare a complete task contract with a goal-only instruction set. Inspect what the planner is asked to do when requirements are missing.",
      11: "The baseline and example-guided agents use the same test ticket. Live mode makes two model runs. Classroom outputs are illustrative fixtures.",
      12: "The SDK resolves the callback with the selected context. The sample user ID stays local while the callback includes the display name, language, and application.",
      13: "The code-managed path uses application prompt versions. The legacy path inspects a placeholder locally and needs an existing resource for live execution.",
      14: "This exercise calls the actual SDK clone method. Inspect the base definition and the customized agent in the evidence.",
      15: "Begin with missing requirements, then supply the audience and duration. Each run sends the current complete request to the planner.",
      16: "Construct each option category locally and inspect the installed SDK declarations. Model, tool, handoff, and guardrail execution can be studied in later runs.",
    };
    $("#exercise-controls").innerHTML =
      `<div class="fields definition-fields">${definitionControls[number].map((control) => field(control.label, control.key, control.options)).join("")}</div><p class="hint">${hints[number]}</p>${number === 13 ? '<div class="notice prompt-deprecation">Hosted prompt objects have a scheduled shutdown on November 30, 2026. <a href="https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object" target="_blank" rel="noreferrer">Official migration guide ↗</a></div>' : ""}<details class="definition-preview"><summary>${number === 11 ? "Inspect the three examples" : "Inspect instructions and context"}</summary><pre id="definition-preview"></pre></details>`;
    $(".flow").innerHTML =
      '<div data-actor="application">Configuration</div><span>→</span><div data-actor="sdk">SDK</div><span>→</span><div data-actor="model">Result</div>';
    if ([30, 31, 32].includes(number)) {
      const media = document.createElement("div");
      media.className = "media-fixture";
      media.innerHTML =
        number === 30
          ? '<img src="/assets/classroom-shapes.png" alt="Teaching image with a blue rectangle, green circle and orange triangle"><a href="/assets/classroom-shapes.png" target="_blank" rel="noreferrer">Open actual image</a>'
          : '<a href="/assets/classroom-workshop.pdf" target="_blank" rel="noreferrer">Open actual one-page PDF ↗</a> · <a href="/assets/classroom-workshop.txt" target="_blank" rel="noreferrer">Read extracted text</a>' +
            (number === 32
              ? '<img src="/assets/classroom-shapes.png" alt="Image available from the multimodal tool">'
              : "");
      $("#exercise-controls").append(media);
    }
    renderDefinitionPreview();
    if (number >= 17 && number <= 24)
      $(".flow").innerHTML =
        '<div data-actor="application">Context</div><span>→</span><div data-actor="sdk">Runner</div><span>↔</span><div data-actor="tool">Tool</div><span>→</span><div data-actor="model">Result</div>';
  }
  $("#exercise-controls").addEventListener("change", (event) => {
    reset();
    if (definitionControls[number]) renderDefinitionPreview();
    if (number === 9) {
      if (event.target.id === "specialist") {
        const currentName = $("#agentName").value;
        if (
          Object.values(specialists).some(
            (entry) => entry.defaultName === currentName,
          )
        ) {
          $("#agentName").value =
            specialists[$("#specialist").value].defaultName;
        }
      }
      if (event.target.id !== "identity-custom-question") renderIdentity();
    }
    if (event.target.id === "language") {
      renderSource(
        event.target.value === "python"
          ? "first_agent.py"
          : number === 3
            ? "package.json"
            : "first-agent.ts",
      );
      updateDownload();
    }
    if (event.target.id === "capability")
      $("#capability-description").textContent =
        state.capabilities[event.target.value].difference;
    updateMode();
  });
}

function renderDefinitionPreview() {
  $("#definition-preview").textContent = definitionPreview(
    state.lesson.number,
    inputValues(),
  );
  highlightJson($("#definition-preview"));
}

function renderIdentity() {
  try {
    const identity = buildIdentity(inputValues());
    $("#identity-responsibility").textContent = identity.responsibility;
    $("#identity-boundaries").textContent = identity.boundaries;
    $("#identity-instructions").textContent = identity.instructions;
    $("#identity-question").textContent = identity.question;
    $("#identity-custom-question").value = identity.question;
  } catch (error) {
    $("#identity-instructions").textContent = error.message;
  }
}

function updateDownload() {
  if ($("#download-starter"))
    $("#download-starter").href = api(
      `/api/starter?language=${$("#language").value}`,
    );
}

function renderSource(name = Object.keys(state.sources)[0]) {
  selectedSource = name;
  const source = state.sources[name];
  const allLines = source.split("\n");
  const section =
    state.lesson.number === 91
      ? 89
      : name === "streaming/streaming-execution.mjs" &&
          state.lesson.number >= 49
        ? 49
        : state.lesson.number === 38
          ? 37
          : state.lesson.number;
  const courseMarker=name.startsWith("course/")?allLines.findIndex(line=>line.trim().startsWith(`if (number === ${section})`)):-1;
  const marker = [
    "mcp/mcp-control-execution.mjs",
    "handoffs/handoff-execution.mjs",
    "hosted/hosted-execution.mjs",
    "control/control-execution.mjs",
    "control/discovery-execution.mjs",
    "tools/tools-execution.mjs",
    "runtime/runtime-execution.mjs",
    "streaming/streaming-execution.mjs",
  ].includes(name)
    ? allLines.findIndex((line) => line.trim() === `// lesson:${section}`)
    : courseMarker;
  const startLine = marker < 0 ? 0 : marker;
  const nextMarker =
    marker < 0
      ? -1
      : allLines.findIndex(
          (line, index) =>
            index > marker && (line.trim().startsWith("// lesson:") || name.startsWith("course/") && line.trim().startsWith("if (number ===")),
        );
  const lines = allLines.slice(
    startLine,
    nextMarker < 0 ? undefined : nextMarker,
  );
  $("#source-tabs").innerHTML = Object.keys(state.sources)
    .map(
      (key) =>
        `<button role="tab" aria-selected="${key === name}" data-file="${escape(key)}">${escape(key)}</button>`,
    )
    .join("");
  $("#source-tabs")
    .querySelectorAll("button")
    .forEach((button) =>
      button.addEventListener("click", () => renderSource(button.dataset.file)),
    );
  $("#source-code").classList.add("syntax-code");
  $("#source-code").dataset.language = languageFor(name);
  $("#source-code").innerHTML = highlightLines(lines.slice(0, 180).join("\n"), name)
    .map(
      (line, i) =>
        `<span class="code-line" data-line="${startLine + i + 1}">${line || " "}</span>`,
    )
    .join("");
  $("#source-code").scrollTop = 0;
  $("#source-name").textContent = name;
  $("#full-source").href = api(`/api/source?name=${encodeURIComponent(name)}`);
  $("#source-note").textContent =
    lines.length > 180
      ? `Showing 180 of ${lines.length} lines. Full file opens the complete source.`
      : name.endsWith(".py")
        ? "Runnable Python example. Download or copy it to execute with your local Python environment."
        : "Actual example source. The organized service and tools are used by this application's backend.";
  if (state.lesson.number === 9)
    $("#source-note").textContent =
      "Executable specialist factory, instruction builder, and live runner used by this lesson.";
  if (state.lesson.number >= 10)
    $("#source-note").textContent =
      "Executable lesson source. SDK construction runs locally. Classroom model outputs are scripted fixtures.";
  if (state.lesson.number >= 17 && state.lesson.number <= 24)
    $("#source-note").textContent =
      "Executable SDK example. Classroom mode uses a scripted local model and in-memory application adapters.";
  if (marker >= 0)
    $("#source-note").textContent =
      "Showing the executable section for this lesson. Full file opens the complete module and shared imports.";
}

function updateMode() {
  const live = mode === "live";
  $("#classroom-mode").setAttribute("aria-pressed", String(!live));
  $("#live-mode").setAttribute("aria-pressed", String(live));
  const python = $("#language")?.value === "python";
  const hostedUnavailable =
    state.lesson.number === 13 &&
    $("#storage")?.value === "hosted" &&
    !state.storedPromptConfigured;
  const unavailable =
    live && (!state.configured || python || hostedUnavailable);
  $("#configuration").hidden = !live;
  $("#configuration").textContent = python
    ? "The in-app live runner executes TypeScript. Copy the Python source and use its local terminal instructions to run Python."
    : state.configured
      ? `Live requests use ${state.model} and your configured API account. A run can incur API charges.`
      : "Set OPENAI_API_KEY in this application's .env file, then restart the server. OPENAI_MODEL selects a model available to your project.";
  if (
    live &&
    state.configured &&
    state.lesson.number >= 34 &&
    state.lesson.number <= 37
  )
    $("#configuration").textContent =
      "Live requests use this lesson's explicit comparison models and your configured API account. A comparison can make several model calls and incur API charges.";
  if (live && state.configured && state.lesson.number === 38)
    $("#configuration").textContent =
      "Live requests use ALT_PROVIDER_URL and ALT_PROVIDER_MODEL with the provider credential configured in OPENAI_API_KEY. The provider can charge for these requests.";
  if (live && hostedUnavailable)
    $("#configuration").textContent =
      "Set OPENAI_API_KEY and STORED_PROMPT_ID in this app's .env file, then restart. The existing hosted prompt must declare a language variable and the selected version. Hosted prompt objects are deprecated.";
  $("#run-button").disabled = unavailable && !playing;
  $("#next-button").disabled = live || playing;
  if ($("#fault")) $("#fault").disabled = live || playing;
  if ($("#custom-question-field")) {
    $("#custom-question-field").hidden = !live;
    $("#question").closest("label").hidden = live;
  }
  if ($("#identity-custom-field")) {
    $("#identity-custom-field").hidden = !live;
    $("#identity-question").hidden = live;
  }
  $("#run-button").textContent = playing
    ? "Stop"
    : live
      ? "Run live"
      : "Run exercise";
}

function inputValues(extra) {
  const input = { mode, ...extra };
  for (const key of [
    "language",
    "capability",
    "fault",
    "activity",
    "question",
    "agentName",
    "specialist",
    "style",
    "scenario",
  ]) {
    if ($(`#${key}`)) input[key] = $(`#${key}`).value;
  }
  if (mode === "live" && $("#custom-question"))
    input.question = $("#custom-question").value;
  if (mode === "live" && $("#identity-custom-question"))
    input.question = $("#identity-custom-question").value;
  for (const control of definitionControls[state.lesson.number] ?? [])
    input[control.key] = $(`#${control.key}`).value;
  if (state.lesson.number >= 95) Object.assign(input, courseInput());
  return input;
}

function setControlsDisabled(disabled) {
  document
    .querySelectorAll(
      "#exercise-controls select, #exercise-controls input, #verify-button, #mode-controls button",
    )
    .forEach((element) => {
      element.disabled = disabled;
    });
}

async function fetchResult(extra) {
  controller = new AbortController();
  const owner = controller;
  const streaming = state.lesson.number >= 49 && state.lesson.number <= 56;
  if (streaming) {
    $("#stream-text").textContent = "";
    $("#stream-events").textContent = "";
    $("#stream-status").textContent = "Receiving SDK events…";
  }
  const response = await fetch(
    api(streaming ? "/api/execute-stream" : "/api/execute"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValues(extra)),
      signal: controller.signal,
    },
  );
  if (streaming && response.ok) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffered = "",
      payload;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        let boundary;
        while ((boundary = buffered.indexOf("\n\n")) >= 0) {
          const frame = buffered.slice(0, boundary);
          buffered = buffered.slice(boundary + 2);
          const line = frame
            .split("\n")
            .find((part) => part.startsWith("data: "));
          if (!line) continue;
          const event = JSON.parse(line.slice(6));
          if (event.type === "error") throw new Error(event.data.error);
          if (event.type === "result") payload = event.data;
          if (event.type === "progress" && controller === owner) {
            const entry = event.data;
            if (entry.delta !== undefined)
              $("#stream-text").textContent += entry.delta;
            $("#stream-status").textContent = entry.agent
              ? `${entry.agent} · ${entry.event}`
              : entry.event;
            const item = document.createElement("li");
            item.textContent = `${entry.kind} · ${entry.event}${entry.agent ? " · " + entry.agent : ""}${entry.status ? " · " + entry.status : ""}`;
            $("#stream-events").append(item);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    if (!payload)
      throw new Error(
        "The event stream ended before the exercise result arrived.",
      );
    if (controller === owner)
      $("#stream-status").textContent = payload.evidence.paused
        ? "Paused · approval required"
        : payload.evidence.cancelled
          ? "Cancelled · cleanup complete"
          : payload.evidence.consumed
            ? "Completed"
            : "Failed · settled";
    return payload;
  }
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error);
    error.diagnosis = payload.diagnosis;
    throw error;
  }
  return payload;
}

function renderCitations(citations) {
  document.querySelector("#answer-sources")?.remove();
  if (!citations.length) return;
  const section = document.createElement("section");
  section.id = "answer-sources";
  section.setAttribute("aria-label", "Answer sources");
  const heading = document.createElement("h3");
  heading.textContent = "Sources";
  section.append(heading);
  const list = document.createElement("ul");
  for (const citation of citations) {
    const item = document.createElement("li");
    if (citation.type === "url_citation") {
      let url;
      try {
        url = new URL(citation.url);
      } catch {
        continue;
      }
      if (!["http:", "https:"].includes(url.protocol)) continue;
      const link = document.createElement("a");
      link.href = url.href;
      link.textContent = citation.title || url.hostname;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      item.append(link);
    } else item.textContent = citation.filename || citation.file_id;
    list.append(item);
  }
  section.append(list);
  $("#output").after(section);
}

function renderArtifacts(artifacts) {
  document.querySelector("#answer-artifacts")?.remove();
  if (!artifacts.length) return;
  const section = document.createElement("section");
  section.id = "answer-artifacts";
  section.className = "answer-artifacts";
  section.setAttribute("aria-label", "Exercise files");
  for (const artifact of artifacts) {
    if (
      !/^\/api\/artifacts\/[a-f0-9-]{36}\.(png|webp|jpeg|csv|json|txt|wav)$/.test(
        artifact.url,
      )
    )
      continue;
    const figure = document.createElement("figure");
    if (artifact.mime?.startsWith("audio/")) {
      const audio=document.createElement("audio");
      audio.controls=true;
      audio.src=artifact.url;
      audio.setAttribute("aria-label",artifact.label);
      figure.append(audio);
    }
    if (artifact.mime?.startsWith("image/")) {
      const image = document.createElement("img");
      image.src = artifact.url;
      image.alt = artifact.label;
      figure.append(image);
    }
    const link = document.createElement("a");
    link.href = artifact.url;
    link.download = artifact.url.split("/").at(-1);
    link.textContent = artifact.label;
    figure.append(link);
    section.append(figure);
  }
  $("#output").after(section);
}

function showStep() {
  const visible = result.events.slice(0, index);
  $("#timeline").innerHTML = visible
    .map(
      (entry) =>
        `<li><h3>${escape(entry.title)}</h3><p>${escape(entry.detail)}</p>${entry.data ? `<pre data-language="json">${escape(JSON.stringify(entry.data, null, 2))}</pre>` : ""}</li>`,
    )
    .join("");
  for (const node of $("#timeline").querySelectorAll("pre[data-language]")) {
    highlightElement(node, node.dataset.language);
  }
  document
    .querySelectorAll(".flow [data-actor]")
    .forEach((node) =>
      node.classList.toggle(
        "active",
        node.dataset.actor === visible.at(-1)?.actor,
      ),
    );
  const complete = index >= result.events.length;
  $("#step-status").textContent = complete
    ? `Complete · ${result.events.length} stages`
    : `Step ${index} of ${result.events.length} · replaying the completed operation`;
  $("#execution-label").textContent = result.label;
  $("#result").hidden = !complete;
  document.body.dataset.complete = String(complete);
  if (complete) {
    renderAnswer(
      $("#output"),
      typeof result.output === "string"
        ? result.output
        : JSON.stringify(result.output, null, 2),
    );
    $("#evidence").textContent = JSON.stringify(result.evidence, null, 2);
    highlightElement($("#evidence"), "json");
    $("#takeaway").textContent = result.takeaway;
    renderCitations(result.citations ?? []);
    renderArtifacts(result.artifacts ?? []);
    if (state.lesson.number >= 95) updateCoursePanel(state.lesson.number, result);
    updatePilotResult(state.lesson.number, result);
  }
}

async function start(extra = {}, automatic = true) {
  if (playing) {
    stop();
    return;
  }
  const generation = ++runGeneration;
  playing = true;
  $("#error").hidden = true;
  setControlsDisabled(true);
  updateMode();
  try {
    if (!result || automatic) {
      index = 0;
      result = undefined;
      $("#timeline").innerHTML = "";
      $("#result").hidden = true;
      document.body.dataset.complete = "false";
      $("#execution-label").textContent =
        mode === "live"
          ? "Waiting for the actual SDK result…"
          : extra.action === "verify"
            ? "Reading the package registries…"
            : "Executing the local exercise…";
      const completed = await fetchResult(extra);
      if (generation !== runGeneration) return;
      result = completed;
    }
    if (generation !== runGeneration) return;
    if (mode === "live") {
      index = result.events.length;
      showStep();
    } else {
      do {
        if (generation !== runGeneration) return;
        index = Math.min(index + 1, result.events.length);
        showStep();
        if (!automatic || index >= result.events.length) break;
        await new Promise((resolve) => setTimeout(resolve, 950));
      } while (index < result.events.length);
    }
  } catch (error) {
    if (generation !== runGeneration) return;
    $("#error").hidden = false;
    $("#error").textContent =
      error.name === "AbortError"
        ? "Run stopped."
        : `${error.message}${error.diagnosis ? `\n\n${error.diagnosis.title}\n${error.diagnosis.explanation}\n\n${error.diagnosis.command}` : ""}`;
    $("#execution-label").textContent = "The operation did not complete.";
  } finally {
    if (generation === runGeneration) {
      playing = false;
      setControlsDisabled(false);
      updateMode();
    }
  }
}

function stop() {
  const wasPlaying = playing;
  ++runGeneration;
  controller?.abort();
  if (wasPlaying && $("#stream-status"))
    $("#stream-status").textContent = "Stream stopped";
  playing = false;
  setControlsDisabled(false);
  updateMode();
  $("#execution-label").textContent =
    "Playback stopped. Reset to begin a new exercise.";
}

function reset() {
  stop();
  resetPilotResult();
  result = undefined;
  index = 0;
  $("#timeline").innerHTML = "";
  $("#result").hidden = true;
  $("#error").hidden = true;
  $("#result details").open = false;
  if ($("#stream-text")) {
    $("#stream-text").textContent = "";
    $("#stream-events").textContent = "";
    $("#stream-status").textContent = "Ready for a stream";
  }
  document.body.dataset.complete = "false";
  document
    .querySelectorAll(".flow .active")
    .forEach((node) => node.classList.remove("active"));
  $("#execution-label").textContent =
    mode === "live"
      ? "Ready for a live request"
      : "Ready for a local classroom exercise";
  $("#step-status").textContent =
    "Choose your inputs, then run or step through the exercise.";
  $("#takeaway").textContent =
    "Follow the execution and connect each stage to the source.";
}

async function initialize() {
  const prompt = new URL(location.href).searchParams.get("prompt");
  const response = await fetch(
    `/api/state${prompt ? `?prompt=${encodeURIComponent(prompt)}` : ""}`,
  );
  state = await response.json();
  if (!response.ok) throw new Error(state.error);
  const lesson = state.lesson;
  document.body.dataset.prompt = String(lesson.number);
  document.title = `${lesson.title} · Agent Academy`;
  $("#navigation").innerHTML = state.lessons
    .map(
      (entry) =>
        `<a href="/?prompt=${entry.number}" class="${entry.number === lesson.number ? "active" : ""}" ${entry.number === lesson.number ? 'aria-current="page"' : ""}><span>${String(entry.number).padStart(2, "0")}</span>${escape(entry.title)}</a>`,
    )
    .join("");
  $("#breadcrumb").textContent = lesson.title;
  if (lesson.category) {
    $("#category").textContent = lesson.category;
    $(".intro .eyebrow").textContent =
      `AGENTS SDK · ${lesson.category.toUpperCase()}`;
  }
  $("#headline").textContent = lesson.headline;
  $("#summary").textContent = lesson.summary;
  $("#prompt-number").textContent =
    `PROMPT ${String(lesson.number).padStart(3, "0")}`;
  $("#lab-title").textContent = lesson.title + " in practice";
  $("#mode-controls").hidden = !lesson.live;
  renderControls();
  renderSource();
  updateMode();
  $("#quiz-question").textContent = lesson.question;
  $("#quiz-answers").innerHTML = lesson.answers
    .map((answer, i) => `<button data-answer="${i}">${escape(answer)}</button>`)
    .join("");
  $("#quiz-answers")
    .querySelectorAll("button")
    .forEach((button) =>
      button.addEventListener("click", () => {
        $("#quiz-feedback").textContent =
          Number(button.dataset.answer) === lesson.correct
            ? `Correct. ${lesson.explanation}`
            : "Try again. Follow the execution and inspect the source.";
      }),
    );
  $("#run-button").addEventListener("click", () => start());
  $("#next-button").addEventListener("click", () => start({}, false));
  $("#reset-button").addEventListener("click", reset);
  document.addEventListener("lesson:reviewed", (event) => {
    if (state.lesson.number !== 127) return;
    result = event.detail;
    index = result.events.length;
    showStep();
  });
  $("#classroom-mode").addEventListener("click", () => {
    mode = "classroom";
    reset();
    updateMode();
  });
  $("#live-mode").addEventListener("click", () => {
    mode = "live";
    reset();
    updateMode();
  });
  $("#record-button").addEventListener("click", () => {
    const active = document.body.classList.toggle("recording");
    $("#record-button").setAttribute("aria-pressed", String(active));
  });
  $("#guide-title").textContent = lesson.title;
  $("#exact-prompt").textContent = lesson.prompt;
  $("#teaching-steps").innerHTML = [
    "Read the implementation prompt and ask students to predict the result.",
    "Select an input and click Next step. Identify who performs each stage.",
    "Open the source files and connect the API names to the visible stages.",
    "Run another input, inspect the evidence, and answer the knowledge check.",
  ]
    .map((text) => `<li>${text}</li>`)
    .join("");
  $("#record-command").textContent =
    `cd apps\\${lesson.folder}\nnpm run record`;
  highlightElement($("#record-command"), "powershell");
  $("#live-guidance").textContent = lesson.live
    ? "Install dependencies with npm ci in the apps folder. Copy this application's .env.example to .env, set OPENAI_API_KEY and an accessible OPENAI_MODEL, and restart. The browser live runner uses TypeScript. Python examples run separately with Python 3.10+ and their pinned requirements."
    : "This lesson executes local project or diagnostic operations. Bootstrap release verification contacts npm and PyPI. Model credentials are needed when you run the downloaded agent project.";
  if (lesson.number === 9) {
    $("#teaching-steps").innerHTML = [
      "Read the prompt. Compare the specialist's name with its responsibility and boundary instructions.",
      "Run the relevant question, then rename the agent and observe that its responsibility stays the same.",
      "Choose an unrelated request and missing-information request. Discuss redirection and clarification.",
      "Compare concise and guided response styles. In Live API mode, inspect actual behavior against the generated instructions.",
    ]
      .map((text) => `<li>${text}</li>`)
      .join("");
    $("#live-guidance").textContent =
      "Copy this application's .env.example to .env, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Live API uses the actual Agents SDK. Classroom answers are scripted fixtures. Boundary instructions guide the model. Resource permissions must be enforced by application code. This example configures no database or execution tools.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/define-agents";
  }
  if (definitionControls[lesson.number]) {
    $("#teaching-steps").innerHTML = [
      "Read the exact prompt and inspect the lesson's instruction or configuration source.",
      "Run the first option, step through its execution evidence, and explain which operations are local.",
      "Change one input and compare the new configuration and result. Inspect scripted classroom output separately from actual SDK construction.",
      "Use Live API where available to observe real model behavior, then discuss the knowledge check.",
    ]
      .map((text) => `<li>${text}</li>`)
      .join("");
    $("#live-guidance").textContent =
      lesson.number === 16
        ? "This lesson constructs SDK configuration examples and reads the installed declaration file locally. It performs zero model requests."
        : "Install shared dependencies in the apps folder. Configure OPENAI_API_KEY and an accessible OPENAI_MODEL in this app's .env, then restart. Live API uses the actual SDK. Prompt 11 performs two model runs for each comparison. Prompt 13's legacy hosted path additionally needs an existing STORED_PROMPT_ID and service availability.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/define-agents";
    if (lesson.number === 16)
      $("#result-heading").textContent = "Installed SDK configuration";
  }
  $("#guide-button").addEventListener("click", () => $("#guide").showModal());
  if (lesson.number >= 17 && lesson.number <= 24) {
    $("#teaching-steps").innerHTML = [
      "Inspect the sample application context and identify the user, tenant, preferences, and request metadata.",
      "Run the scenario with the scripted local model. The SDK runner and registered tools execute on your computer.",
      "Inspect the observed tool calls, resource checks, state changes, and lifecycle trace in the evidence.",
      "Change one input and compare results. All profiles and resources are teaching fixtures. Discuss how production code obtains authenticated identity and owns resource clients.",
    ]
      .map((text) => `<li>${text}</li>`)
      .join("");
    $("#live-guidance").textContent = lesson.live
      ? "Live API uses the configured OpenAI model with the same local teaching fixtures. Set OPENAI_API_KEY and an accessible OPENAI_MODEL in the app's .env and restart. Model decisions can vary, so inspect observed tool executions. Database and API adapters use local in-memory data."
      : "This lesson uses local runtime validation or controlled SDK runs. It requires installed dependencies and works without API credentials. Application adapters use local in-memory fixtures.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/define-agents#keep-local-context-separate-from-model-context";
    if (lesson.number === 17)
      $("#result-heading").textContent = "Runtime validation result";
  }
  if (lesson.number >= 25) {
    $("#teaching-steps").innerHTML = [
      "Inspect the actual schema, asset, or model configuration in the source explorer.",
      "Select a scenario and run it. Step through the observed SDK operations.",
      "Inspect the evidence and compare accepted, rejected, and incomplete outcomes.",
      "Change one input and record the comparison using Recording view.",
    ]
      .map((text) => "<li>" + text + "</li>")
      .join("");
    $("#live-guidance").textContent =
      lesson.number === 25
        ? "Prompt 25 runs Python and Pydantic. Run npm run setup:python once in the apps folder. Live API requires OPENAI_API_KEY and a compatible OPENAI_MODEL in this application’s .env."
        : lesson.live
          ? "Classroom inference is scripted. SDK validation, tools, payload conversion, and local checks execute. Live API requires OPENAI_API_KEY and a compatible model. Prompt 34 selects explicit model profiles."
          : "This lesson runs controlled local SDK examples without API credentials. Refusal and incomplete provider outcomes in Prompt 29 are explicitly injected fixtures.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/models";
  }
  if (lesson.number >= 35) {
    $("#teaching-steps").innerHTML = [
      "Inspect the selected configuration and executable lesson source.",
      "Run the scenario and inspect actual SDK operations in the evidence.",
      "Change one input and compare observed calls, outputs, settings, or connections.",
      "Use Recording view to capture the comparison.",
    ]
      .map((text) => "<li>" + text + "</li>")
      .join("");
    $("#live-guidance").textContent =
      lesson.number === 41
        ? "Python modes use the workspace Python environment. Run npm run setup:python once in the apps folder. Each Python exercise runs in an owned subprocess."
        : lesson.live
          ? "Live API requires credentials. Prompt 35 makes two model runs. Prompt 36 uses explicit Luna and Astra models. Prompt 37 compares both endpoints. Prompt 38 uses ALT_PROVIDER_URL, ALT_PROVIDER_MODEL, and OPENAI_API_KEY for that external provider. Classroom inference is scripted."
          : "The SDK executes locally with controlled model or protocol fixtures. Prompt 40 opens a real loopback WebSocket endpoint and closes its owned connections.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/running-agents";
  }
  if (lesson.number >= 45) {
    $("#teaching-steps").innerHTML = [
      "Inspect the executable SDK example and select a scenario.",
      "Run the exercise. Streaming lessons display actual incremental progress before the replay begins.",
      "Inspect the final evidence and explain completion, failure, or cancellation.",
      "Change one input and compare the result in Recording view.",
    ]
      .map((text) => "<li>" + text + "</li>")
      .join("");
    $("#live-guidance").textContent =
      "These lessons execute the installed SDK with controlled local model output. Token reports are synthetic fixtures. Prompt 49 also runs in the terminal with npm run terminal:49. Streaming progress reaches the page during execution.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/agents/results";
    if (lesson.number >= 49 && lesson.number <= 56) {
      const panel = document.createElement("section");
      panel.className = "stream-progress";
      panel.id = "stream-progress";
      panel.innerHTML =
        '<h3>Live SDK progress</h3><p id="stream-status">Ready for a stream</p><pre id="stream-text"></pre><details><summary>Observed event log</summary><ol id="stream-events"></ol></details>';
      $("#exercise-controls").after(panel);
    }
  }
  if (lesson.number >= 55) {
    $("#teaching-steps").innerHTML = [
      "Inspect the registered tool, schema, state or SSE endpoint source.",
      "Run the first scenario and inspect actual SDK execution evidence.",
      "Change the input to compare decisions, validation, access checks or failures.",
      "Use Recording view to capture the comparison and knowledge check.",
    ]
      .map((text) => "<li>" + text + "</li>")
      .join("");
    $("#live-guidance").textContent = lesson.live
      ? "Classroom inference is scripted. Live API uses your configured OPENAI_API_KEY and an accessible OPENAI_MODEL. Tool callbacks execute against the same local teaching fixtures. Model choices can vary."
      : "This lesson runs controlled local SDK examples. HTTP services and SSE clients are loopback fixtures. Approval state and data exist within the exercise invocation. No API credential is required.";
    $(".page-footer a").href =
      "https://developers.openai.com/api/docs/guides/tools";
  }
  if (lesson.number >= 65) {
    $("#live-guidance").textContent =
      lesson.number >= 71
        ? "Classroom provider responses are injected fixtures. Live mode calls hosted services using a compatible model. Prompt 74 requires VECTOR_STORE_ID from its document setup command. Inspect each lesson hint for execution details."
        : lesson.live
          ? "Classroom model choices are scripted while SDK callbacks and policies execute locally. Live mode uses your configured model and local fixture tools."
          : "This controlled local model reproduces forced-tool repetition and its bounded recovery.";
  }
  if (lesson.number >= 75) {
    $("#live-guidance").textContent =
      hostedHints[lesson.number] +
      " Live inference requires the selected app’s environment configuration and an accessible compatible model. Live hosted operations can incur charges.";
  }
  if (lesson.number >= 85) {
    $("#live-guidance").textContent =
      handoffHints[lesson.number] +
      (lesson.live
        ? " Live inference requires this app’s configured API key and an accessible model. These cases use synthetic local teaching data."
        : " This lesson executes locally without an API key.");
  }
  $("#copy-button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(state.sources[selectedSource]);
      $("#copy-button").textContent = "Copied";
    } catch {
      $("#copy-button").textContent = "Open Full file to copy";
    }
  });
  if (lesson.number >= 95) {
    $("#live-guidance").textContent = remainingHints[lesson.number];
    $(".knowledge").hidden = true;
    $("#teaching-steps").lastElementChild.textContent = "Use Recording view to capture the scenario comparison and execution evidence.";
    mountCoursePanel(lesson.number);
  }
  await mountPilotLesson(lesson.number, state.lessons);
  document.body.dataset.ready = "true";
}

initialize().catch((error) => {
  $("#headline").textContent = "The lesson could not load.";
  $("#summary").textContent = error.message;
});
import { remainingHints } from "/remaining-lessons.js";
import { mountCoursePanel, updateCoursePanel, courseInput } from "/course-panel.js";
