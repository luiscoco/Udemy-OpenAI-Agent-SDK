import {
  sdk,
  runAgent,
  message,
  functionCall,
  courseResult,
  selectScenario,
  inputText,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import { runJsonProcess } from "../../../foundations-runtime/python-runtime.mjs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  capturedTransport,
  apiMessage,
} from "../../../foundations-runtime/examples/structured/captured-transport.mjs";
import { createLessonRunner } from "../../../foundations-runtime/control-execution.mjs";
import { removeAllTools } from "@openai/agents-core/extensions";

export const workerPath = fileURLToPath(
  new URL("../../../foundations-runtime/course/worker.mjs", import.meta.url),
);
export async function executeSession(number, input, { signal } = {}) {
  const scenario = input.scenario;
  const store = openStore();
  const tenant = `lesson-${number}-${randomUUID()}`;
  const id = randomUUID();
  const evidence = { tenant, sessionId: id };
  let output;
  try {
    if (number === 105) {
      const remember =
        selectScenario(scenario, ["same-session", "new-session"]) ===
        "same-session";
      const firstSession = new sdk.MemorySession();
      await runAgent(
        "Tutor",
        [message("Recorded workshop Robotics.")],
        "My workshop is Robotics.",
        { run: { session: firstSession, signal } },
      );
      const second = await runAgent(
        "Tutor",
        [
          (request) =>
            message(
              inputText(request.input).includes("Robotics")
                ? "Your workshop is Robotics."
                : "Please name your workshop.",
            ),
        ],
        "Which workshop did I select?",
        {
          run: {
            session: remember ? firstSession : new sdk.MemorySession(),
            signal,
          },
        },
      );
      evidence.requests = second.requests;
      output = second.result.finalOutput;
    }
    if (number === 106) {
      const persistent =
        selectScenario(scenario, ["restart-persistent", "new-memory"]) ===
        "restart-persistent";
      const session = store.session(tenant, id);
      await runAgent(
        "Tutor",
        [message("Invoice INV-42 recorded.")],
        "Remember invoice INV-42.",
        { run: { session, signal } },
      );
      const child = await runJsonProcess(
        process.execPath,
        [workerPath, "read", store.path, tenant, id],
        { signal },
      );
      Object.assign(evidence, {
        writerPid: process.pid,
        readerPid: child.pid,
        persistedItems: child.items,
      });
      output = persistent
        ? `New process loaded ${child.items.length} history items. Invoice preserved — ${JSON.stringify(child.items).includes("INV-42")}`
        : `A new MemorySession contains ${(await new sdk.MemorySession().getItems()).length} items.`;
    }
    if (number === 107) {
      const operation = selectScenario(scenario, ["correct", "clear"]);
      const session = store.session(tenant, id);
      await session.addItems([
        { role: "user", content: "Workshop starts at 15:00." },
      ]);
      const before = await session.getItems();
      if (operation === "correct") {
        await session.popItem();
        await session.addItems([
          { role: "user", content: "Correction: workshop starts at 16:00." },
        ]);
      } else await session.clearSession();
      Object.assign(evidence, { before, after: await session.getItems() });
      output = JSON.stringify(evidence.after);
    }
    if (number === 108) {
      selectScenario(scenario, ["concurrent-appends", "tenant-isolation"]);
      await Promise.all(
        ["A", "B"].map((label) =>
          runJsonProcess(
            process.execPath,
            [
              workerPath,
              "append",
              store.path,
              tenant,
              id,
              JSON.stringify([{ role: "user", content: `Worker ${label}` }]),
            ],
            { signal },
          ),
        ),
      );
      const items = await store.session(tenant, id).getItems();
      const other = await store.session("different-tenant", id).getItems();
      Object.assign(evidence, {
        items,
        otherTenantItems: other,
        concurrentWriters: 2,
        transactional: true,
      });
      output = `Atomic appends — ${items.length}\nOther tenant sees — ${other.length} items`;
    }
    if (number === 109) {
      const strategy = selectScenario(scenario, [
        "conversation",
        "response-chain",
        "combined-settings",
      ]);
      const transport = capturedTransport([
        apiMessage("First response."),
        apiMessage("Continuation response."),
      ]);
      const runner = createLessonRunner(false, {}, transport.client);
      const agent = new sdk.Agent({
        name: "Continuation",
        model: "gpt-6-astra",
      });
      if (strategy === "combined-settings") {
        try {
          await runner.run(agent, "Hi", {
            session: new sdk.MemorySession(),
            previousResponseId: "resp_fixture",
            signal,
          });
          evidence.rejected = false;
          evidence.observation =
            "Installed SDK accepted session plus previousResponseId against the captured provider. Verify provider-side constraints before deployment.";
          evidence.actualPayloads = transport.requests;
        } catch (error) {
          evidence.rejected = true;
          evidence.error = { type: error.name, message: error.message };
        }
        output = JSON.stringify(evidence);
      } else {
        const first = await runner.run(agent, "First", {
          ...(strategy === "conversation"
            ? { conversationId: "conv_classroom" }
            : {}),
          signal,
        });
        await runner.run(agent, "Next", {
          ...(strategy === "conversation"
            ? { conversationId: "conv_classroom" }
            : { previousResponseId: first.lastResponseId }),
          signal,
        });
        evidence.actualPayloads = transport.requests;
        output = `Strategy — ${strategy}\nActual provider request count — ${transport.requests.length}`;
      }
    }
    if (number === 110) {
      const manage =
        selectScenario(scenario, ["compact-context", "full-context"]) ===
        "compact-context";
      const initial = Array.from({ length: 20 }, (_, index) => ({
        role: "user",
        content: `Old unrelated note ${index}`,
      }));
      initial.push({
        role: "user",
        content: "Task state: invoice INV-42, amount EUR 18.",
      });
      const session = new sdk.MemorySession({ initialItems: initial });
      const run = await runAgent(
        "Context tutor",
        [
          (request) =>
            message(
              inputText(request.input).includes("INV-42")
                ? "INV-42 remains available."
                : "Missing invoice.",
            ),
        ],
        "Continue task.",
        {
          run: {
            session,
            signal,
            ...(manage
              ? {
                  sessionInputCallback: (_history, newItems) => [
                    {
                      role: "user",
                      content: "Retained task state: INV-42, EUR 18.",
                    },
                    ...newItems,
                  ],
                }
              : {}),
          },
        },
      );
      evidence.actualModelInput = run.requests[0].input;
      evidence.retained = JSON.stringify(evidence.actualModelInput).includes(
        "INV-42",
      );
      output = `Model input items — ${evidence.actualModelInput.length}\nTask state retained — ${evidence.retained}`;
    }
    if (number === 111) {
      const operation = selectScenario(scenario, [
        "approved-fact",
        "correct-fact",
        "delete-fact",
        "unapproved",
      ]);
      let denied = false;
      try {
        store.remember(
          tenant,
          "workshop",
          "Robotics",
          operation !== "unapproved",
        );
      } catch {
        denied = true;
      }
      if (operation === "correct-fact")
        store.remember(tenant, "workshop", "Astronomy", true);
      if (operation === "delete-fact") store.forget(tenant, "workshop");
      Object.assign(evidence, {
        denied,
        fact: store.recall(tenant, "workshop"),
        otherTenantFact: store.recall("other", "workshop"),
      });
      output = JSON.stringify(evidence);
    }
    if (number === 112) {
      const retain =
        selectScenario(scenario, ["retain-pairs", "remove-pairs"]) ===
        "retain-pairs";
      const tool = sdk.tool({
        name: "read_invoice",
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: () => "Invoice INV-42, EUR 18.",
      });
      const first = await runAgent(
        "Reader",
        [functionCall("read_invoice"), message("Read INV-42.")],
        "Read invoice INV-42.",
        { agent: { tools: [tool] }, run: { signal } },
      );
      const history = retain
        ? first.result.history
        : removeAllTools({
            inputHistory: first.result.history,
            preHandoffItems: [],
            newItems: [],
          }).inputHistory;
      const second = await runAgent(
        "Follower",
        [message("Invoice INV-42 retained.")],
        [...history, { role: "user", content: "Continue the invoice task." }],
        { run: { signal } },
      );
      evidence.modelHistory = second.requests[0].input;
      const calls = evidence.modelHistory
        .filter((item) => item.type === "function_call")
        .map((item) => item.callId);
      evidence.validPairs = evidence.modelHistory
        .filter((item) => item.type === "function_call_result")
        .every((item) => calls.includes(item.callId));
      output = `Tool calls retained — ${calls.length}\nValid relationships — ${evidence.validPairs}`;
    }
  } finally {
    store.close();
    evidence.storageClosed = true;
  }
  return courseResult(
    number,
    output,
    evidence,
    "Inspect actual session operations and the history sent to the model. SQLite stores are application-managed and partitioned by tenant.",
  );
}
