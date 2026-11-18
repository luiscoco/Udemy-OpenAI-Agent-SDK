import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { executeTools as run } from "../tools-execution.mjs";
import { createTenantDatabase } from "../examples/tools/tenant-database.mjs";
import {
  createWeatherFixture,
  fetchWeather,
} from "../examples/tools/external-api.mjs";
import { createApp } from "../server.mjs";

test("HTTP client classifies malformed JSON and null bodies as invalid API responses", async () => {
  const bodies = ["not-json", "null"];
  const server = createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(bodies.shift());
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    for (let index = 0; index < 2; index++)
      await assert.rejects(
        () =>
          fetchWeather({
            baseURL: `http://127.0.0.1:${server.address().port}`,
            token: "fixture",
            city: "Madrid",
          }),
        (error) => error.code === "INVALID_API_RESPONSE",
      );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("streamed approvals settle, serialize and restore before any approved execution", async () => {
  for (const approvalDecision of ["pause", "approve", "reject"]) {
    const { evidence: e } = await run(55, { approvalDecision });
    assert.equal(e.initialInterruptions, 1);
    assert.equal(e.restoredInterruptions, 1);
    assert.equal(e.beforeDecisionExecutions, 0);
    assert.ok(JSON.parse(e.serializedState));
    assert.equal(e.settled, true);
    assert.equal(e.toolExecutions, approvalDecision === "approve" ? 1 : 0);
    assert.equal(e.paused, approvalDecision === "pause");
    assert.equal(e.consumed, approvalDecision !== "pause");
    assert.ok(
      e.streamEvents.some((event) => event.event === "tool_approval_requested"),
    );
  }
});
test("real SSE teaching client disconnect cancels its SDK stream and awaits resource cleanup", async () => {
  for (const sseClient of ["complete", "disconnect"]) {
    const received = [];
    const { evidence: e } = await run(
      56,
      { sseClient },
      { onProgress: (event) => received.push(event) },
    );
    assert.equal(e.clientDisconnected, sseClient === "disconnect");
    assert.equal(e.cancellationObserved, sseClient === "disconnect");
    assert.equal(e.settled, true);
    assert.equal(e.modelIdle, true);
    assert.equal(e.resourceClosed, true);
    assert.equal(e.receivedEvents, received.length);
    assert.equal(e.consumed, sseClient === "complete");
    if (sseClient === "disconnect") assert.equal(e.chunks, 3);
  }
});
test("calculator executes finite arithmetic and a conceptual question uses no tool callback", async () => {
  const arithmetic = (await run(57, {})).evidence;
  assert.equal(arithmetic.toolExecutions, 1);
  assert.equal(arithmetic.observedResults[0].value, 37.5);
  const concept = (await run(57, { calculatorQuestion: "concept" })).evidence;
  assert.equal(concept.toolExecutions, 0);
});
test("SDK argument constraints prevent invalid candidates from entering application work", async () => {
  for (const argumentCase of [
    "valid",
    "wrong-type",
    "too-many",
    "unknown-city",
  ]) {
    const { evidence: e } = await run(58, { argumentCase });
    assert.equal(e.callbackExecutions, argumentCase === "valid" ? 1 : 0);
    if (argumentCase !== "valid") {
      assert.equal(e.validationErrors.length, 1);
      assert.match(JSON.stringify(e.modelVisibleResults), /INVALID_ARGUMENTS/);
    }
  }
});
test("tool descriptions expose documented schemas and a controlled ambiguity comparison", async () => {
  const clear = (await run(59, {})).evidence;
  const vague = (await run(59, { descriptionQuality: "vague" })).evidence;
  assert.equal(clear.selectedCorrectCapability, true);
  assert.equal(vague.selectedCorrectCapability, false);
  assert.ok(
    clear.actualModelToolDefinitions.some(
      (tool) =>
        tool.name === "read_shipment_status" &&
        tool.description.includes("Read latest"),
    ),
  );
  assert.match(
    JSON.stringify(clear.actualModelToolDefinitions),
    /Identifier of the existing order/,
  );
});
test("HTTP tool authenticates and maps API, deadline and service failures without exposing credentials", async () => {
  for (const [apiScenario, code] of [
    ["success", undefined],
    ["unauthorized", "AUTHENTICATION_FAILED"],
    ["timeout", "API_TIMEOUT"],
    ["server-error", "UPSTREAM_UNAVAILABLE"],
  ]) {
    const { evidence: e } = await run(60, { apiScenario });
    assert.equal(e.resourceClosed, true);
    assert.equal(e.observedRequests[0].authorizationPresent, true);
    assert.equal(
      e.observedRequests[0].authorized,
      apiScenario !== "unauthorized",
    );
    assert.equal(e.observedResults[0].code, code);
    assert.doesNotMatch(
      JSON.stringify(e),
      /classroom-weather-token|invalid-fixture-token|private upstream diagnostic/,
    );
  }
});
test("HTTP client honors its caller abort and closes the service fixture", async () => {
  const service = await createWeatherFixture("timeout");
  const controller = new AbortController();
  try {
    const pending = fetchWeather({
      baseURL: service.baseURL,
      token: service.token,
      city: "Madrid",
      signal: controller.signal,
      timeoutMs: 1000,
    });
    controller.abort();
    await assert.rejects(pending, (error) => error.name === "AbortError");
  } finally {
    await service.close();
  }
});
test("actual SQLite binds tenant and record parameters and blocks cross-tenant and injection-shaped lookups", async () => {
  for (const databaseProfile of ["alice", "ben"])
    for (const recordCase of ["own", "cross", "injection"]) {
      const { evidence: e } = await run(61, { databaseProfile, recordCase });
      assert.equal(e.observedResults[0].found, recordCase === "own");
      assert.equal(e.queryOnly, true);
      assert.equal(e.resourceClosed, true);
      assert.equal(e.queries[0].parameters[0], e.context.tenantId);
      assert.equal(e.queries[0].parameters[1], e.recordId);
      assert.match(e.queries[0].sql, /tenant_id = \? AND id = \?/);
    }
  const database = await createTenantDatabase();
  try {
    assert.throws(
      () => database.database.exec("DELETE FROM workshops"),
      /readonly|read.only/i,
    );
    assert.throws(() => database.read({}, "workshop-a"), /Authenticated/);
  } finally {
    database.close();
  }
});
test("schema-validated structured tool results preserve their actual model-visible JSON representation", async () => {
  const structured = (await run(62, {})).evidence;
  assert.equal(structured.outputSchemaEnabled, true);
  assert.equal(structured.classroomDownstreamInput.type, "text");
  assert.equal(
    JSON.parse(structured.classroomDownstreamInput.text).durationMinutes,
    30,
  );
  const text = (await run(62, { returnFormat: "text" })).evidence;
  assert.equal(text.outputSchemaEnabled, false);
  assert.match(text.classroomDownstreamInput.text, /30 minutes/);
});
test("safe tool failures exclude the synthetic secret from evidence, model input and public errors", async () => {
  for (const toolErrorPolicy of ["safe-result", "propagate"]) {
    const result = await run(63, { toolErrorPolicy });
    assert.equal(result.evidence.secretAbsentFromEvidence, true);
    assert.doesNotMatch(
      JSON.stringify(result),
      /CLASSROOM_SECRET_DO_NOT_EXPOSE|Internal credential=|private_backend_detail_942/,
    );
    if (toolErrorPolicy === "safe-result") {
      assert.equal(result.evidence.completed, true);
      assert.match(
        JSON.stringify(result.evidence.safeResults),
        /UPSTREAM_UNAVAILABLE/,
      );
    } else {
      assert.equal(result.evidence.completed, false);
      assert.equal(result.evidence.errorType, "ToolCallError");
    }
  }
});
test("SDK per-tool timeout adds no implicit retry and application retry waits for the first backend to settle", async () => {
  for (const timeoutPolicy of ["as-result", "raise", "retry"]) {
    const { evidence: e } = await run(64, { timeoutPolicy });
    assert.equal(e.backendSettled, true);
    assert.equal(e.toolExecutions, timeoutPolicy === "retry" ? 2 : 1);
    assert.equal(e.applicationRetries, timeoutPolicy === "retry" ? 1 : 0);
    if (timeoutPolicy === "raise") {
      assert.equal(e.handledError.type, "ToolTimeoutError");
      assert.equal(e.consumed, false);
    }
    if (timeoutPolicy === "as-result")
      assert.match(JSON.stringify(e.modelVisibleResults), /TOOL_TIMEOUT/);
    if (timeoutPolicy === "retry") {
      assert.ok(
        e.trace.indexOf("call.1.settled") <
          e.trace.indexOf("application.retry"),
      );
      assert.equal(e.consumed, true);
    }
  }
});
test("normal application event endpoint supports approval pauses and rejects unsupported tool streaming", async () => {
  const server = createApp({ number: 55, env: {} });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const post = (path, body) =>
    fetch(`http://127.0.0.1:${server.address().port}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    const response = await post("/api/execute-stream", {});
    assert.match(response.headers.get("content-type"), /text\/event-stream/);
    const frames = (await response.text())
      .trim()
      .split("\n\n")
      .map((frame) => JSON.parse(frame.slice(6)));
    assert.ok(
      frames.some(
        (frame) =>
          frame.type === "progress" &&
          frame.data.event === "tool_approval_requested",
      ),
    );
    assert.equal(frames.at(-1).data.evidence.paused, true);
    assert.equal((await post("/api/execute-stream?prompt=57", {})).status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("invalid selections and unavailable live paths reject before application work", async () => {
  for (const [number, key] of [
    [55, "approvalDecision"],
    [56, "sseClient"],
    [57, "calculatorQuestion"],
    [58, "argumentCase"],
    [59, "descriptionQuality"],
    [60, "apiScenario"],
    [61, "databaseProfile"],
    [62, "returnFormat"],
    [63, "toolErrorPolicy"],
    [64, "timeoutPolicy"],
  ])
    await assert.rejects(() => run(number, { [key]: "unlisted" }), /listed/);
  await assert.rejects(() => run(55, { mode: "live" }), /controlled local/);
  await assert.rejects(() => run(57, { mode: "live" }), /OPENAI_API_KEY/);
});
