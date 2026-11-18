import { highlightElement } from "/syntax/highlight.js";

const extraInput = {};
export function courseInput() {
  return { ...extraInput };
}
const element = (tag, text) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (tag === "pre" && text) highlightElement(node, "json");
  return node;
};
async function execute(number, input) {
  const response = await fetch(`/api/execute?prompt=${number}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "classroom", ...input }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
async function streamChat(input, onProgress) {
  const response = await fetch("/api/execute-stream?prompt=182", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "classroom",
      scenario: "conversation",
      ...input,
    }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  const reader = response.body.getReader(),
    decoder = new TextDecoder();
  let buffer = "",
    result;
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const frames = buffer.split("\n\n");
    buffer = frames.pop();
    for (const frame of frames) {
      const line = frame.split("\n").find((line) => line.startsWith("data: "));
      if (!line) continue;
      const item = JSON.parse(line.slice(6));
      if (item.type === "progress") onProgress(item.data);
      if (item.type === "result") result = item.data;
      if (item.type === "error") throw new Error(item.data.error);
    }
    if (done) break;
  }
  if (!result) throw new Error("Chat ended without a completed result");
  return result;
}
export function mountCoursePanel(number) {
  document.querySelector("#course-panel")?.remove();
  if (![127, 153, 182, 191, 197, 200].includes(number)) return;
  const panel = element("section");
  panel.id = "course-panel";
  panel.className = "identity-contract";
  document.querySelector("#exercise-controls").after(panel);
  if (number === 127) {
    panel.append(
      element("h3", "Review proposed record changes"),
      element(
        "p",
        "Run the pause scenario to load the exact tool arguments. The reviewing identity is the teacher fixture.",
      ),
    );
  }
  if ([182, 191].includes(number)) {
    panel.append(
      element(
        "h3",
        number === 191
          ? "Self-hosted ChatKit companion"
          : "Chat with the tutor",
      ),
    );
    if (number === 191) {
      const link = element("a", "Open ChatKit companion on port 4191");
      link.href = "http://127.0.0.1:4191";
      link.target = "_blank";
      link.rel = "noreferrer";
      panel.append(
        link,
        element(
          "p",
          "Start the companion with npm run chatkit in the apps directory. Its server implements the ChatKit protocol and stores threads in SQLite.",
        ),
      );
    }
    const log = element("div");
    log.id = "chat-log";
    log.setAttribute("aria-live", "polite");
    const form = element("form");
    const field = element("input");
    field.id = "chat-message";
    field.maxLength = 1000;
    field.placeholder = "Ask about agent tools";
    field.required = true;
    field.setAttribute("aria-label", "Chat message");
    const send = element("button", "Send message");
    send.type = "submit";
    form.append(field, send);
    panel.append(log, form);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      send.disabled = true;
      log.append(element("p", `You — ${field.value}`));
      try {
        const reply = element("p", "Tutor — ");
        log.append(reply);
        const invoke =
          number === 182
            ? (input) =>
                streamChat(input, (entry) => {
                  if (entry.event === "text_delta")
                    reply.textContent += entry.text;
                  else if (entry.detail)
                    reply.setAttribute("aria-label", entry.detail);
                })
            : (input) => execute(number, input);
        const result = await invoke({
          scenario: number === 191 ? "thread" : "conversation",
          message: field.value,
          threadId: extraInput.threadId,
        });
        extraInput.threadId = result.evidence.threadId;
        reply.textContent = `Tutor — ${result.output}`;
        for (const citation of result.citations ?? [])
          log.append(element("p", `Source — ${citation.filename}`));
        field.value = "";
      } catch (error) {
        log.append(element("p", error.message));
      } finally {
        send.disabled = false;
      }
    });
  }
  if (number === 197) {
    panel.append(element("h3", "Analyze your CSV"));
    const file = element("input");
    file.type = "file";
    file.accept = ".csv,text/csv";
    file.id = "csv-upload";
    file.setAttribute("aria-label", "CSV file");
    const status = element(
      "p",
      "Use columns name,value with 1 to 30 rows. The sample remains selected until a file is loaded.",
    );
    file.addEventListener("change", async () => {
      const selected = file.files[0];
      if (!selected) return;
      if (selected.size > 8000) {
        status.textContent = "Choose a CSV smaller than 8,000 bytes.";
        return;
      }
      extraInput.csv = await selected.text();
      status.textContent = `Loaded ${selected.name}. Run the analyze scenario.`;
    });
    panel.append(file, status);
  }
  if (number === 153) {
    panel.append(
      element("h3", "Live microphone over WebRTC"),
      element(
        "p",
        "This separate client requests microphone access and a short-lived token from the local backend. Enable CLASSROOM_LIVE_VOICE=1 and configure OPENAI_API_KEY to use the paid provider.",
      ),
    );
    const connect = element("button", "Connect microphone");
    connect.id = "voice-connect";
    const stop = element("button", "Disconnect");
    stop.id = "voice-disconnect";
    const status = element("pre");
    status.id = "voice-status";
    status.setAttribute("aria-live", "polite");
    panel.append(connect, stop, status);
    connect.addEventListener("click", async () => {
      const { connectVoice } = await import("./voice-client.js");
      await connectVoice(status);
    });
    stop.addEventListener("click", async () => {
      const { disconnectVoice } = await import("./voice-client.js");
      disconnectVoice();
      status.textContent = "Disconnected";
    });
  }
  if (number === 200) {
    panel.append(
      element("h3", "Capstone readiness"),
      element(
        "p",
        "Run the healthy, recovery and regression scenarios. The downloadable report includes evaluation scores, persisted job state, unique side effects and live-integration limitations.",
      ),
    );
  }
}
export function updateCoursePanel(number, result) {
  if (number === 152) {
    document.querySelector("#trace-graph")?.remove();
    const panel = element("section");
    panel.id = "trace-graph";
    panel.className = "identity-contract";
    panel.append(element("h3", "Observed workflow graph"));
    const spans = result.evidence.graph ?? [];
    const render = (parent) => {
      const list = element("ul");
      for (const span of spans.filter((span) => span.parent === parent)) {
        const item = element(
          "li",
          `${span.name ?? span.type} · ${span.id.slice(-8)}`,
        );
        item.append(render(span.id));
        list.append(item);
      }
      return list;
    };
    panel.append(render(null));
    document.querySelector("#output").after(panel);
    return;
  }
  if (number !== 127) return;
  const panel = document.querySelector("#course-panel");
  if (!panel) return;
  panel.replaceChildren(element("h3", "Review proposed record changes"));
  for (const record of result.reviewRecords ?? []) {
    const card = element("section");
    card.append(
      element("h4", record.tool),
      element("pre", JSON.stringify(record.arguments, null, 2)),
      element(
        "p",
        `Reviewer ${record.approvingIdentity}. Decision ${record.decision}.`,
      ),
    );
    panel.append(card);
  }
  if (
    (result.reviewRecords ?? []).some((record) => record.decision === "pending")
  ) {
    for (const decision of ["approve", "reject"]) {
      const button = element(
        "button",
        decision === "approve"
          ? "Approve proposed action"
          : "Reject proposed action",
      );
      button.dataset.decision = decision;
      button.addEventListener("click", async () => {
        panel
          .querySelectorAll("button")
          .forEach((node) => (node.disabled = true));
        try {
          const next = await execute(127, {
            scenario: decision,
            reviewId: result.reviewId,
          });
          document.dispatchEvent(new CustomEvent("lesson:reviewed", { detail: next }));
        } catch (error) {
          panel.append(element("p", error.message));
          panel
            .querySelectorAll("button")
            .forEach((node) => (node.disabled = false));
        }
      });
      panel.append(button);
    }
  }
  if (!(result.reviewRecords ?? []).some(record => record.decision === "pending")) {
    panel.append(element("p", result.output), element("pre", JSON.stringify(result.evidence, null, 2)));
  }
}
