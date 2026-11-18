import test from "node:test";
import assert from "node:assert/strict";
import {
  buildIdentity,
  specialists,
  responseStyles,
} from "../public/identity.js";
import { executeLesson } from "../execute.mjs";
import { runSpecialist } from "../examples/identity/run-specialist.mjs";
import { createSpecialistAgent } from "../examples/identity/specialist-agent.mjs";

test("every specialist, style, and scenario yields labeled classroom evidence", async () => {
  for (const specialist of Object.keys(specialists)) {
    for (const style of Object.keys(responseStyles)) {
      for (const scenario of ["relevant", "unrelated", "clarification"]) {
        const input = {
          specialist,
          style,
          scenario,
          agentName: "Classroom specialist",
        };
        const result = await executeLesson(9, input, { env: {} });
        assert.equal(result.events.length, 4);
        assert.match(result.label, /scripted/);
        assert.equal(result.evidence.agent.name, input.agentName);
        assert.equal(
          result.evidence.agent.instructions,
          buildIdentity(input).instructions,
        );
        assert.equal(result.evidence.modelResponses, 0);
        assert.deepEqual(result.evidence.agent.configuredTools, []);
        assert.ok(result.output.trim());
        if (style === "guided") assert.match(result.output, /^1\. /);
        if (scenario === "clarification")
          assert.match(result.output, /database|function/i);
      }
    }
  }
});

test("renaming changes the identifier while instruction choices control responsibility and style", () => {
  const initial = buildIdentity();
  const renamed = buildIdentity({ agentName: "Different name" });
  assert.notEqual(renamed.name, initial.name);
  assert.equal(renamed.instructions, initial.instructions);
  assert.notEqual(
    buildIdentity({ specialist: "python" }).instructions,
    initial.instructions,
  );
  assert.notEqual(
    buildIdentity({ style: "guided" }).instructions,
    initial.instructions,
  );
});

test("invalid identity choices and unsupported classroom questions fail explicitly", async () => {
  for (const agentName of ["", " ", "x".repeat(61), "Name\nOther", {}, null]) {
    assert.throws(() => buildIdentity({ agentName }), /agent name/);
  }
  for (const input of [
    { specialist: "__proto__" },
    { style: "constructor" },
    { scenario: "unknown" },
  ]) {
    assert.throws(() => buildIdentity(input), /Choose/);
  }
  await assert.rejects(
    executeLesson(9, { question: "Unsupported custom fixture" }),
    /Live API/,
  );
});

function testDependencies(response, calls) {
  class Agent {
    constructor(options) {
      Object.assign(this, options);
      calls.agent = options;
    }
  }
  class OpenAI {
    constructor(options) {
      calls.client = options;
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
      calls.run = { agent, question, options };
      if (response instanceof Error) throw response;
      return response;
    }
  }
  return { Agent, OpenAI, OpenAIProvider, Runner };
}

test("live identity uses the edited contract, configured client, custom question, and cancellation signal", async () => {
  const calls = {};
  const signal = new AbortController().signal;
  const input = {
    mode: "live",
    specialist: "python",
    style: "guided",
    agentName: "Mira",
    question: "Explain Python lists.",
  };
  const result = await executeLesson(9, input, {
    env: {
      OPENAI_API_KEY: "identity-test-key",
      OPENAI_MODEL: "identity-test-model",
    },
    signal,
    dependencies: testDependencies(
      { finalOutput: "Actual live-adapter result", rawResponses: [{}] },
      calls,
    ),
  });
  assert.equal(calls.client.apiKey, "identity-test-key");
  assert.equal(calls.client.maxRetries, 0);
  assert.equal(calls.agent.name, "Mira");
  assert.equal(calls.agent.model, "identity-test-model");
  assert.equal(calls.agent.instructions, buildIdentity(input).instructions);
  assert.deepEqual(calls.agent.tools, []);
  assert.equal(calls.run.question, input.question);
  assert.equal(calls.run.options.signal, signal);
  assert.equal(calls.run.options.maxTurns, 3);
  assert.equal(result.output, "Actual live-adapter result");
  assert.equal(result.evidence.modelResponses, 1);
  assert.match(result.evidence.expectedBehavior, /custom request/);
});

test("live identity rejects missing configuration, invalid questions, and empty or paused responses", async () => {
  await assert.rejects(
    executeLesson(9, { mode: "live" }, { env: {} }),
    /OPENAI_API_KEY/,
  );
  for (const question of ["", " ", "x".repeat(1001), 42]) {
    await assert.rejects(
      runSpecialist({
        input: { question },
        env: { OPENAI_API_KEY: "test" },
        dependencies: testDependencies({}, {}),
      }),
      /question between/,
    );
  }
  for (const response of [
    {},
    { finalOutput: " " },
    { finalOutput: "Partial", interruptions: [{}] },
  ]) {
    await assert.rejects(
      runSpecialist({
        input: {},
        env: { OPENAI_API_KEY: "test" },
        dependencies: testDependencies(response, {}),
      }),
      /no completed|paused/,
    );
  }
  const failure = Object.assign(new Error("Invalid credential"), {
    status: 401,
  });
  await assert.rejects(
    runSpecialist({
      input: {},
      env: { OPENAI_API_KEY: "test" },
      dependencies: testDependencies(failure, {}),
    }),
    (error) => error.status === 401,
  );
});

test("the installed SDK builds the specialist with its configured identity and no tools", async () => {
  const { Agent } = await import("@openai/agents");
  const { agent, identity } = createSpecialistAgent({
    Agent,
    input: { agentName: "Actual SDK tutor" },
    model: "test-model",
  });
  assert.equal(agent.name, "Actual SDK tutor");
  assert.equal(agent.instructions, identity.instructions);
  assert.deepEqual(agent.tools, []);
});
