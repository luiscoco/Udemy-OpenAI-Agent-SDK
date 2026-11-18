import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  sdk,
  z,
  functionCall,
  runAgent,
  message,
  courseResult,
  selectScenario,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import { runJsonProcess } from "../../../foundations-runtime/python-runtime.mjs";
import { ClassroomStreamModel } from "../../../foundations-runtime/examples/streaming/classroom-model.ts";

export const reliabilityScenarios = {
  177: ["recover", "permanent-failure"],
  178: ["complete", "deadline", "model-deadline", "tool-deadline"],
  179: ["within-budget", "exhausted"],
  180: ["complete-job", "retry-job"],
  181: ["authorized", "unauthorized", "other-tenant"],
  182: ["conversation", "new-session"],
  183: ["healthy", "draining"],
  184: ["recover-crash", "duplicate-delivery"],
};
export async function withService(handler, action) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    return await action(`http://127.0.0.1:${server.address().port}`, server);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
export async function retry(
  action,
  { attempts = 3, signal, onAttempt = () => {} } = {},
) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    signal?.throwIfAborted();
    try {
      onAttempt(attempt);
      return await action(attempt);
    } catch (error) {
      last = error;
      if (!error.retryable || attempt === attempts) throw error;
      await delay(5 * attempt, undefined, { signal });
    }
  }
  throw last;
}
export async function durableExercise(
  store,
  tenant,
  { crash = true, signal } = {},
) {
  const id = randomUUID();
  const body = {
    tenant,
    operationId: randomUUID(),
    payload: { order: "ORD-42", amount: 18 },
  };
  store.db
    .prepare("INSERT INTO jobs VALUES(?,?,?)")
    .run(id, "queued", JSON.stringify(body));
  const worker = fileURLToPath(new URL("../../../foundations-runtime/course/worker.mjs", import.meta.url));
  let failure;
  if (crash) {
    try {
      await runJsonProcess(
        process.execPath,
        [worker, "job", store.path, tenant, id, "crash"],
        { signal },
      );
    } catch (error) {
      failure = error.message;
    }
  }
  const resumed = await runJsonProcess(
    process.execPath,
    [worker, "job", store.path, tenant, id, "finish"],
    { signal },
  );
  const duplicate = await runJsonProcess(
    process.execPath,
    [worker, "job", store.path, tenant, id, "finish"],
    { signal },
  );
  const row = store.db.prepare("SELECT * FROM jobs WHERE id=?").get(id);
  return {
    jobId: id,
    state: row.state,
    body: JSON.parse(row.body),
    crashObserved: Boolean(failure),
    workerPid: resumed.pid,
    duplicateWorkerPid: duplicate.pid,
    effects: store.db
      .prepare("SELECT COUNT(*) count FROM effects WHERE tenant=?")
      .get(tenant).count,
  };
}
export async function executeReliability(
  number,
  input,
  { signal, onProgress = () => {} } = {},
) {
  const scenario = selectScenario(input.scenario, reliabilityScenarios[number]);
  const evidence = { scenario };
  let output;
  if (number === 177) {
    const attempts = [];
    try {
      output = await retry(
        async (attempt) => {
          if (scenario === "permanent-failure" || attempt < 3) {
            const error = new Error(
              attempt < 3
                ? "Temporary provider failure"
                : "Permanent provider failure",
            );
            error.retryable = scenario !== "permanent-failure";
            throw error;
          }
          const result = await runAgent(
            "Recovered agent",
            [message("Recovered on attempt 3.")],
            "Run.",
            { run: { signal } },
          );
          return result.result.finalOutput;
        },
        { signal, onAttempt: (attempt) => attempts.push(attempt) },
      );
    } catch (error) {
      output = error.message;
      evidence.failed = true;
    }
    evidence.attempts = attempts;
  }
  if (number === 178) {
    if (scenario === "model-deadline" || scenario === "tool-deadline") {
      let settled = false;
      try {
        const plan =
          scenario === "model-deadline"
            ? [
                async (request) => {
                  try {
                    await delay(100, undefined, { signal: request.signal });
                    return message("Finished");
                  } finally {
                    settled = true;
                  }
                },
              ]
            : [functionCall("slow_read")];
        const tools =
          scenario === "tool-deadline"
            ? [
                sdk.tool({
                  name: "slow_read",
                  parameters: z.object({}),
                  timeoutMs: 5,
                  timeoutBehavior: "raise_exception",
                  execute: async (_args, _context, details) => {
                    try {
                      await delay(100, undefined, { signal: details?.signal });
                      return "Finished";
                    } finally {
                      settled = true;
                    }
                  },
                }),
              ]
            : [];
        await runAgent("Deadline tutor", plan, "Read.", {
          agent: {
            tools,
            modelSettings: {
              timeoutMs: scenario === "model-deadline" ? 5 : 1000,
            },
          },
          run: { signal },
        });
      } catch (error) {
        evidence.errorType = error.name;
      }
      await delay(10);
      evidence.operationSettled = settled;
      output = `${scenario} produced ${evidence.errorType}. Operation settled ${settled}.`;
      return courseResult(
        number,
        output,
        evidence,
        "SDK model and tool deadlines cooperate with abort signals. The exercise waits for cleanup.",
      );
    }
    const controller = new AbortController();
    const deadline = setTimeout(
      () => controller.abort(new Error("Application deadline exceeded")),
      scenario === "deadline" ? 5 : 1000,
    );
    try {
      await delay(scenario === "deadline" ? 100 : 1, undefined, {
        signal: AbortSignal.any([
          controller.signal,
          ...(signal ? [signal] : []),
        ]),
      });
      output = "Operation completed within its deadline.";
      evidence.cancelled = false;
    } catch (error) {
      evidence.cancelled = true;
      evidence.error = error.message;
      output = "Deadline cancelled the pending operation.";
    } finally {
      clearTimeout(deadline);
      evidence.timerCleared = true;
    }
  }
  if (number === 179) {
    const budget = {
      maxCalls: scenario === "exhausted" ? 1 : 3,
      maxTurns: 3,
      maxDurationMs: 1000,
      maxEstimatedUsd: 0.0003,
    };
    const started = performance.now();
    let estimatedUsd = 0;
    let used = 0;
    for (const task of ["research", "review"]) {
      if (
        used >= budget.maxCalls ||
        performance.now() - started >= budget.maxDurationMs ||
        estimatedUsd + 0.0001 > budget.maxEstimatedUsd
      ) {
        evidence.stoppedBefore = task;
        break;
      }
      await runAgent(task, [message(`${task} complete`)], "Run.", {
        run: { maxTurns: budget.maxTurns, signal },
      });
      used++;
      estimatedUsd += 0.0001;
    }
    Object.assign(evidence, {
      budget,
      used,
      remaining: budget.maxCalls - used,
      estimatedUsd,
      elapsedMs: performance.now() - started,
      spendingBoundary:
        "Application reservation based on illustrative per-call estimates. Provider billing requires actual usage and rates.",
    });
    output = `Completed calls ${used}. Remaining call budget ${evidence.remaining}.`;
  }
  if ([180, 184].includes(number)) {
    const store = openStore();
    try {
      Object.assign(
        evidence,
        await durableExercise(store, `job-${randomUUID()}`, {
          crash: scenario === "recover-crash" || scenario === "retry-job",
          signal,
        }),
      );
      output = `Persisted job ${evidence.state}. Unique committed effects ${evidence.effects}.`;
    } finally {
      store.close();
    }
  }
  if (number === 181) {
    const token = randomUUID();
    const tenant = "school-a";
    const status = await withService(
      async (req, res) => {
        const provided = Buffer.from(req.headers.authorization ?? "");
        const expected = Buffer.from(`Bearer ${token}`);
        const valid =
          provided.length === expected.length &&
          timingSafeEqual(provided, expected);
        const own = req.headers["x-tenant"] === tenant;
        res.setHeader("Content-Type", "application/json");
        if (!valid) {
          res.writeHead(401);
          return res.end('{"error":"Authentication required"}');
        }
        if (!own) {
          res.writeHead(403);
          return res.end('{"error":"Tenant forbidden"}');
        }
        const result = await runAgent(
          "Authenticated tutor",
          [message("Authorized classroom response.")],
          "Teach.",
          { run: { signal } },
        );
        res.end(JSON.stringify({ tenant, output: result.result.finalOutput }));
      },
      async (url) => {
        const response = await fetch(url, {
          headers: {
            authorization: `Bearer ${scenario === "unauthorized" ? "invalid" : token}`,
            "x-tenant": scenario === "other-tenant" ? "school-b" : tenant,
          },
          signal,
        });
        return { status: response.status, body: await response.json() };
      },
    );
    Object.assign(evidence, status);
    output = JSON.stringify(status);
  }
  if (number === 182) {
    if (input.message) {
      const store = openStore();
      try {
        const threadId = String(input.threadId ?? randomUUID());
        const session = store.session("chat-fixture", threadId);
        const text = String(input.message).trim().slice(0, 1000);
        if (!text) throw new Error("Enter a message");
        const model = new ClassroomStreamModel(
          "chat-stream",
          () => [
            message(
              `Agent tools execute validated application functions. Your request was “${text}”. [classroom-handbook]`,
            ),
          ],
          { delayMs: 15 },
        );
        onProgress({
          event: "tool_progress",
          detail: "Loading the authorized classroom handbook fixture",
        });
        const stream = await new sdk.Runner({ tracingDisabled: true }).run(
          new sdk.Agent({ name: "Chat tutor", model }),
          text,
          { session, signal, stream: true },
        );
        stream.completed.catch(() => {});
        try {
          for await (const delta of stream.toTextStream())
            onProgress({ event: "text_delta", text: delta });
          await stream.completed;
          output = stream.finalOutput;
        } finally {
          await stream.completed.catch(() => {});
          await model.whenIdle();
        }
        evidence.threadId = threadId;
        evidence.items = await session.getItems();
        return courseResult(
          number,
          output,
          evidence,
          "Streaming output and persistent session history are delivered by the SDK.",
          {
            citations: [
              {
                type: "file_citation",
                filename: "classroom-handbook",
                file_id: "classroom-handbook",
              },
            ],
          },
        );
      } finally {
        store.close();
      }
    }
    const session = new sdk.MemorySession();
    await runAgent(
      "Chat tutor",
      [message("Robotics workshop recorded.")],
      "My workshop is Robotics.",
      { run: { session, signal } },
    );
    const next =
      scenario === "conversation" ? session : new sdk.MemorySession();
    const result = await runAgent(
      "Chat tutor",
      [
        (request) =>
          message(
            JSON.stringify(request.input).includes("Robotics")
              ? "We can continue the Robotics workshop."
              : "Which workshop would you like?",
          ),
      ],
      "Continue.",
      { run: { session: next, signal } },
    );
    evidence.items = await next.getItems();
    output = result.result.finalOutput;
  }
  if (number === 183) {
    let draining = scenario === "draining";
    const observed = await withService(
      (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(draining ? 503 : 200);
        res.end(
          JSON.stringify({
            status: draining ? "draining" : "ready",
            storage: "SQLite WAL",
            acceptingRuns: !draining,
          }),
        );
      },
      async (url) => {
        const response = await fetch(`${url}/health`, { signal });
        return { status: response.status, body: await response.json() };
      },
    );
    evidence.health = observed;
    evidence.container = {
      base: "node:24-bookworm-slim",
      port: 3283,
      volume: "/app/.runtime",
      healthPath: "/health",
    };
    output = JSON.stringify(observed);
  }
  return courseResult(
    number,
    output,
    evidence,
    "Application-level retry, authorization and durable storage boundaries remain visible in measured execution evidence.",
  );
}
