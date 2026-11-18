import { executeWorkflow } from "../../../foundations-runtime/course/workflows.mjs";
import { executeSession } from "../../../foundations-runtime/course/sessions.mjs";
import { executeGuardrail } from "../../../foundations-runtime/course/guardrails.mjs";
import { executeApproval } from "../../../foundations-runtime/course/approvals.mjs";
import { executeSandbox, sandboxScenarios } from "../../../foundations-runtime/course/sandboxes.mjs";
import { executeTracing, tracingScenarios } from "../../../foundations-runtime/course/tracing.mjs";
import { executeRealtime, realtimeScenarios } from "../../../foundations-runtime/course/realtime.mjs";
import { executeVoice, voiceScenarios } from "../../../foundations-runtime/course/voice.mjs";
import { executeEvaluation, evaluationScenarios } from "../../../foundations-runtime/course/evaluation.mjs";
import { executeReliability, reliabilityScenarios } from "../../../foundations-runtime/course/reliability.mjs";
import { executeAdvanced, advancedScenarios } from "../../../foundations-runtime/course/advanced.mjs";
import { executeProject, projectScenarios } from "./projects.mjs";
import { executeLiveDelegation } from "../../../foundations-runtime/course/gpt-live.mjs";

export const courseScenarios = {
  95: ["authorized", "disabled"],
  96: ["last-specialist", "restart-triage"],
  97: ["combine", "one-specialist"],
  98: ["valid", "invalid"],
  99: ["valid-contracts", "reject-invalid"],
  100: ["all-success", "partial-failure"],
  101: ["known-rule", "model-fallback"],
  102: ["execute-plan", "reject-plan"],
  103: ["converge", "iteration-limit"],
  104: ["complete", "recover"],
  105: ["same-session", "new-session"],
  106: ["restart-persistent", "new-memory"],
  107: ["correct", "clear"],
  108: ["concurrent-appends", "tenant-isolation"],
  109: ["conversation", "response-chain", "combined-settings"],
  110: ["compact-context", "full-context"],
  111: ["approved-fact", "correct-fact", "delete-fact", "unapproved"],
  112: ["retain-pairs", "remove-pairs"],
  113: ["accepted", "rejected"],
  114: ["accepted", "rejected"],
  115: ["accepted", "rejected"],
  116: ["accepted", "rejected"],
  117: ["accepted", "rejected"],
  118: ["parallel-blocked", "blocking-blocked"],
  119: ["handoff", "nested-tool"],
  120: ["accepted", "rejected"],
  121: ["approve", "pause"],
  122: ["low-risk", "high-risk"],
  123: ["approve", "reject"],
  124: ["restore-process", "pause"],
  125: ["nested-tool", "handoff"],
  126: ["approve-both", "mixed-decisions"],
  127: ["pause", "approve", "reject"],
  128: ["valid-on-resume", "revoked", "duplicate-resume"],
  ...sandboxScenarios,
  ...tracingScenarios,
  ...realtimeScenarios,
  ...voiceScenarios,
  ...evaluationScenarios,
  ...reliabilityScenarios,
  ...advancedScenarios,
  ...projectScenarios,
};
export function courseModule(number) {
  for (const [end, module] of [
    [104, "workflows"],
    [112, "sessions"],
    [120, "guardrails"],
    [128, "approvals"],
    [144, "sandboxes"],
    [152, "tracing"],
    [160, "realtime"],
    [165, "voice"],
    [168, "realtime"],
    [176, "evaluation"],
    [184, "reliability"],
    [192, "advanced"],
    [200, "projects"],
  ])
    if (number <= end) return module;
  throw new Error("Course prompt out of range");
}
export async function executeCourse(number, input, options) {
  if (number === 166) return executeLiveDelegation(input, options);
  input = { ...input, scenario: input.scenario ?? courseScenarios[number][0] };
  const handlers = {
    workflows: executeWorkflow,
    sessions: executeSession,
    guardrails: executeGuardrail,
    approvals: executeApproval,
    sandboxes: executeSandbox,
    tracing: executeTracing,
    realtime: executeRealtime,
    voice: executeVoice,
    evaluation: executeEvaluation,
    reliability: executeReliability,
    advanced: executeAdvanced,
    projects: executeProject,
  };
  return handlers[courseModule(number)](number, input, options);
}
