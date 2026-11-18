import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createApp } from "../server.mjs";
import { executeLesson, lessonSources } from "../execute.mjs";
import { starterFiles, starterArchive } from "../bootstrap.mjs";
import { lessons } from "../catalog.mjs";
import { diagnose } from "../diagnostics.mjs";
import { loadConfig } from "../examples/organized/config.mjs";
import { lookupActivity } from "../examples/organized/tools/club.mjs";
import { createClubAgent } from "../examples/organized/agents/club-agent.mjs";

async function serve(options, action) {
  const server = createApp(options);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    await action(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

const post = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

test("all configured lessons expose their exact prompt, source, and a real classroom result", async () => {
  await serve({ env: {} }, async (base) => {
    for (const lesson of lessons) {
      const state = await (
        await fetch(`${base}/api/state?prompt=${lesson.number}`)
      ).json();
      assert.equal(state.lesson.prompt, lesson.prompt);
      assert.equal(state.configured, false);
      assert.ok(
        Object.values(state.sources).every(
          (value) => typeof value === "string" && value.length,
        ),
      );
      const response = await post(
        `${base}/api/execute?prompt=${lesson.number}`,
        { mode: "classroom" },
      );
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.ok(result.events.length >= 2);
      assert.ok(result.output);
      assert.ok(result.label);
      assert.ok(result.evidence);
    }
  });
});

test("every capability and club produces the selected result", async () => {
  for (const capability of [
    "basics",
    "tools",
    "structured",
    "orchestration",
    "sessions",
  ]) {
    const result = await executeLesson(
      2,
      { capability, language: "python" },
      { env: {} },
    );
    assert.match(result.events[0].detail, /Python/);
    assert.ok(result.evidence.python);
  }
  for (const activity of ["robotics", "astronomy", "music"]) {
    for (const number of [6, 7]) {
      const result = await executeLesson(number, { activity }, { env: {} });
      assert.deepEqual(result.evidence.toolResult, lookupActivity(activity));
      assert.equal(result.evidence.actualLocalToolCalls, 1);
    }
  }
  await assert.rejects(executeLesson(6, { activity: "__proto__" }), /Choose/);
  await assert.rejects(executeLesson(5, { question: "constructor" }), /Choose/);
});

test("diagnostic scenarios preserve actual local errors and classify injected HTTP failures", async () => {
  for (const fault of [
    "missing",
    "invalid",
    "installation",
    "imports",
    "model",
    "rate",
  ]) {
    const result = await executeLesson(8, { fault }, { env: {} });
    assert.ok(result.evidence.diagnosis.command);
    if (["missing", "imports"].includes(fault))
      assert.match(result.label, /Actual local/);
    else assert.match(result.label, /fixture/);
  }
  assert.match(diagnose({ status: 403 }).title, /original failure/);
  const result = await executeLesson(4, { fault: "configured" }, { env: {} });
  assert.equal(result.evidence.acceptedByAPI, "not tested");
});

test("starter ZIPs contain real pinned source and the TypeScript transitive lock", async () => {
  for (const language of ["typescript", "python"]) {
    const files = await starterFiles(language);
    const zip = await starterArchive(language);
    assert.equal(zip.readUInt32LE(), 0x04034b50);
    assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
    if (language === "typescript") {
      const manifest = JSON.parse(files["package.json"]);
      const lock = JSON.parse(files["package-lock.json"]);
      assert.deepEqual(manifest.dependencies, lock.packages[""].dependencies);
      assert.equal(
        lock.packages["node_modules/@openai/agents"].version,
        manifest.dependencies["@openai/agents"],
      );
      assert.match(files["main.ts"], /result.finalOutput/);
    } else {
      assert.match(files["requirements.txt"], /^openai-agents==\d/);
      assert.match(files["main.py"], /result.final_output/);
    }
  }
});

test("private files, unknown source names, cross-origin calls, and malformed inputs are rejected", async () => {
  await serve(
    { env: { OPENAI_API_KEY: "sk-private-secret" } },
    async (base) => {
      for (const path of [
        "/.env",
        "/server.mjs",
        "/api/source?name=../../.env",
        "/api/source?name=constructor",
      ])
        assert.equal((await fetch(base + path)).status, 404);
      assert.equal(
        (
          await fetch(`${base}/api/state`, {
            headers: { origin: "https://elsewhere.example" },
          })
        ).status,
        403,
      );
      for (const body of [null, [], "bad", { mode: "unknown" }])
        assert.equal((await post(`${base}/api/execute`, body)).status, 400);
      assert.equal(
        (await post(`${base}/api/execute`, { question: "x".repeat(14000) }))
          .status,
        400,
      );
      const state = await (await fetch(`${base}/api/state`)).text();
      assert.ok(!state.includes("sk-private-secret"));
      assert.equal(
        (
          await post(`${base}/api/execute?prompt=2`, {
            mode: "live",
            language: "python",
          })
        ).status,
        400,
      );
    },
  );
});

test("live errors preserve recovery information and redact exact credentials", async () => {
  await serve(
    {
      env: { OPENAI_API_KEY: "private-value" },
      execute: async () => {
        const error = new Error(
          "Rejected private-value and sk-sensitive-value",
        );
        error.status = 401;
        throw error;
      },
    },
    async (base) => {
      const result = await (
        await post(`${base}/api/execute`, { mode: "live" })
      ).json();
      assert.ok(!result.error.includes("private-value"));
      assert.ok(!result.error.includes("sk-sensitive-value"));
      assert.match(result.diagnosis.title, /credential/);
    },
  );
});

test("a running live operation rejects overlapping live requests and releases the lock", async () => {
  let release;
  let started;
  const hasStarted = new Promise((resolve) => {
    started = resolve;
  });
  await serve(
    {
      env: {},
      execute: async () => {
        started();
        await new Promise((resolve) => {
          release = resolve;
        });
        return { output: "done" };
      },
    },
    async (base) => {
      const first = post(`${base}/api/execute`, { mode: "live" });
      await hasStarted;
      assert.equal(
        (await post(`${base}/api/execute`, { mode: "live" })).status,
        409,
      );
      release();
      assert.equal((await first).status, 200);
    },
  );
});

test("live first-agent adapter uses the configured client and propagates cancellation", async () => {
  const calls = {};
  class OpenAI {
    constructor(options) {
      calls.client = options;
    }
  }
  class Agent {
    constructor(options) {
      calls.agent = options;
    }
  }
  class OpenAIProvider {
    constructor(options) {
      calls.provider = options;
    }
  }
  class Runner {
    constructor(options) {
      calls.runner = options;
    }
    async run(agent, question, options) {
      calls.run = { question, options };
      return {
        finalOutput: "Actual adapter test response",
        rawResponses: [{}],
      };
    }
  }
  const signal = new AbortController().signal;
  const result = await executeLesson(
    5,
    { mode: "live", question: "What is a tool?" },
    {
      env: { OPENAI_API_KEY: "test-key", OPENAI_MODEL: "test-model" },
      signal,
      dependencies: { Agent, Runner, OpenAIProvider, OpenAI },
    },
  );
  assert.equal(calls.client.apiKey, "test-key");
  assert.equal(calls.agent.model, "test-model");
  assert.equal(calls.run.options.signal, signal);
  assert.equal(calls.run.options.maxTurns, 3);
  assert.equal(result.output, "Actual adapter test response");
});

test("live authentication probe reports an actual response and checks completion", async () => {
  let captured;
  class OpenAI {
    responses = {
      create: async (request, options) => {
        captured = { request, options };
        return { status: "completed", output_text: "OK" };
      },
    };
  }
  const signal = new AbortController().signal;
  const result = await executeLesson(
    4,
    { mode: "live" },
    { env: { OPENAI_API_KEY: "test-key" }, signal, dependencies: { OpenAI } },
  );
  assert.equal(captured.options.signal, signal);
  assert.equal(result.evidence.requestAccepted, true);
  assert.equal(result.output, "OK");
  assert.throws(() => loadConfig({}), /OPENAI_API_KEY/);
});

test("the actual installed SDK accepts the agent and its tool schema without a model request", async () => {
  const sdk = await import("@openai/agents");
  const { z } = await import("zod");
  const agent = createClubAgent({
    ...sdk,
    z,
    model: "test-model",
    onTool: () => {},
  });
  assert.equal(agent.name, "Club assistant");
  assert.equal(agent.tools[0].name, "lookup_activity");
  assert.equal(typeof sdk.OpenAIProvider, "function");
  assert.equal(typeof sdk.Runner, "function");
  const sources = await lessonSources(7);
  assert.ok(sources["services/club-service.mjs"].includes("runner.run"));
});

test("the club service executes its registered tool and returns observed evidence", async () => {
  const calls = {};
  class OpenAI {
    constructor(options) {
      calls.client = options;
    }
  }
  class OpenAIProvider {
    constructor() {}
  }
  class Agent {
    constructor(options) {
      Object.assign(this, options);
    }
  }
  class Runner {
    constructor() {}
    async run(agent, input, options) {
      calls.signal = options.signal;
      await agent.tools[0].execute({ activity: "music" });
      return { finalOutput: "Music is in Studio.", rawResponses: [{}, {}] };
    }
  }
  const { z } = await import("zod");
  const signal = new AbortController().signal;
  const result = await executeLesson(
    7,
    { mode: "live", activity: "music" },
    {
      env: { OPENAI_API_KEY: "club-test-key" },
      signal,
      dependencies: {
        OpenAI,
        OpenAIProvider,
        Agent,
        Runner,
        z,
        tool: (definition) => definition,
      },
    },
  );
  assert.equal(calls.client.apiKey, "club-test-key");
  assert.equal(calls.signal, signal);
  assert.equal(result.evidence.actualToolCalls, 1);
  assert.deepEqual(result.evidence.toolResults[0], lookupActivity("music"));
});

test("every standalone application starts at its own normal entry point", async () => {
  for (const lesson of lessons) {
    const child = spawn(process.execPath, ["server.mjs"], {
      cwd: fileURLToPath(new URL(`../../${lesson.folder}/`, import.meta.url)),
      env: { ...process.env, PORT: "0", OPENAI_API_KEY: "" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const ready = new Promise((resolve, reject) => {
      child.stdout.on("data", (chunk) => {
        output += chunk.toString();
        const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (address) resolve(address);
      });
      child.on("error", reject);
      child.on("exit", (code) =>
        reject(new Error(`Prompt ${lesson.number} exited early with ${code}.`)),
      );
    });
    const timer = setTimeout(() => child.kill(), 10000);
    try {
      const base = await ready;
      const state = await (await fetch(`${base}/api/state`)).json();
      assert.equal(state.lesson.number, lesson.number);
    } finally {
      clearTimeout(timer);
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
  }
});
