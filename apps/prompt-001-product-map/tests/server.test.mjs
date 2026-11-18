import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { createApp } from "../server.mjs";
import { execute as executeResponses } from "../src/adapters/responses.mjs";
import { execute as executeAgentsSdk } from "../src/adapters/agents-sdk.mjs";
import { execute as executeAgentsApi } from "../src/adapters/agents-api.mjs";
import { execute as executeCodex } from "../src/adapters/codex.mjs";

let server;
let base;
before(async () => {
  server = createApp({ env: {}, demoDelay: 1 });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("serves four real adapter excerpts and keeps private files inaccessible", async () => {
  const response = await fetch(`${base}/api/lesson`);
  const lesson = await response.json();
  assert.equal(lesson.products.length, 4);
  for (const product of lesson.products) {
    assert.ok(product.code.length > 50);
    assert.doesNotThrow(
      () => new Function(`return async function() {\n${product.code}\n}`),
    );
    assert.equal((await fetch(`${base}${product.sourcePath}`)).status, 200);
  }
  for (const path of [
    "/.env",
    "/server.mjs",
    "/source/../.env",
    "/%2e%2e/server.mjs",
  ])
    assert.equal((await fetch(base + path)).status, 404);
});

test("each classroom run has ordered steps, a labeled result, and evidence", async () => {
  for (const product of ["agents-sdk", "responses", "agents-api", "codex"]) {
    const response = await fetch(`${base}/api/run`, {
      method: "POST",
      body: JSON.stringify({ product, mode: "demo" }),
    });
    assert.equal(response.status, 200);
    const events = (await response.text())
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(events[0].simulated, true);
    const steps = events.filter((event) => event.type === "step");
    assert.deepEqual(
      steps.map((step) => step.index),
      Array.from({ length: steps.length }, (_, index) => index),
    );
    const result = events.at(-1);
    assert.equal(result.type, "result");
    assert.equal(result.simulated, true);
    assert.ok(result.text && result.evidence);
  }
});

test("rejects invalid bodies, unavailable live requests, and cross-origin execution", async () => {
  for (const body of [
    "null",
    "[]",
    "{}",
    "bad json",
    JSON.stringify({ product: "../server", mode: "demo" }),
  ]) {
    assert.equal(
      (await fetch(`${base}/api/run`, { method: "POST", body })).status,
      400,
    );
  }
  assert.equal(
    (
      await fetch(`${base}/api/run`, {
        method: "POST",
        body: JSON.stringify({ product: "responses", mode: "live" }),
      })
    ).status,
    503,
  );
  assert.equal(
    (
      await fetch(`${base}/api/run`, {
        method: "POST",
        headers: { origin: "https://example.com" },
        body: "{}",
      })
    ).status,
    403,
  );
  assert.equal(
    (await fetch(`${base}/api/sessions/arbitrary`, { method: "DELETE" }))
      .status,
    404,
  );
});

test("Responses adapter passes cancellation and checks completion", async () => {
  let received;
  class OpenAI {
    responses = {
      create: async (body, options) => {
        received = { body, options };
        return {
          status: "completed",
          id: "test-response",
          output_text: "A short answer.",
        };
      },
    };
  }
  const signal = new AbortController().signal;
  const result = await executeResponses(
    { env: {}, signal, emit() {}, task: "Explain agents." },
    { OpenAI },
  );
  assert.equal(result.text, "A short answer.");
  assert.equal(received.body.input, "Explain agents.");
  assert.equal(received.options.signal, signal);
});

test("Agents SDK adapter executes the registered order tool through run", async () => {
  const events = [];
  class Agent {
    constructor(options) {
      Object.assign(this, options);
    }
  }
  const dependencies = {
    agents: {
      Agent,
      tool: (value) => value,
      run: async (agent) => {
        await agent.tools[0].execute({ orderId: "1042" });
        return { finalOutput: "Dispatched." };
      },
    },
    zod: { z: { object: (value) => value, string: () => "string" } },
  };
  const result = await executeAgentsSdk(
    {
      env: {},
      signal: new AbortController().signal,
      emit: (event) => events.push(event),
      task: "Check 1042.",
    },
    dependencies,
  );
  assert.equal(result.text, "Dispatched.");
  assert.equal(JSON.parse(result.evidence).orderId, "1042");
  assert.ok(events.some((event) => event.index === 2));
});

test("managed runtime failure preserves its session ID and aborts the stream", async () => {
  let aborted = false;
  class OpenAI {
    beta = {
      agents: {
        sessions: {
          create: async () => ({
            withResultCollection() {},
            async *[Symbol.asyncIterator]() {
              yield {
                type: "agent.session.turn.failed",
                session_id: "session-test",
              };
            },
            controller: {
              abort() {
                aborted = true;
              },
            },
          }),
        },
      },
    };
  }
  await assert.rejects(
    () =>
      executeAgentsApi(
        {
          env: {},
          signal: new AbortController().signal,
          emit() {},
          task: "Run task.",
        },
        { OpenAI },
      ),
    (error) => error.sessionId === "session-test",
  );
  assert.equal(aborted, true);
});

test("Codex adapter uses the bounded fixture and propagates cancellation", async () => {
  let options;
  let turnOptions;
  class Codex {
    startThread(value) {
      options = value;
      return {
        id: "thread-test",
        run: async (task, value) => {
          turnOptions = value;
          return {
            finalResponse: "Repository explanation.",
            items: [
              {
                type: "command_execution",
                command: "Get-Content package.json",
              },
            ],
          };
        },
      };
    }
  }
  const signal = new AbortController().signal;
  await executeCodex(
    { env: {}, signal, emit() {}, task: "Read the fixture." },
    { codex: { Codex } },
  );
  assert.equal(options.sandboxMode, "read-only");
  assert.ok(options.workingDirectory.includes("robotics-club"));
  assert.equal(turnOptions.signal, signal);
});

test("managed runtime checks the final turn status from the installed SDK result shape", async () => {
  let status = "completed";
  let request;
  let aborted = 0;
  class OpenAI {
    beta = {
      agents: {
        sessions: {
          create: async (body, options) => {
            request = { body, options };
            return {
              withResultCollection() {},
              async *[Symbol.asyncIterator]() {
                yield {
                  type: "agent.session.created",
                  session: { id: "hosted-test" },
                };
                yield {
                  type: "agent.session.turn.item.added",
                  session_id: "hosted-test",
                  item: { type: "command_execution" },
                };
              },
              finalResult: async () => ({
                session_id: "hosted-test",
                turn_id: "turn-test",
                turn: { status },
                output_text: "Hello, classroom!",
              }),
              controller: {
                abort() {
                  aborted++;
                },
              },
            };
          },
        },
      },
    };
  }
  const context = {
    env: {},
    signal: new AbortController().signal,
    emit() {},
    task: "Run the classroom script.",
  };
  const result = await executeAgentsApi(context, { OpenAI });
  assert.equal(result.sessionId, "hosted-test");
  assert.equal(JSON.parse(result.evidence).status, "completed");
  assert.equal(request.body.environment.type, "openai_hosted");
  assert.equal(request.body.input, context.task);
  assert.equal(request.options.signal, context.signal);
  status = "failed";
  await assert.rejects(
    () => executeAgentsApi(context, { OpenAI }),
    /status failed/,
  );
  assert.equal(aborted, 2);
});

test("overlapping live runs are rejected and observed hosted sessions survive a page reset", async () => {
  let release;
  let calls = 0;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const app = createApp({
    env: { OPENAI_API_KEY: "test-key", ENABLE_AGENTS_API: "true" },
    executeLive: async ({ emit }) => {
      calls++;
      emit({
        type: "runtime",
        name: "agent.session.created",
        sessionId: "owned-session-test",
      });
      if (calls === 1) await gate;
      return {
        text: "A completed live test.",
        sessionId: "owned-session-test",
      };
    },
  });
  await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve));
  const address = `http://127.0.0.1:${app.address().port}`;
  const init = {
    method: "POST",
    body: JSON.stringify({ product: "agents-api", mode: "live" }),
  };
  try {
    const first = await fetch(`${address}/api/run`, init);
    assert.equal((await fetch(`${address}/api/run`, init)).status, 409);
    release();
    assert.ok((await first.text()).includes('"type":"result"'));
    assert.deepEqual(
      (await (await fetch(`${address}/api/sessions`)).json()).sessions,
      ["owned-session-test"],
    );
    assert.equal((await fetch(`${address}/api/run`, init)).status, 200);
  } finally {
    release();
    await new Promise((resolve) => app.close(resolve));
  }
});

test("live errors are labeled and credentials are redacted through the HTTP entry point", async () => {
  const app = createApp({
    env: { OPENAI_API_KEY: "test-private-key" },
    executeLive: async () => {
      throw new Error("Provider rejected test-private-key");
    },
  });
  await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve));
  try {
    const response = await fetch(
      `http://127.0.0.1:${app.address().port}/api/run`,
      {
        method: "POST",
        body: JSON.stringify({ product: "responses", mode: "live" }),
      },
    );
    const text = await response.text();
    assert.ok(text.includes('"type":"error"'));
    assert.ok(text.includes("[redacted]"));
    assert.ok(!text.includes("test-private-key"));
    assert.ok(!text.includes('"type":"result"'));
  } finally {
    await new Promise((resolve) => app.close(resolve));
  }
});
