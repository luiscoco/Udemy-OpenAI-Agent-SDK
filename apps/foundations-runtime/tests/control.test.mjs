import test from "node:test";
import assert from "node:assert/strict";
import { executeLesson } from "../execute.mjs";
import { controlControls } from "../public/control-lessons.js";
import { createApp } from "../server.mjs";
import { Agent, Runner, tool, ModelBehaviorError } from "@openai/agents";
import { z } from "zod";
import {
  scriptedModel,
  functionCall,
} from "../examples/context/scripted-model.mjs";

const run = (number, input = {}, options = {}) =>
  executeLesson(number, input, { env: {}, ...options });
for (let number = 65; number <= 74; number++) {
  test(`Prompt ${number} runs every scenario through its normal entry point`, async () => {
    const cases = controlControls[number].reduce(
      (rows, control) =>
        rows.flatMap((row) =>
          control.options.map(([value]) => ({ ...row, [control.key]: value })),
        ),
      [{}],
    );
    for (const input of cases) {
      const result = await run(number, input);
      const e = result.evidence;
      assert.equal(e.inferenceIsScripted, true);
      assert.equal(typeof result.output, "string");
      assert.ok(result.events.length >= 3);
      if (number === 65) {
        assert.deepEqual(
          e.calls,
          input.toolChoice === "auto"
            ? []
            : [
                input.toolChoice === "required"
                  ? "read_workshop"
                  : "read_capacity",
              ],
        );
        assert.equal(e.observedRequests[0].toolChoice, input.toolChoice);
        if (e.observedRequests.length > 1)
          assert.equal(e.observedRequests[1].toolChoice, undefined);
      }
      if (number === 66)
        assert.equal(
          e.modelResponses,
          input.stopPolicy === "run_llm_again" ? 2 : 1,
        );
      if (number === 67) {
        assert.equal(
          e.decisions[0].isFinalOutput,
          input.completionCase === "complete",
        );
        assert.equal(
          e.modelResponses,
          input.completionCase === "complete" ? 1 : 2,
        );
      }
      if (number === 68) {
        assert.equal(e.updates, input.availabilityProfile === "editor" ? 1 : 0);
        assert.equal(
          e.workshop.title,
          input.availabilityProfile === "editor"
            ? "Robotics lab"
            : "Robotics workshop",
        );
        assert.equal(
          e.observedRequests[0].tools.includes("edit_workshop"),
          input.availabilityProfile !== "viewer",
        );
        if (input.availabilityProfile === "revoked")
          assert.match(result.output, /FORBIDDEN/);
      }
      if (number === 69) {
        assert.equal(
          e.peakConcurrency,
          input.parallelPattern === "parallel"
            ? Number(input.concurrencyLimit)
            : 1,
        );
        assert.equal(e.activeAfterRun, 0);
        assert.equal(
          e.trace.filter((event) => event.event === "finish").length,
          3,
        );
        assert.equal(
          e.modelResponses,
          input.parallelPattern === "parallel" ? 2 : 4,
        );
      }
      if (number === 70) {
        assert.equal(e.calls.length, input.resetPolicy === "reset" ? 1 : 3);
        assert.equal(
          e.errorType,
          input.resetPolicy === "reset" ? undefined : "MaxTurnsExceededError",
        );
      }
      if (number === 71) {
        assert.deepEqual(e.callbacks, ["read_workshop"]);
        const payload = e.actualRequestPayloads[0];
        assert.equal(
          payload.tools.some((tool) => tool.type === "tool_search"),
          input.discoveryMode === "deferred",
        );
        const namespace = payload.tools.find(
          (tool) => tool.type === "namespace",
        );
        assert.equal(namespace.name, "classroom");
        assert.ok(
          namespace.tools.every(
            (tool) =>
              Boolean(tool.defer_loading) ===
              (input.discoveryMode === "deferred"),
          ),
        );
        assert.equal(
          e.responseItems.some((item) => item.type === "tool_search_output"),
          input.discoveryMode === "deferred",
        );
      }
      if (number === 72) {
        assert.deepEqual(e.classroomAggregate, { kits: 3, totalAvailable: 18 });
        assert.equal(e.callbacks.length, 3);
        assert.ok(e.callbacks.every((call) => call.caller.type === "program"));
        assert.ok(
          e.actualRequestPayloads[0].tools.some(
            (tool) => tool.type === "programmatic_tool_calling",
          ),
        );
        assert.deepEqual(e.allowedCallers.update_inventory, ["direct"]);
      }
      if (number === 73) {
        assert.equal(result.citations[0].type, "url_citation");
        const tool = e.actualRequestPayloads[0].tools.find(
          (tool) => tool.type === "web_search",
        );
        assert.deepEqual(
          tool.filters?.allowed_domains,
          input.searchScope === "official"
            ? ["developers.openai.com"]
            : undefined,
        );
      }
      if (number === 74) {
        assert.equal(result.citations[0].type, "file_citation");
        const payload = e.actualRequestPayloads[0];
        assert.deepEqual(payload.tools[0].vector_store_ids, [
          "vs_classroom_fixture",
        ]);
        assert.ok(payload.include.includes("file_search_call.results"));
      }
    }
  });
}

test("SDK rejects a programmatic caller for a direct-only tool before execution", async () => {
  let executed = false;
  const write = tool({
    name: "write_fixture",
    parameters: z.object({}),
    allowedCallers: ["direct"],
    execute: () => {
      executed = true;
      return "updated";
    },
  });
  const call = {
    ...functionCall("write_fixture"),
    caller: { type: "program", callerId: "forbidden-program" },
  };
  const agent = new Agent({
    name: "Caller boundary",
    model: scriptedModel([call]),
    tools: [write],
  });
  await assert.rejects(
    () => new Runner({ tracingDisabled: true }).run(agent, "test"),
    ModelBehaviorError,
  );
  assert.equal(executed, false);
});

test("New controls reject unknown selections and live file search requires a store", async () => {
  for (let number = 65; number <= 74; number++) {
    const key = controlControls[number][0].key;
    await assert.rejects(
      () => run(number, { [key]: "unknown" }),
      /listed lesson scenario/,
    );
  }
  await assert.rejects(() => run(74, { mode: "live" }), /VECTOR_STORE_ID/);
});

test("A cancelled concurrency exercise rejects before work starts", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    () => run(69, {}, { signal: controller.signal }),
    (error) => error.name === "AbortError",
  );
});

test("The server exposes source and controls for all ten new applications", async () => {
  const server = createApp({ number: 65, env: {} });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (let number = 65; number <= 74; number++) {
      const response = await fetch(`${base}/api/state?prompt=${number}`);
      assert.equal(response.status, 200);
      const state = await response.json();
      assert.equal(state.lesson.number, number);
      assert.ok(Object.values(state.sources).every((source) => source.length));
    }
    assert.equal((await fetch(`${base}/control-lessons.js`)).status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
