import test from "node:test";
import assert from "node:assert/strict";
import * as sdk from "@openai/agents";
import { executeLesson } from "../execute.mjs";
import { withClassroomServices } from "../examples/context/services.mjs";

test("typed context validates runtime values and resolves the actual SDK callback", async () => {
  const valid = await executeLesson(17, { profile: "luis" });
  assert.equal(valid.evidence.validationSucceeded, true);
  assert.match(valid.evidence.resolvedInstructions, /Luis/);
  assert.equal(valid.evidence.modelRequests, 0);
  for (const [contextCase, path] of [
    ["missing-tenant", "tenant"],
    ["invalid-language", "preferences.language"],
  ]) {
    const result = await executeLesson(17, { contextCase });
    assert.equal(result.evidence.validationSucceeded, false);
    assert.equal(result.evidence.issues[0].path, path);
    assert.ok(!result.evidence.resolvedInstructions);
  }
});

test("the actual SDK tool reuses injected clients and returns tenant-appropriate fixture data", async () => {
  for (const [profile, title, materials] of [
    ["ada", "Robotics workshop", "Robotics kits"],
    ["luis", "Music workshop", "Musical instruments"],
  ]) {
    const result = await executeLesson(18, { profile });
    assert.equal(result.evidence.actualToolResult.title, title);
    assert.ok(result.evidence.actualToolResult.materials.includes(materials));
    assert.equal(result.evidence.sdkModelCalls, 2);
    assert.deepEqual(result.evidence.closedClients, [
      "api.close",
      "database.close",
    ]);
    assert.equal(
      result.evidence.trace.filter((entry) => entry.event === "application.log")
        .length,
      1,
    );
  }
});

test("actual model-adapter requests expose only explicit instructions and tool outputs", async () => {
  for (const visibility of ["local", "instructions", "tool"]) {
    const result = await executeLesson(19, { visibility });
    const payload = JSON.stringify(result.evidence.actualAdapterRequests);
    assert.equal(result.evidence.localMarkerFoundInRequests, false);
    assert.ok(!payload.includes("CLASSROOM_LOCAL_ONLY_MARKER"));
    assert.ok(!payload.includes("sample-user-a"));
    if (visibility === "instructions")
      assert.match(
        result.evidence.actualAdapterRequests[0].systemInstructions,
        /Ada/,
      );
    if (visibility === "tool") {
      assert.equal(result.evidence.actualAdapterRequests.length, 2);
      assert.ok(
        result.evidence.actualAdapterRequests[1].input.some(
          (entry) => entry.type === "function_call_result",
        ),
      );
    }
  }
});

test("authorization denies cross-tenant and unknown IDs inside the registered SDK tool", async () => {
  for (const profile of ["ada", "luis"]) {
    for (const documentId of ["doc-a", "doc-b", "missing"]) {
      const allowed =
        (profile === "ada" && documentId === "doc-a") ||
        (profile === "luis" && documentId === "doc-b");
      const result = await executeLesson(20, { profile, documentId });
      assert.equal(
        result.evidence.authorization,
        allowed ? "allowed" : "denied",
      );
      if (!allowed) {
        assert.match(result.output, /^Document unavailable\./);
        assert.ok(!result.evidence.actualToolResult);
        assert.ok(!JSON.stringify(result).includes("Music club meets"));
        assert.ok(!JSON.stringify(result).includes("Robotics club meets"));
      }
      const lookup = result.evidence.trace.find(
        (entry) => entry.event === "database.find",
      );
      assert.equal(
        lookup.tenantId,
        profile === "ada" ? "school-a" : "school-b",
      );
      assert.deepEqual(result.evidence.closedClients, [
        "api.close",
        "database.close",
      ]);
    }
  }
});

test("personalization converts real timezone values and excludes internal identifiers from instructions", async () => {
  for (const contextLanguage of ["English", "Spanish"]) {
    const madrid = await executeLesson(21, {
      contextLanguage,
      timezone: "Europe/Madrid",
    });
    const newYork = await executeLesson(21, {
      contextLanguage,
      timezone: "America/New_York",
      detail: "detailed",
    });
    assert.match(madrid.evidence.localTime, /18:00/);
    assert.match(newYork.evidence.localTime, /12:00/);
    for (const result of [madrid, newYork]) {
      assert.ok(!result.evidence.modelInstructions.includes("sample-user"));
      assert.ok(!result.evidence.modelInstructions.includes("school-a"));
      assert.match(
        result.evidence.modelInstructions,
        new RegExp(contextLanguage),
      );
    }
  }
});

test("actual handoffs and nested runs preserve or isolate state according to the supplied context", async () => {
  for (const contextPattern of ["handoff", "nested-shared", "nested-copy"]) {
    const result = await executeLesson(22, { contextPattern });
    assert.equal(result.evidence.childNotes.length, 1);
    assert.equal(
      result.evidence.parentNotes.length,
      contextPattern === "nested-copy" ? 0 : 1,
    );
    assert.equal(
      result.evidence.lastAgent,
      contextPattern === "handoff" ? "Notes specialist" : "Notes manager",
    );
    if (contextPattern === "handoff") {
      assert.equal(result.evidence.handoffSharesContext, true);
      assert.ok(result.evidence.sdkItemTypes.includes("handoff_call_item"));
    } else
      assert.equal(
        result.evidence.nestedSharesContext,
        contextPattern === "nested-shared",
      );
  }
  const concurrent = await Promise.all([
    executeLesson(22, {}),
    executeLesson(22, {}),
  ]);
  assert.ok(
    concurrent.every((result) => result.evidence.parentNotes.length === 1),
  );
});

