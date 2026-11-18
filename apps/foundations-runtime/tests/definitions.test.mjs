import test from "node:test";
import assert from "node:assert/strict";
import * as sdk from "@openai/agents";
import { executeLesson } from "../execute.mjs";
import { dynamicContext, definitionControls } from "../public/definitions.js";
import { createTutorVariant } from "../examples/definitions/reusable-agents.mjs";
import { createVersionedAgent } from "../examples/definitions/versioned-prompts.mjs";

test("instruction design exposes selected sections and missing-requirement behavior", async () => {
  const complete = await executeLesson(10, { request: "missing" });
  assert.match(complete.output, /audience.*how long/);
  assert.equal(complete.evidence.includedSections.length, 4);
  const minimal = await executeLesson(10, {
    instructionSet: "goal-only",
    request: "missing",
  });
  assert.deepEqual(minimal.evidence.includedSections, ["goal"]);
  assert.ok(
    !minimal.evidence.agent.instructions.includes("Completion criteria"),
  );
  assert.match(minimal.events[2].detail, /omits/);
});

test("three examples use the same comparison ticket with labeled scripted outputs", async () => {
  for (const ticket of ["login", "payment", "crash"]) {
    const result = await executeLesson(11, { ticket });
    assert.equal(result.evidence.examples.length, 3);
    assert.equal(result.evidence.modelOutputIsScripted, true);
    assert.match(result.evidence.after.instructions, /Input:/);
    assert.notEqual(
      result.evidence.before.output,
      result.evidence.after.output,
    );
  }
});

test("dynamic instructions resolve through SDK context without exposing the sample user ID", async () => {
  for (const user of ["ada", "luis"]) {
    for (const responseLanguage of ["English", "Spanish"]) {
      for (const application of ["homework", "workshop"]) {
        const input = { user, responseLanguage, application };
        const context = dynamicContext(input);
        const result = await executeLesson(12, input);
        assert.match(
          result.evidence.resolvedInstructions,
          new RegExp(context.displayName),
        );
        assert.match(
          result.evidence.resolvedInstructions,
          new RegExp(responseLanguage),
        );
        assert.ok(
          !result.evidence.resolvedInstructions.includes(context.userId),
        );
        assert.match(result.output, new RegExp(context.displayName));
      }
    }
  }
});

test("prompt versions use real SDK promptId configuration and explicit classroom placeholders", async () => {
  for (const storage of ["code", "hosted"]) {
    for (const version of ["1", "2"]) {
      const result = await executeLesson(13, {
        storage,
        version,
        responseLanguage: "Spanish",
      });
      assert.equal(result.evidence.version, version);
      assert.equal(result.evidence.variables.language, "Spanish");
      if (storage === "hosted") {
        assert.equal(
          result.evidence.reference.promptId,
          "pmpt_CLASSROOM_FIXTURE",
        );
        assert.equal(result.evidence.classroomReferenceIsPlaceholder, true);
      } else assert.match(result.evidence.instructions, /Spanish/);
    }
  }
  const agent = createVersionedAgent({
    Agent: sdk.Agent,
    model: "test",
    input: { storage: "hosted" },
    env: { STORED_PROMPT_ID: "pmpt_existing" },
    live: true,
  });
  assert.equal(
    (await agent.getPrompt(new sdk.RunContext())).promptId,
    "pmpt_existing",
  );
  assert.throws(
    () =>
      createVersionedAgent({
        Agent: sdk.Agent,
        input: { storage: "hosted" },
        env: {},
        live: true,
      }),
    /STORED_PROMPT_ID/,
  );
});

test("actual SDK cloning returns distinct agents with explicit independent tool lists", async () => {
  for (const variant of ["concise", "guided"]) {
    const { base, specialized } = createTutorVariant({
      ...sdk,
      model: "test",
      variant,
    });
    assert.notEqual(base, specialized);
    assert.notEqual(base.tools, specialized.tools);
    assert.equal(base.instructions, "Explain AI agent concepts to beginners.");
    assert.notEqual(base.instructions, specialized.instructions);
    const result = await executeLesson(14, { variant });
    assert.equal(result.evidence.distinctAgentObjects, true);
  }
});

