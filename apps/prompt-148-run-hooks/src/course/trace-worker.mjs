import * as sdk from "@openai/agents";
import { scriptedModel, functionCall, message } from "./common.mjs";

const number = Number(process.argv[2]);
const scenario = process.argv[3];
const records = [],
  hooks = [];
let flushes = 0;
sdk.setTraceProcessors([
  {
    async onTraceStart(trace) {
      records.push({ kind: "trace", ...trace.toJSON() });
    },
    async onTraceEnd() {},
    async onSpanStart() {},
    async onSpanEnd(span) {
      records.push({ kind: "span", ...span.toJSON() });
    },
    async forceFlush() {
      flushes++;
    },
    async shutdown() {},
  },
]);
const sensitive = number !== 150 || scenario === "include-fixture";
const runner = new sdk.Runner({
  traceIncludeSensitiveData: sensitive,
  workflowName: `Prompt ${number}`,
  groupId: "classroom-conversation",
});
const tool = sdk.tool({
  name: "read_invoice",
  parameters: { type: "object", properties: {}, additionalProperties: false },
  execute: async () => {
    return sdk.withCustomSpan(async () => "INV-42, EUR 18", {
      data: { name: "database.read", data: { record: "INV-42" } },
    });
  },
});
const agent = new sdk.Agent({
  name: "Invoice agent",
  model: scriptedModel([
    functionCall("read_invoice"),
    message("Invoice INV-42 totals EUR 18."),
  ]),
  tools: [tool],
});
const target = number === 148 ? runner : agent;
for (const event of [
  "agent_start",
  "agent_end",
  "agent_tool_start",
  "agent_tool_end",
  "agent_handoff",
]) {
  target.on(event, () =>
    hooks.push({
      scope: number === 148 ? "run" : "agent",
      event,
      at: performance.now(),
    }),
  );
}
const started = performance.now();
let result;
await sdk.withTrace(
  `Prompt ${number}`,
  async () => {
    result = await runner.run(agent, "Read invoice INV-42.");
    if (number === 146) {
      const follow = new sdk.Agent({
        name: "Follow-up",
        model: scriptedModel([message("Invoice follow-up complete.")]),
      });
      await runner.run(follow, "Confirm invoice.");
    }
  },
  { groupId: "classroom-conversation", metadata: { scenario, fixture: true } },
);
await new Promise((resolve) => setTimeout(resolve, 20));
await sdk.getGlobalTraceProvider().forceFlush();
const durationMs = performance.now() - started;
const spans = records.filter((item) => item.kind === "span");
console.log(
  JSON.stringify({
    output: result.finalOutput,
    records,
    hooks,
    flushes,
    durationMs,
    usage: result.state.usage,
    metrics: {
      toolCalls: spans.filter((span) => span.span_data?.type === "function")
        .length,
      toolFailures: spans.filter(
        (span) => span.span_data?.type === "function" && span.error,
      ).length,
      handoffs: spans.filter((span) => span.span_data?.type === "handoff")
        .length,
      latencyMs: durationMs,
    },
    graph: spans.map((span) => ({
      id: span.id,
      parent: span.parent_id,
      type: span.span_data?.type,
      name: span.span_data?.name,
    })),
    estimate: {
      inputTokens: 100,
      outputTokens: 30,
      inputUsdPerMillion: 1,
      outputUsdPerMillion: 4,
      usd: 0.00022,
      label: "Illustrative rates and token counts for teaching. No invoice.",
    },
  }),
);