test("actual ToolCallDetails reach the log allowlist while sensitive values remain absent", async () => {
  for (const recordId of ["record-a", "record-b"]) {
    const result = await executeLesson(23, { recordId });
    const logs = result.evidence.safeApplicationLogs;
    assert.equal(logs.length, 1);
    assert.equal(logs[0].callId, "classroom-call-1");
    assert.deepEqual(logs[0].argumentNames, ["recordId", "privateNote"]);
    assert.ok(!JSON.stringify(result).includes("sample-only-keep-private"));
    assert.ok(!JSON.stringify(logs).includes(recordId));
    assert.equal(result.evidence.sdkPayloadLoggingSuppressed, true);
  }
});

test("owned clients close after success, tool failure, cancellation, and partial initialization", async () => {
  for (const lifecycleOutcome of [
    "success",
    "failure",
    "cancel",
    "init-failure",
  ]) {
    const result = await executeLesson(24, { lifecycleOutcome });
    assert.equal(result.evidence.completed, lifecycleOutcome === "success");
    assert.deepEqual(result.evidence.closedClients, [
      "api.close",
      "database.close",
    ]);
    if (lifecycleOutcome === "init-failure") {
      assert.equal(result.evidence.sdkModelCalls, 0);
      assert.equal(result.events[2].title, "Skip the SDK run");
      assert.match(result.label, /client initialization/);
    }
    if (lifecycleOutcome === "cancel")
      assert.match(result.evidence.handledOutcome, /cancelled/);
    const finalEvents = result.evidence.trace
      .slice(-2)
      .map((entry) => entry.event);
    assert.deepEqual(finalEvents, ["api.close", "database.close"]);
  }
});

test("cleanup failure preserves the primary error and still attempts all owned clients", async () => {
  const trace = [];
  const primary = new Error("Primary operation failed.");
  await assert.rejects(
    withClassroomServices({ trace }, async (services) => {
      services.api.close = async () => {
        trace.push({ event: "api.close.failed" });
        throw new Error("Close failed.");
      };
      throw primary;
    }),
    (error) => error === primary,
  );
  assert.ok(trace.some((entry) => entry.event === "database.close"));
  assert.ok(trace.some((entry) => entry.event === "cleanup.error"));
});

test("invalid context inputs and unsupported live modes fail explicitly", async () => {
  for (const [number, input] of [
    [17, { profile: "unknown" }],
    [19, { visibility: "invalid" }],
    [20, { documentId: "invalid" }],
    [21, { timezone: "invalid" }],
    [22, { contextPattern: "invalid" }],
    [23, { recordId: "invalid" }],
    [24, { lifecycleOutcome: "invalid" }],
  ]) {
    await assert.rejects(executeLesson(number, input));
  }
  for (const number of [17, 19, 24])
    await assert.rejects(
      executeLesson(number, { mode: "live" }, { env: {} }),
      /local validation/,
    );
  await assert.rejects(
    executeLesson(18, { mode: "live" }, { env: {} }),
    /OPENAI_API_KEY/,
  );
});

test("live context adapters pass credentials, context, model, and cancellation to the runner", async () => {
  for (const number of [18, 20, 21, 22, 23]) {
    const calls = [];
    class OpenAI {
      constructor(options) {
        calls.client = options;
      }
    }
    class Runner {
      async run(agent, question, options) {
        calls.push({ agent, question, options });
        if (agent.tools.length && number !== 22) {
          const args =
            number === 20
              ? { documentId: "doc-a" }
              : number === 23
                ? {
                    recordId: "record-a",
                    privateNote: "sample-only-keep-private",
                  }
                : {};
          await agent.tools[0].invoke(
            new sdk.RunContext(options.context),
            JSON.stringify(args),
            {
              signal: options.signal,
              toolCall: {
                type: "function_call",
                name: agent.tools[0].name,
                callId: "live-contract-call",
                arguments: JSON.stringify(args),
              },
            },
          );
        }
        return {
          finalOutput: "Actual adapter test result",
          rawResponses: [{}],
          lastAgent: agent,
          newItems: [],
        };
      }
    }
    const signal = new AbortController().signal;
    const result = await executeLesson(
      number,
      { mode: "live" },
      {
        env: {
          OPENAI_API_KEY: "context-test-key",
          OPENAI_MODEL: "context-test-model",
        },
        signal,
        dependencies: { OpenAI, Runner },
      },
    );
    assert.equal(calls.client.apiKey, "context-test-key");
    assert.equal(calls[0].agent.model, "context-test-model");
    assert.equal(calls[0].options.context.tenant.id, "school-a");
    assert.equal(calls[0].options.signal.aborted, false);
    assert.equal(calls[0].options.maxTurns, 5);
    assert.match(result.label, /OpenAI model/);
  }
});
