import { courseResult, selectScenario } from "./common.mjs";
import { runJsonProcess } from "../../../foundations-runtime/python-runtime.mjs";
import { fileURLToPath } from "node:url";
import { saveArtifact } from "../../../foundations-runtime/artifacts.mjs";
export const tracingScenarios = {
  145: ["trace", "inspect"],
  146: ["grouped", "inspect"],
  147: ["custom-span", "inspect"],
  148: ["run-hooks", "inspect"],
  149: ["agent-hooks", "inspect"],
  150: ["redact", "include-fixture"],
  151: ["metrics", "estimate"],
  152: ["graph", "export"],
};
export async function executeTracing(number, input, { signal } = {}) {
  const scenario = selectScenario(input.scenario, tracingScenarios[number]);
  const evidence = await runJsonProcess(
    process.execPath,
    [
      fileURLToPath(new URL("./trace-worker.mjs", import.meta.url)),
      String(number),
      scenario,
    ],
    { signal },
  );
  const artifacts =
    number === 152
      ? [
          await saveArtifact(
            JSON.stringify(evidence.graph, null, 2),
            "json",
            "Trace graph",
          ),
        ]
      : [];
  return courseResult(
    number,
    evidence.output,
    evidence,
    "A dedicated process captures actual SDK traces and hooks in a local processor. Classroom model responses are scripted.",
    { artifacts },
  );
}
