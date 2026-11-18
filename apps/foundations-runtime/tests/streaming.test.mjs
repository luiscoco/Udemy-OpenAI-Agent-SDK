import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as pause } from "node:timers/promises";
import { executeStreaming as run } from "../streaming-execution.mjs";
import { createApp } from "../server.mjs";

test("actual run items preserve tools, handoff ownership and model messages", async () => {
  const { evidence: e } = await run(45, {});
  assert.deepEqual(
    e.allItems.map((item) => item.type),
    [
      "tool_call_item",
      "tool_call_output_item",
      "handoff_call_item",
      "handoff_output_item",
      "message_output_item",
    ],
  );
  const handoff = e.allItems.find(
    (item) => item.type === "handoff_output_item",
  );
  assert.equal(handoff.fromAgent, "Workshop coordinator");
  assert.equal(handoff.toAgent, "Timetable specialist");
  for (const itemView of ["tools", "handoffs"]) {
    const filtered = (await run(45, { itemView })).evidence.visibleItems;
    assert.equal(filtered.length, 2);
    assert.ok(
      filtered.every((item) =>
        item.type.startsWith(itemView === "tools" ? "tool_" : "handoff_"),
      ),
    );
  }
});
test("separate nested SDK usage matches a deduplicated response ledger", async () => {
  const nested = (await run(46, {})).evidence;
  assert.equal(nested.combined.requests, 3);
  assert.equal(nested.combined.totalTokens, 60);
  assert.equal(
    nested.rootUsage.requests + nested.nestedUsage.requests,
    nested.combined.requests,
  );
  assert.equal(
    nested.rootUsage.totalTokens + nested.nestedUsage.totalTokens,
    nested.combined.totalTokens,
  );
  assert.equal(new Set(nested.ledger.map((row) => row.responseId)).size, 3);
  const single = (await run(46, { usageScope: "single" })).evidence;
  assert.equal(single.combined.requests, 1);
  assert.equal(single.nestedUsage, null);
});
test("actual SDK failure classes map to the intended application errors", async () => {
  for (const [exceptionCase, sdkType] of [
    ["configuration", "UserError"],
    ["model", "ModelBehaviorError"],
    ["timeout", "ModelTimeoutError"],
    ["turn-limit", "MaxTurnsExceededError"],
  ]) {
    const { evidence: e } = await run(47, { exceptionCase });
    assert.equal(e.handled.sdkType, sdkType);
    assert.equal(e.consumed, false);
  }
});
test("manual continuation carries the actual replay history into the second model request", async () => {
  const carry = (await run(48, {})).evidence;
  assert.match(carry.secondOutput, /Spain/);
  assert.equal(carry.secondInput.length, carry.firstHistory.length + 1);
  const omit = (await run(48, { historyPolicy: "omit" })).evidence;
  assert.match(omit.secondOutput, /provide the workshop city/);
  assert.equal(omit.secondInput.length, 1);
});
test("text streaming delivers multiple SDK chunks before completion", async () => {
  const received = [];
  const result = await run(
    49,
    {},
    { onProgress: (event) => received.push(event) },
  );
  assert.ok(received.length > 5);
  assert.equal(received.map((event) => event.delta).join(""), result.output);
  assert.equal(result.evidence.settled, true);
});
test("event filters preserve actual SDK and raw event categories", async () => {
  for (const eventView of ["both", "raw", "sdk"]) {
    const { evidence: e } = await run(50, { eventView });
    assert.ok(e.streamEvents.some((event) => event.event === "tool_called"));
    assert.ok(
      e.streamEvents.some((event) => event.event === "output_text_delta"),
    );
    assert.ok(e.visibleEvents.length > 0);
    if (eventView === "raw")
      assert.ok(
        e.visibleEvents.every(
          (event) => event.kind === "raw_model_stream_event",
        ),
      );
    if (eventView === "sdk")
      assert.ok(
        e.visibleEvents.every(
          (event) => event.kind !== "raw_model_stream_event",
        ),
      );
  }
});
test("streamed handoff records and agent updates identify the actual destination", async () => {
  for (const streamSpecialist of ["robotics", "astronomy"]) {
    const { evidence: e } = await run(51, { streamSpecialist });
    const handoff = e.streamEvents.find(
      (event) => event.event === "handoff_occurred",
    );
    const update = e.streamEvents.find(
      (event) => event.event === "agent_changed",
    );
    assert.equal(handoff.fromAgent, "Streaming coordinator");
    assert.equal(handoff.toAgent, update.agent);
    assert.match(update.agent, new RegExp(streamSpecialist, "i"));
  }
});
test("tool progress distinguishes supported lifecycle hooks and application-reported failure", async () => {
  const success = (await run(52, {})).evidence;
  assert.deepEqual(
    success.streamEvents
      .filter((event) => event.kind === "lifecycle_hook")
      .map((event) => event.event),
    ["tool_start", "tool_end"],
  );
  const failure = (await run(52, { toolOutcome: "failure" })).evidence;
  assert.equal(failure.errorType, "ToolCallError");
  assert.equal(failure.consumed, false);
  assert.ok(
    failure.streamEvents.some(
      (event) => event.kind === "application" && event.event === "tool_failure",
    ),
  );
  assert.equal(failure.streamEvents.find(event=>event.event==='tool_end').status,'failed');
});
test("completion gate saves completed state only after settlement and rejects partial failed text", async () => {
  const success = (await run(53, {})).evidence;
  assert.equal(success.snapshotCount, 1);
  assert.ok(success.snapshotBytes > 100);
  assert.ok(
    success.lifecycle.indexOf("stream.settled") <
      success.lifecycle.indexOf("result.read"),
  );
  assert.ok(
    success.lifecycle.indexOf("result.read") <
      success.lifecycle.indexOf("state.saved"),
  );
  const failure = (await run(53, { completionCase: "failure" })).evidence;
  assert.equal(failure.consumed, false);
  assert.equal(failure.finalOutput, null);
  assert.equal(failure.usage, null);
  assert.equal(failure.snapshotCount, 0);
  assert.ok(failure.partialText.length > 0);
  assert.equal(failure.settled, true);
});
test("AbortController cancellation settles the actual stream and owned model before resource cleanup", async () => {
  for (const [cancelPoint, count] of [
    ["first", 1],
    ["third", 3],
  ]) {
    const { evidence: e } = await run(54, { cancelPoint });
    assert.equal(e.deltaCount, count);
    assert.equal(e.cancelled, true);
    assert.equal(e.consumed, false);
    assert.equal(e.activeGenerators, 0);
    assert.equal(e.resourceClosed, true);
    assert.ok(
      e.lifecycle.indexOf("abort.requested") <
        e.lifecycle.indexOf("stream.settled"),
    );
    assert.ok(
      e.lifecycle.indexOf("models.idle") <
        e.lifecycle.indexOf("resource.close"),
    );
  }
  const finish = (await run(54, { cancelPoint: "finish" })).evidence;
  assert.equal(finish.cancelled, false);
  assert.equal(finish.consumed, true);
});
test("HTTP progress frames arrive before the final exercise result", async () => {
  const server = createApp({ number: 49, env: {} });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/execute-stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamSpeed: "slow" }),
      },
    );
    assert.match(response.headers.get("content-type"), /text\/event-stream/);
    const reader = response.body.getReader();
    let raw = "";
    const first = await reader.read();
    raw += new TextDecoder().decode(first.value);
    assert.match(raw, /"type":"progress"/);
    assert.doesNotMatch(raw, /"type":"result"/);
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      raw += new TextDecoder().decode(next.value);
    }
    const frames = raw
      .trim()
      .split("\n\n")
      .map((frame) => JSON.parse(frame.slice(6)));
    assert.equal(frames.at(-1).type, "result");
    assert.equal(frames.at(-1).data.evidence.consumed, true);
    assert.ok(frames.filter((frame) => frame.type === "progress").length > 5);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("disconnecting an HTTP event stream aborts its owned server operation", async () => {
  let resolveAbort;
  const observedAbort = new Promise((resolve) => {
    resolveAbort = resolve;
  });
  const server = createApp({
    number: 49,
    env: {},
    execute: async (_number, _input, { signal, onProgress }) => {
      onProgress({ kind: "test", event: "started" });
      await new Promise((resolve) =>
        signal.addEventListener("abort", resolve, { once: true }),
      );
      resolveAbort();
      return {};
    },
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/execute-stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    );
    const reader = response.body.getReader();
    await reader.read();
    await reader.cancel();
    await Promise.race([
      observedAbort,
      pause(3000, undefined, { ref: false }).then(() => {
        throw new Error("Server cancellation was not observed.");
      }),
    ]);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("terminal entry point writes incremental chunks and a completed summary", async () => {
  const child = spawn(
    process.execPath,
    [
      fileURLToPath(
        new URL("../examples/streaming/terminal.mjs", import.meta.url),
      ),
    ],
    { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  const chunks = [];
  let errors = "";
  child.stdout.on("data", (chunk) => chunks.push(chunk.toString()));
  child.stderr.on("data", (chunk) => {
    errors += chunk.toString();
  });
  const [code] = await once(child, "close");
  assert.equal(code, 0, errors);
  assert.ok(chunks.length > 5);
  assert.match(chunks.join(""), /Completed 19 incremental chunks/);
});
test("invalid scenario selections fail before model execution", async () => {
  for (const [number, key] of [
    [45, "itemView"],
    [46, "usageScope"],
    [47, "exceptionCase"],
    [48, "historyPolicy"],
    [49, "streamSpeed"],
    [50, "eventView"],
    [51, "streamSpecialist"],
    [52, "toolOutcome"],
    [53, "completionCase"],
    [54, "cancelPoint"],
  ])
    await assert.rejects(() => run(number, { [key]: "unlisted" }), /listed/);
  await assert.rejects(() => run(49, { mode: "live" }), /controlled classroom/);
});
