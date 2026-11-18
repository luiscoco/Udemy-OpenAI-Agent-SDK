import test from "node:test";
import assert from "node:assert/strict";
import { executeLesson } from "../execute.mjs";
import { handoffControls } from "../public/handoff-lessons.js";
import { createAdvancedProtocol } from "../examples/mcp/advanced-protocol.mjs";
import { createMcpHttpFixture } from "../examples/mcp/http-server.mjs";
import { setTimeout as pause } from "node:timers/promises";

for (let number = 85; number <= 94; number++) {
  test(`Prompt ${number} executes all classroom scenarios with observable SDK outcomes`, async () => {
    const rows = handoffControls[number].reduce(
      (rows, control) =>
        rows.flatMap((row) =>
          control.options.map(([value]) => ({ ...row, [control.key]: value })),
        ),
      [{}],
    );
    for (const input of rows) {
      const result = await executeLesson(number, input, { env: {} });
      const e = result.evidence;
      assert.ok(result.output);
      if (number <= 88) {
        assert.equal(e.connectionsClosed, true);
        assert.equal(e.serversClosed, true);
        assert.equal(e.pendingRequestsAfterCleanup, 0);
      }
      if (number === 85) {
        const names = e.modelRequests[0].tools;
        assert.ok(names.includes("read_timetable"));
        assert.equal(
          names.includes("read_budget"),
          input.mcpFilterPolicy === "context" && input.filterRole === "finance",
        );
        assert.equal(e.callCount, 1);
      }
      if (number === 86) {
        assert.equal(
          e.toolListRequests,
          input.cachePolicy === "cached" ? 1 : 2,
        );
        assert.equal(e.definitionFresh, input.cachePolicy !== "cached");
        assert.match(e.before[0].description, /version 1/);
      }
      if (number === 87) {
        assert.ok(e.errors[0].message);
        assert.equal(e.recovered, input.mcpFailure === "restart");
        if (input.mcpFailure === "timeout")
          assert.equal(e.errors[0].code, "REQUEST_TIMEOUT");
      }
      if (number === 88) {
        assert.deepEqual(e.resourceNames, ["Workshop handbook"]);
        assert.deepEqual(e.promptNames, ["summarize_handbook"]);
        const request = e.modelRequests[0];
        assert.deepEqual(request.tools, ["read_timetable"]);
        assert.equal(
          JSON.stringify(request.input).includes(e.resourceText),
          input.resourcePolicy === "include",
        );
      }
      if (number === 89) {
        assert.equal(e.selectedCategory, input.supportIssue);
        assert.ok(e.sdkItemTypes.includes("handoff_output_item"));
        assert.equal(e.correctlyRouted, true);
      }
      if (number === 90) {
        assert.equal(
          e.finalOwner,
          input.ownershipPattern === "handoff"
            ? "Billing specialist"
            : "Manager",
        );
        assert.ok(
          e.sdkItemTypes.includes(
            input.ownershipPattern === "handoff"
              ? "handoff_output_item"
              : "tool_call_output_item",
          ),
        );
        assert.ok(
          e.modelRequests.some(
            (request) => request.agent === "Billing specialist",
          ),
        );
      }
      if (number === 91) {
        assert.equal(e.correctlyRouted, input.routingDescriptions === "clear");
        assert.equal(e.handoffDefinitions.length, 3);
        if (input.routingDescriptions === "vague")
          assert.equal(
            new Set(e.handoffDefinitions.map((tool) => tool.description)).size,
            1,
          );
      }
      if (number === 92) {
        assert.equal(
          e.callbackExecutions,
          input.metadataCase === "valid" ? 1 : 0,
        );
        if (input.metadataCase === "invalid") {
          assert.equal(e.validatedMetadata, null);
          assert.equal(e.validationError.type, "ModelBehaviorError");
          assert.ok(
            !e.lifecycle.some((event) => event.agent === "Billing specialist"),
          );
        } else assert.equal(e.validatedMetadata.invoiceId, "INV-42");
      }
      if (number === 93) {
        assert.equal(e.routingLog.length, 1);
        const callback = e.lifecycle.findIndex(
          (event) => event.event === "onHandoff",
        );
        const specialist = e.lifecycle.findIndex(
          (event) =>
            event.event === "agent_start" && event.agent !== "Callback triage",
        );
        assert.ok(callback >= 0 && callback < specialist);
        assert.equal(e.routingLog[0].to, e.finalOwner);
      }
      if (number === 94) {
        assert.equal(e.invoicePreserved, true);
        assert.equal(e.amountPreserved, true);
        assert.equal(
          e.unrelatedHistoryReceived,
          input.historyPolicy === "full",
        );
        if (input.historyPolicy === "focused")
          assert.ok(
            !e.specialistInput.some((item) =>
              ["function_call", "function_call_result"].includes(item.type),
            ),
          );
      }
    }
  });
}

test("A hidden MCP capability still enforces application permission at invocation", async () => {
  const protocol = createAdvancedProtocol({ role: "instructor" });
  const fixture = await createMcpHttpFixture({ handle: protocol.handle });
  try {
    const response = await fetch(fixture.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "read_budget", arguments: {} },
      }),
    });
    const value = await response.json();
    assert.equal(value.result.isError, true);
    assert.equal(value.result.content[0].text, "FORBIDDEN");
  } finally {
    await fixture.close();
  }
});

test("Closing an MCP fixture drains a handler after its client aborts", async () => {
  let begun;
  const started = new Promise((resolve) => {
    begun = resolve;
  });
  let finished = false;
  const fixture = await createMcpHttpFixture({
    handle: async (request) => {
      begun();
      await pause(80);
      finished = true;
      return { jsonrpc: "2.0", id: request.id, result: {} };
    },
  });
  const controller = new AbortController();
  const request = fetch(fixture.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"jsonrpc":"2.0","id":1,"method":"ping"}',
    signal: controller.signal,
  }).catch((error) => error);
  try {
    await started;
    controller.abort();
    await request;
  } finally {
    await fixture.close();
  }
  assert.equal(finished, true);
  assert.equal(fixture.pendingRequests, 0);
});

test("Invalid scenario values and aborted operations reject through the normal entry point", async () => {
  for (let number = 85; number <= 94; number++) {
    const key = handoffControls[number][0].key;
    await assert.rejects(
      () => executeLesson(number, { [key]: "unknown" }, { env: {} }),
      /listed lesson scenario/,
    );
  }
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    () => executeLesson(87, {}, { env: {}, signal: controller.signal }),
    (error) => error.name === "AbortError",
  );
});
