import {
  ScriptedModel,
  assistantMessage,
  functionCall as testCall,
} from "@openai/agents/testing";
import { sdk, z, courseResult, selectScenario } from "./common.mjs";
import { executeWorkflow } from "../../../foundations-runtime/course/workflows.mjs";
import { executeApproval } from "../../../foundations-runtime/course/approvals.mjs";
import { executeGuardrail } from "../../../foundations-runtime/course/guardrails.mjs";
import { executeSandbox } from "../../../foundations-runtime/course/sandboxes.mjs";
import { executeRealtime } from "../../../foundations-runtime/course/realtime.mjs";
import { saveArtifact } from "../../../foundations-runtime/artifacts.mjs";
import assert from "node:assert/strict";

export const evaluationScenarios = {
  169: ["pass", "extra-call"],
  170: ["valid", "invalid"],
  171: ["billing", "technical"],
  172: ["approved", "rejected"],
  173: ["sandbox", "realtime", "guardrail"],
  174: ["baseline", "regression"],
  175: ["passing-trace", "failing-trace"],
  176: ["v1", "v2"],
};
export const evaluationDataset = [
  { id: "bill-1", text: "I was charged twice", expected: "billing" },
  { id: "tech-1", text: "The app crashes", expected: "technical" },
  { id: "bill-2", text: "Refund my invoice", expected: "billing" },
  { id: "tech-2", text: "Upload produces an error", expected: "technical" },
  { id: "ambiguous", text: "My account has a problem", expected: "clarify" },
  { id: "missing", text: "", expected: "clarify" },
  { id: "mixed", text: "Charged twice and app crashes", expected: "clarify" },
  { id: "failure", text: "Provider unavailable", expected: "error" },
];
export function classify(text, version = "v2") {
  if (/unavailable/i.test(text)) return "error";
  if (!text || /account/i.test(text)) return "clarify";
  if (/charged/i.test(text) && /crash/i.test(text))
    return version === "v1" ? "billing" : "clarify";
  return /charged|invoice|refund/i.test(text) &&
    !(version === "v1" && /refund/i.test(text))
    ? "billing"
    : "technical";
}
export async function executeEvaluation(number, input, options = {}) {
  const scenario = selectScenario(input.scenario, evaluationScenarios[number]);
  const checks = [];
  const evidence = { scenario };
  const check = async (name, action) => {
    try {
      await action();
      checks.push({ name, passed: true });
    } catch (error) {
      checks.push({ name, passed: false, error: error.message });
    }
  };
  if (number === 169) {
    const model = new ScriptedModel([[assistantMessage("Hello classroom.")]]);
    const agent = new sdk.Agent({ name: "Test agent", model });
    await new sdk.Runner({ tracingDisabled: true }).run(agent, "Hello");
    await check("one model call", () => assert.equal(model.calls.length, 1));
    await check("script consumed", () => model.assertComplete());
    if (scenario === "extra-call")
      await check("unexpected call detected", async () => {
        await assert.rejects(() =>
          new sdk.Runner({ tracingDisabled: true }).run(agent, "Again"),
        );
      });
    evidence.calls = model.calls.length;
  }
  if (number === 170) {
    let executed = 0;
    const tool = sdk.tool({
      name: "multiply",
      parameters: z.object({ a: z.number(), b: z.number() }),
      execute: ({ a, b }) => {
        executed++;
        return a * b;
      },
    });
    const context = new sdk.RunContext();
    if (scenario === "valid") {
      const value = await tool.invoke(context, '{"a":6,"b":7}');
      await check("multiplication", () => assert.equal(String(value), "42"));
    } else
      await check("schema blocks invalid input", () =>
        assert.rejects(() => tool.invoke(context, '{"a":"bad","b":7}')),
      );
    evidence.executions = executed;
  }
  if (number === 171) {
    const route = scenario === "billing" ? "known-rule" : "model-fallback";
    const result = await executeWorkflow(101, { scenario: route }, options);
    await check("correct specialist", () =>
      assert.equal(result.evidence.selected, scenario),
    );
    evidence.routing = result.evidence;
  }
  if (number === 172) {
    const result = await executeApproval(
      123,
      { scenario: scenario === "approved" ? "approve" : "reject" },
      options,
    );
    await check("side effects match decision", () =>
      assert.equal(
        result.evidence.uniqueSideEffects,
        scenario === "approved" ? 1 : 0,
      ),
    );
    evidence.approval = result.evidence;
  }
  if (number === 173) {
    const result =
      scenario === "sandbox"
        ? await executeSandbox(134, { scenario: "denied" }, options)
        : scenario === "realtime"
          ? await executeRealtime(156, { scenario: "interrupt" }, options)
          : await executeGuardrail(120, { scenario: "rejected" }, options);
    await check("fixture completed", () => assert.ok(result.output));
    evidence.component = result.evidence;
  }
  if ([174, 176].includes(number)) {
    const version =
      number === 176 ? scenario : scenario === "regression" ? "v1" : "v2";
    evidence.rows = [];
    for (const row of evaluationDataset) {
      const started = performance.now();
      const actual = classify(row.text, version);
      evidence.rows.push({
        ...row,
        actual,
        passed: actual === row.expected,
        latencyMs: performance.now() - started,
        providerCostUsd: 0,
      });
    }
    evidence.accuracy =
      evidence.rows.filter((row) => row.passed).length / evidence.rows.length;
    evidence.version = version;
    evidence.failureRate = 1 - evidence.accuracy;
    evidence.measuredLatencyMs = evidence.rows.reduce(
      (sum, row) => sum + row.latencyMs,
      0,
    );
    evidence.costExplanation =
      "Local classifier fixture has no provider charge. Supply live usage and actual rates for a paid-model comparison.";
    checks.push({ name: "all routing cases", passed: evidence.accuracy === 1 });
  }
  if (number === 175) {
    const trace = {
      route: "billing",
      toolCalls: scenario === "failing-trace" ? 2 : 1,
      approval: true,
      effects: scenario === "failing-trace" ? 2 : 1,
    };
    await check("one authorized write", () => {
      assert.equal(trace.toolCalls, 1);
      assert.equal(trace.effects, 1);
      assert.equal(trace.approval, true);
    });
    evidence.trace = trace;
    evidence.fixture = true;
  }
  evidence.checks = checks;
  evidence.passed = checks.every((row) => row.passed);
  const artifacts = [
    await saveArtifact(
      JSON.stringify(evidence, null, 2),
      "json",
      "Evaluation results",
    ),
  ];
  return courseResult(
    number,
    checks
      .map((row) => `${row.passed ? "PASS" : "FAIL"} ${row.name}`)
      .join("\n"),
    evidence,
    "Assertions inspect SDK executions and versioned fixtures. A failing comparison remains visible in the report.",
    { artifacts },
  );
}