test("clarification identifies only missing fields and uses the supplied complete duration", async () => {
  for (const audience of ["", "beginners", "experienced students"]) {
    for (const duration of ["", "30", "60"]) {
      const result = await executeLesson(15, { audience, duration });
      const missing = result.evidence.request.missing;
      if (missing.length) {
        for (const field of missing)
          assert.match(result.output, new RegExp(field));
        assert.ok(!result.output.includes("Materials"));
      } else {
        assert.match(result.output, new RegExp(`${duration} minutes`));
        assert.match(result.output, /Materials/);
      }
    }
  }
});

test("every configuration category constructs through the installed SDK and covers its public fields", async () => {
  for (const [, category] of definitionControls[16][0].options)
    assert.ok(category);
  for (const [configCategory] of definitionControls[16][0].options) {
    const result = await executeLesson(16, { configCategory });
    assert.equal(result.evidence.constructionOnly, true);
    assert.deepEqual(
      [...result.evidence.coveredFields].sort(),
      [...result.evidence.installedSDK.fields].sort(),
    );
    assert.match(result.output, /Focused factory excerpt/);
    assert.equal(result.evidence.installedSDK.version, "0.21.0");
    if (configCategory === "validation")
      assert.deepEqual(result.evidence.constructed.parsedFixture, {
        category: "billing",
      });
    if (configCategory === "context")
      assert.match(result.evidence.constructed.resolvedInstructions, /Ada/);
    if (configCategory === "run")
      assert.equal(result.evidence.constructed.runOptions.maxTurns, 3);
  }
});

function liveDependencies(responses, calls) {
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
      calls.runs ??= [];
      calls.runs.push({ agent, question, options });
      const result = responses[calls.runs.length - 1];
      if (result instanceof Error) throw result;
      return result ?? { finalOutput: "Actual adapter test answer" };
    }
  }
  return { ...sdk, OpenAI, OpenAIProvider, Runner };
}

test("all live definition paths configure the actual agent, client, model, and cancellation", async () => {
  for (const number of [10, 11, 12, 13, 14, 15]) {
    const calls = {};
    const signal = new AbortController().signal;
    const result = await executeLesson(
      number,
      { mode: "live" },
      {
        env: { OPENAI_API_KEY: "test-key", OPENAI_MODEL: "test-model" },
        signal,
        dependencies: liveDependencies([], calls),
      },
    );
    assert.equal(calls.client.apiKey, "test-key");
    assert.equal(calls.client.maxRetries, 0);
    assert.equal(calls.runs[0].agent.model, "test-model");
    assert.equal(calls.runs[0].options.signal, signal);
    assert.equal(calls.runs[0].options.maxTurns, 3);
    assert.equal(result.evidence.modelOutputIsScripted, false);
    if (number === 11) {
      assert.equal(calls.runs.length, 2);
      assert.equal(calls.runs[0].question, calls.runs[1].question);
    }
    if (number === 12)
      assert.deepEqual(calls.runs[0].options.context, dynamicContext());
  }
});

test("invalid selectors, empty results, interrupted runs, and partial comparisons fail explicitly", async () => {
  const invalid = [
    [10, { instructionSet: "invalid" }],
    [11, { ticket: "constructor" }],
    [12, { responseLanguage: "unknown" }],
    [13, { version: "99" }],
    [14, { variant: "__proto__" }],
    [15, { duration: "-5" }],
    [16, { configCategory: "invalid" }],
  ];
  for (const [number, input] of invalid)
    await assert.rejects(executeLesson(number, input), /Choose/);
  for (const response of [
    {},
    { finalOutput: "" },
    { finalOutput: "partial", interruptions: [{}] },
  ]) {
    await assert.rejects(
      executeLesson(
        10,
        { mode: "live" },
        {
          env: { OPENAI_API_KEY: "test" },
          dependencies: liveDependencies([response], {}),
        },
      ),
      /no completed/,
    );
  }
  await assert.rejects(
    executeLesson(
      11,
      { mode: "live" },
      {
        env: { OPENAI_API_KEY: "test" },
        dependencies: liveDependencies(
          [{ finalOutput: "before" }, new Error("fixture failure")],
          {},
        ),
      },
    ),
    /after-example run failed/,
  );
});
