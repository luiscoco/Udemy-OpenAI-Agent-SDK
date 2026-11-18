import * as sdk from "@openai/agents";
import { executeProject } from "./projects.mjs";

const traces = [];
sdk.setTraceProcessors([
  {
    async onTraceStart(trace) {
      traces.push({ kind: "trace", ...trace.toJSON() });
    },
    async onTraceEnd() {},
    async onSpanStart() {},
    async onSpanEnd(span) {
      traces.push({ kind: "span", ...span.toJSON() });
    },
    async forceFlush() {},
    async shutdown() {},
  },
]);
const result = await executeProject(
  193,
  { scenario: process.argv[2] ?? "order" },
  { captureTrace: true },
);
await sdk.getGlobalTraceProvider().forceFlush();
result.evidence.traces = traces;
console.log(JSON.stringify(result));
