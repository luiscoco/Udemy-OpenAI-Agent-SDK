import { highlightLines, highlightJson } from "/syntax/highlight.js";

const $ = (selector) => document.querySelector(selector);
const iconPaths = {
  workflow:
    '<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v9h9M9 6h9v9"/>',
  message:
    '<path d="M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z"/><path d="M7 9h8M7 13h5"/>',
  cloud: '<path d="M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5.5 5.5 0 0 1 0 11Z"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>',
  book: '<path d="M12 6c-3-2-6-3-10-2v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-4-1-7 0-10 2ZM12 6v15"/>',
  screen:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  next: '<path d="m5 5 9 7-9 7ZM19 5v14"/>',
  external:
    '<path d="M14 3h7v7M21 3l-9 9M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  lightbulb:
    '<path d="M9 18h6M10 21h4M8 15a7 7 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',
  location:
    '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  app: '<rect x="2" y="3" width="20" height="17" rx="2"/><path d="M2 8h20M6 5.5h.01M9 5.5h.01"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.code}</svg>`;
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

const state = {
  product: "agents-sdk",
  mode: "demo",
  index: -1,
  complete: false,
  busy: false,
  result: null,
  error: "",
  plan: null,
  controller: null,
  manualLoading: false,
  challenge: 0,
  answered: false,
  runtimeName: "",
};
let lesson;
let configuration;
let operation = 0;
const hostedSessions = new Set();

function applyIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
}

function selectedProduct() {
  return lesson.products.find((product) => product.id === state.product);
}

function resetExecution() {
  operation++;
  state.controller?.abort();
  Object.assign(state, {
    index: -1,
    complete: false,
    busy: false,
    result: null,
    error: "",
    plan: null,
    controller: null,
    manualLoading: false,
    runtimeName: "",
  });
}

function selectProduct(id) {
  if (state.busy || state.manualLoading) return;
  resetExecution();
  state.product = id;
  render();
}

function renderProducts() {
  $("#product-grid").innerHTML = lesson.products
    .map(
      (product) => `
    <button class="product-card" data-product="${product.id}" aria-pressed="${state.product === product.id}" ${state.busy ? "disabled" : ""}>
      <div class="product-top"><span class="product-icon">${icon(product.icon)}</span><span class="selected-check">${icon("check")}</span></div>
      <h2>${escape(product.name)}</h2><p>${escape(product.description)}</p><span class="product-category">${escape(product.category)}</span>
    </button>`,
    )
    .join("");
  document
    .querySelectorAll(".product-card")
    .forEach((button) =>
      button.addEventListener("click", () =>
        selectProduct(button.dataset.product),
      ),
    );
}

function renderExecution() {
  const product = selectedProduct();
  const active = product.steps[state.index];
  const liveReady = configuration.live[product.id].available;
  $("#lab-title").innerHTML = `${escape(product.name)} <span>in action</span>`;
  $("#task-text").textContent = product.task;
  $("#demo-mode").setAttribute("aria-pressed", String(state.mode === "demo"));
  $("#live-mode").setAttribute("aria-pressed", String(state.mode === "live"));
  $("#demo-mode").disabled = state.busy;
  $("#live-mode").disabled = state.busy;
  $("#mode-description").textContent =
    state.mode === "demo"
      ? "Simulation · scripted model output"
      : "Live execution · configured account usage";
  $("#status-dot").className =
    `status-dot ${state.busy ? "running" : state.complete ? "complete" : ""}`;
  $("#step-counter").textContent = state.complete
    ? "Workflow complete"
    : active
      ? `Step ${state.index + 1} of ${product.steps.length}`
      : "Ready to explore";
  $("#ownership-text").textContent = product.ownership;
  $("#workflow").innerHTML = product.nodes
    .map(
      (node, index) =>
        `${index ? `<span class="workflow-arrow">${icon("arrow")}</span>` : ""}<div class="workflow-node ${active?.node === index ? "active" : ""}"><span>${icon(index === 0 ? "app" : index === 1 ? product.icon : product.id === "responses" ? "message" : "code")}</span><strong>${escape(node)}</strong><small>${escape(product.boundaries[index])}</small></div>`,
    )
    .join("");
  $("#step-list").innerHTML = product.steps
    .map((step, index) => {
      const done = state.complete || index < state.index;
      return `<li class="step ${done ? "done" : index === state.index ? "active" : ""}" ${index === state.index ? 'aria-current="step"' : ""}><span class="step-marker">${done ? icon("check") : index + 1}</span><div><strong>${escape(step.title)}</strong><p>${escape(step.detail)}</p></div></li>`;
    })
    .join("");
  $("#code-filename").textContent = `${product.id}.mjs`;
  $("#code-content").classList.add("syntax-code");
  $("#code-content").dataset.language = "javascript";
  $("#code-content").innerHTML = highlightLines(product.code, "javascript")
    .map(
      (line, index) =>
        `<span class="code-line ${active?.lines.includes(index + 1) ? "highlight" : ""}"><span class="line-number" aria-hidden="true">${index + 1}</span>${line}</span>`,
    )
    .join("");
  $("#source-link").href = product.sourcePath;
  $("#code-note-text").textContent =
    product.id === "agents-sdk"
      ? "Agent, run, lookup, model, task, and signal are supplied by the server adapter. Full source includes the order tool."
      : product.id === "agents-api"
        ? "sessions is client.beta.agents.sessions. The server supplies agentConfiguration and handles runtime events, failures, and session IDs."
        : product.id === "codex"
          ? "The server supplies the fixture workspace and configured Codex instance. This lesson uses a read-only thread."
          : "The server supplies the OpenAI client, configured model, lesson task, and cancellation signal.";
  $("#code-status").textContent = state.busy
    ? state.runtimeName || "Executing on the backend"
    : state.complete
      ? state.mode === "demo"
        ? "Simulation complete"
        : "Live request complete"
      : "Highlight follows execution";
  $("#takeaway").textContent = product.takeaway;
  $("#documentation-link").href = product.source;
  $("#run-button").disabled =
    !state.busy && state.mode === "live" && !liveReady;
  $("#run-label").textContent = state.busy
    ? "Stop"
    : state.mode === "demo"
      ? state.complete
        ? "Replay demo"
        : "Run demo"
      : "Run live";
  $("#run-button [data-icon]").innerHTML = icon(state.busy ? "stop" : "play");
  $("#next-button").hidden = state.mode === "live";
  $("#next-button").disabled =
    state.busy || state.complete || state.manualLoading;
  $("#reset-button").disabled = state.busy;
  $("#setup-notice").hidden = state.mode !== "live" || liveReady;
  $("#setup-notice").textContent = configuration.live[product.id].reason;
  $("#result-panel").hidden = !state.result;
  $("#error-panel").hidden = !state.error;
  $("#error-panel").textContent = state.error;
  if (state.result) {
    $("#result-title").textContent =
      state.mode === "demo" ? "Illustrative result" : "Live result";
    $("#result-text").textContent = state.result.text;
    $("#evidence-title").textContent =
      state.result.evidenceTitle || "Inspect result";
    $("#result-evidence").textContent = state.result.evidence || "";
    highlightJson($("#result-evidence"));
  }
  $("#session-actions").hidden = !(
    state.result?.sessionId && state.mode === "live"
  );
  $("#session-id").textContent = state.result?.sessionDeleted
    ? "Hosted session deleted"
    : state.result?.sessionId || "";
  document.body.dataset.product = state.product;
  document.body.dataset.execution = state.busy
    ? "running"
    : state.complete
      ? "complete"
      : state.error
        ? "error"
        : "ready";
}

function renderChallenge() {
  const challenge = lesson.challenges[state.challenge];
  $("#challenge-question").textContent = challenge.question;
  $("#challenge-actions").innerHTML = lesson.products
    .map(
      (product) =>
        `<button class="challenge-option" data-answer="${product.id}">${escape(product.name)}</button>`,
    )
    .join("");
  $("#challenge-feedback").textContent = "";
  $("#challenge-next").hidden = true;
  document.querySelectorAll(".challenge-option").forEach((button) =>
    button.addEventListener("click", () => {
      const correct = button.dataset.answer === challenge.answer;
      document.querySelectorAll(".challenge-option").forEach((option) => {
        option.className = "challenge-option";
      });
      button.classList.add(correct ? "correct" : "incorrect");
      $("#challenge-feedback").textContent = correct
        ? `Exactly. ${challenge.why}`
        : "Think about who should own the workflow. Try another product.";
      $("#challenge-next").hidden = !correct;
    }),
  );
}

function render() {
  renderProducts();
  renderExecution();
  renderSessions();
}

function renderSessions() {
  $("#hosted-sessions").hidden = hostedSessions.size === 0;
  $("#hosted-session-list").innerHTML = [...hostedSessions]
    .map(
      (id) =>
        `<div class="hosted-session-row"><code>${escape(id)}</code><button class="text-button" data-session="${escape(id)}">Delete session</button></div>`,
    )
    .join("");
  document
    .querySelectorAll("[data-session]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        deleteSession(button.dataset.session, button),
      ),
    );
}

async function deleteSession(id, button) {
  button.disabled = true;
  try {
    const response = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error(
        (await response.json()).error || "Session cleanup failed.",
      );
    hostedSessions.delete(id);
    if (state.result?.sessionId === id) state.result.sessionDeleted = true;
    renderExecution();
    renderSessions();
  } catch (error) {
    state.error = error.message;
    renderExecution();
  } finally {
    button.disabled = false;
  }
}

async function nextStep() {
  if (state.busy || state.manualLoading || state.complete) return;
  const ticket = operation;
  state.manualLoading = true;
  renderExecution();
  try {
    if (!state.plan) {
      const response = await fetch(`/api/demo?product=${state.product}`);
      if (!response.ok)
        throw new Error("The classroom example could not be loaded.");
      const plan = await response.json();
      if (ticket !== operation) return;
      state.plan = plan;
    }
    state.index++;
    if (state.index >= selectedProduct().steps.length - 1) {
      state.result = state.plan.result;
      state.complete = true;
    }
    $("#announcement").textContent = selectedProduct().steps[state.index].title;
  } catch (error) {
    if (ticket === operation) state.error = error.message;
  } finally {
    if (ticket === operation) {
      state.manualLoading = false;
      renderExecution();
    }
  }
}

function handleEvent(event) {
  if (event.sessionId && state.mode === "live") {
    hostedSessions.add(event.sessionId);
    renderSessions();
  }
  if (event.type === "step") {
    state.index = event.index;
    $("#announcement").textContent =
      selectedProduct().steps[event.index]?.title || "";
  }
  if (event.type === "runtime") state.runtimeName = event.name;
  if (event.type === "result") {
    state.result = event;
    state.complete = true;
    state.index = selectedProduct().steps.length - 1;
    $("#announcement").textContent =
      "Workflow complete. The result is ready to inspect.";
  }
  if (event.type === "error") {
    state.error = event.message;
    if (event.sessionId)
      state.result = {
        sessionId: event.sessionId,
        text: "A hosted session was created. Inspect or delete it before starting another request.",
        evidence: event.sessionId,
        evidenceTitle: "Hosted session ID",
      };
  }
  renderExecution();
}

async function run() {
  if (state.busy) {
    state.controller.abort();
    return;
  }
  resetExecution();
  const ticket = operation;
  state.busy = true;
  state.controller = new AbortController();
  $("#evidence-details").open = false;
  render();
  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ product: state.product, mode: state.mode }),
      signal: state.controller.signal,
    });
    if (!response.ok)
      throw new Error(
        (await response.json()).error || "The request could not be started.",
      );
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines)
        if (line.trim() && ticket === operation) handleEvent(JSON.parse(line));
      if (done) break;
    }
    if (buffer.trim() && ticket === operation) handleEvent(JSON.parse(buffer));
    if (ticket === operation && !state.complete && !state.error)
      state.error =
        "The stream ended before a final result arrived. Inspect any hosted session before retrying.";
  } catch (error) {
    if (ticket === operation)
      state.error =
        error.name === "AbortError"
          ? "Playback stopped. You can reset or start again. Inspect any live hosted session before retrying."
          : error.message;
  } finally {
    if (ticket === operation) {
      state.busy = false;
      state.controller = null;
      render();
    }
  }
}

applyIcons();
try {
  const [lessonResponse, configResponse, sessionsResponse] = await Promise.all([
    fetch("/api/lesson"),
    fetch("/api/config"),
    fetch("/api/sessions"),
  ]);
  if (!lessonResponse.ok || !configResponse.ok || !sessionsResponse.ok)
    throw new Error(
      "The lesson could not be loaded. Restart the local server and reload.",
    );
  [lesson, configuration] = await Promise.all([
    lessonResponse.json(),
    configResponse.json(),
  ]);
  for (const session of (await sessionsResponse.json()).sessions)
    hostedSessions.add(session);
  $("#implementation-prompt").textContent = implementationQuote(
    lesson.implementationPrompt,
  );
  render();
  renderChallenge();
  $("#run-button").addEventListener("click", run);
  $("#next-button").addEventListener("click", nextStep);
  $("#reset-button").addEventListener("click", () => {
    resetExecution();
    $("#evidence-details").open = false;
    render();
  });
  for (const mode of ["demo", "live"])
    $(`#${mode}-mode`).addEventListener("click", () => {
      if (state.busy) return;
      resetExecution();
      state.mode = mode;
      render();
    });
  $("#notes-button").addEventListener("click", () =>
    $("#guide-dialog").showModal(),
  );
  $("#close-guide").addEventListener("click", () => $("#guide-dialog").close());
  $("#recording-button").addEventListener("click", () => {
    const recording = document.body.classList.toggle("recording");
    $("#recording-button").setAttribute("aria-pressed", String(recording));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  $("#copy-button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(selectedProduct().code);
      $("#copy-button").textContent = "Copied";
    } catch {
      $("#copy-button").textContent = "Select code to copy";
    }
    setTimeout(() => {
      $("#copy-button").textContent = "Copy";
    }, 1800);
  });
  $("#challenge-next").addEventListener("click", () => {
    state.challenge = (state.challenge + 1) % lesson.challenges.length;
    renderChallenge();
  });
} catch (error) {
  $("#error-panel").hidden = false;
  $("#error-panel").textContent = error.message;
  $("#run-button").disabled = true;
  $("#next-button").disabled = true;
}

function implementationQuote(text) {
  return `“${text}”`;
}
