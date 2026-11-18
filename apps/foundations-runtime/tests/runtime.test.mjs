import test from "node:test";
import assert from "node:assert/strict";
import { executeRuntime as run } from "../runtime-execution.mjs";
import { localHTTPProvider } from "../examples/runtime/local-provider.mjs";

test("reasoning comparison keeps the task and criteria fixed and captures actual settings", async () => {
  for (const reasoningComparison of ["effort", "verbosity"]) {
    const { evidence: e } = await run(35, { reasoningComparison });
    assert.equal(e.rows.length, 2);
    assert.equal(e.inferenceIsScripted, true);
    for (const row of e.rows) {
      assert.equal(row.value.total, 50);
      assert.equal(row.accepted, true);
      assert.ok(row.elapsedSdkMs >= 0);
      assert.equal(
        row.capturedRequest[
          reasoningComparison === "effort" ? "reasoning" : "text"
        ][reasoningComparison === "effort" ? "effort" : "verbosity"],
        row.level,
      );
    }
  }
});
test("routing selects the observed specialist and counts the additional model call", async () => {
  for (const routingTask of ["easy", "hard"])
    for (const routingStrategy of ["mixed", "direct"]) {
      const { evidence: e } = await run(36, { routingTask, routingStrategy });
      assert.equal(e.modelCalls, routingStrategy === "mixed" ? 2 : 1);
      assert.equal(
        e.selectedModel,
        routingTask === "easy" && routingStrategy === "mixed"
          ? "gpt-6-luna"
          : "gpt-6-astra",
      );
      assert.ok(Object.values(e.checks).every(Boolean));
    }
});
test("both API adapters execute local tools and strict Chat validation rejects hosted tools before transmission", async () => {
  const tools = (await run(37, { apiFeature: "tool" })).evidence;
  assert.equal(tools.observedTools.length, 2);
  assert.ok(tools.rows.every((row) => row.localRequests === 2));
  const hosted = (await run(37, { apiFeature: "hosted" })).evidence;
  assert.equal(hosted.rows[0].accepted, true);
  assert.equal(hosted.rows[1].accepted, false);
  assert.equal(hosted.rows[1].localRequests, 0);
  assert.equal(hosted.actualRequests[0].body.tools[0].type, "web_search");
});
test("compatible provider returns actual tool, schema, streaming and absent-usage protocol shapes", async () => {
  for (const providerFeature of [
    "tools",
    "structured",
    "streaming",
    "missing-usage",
  ]) {
    const { evidence: e } = await run(38, { providerFeature });
    assert.equal(e.rows[0].accepted, true);
    if (providerFeature === "tools") {
      assert.equal(e.observedTools.length, 1);
      assert.equal(e.actualRequests.length, 2);
    }
    if (providerFeature === "structured") {
      assert.deepEqual(e.rows[0].finalOutput, {
        answer: "Classroom provider answer.",
      });
      assert.equal(
        e.actualRequests[0].body.response_format.type,
        "json_schema",
      );
    }
    if (providerFeature === "streaming")
      assert.ok(e.rows[0].streamedEvents.includes("output_text_delta"));
    if (providerFeature === "missing-usage") {
      assert.equal(e.rows[0].usage.totalTokens, 0);
      assert.match(e.usageReporting, /omitted usage/);
    }
  }
});
test("configured external-provider path uses its supplied URL and model through the supported adapter", async () => {
  const provider = await localHTTPProvider();
  try {
    const { evidence: e } = await run(
      38,
      { mode: "live", providerFeature: "structured" },
      {
        env: {
          OPENAI_API_KEY: "fixture-provider-key",
          ALT_PROVIDER_URL: provider.baseURL,
          ALT_PROVIDER_MODEL: "fixture-provider-model",
        },
      },
    );
    assert.equal(provider.requests[0].body.model, "fixture-provider-model");
    assert.equal(e.inferenceIsScripted, false);
    assert.deepEqual(e.rows[0].finalOutput, {
      answer: "Classroom provider answer.",
    });
  } finally {
    await provider.close();
  }
});
test("custom Model supports complete and streamed runs and rejects malformed schema output", async () => {
  for (const adapterScenario of ["text", "stream", "invalid"]) {
    const { evidence: e } = await run(39, { adapterScenario });
    assert.equal(e.accepted, adapterScenario !== "invalid");
    assert.equal(e.requests.length, 1);
    if (adapterScenario === "stream") {
      assert.ok(e.streamEvents.includes("response_started"));
      assert.ok(e.streamEvents.includes("response_done"));
    }
    if (adapterScenario === "invalid")
      assert.equal(e.errorType, "ModelBehaviorError");
  }
});
test("actual WebSocket model reuses or replaces connections and closes owned resources", async () => {
  for (const connectionPolicy of ["reuse", "fresh"]) {
    const { evidence: e } = await run(40, { connectionPolicy });
    assert.equal(e.connections, connectionPolicy === "reuse" ? 1 : 2);
    assert.equal(e.frames.length, 2);
    assert.equal(e.closed, e.connections);
    assert.ok(e.frames.every((item) => item.frame.type === "response.create"));
    assert.equal(e.cleanupCompleted, true);
  }
});
test("execution methods call actual asynchronous TypeScript and async/sync Python SDK methods", async () => {
  for (const executionMethod of ["async-ts", "async-python", "sync-python"]) {
    const { evidence: e } = await run(41, { executionMethod });
    assert.equal(e.method, executionMethod);
    assert.ok(e.finalOutput);
    assert.ok(e.lastResponseId);
    assert.ok(e.elapsedSdkMs >= 0);
  }
});
test("SDK turn limits count model calls and preserve observed local tool execution counts", async () => {
  for (const turnBudget of ["1", "2", "3"]) {
    const { evidence: e } = await run(42, { turnBudget });
    assert.equal(e.modelCalls, Number(turnBudget));
    assert.equal(e.toolExecutions, Math.min(2, Number(turnBudget)));
    assert.equal(e.consumed, turnBudget === "3");
    if (turnBudget !== "3") assert.equal(e.errorType, "MaxTurnsExceededError");
  }
});
test("installed runner applies workflow defaults and preserves explicit specialist model and settings", async () => {
  const { evidence: e } = await run(43, {});
  const coordinator = e.observed.find((row) => row.model === "gpt-6-luna");
  const specialist = e.observed.find((row) => row.model === "gpt-6-astra");
  assert.equal(coordinator.requests[0].settings.maxTokens, 128);
  assert.equal(coordinator.requests[0].settings.text.verbosity, "low");
  assert.equal(specialist.requests[0].settings.maxTokens, 1024);
  assert.equal(specialist.requests[0].settings.text.verbosity, "high");
  const plain = (await run(43, { workflowConfig: "agent-only" })).evidence;
  assert.equal(plain.observed[0].requests[0].settings.maxTokens, undefined);
});
test("RunResult exposes ownership, actual continuation history and unconsumed approval state", async () => {
  const handed = (await run(44, {})).evidence;
  assert.equal(handed.lastAgent, "Result specialist");
  assert.equal(handed.lastAgent, handed.activeAgent);
  assert.ok(handed.rawResponseIds.includes(handed.lastResponseId));
  const continued = (await run(44, { resultScenario: "continuation" }))
    .evidence;
  assert.ok(continued.historyLength > continued.initialHistoryLength);
  assert.match(continued.finalOutput, /continued/);
  const paused = (await run(44, { resultScenario: "approval" })).evidence;
  assert.equal(paused.finalOutput, null);
  assert.equal(paused.consumed, false);
  assert.equal(paused.toolExecuted, false);
  assert.equal(paused.interruptionCount, 1);
  assert.equal(paused.stateAvailable, true);
});
test("invalid selections and unsupported live modes are rejected without execution", async () => {
  for (const [number, key] of [
    [35, "reasoningComparison"],
    [36, "routingTask"],
    [37, "apiFeature"],
    [38, "providerFeature"],
    [39, "adapterScenario"],
    [40, "connectionPolicy"],
    [41, "executionMethod"],
    [42, "turnBudget"],
    [43, "workflowConfig"],
    [44, "resultScenario"],
  ])
    await assert.rejects(
      () => run(number, { [key]: "unlisted-case" }),
      /listed/,
    );
  await assert.rejects(() => run(40, { mode: "live" }), /controlled local/);
  await assert.rejects(
    () => run(38, { mode: "live" }, { env: { OPENAI_API_KEY: "fixture" } }),
    /ALT_PROVIDER_URL/,
  );
  await assert.rejects(() => run(35, { mode: "live" }), /OPENAI_API_KEY/);
});
