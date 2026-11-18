import {
  sdk,
  scriptedModel,
  message,
  functionCall,
  courseResult,
  selectScenario,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import { createApprovalAgent } from "../../../foundations-runtime/course/approval-agent.mjs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { runJsonProcess } from "../../../foundations-runtime/python-runtime.mjs";

export async function executeApproval(number, input, { signal } = {}) {
  const allowed = {
    121: ["approve", "pause"],
    122: ["low-risk", "high-risk"],
    123: ["approve", "reject"],
    124: ["restore-process", "pause"],
    125: ["nested-tool", "handoff"],
    126: ["approve-both", "mixed-decisions"],
    127: ["pause", "approve", "reject"],
    128: ["valid-on-resume", "revoked", "duplicate-resume"],
  };
  const scenario = selectScenario(input.scenario, allowed[number]);
  const store = openStore();
  let tenant = `review-${randomUUID()}`,
    runId = randomUUID();
  let config = {
    tenant,
    operationId: runId,
    amount: number === 122 && scenario === "high-risk" ? 200 : 50,
    conditional: number === 122,
    multiple: number === 126,
  };
  const evidence = { scenario };
  let output;
  const reviewRecords = [];
  try {
    store.allow(tenant, true);
    let factory = createApprovalAgent(store, config);
    let agent = factory.agent;
    if (number === 125) {
      const child = agent;
      agent = new sdk.Agent({
        name: "Approval manager",
        model: scriptedModel(
          scenario === "handoff"
            ? [functionCall("transfer_review")]
            : [
                functionCall("ask_reviewer", { input: "Update record." }),
                message("Nested approval completed."),
              ],
        ),
        ...(scenario === "handoff"
          ? {
              handoffs: [
                sdk.handoff(child, { toolNameOverride: "transfer_review" }),
              ],
            }
          : {
              tools: [
                child.asTool({
                  toolName: "ask_reviewer",
                  toolDescription: "Ask record reviewer.",
                }),
              ],
            }),
      });
    }
    const runner = new sdk.Runner({ tracingDisabled: true });
    let first;
    if (number === 127 && input.reviewId) {
      const saved = store.getRun(input.reviewId, "review-interface");
      if (!saved) throw new Error("Review state is missing or expired.");
      config = saved.config;
      tenant = config.tenant;
      runId = input.reviewId;
      factory = createApprovalAgent(store, { ...config, phase: "resume" });
      agent = factory.agent;
      first = { state: await sdk.RunState.fromString(agent, saved.snapshot) };
      first.interruptions = first.state.getInterruptions();
    } else
      first = await runner.run(agent, "Prepare the proposed record updates.", {
        signal,
      });
    evidence.executionsBeforeApproval = factory.effects.length;
    evidence.pending = first.interruptions.length;
    const snapshot = first.state.toString();
    store.saveRun(runId, number === 127 ? "review-interface" : tenant, {
      config,
      snapshot,
    });
    evidence.snapshotBytes = Buffer.byteLength(snapshot);
    if (number === 128 && scenario === "revoked") store.allow(tenant, false);
    if (number === 124 && scenario === "restore-process") {
      const child = await runJsonProcess(
        process.execPath,
        [
          fileURLToPath(new URL("../../../foundations-runtime/course/resume-worker.mjs", import.meta.url)),
          store.path,
          tenant,
          runId,
        ],
        { signal },
      );
      Object.assign(evidence, {
        writerPid: process.pid,
        resumerPid: child.pid,
        effects: child.effects,
      });
      output = child.output;
    } else if (
      first.interruptions.length &&
      !(scenario === "pause" || (number === 122 && scenario === "high-risk"))
    ) {
      const pending = first.state.getInterruptions();
      for (const [index, item] of pending.entries()) {
        const approved =
          scenario !== "reject" &&
          !(scenario === "mixed-decisions" && index === 1);
        reviewRecords.push({
          tool: item.rawItem.name,
          arguments: JSON.parse(item.rawItem.arguments),
          approvingIdentity: "teacher-fixture",
          decision: approved ? "approved" : "rejected",
        });
        if (approved) first.state.approve(item);
        else
          first.state.reject(item, {
            message: "Teacher fixture rejected this action.",
          });
      }
      const result = await runner.run(agent, first.state, { signal });
      output = result.finalOutput;
      evidence.effects = factory.effects;
      if (number === 128 && scenario === "duplicate-resume") {
        const duplicateFactory = createApprovalAgent(store, {
          ...config,
          phase: "resume",
        });
        const duplicate = await sdk.RunState.fromString(
          duplicateFactory.agent,
          snapshot,
        );
        for (const item of duplicate.getInterruptions())
          duplicate.approve(item);
        await runner.run(duplicateFactory.agent, duplicate, { signal });
        evidence.duplicateEffects = duplicateFactory.effects;
      }
    } else {
      output = first.interruptions.length
        ? "Paused for review. Proposed actions have not executed."
        : first.finalOutput;
      evidence.effects = factory.effects;
    }
    if (number === 127 && scenario === "pause")
      for (const item of first.interruptions)
        reviewRecords.push({
          tool: item.rawItem.name,
          arguments: JSON.parse(item.rawItem.arguments),
          approvingIdentity: "teacher-fixture",
          decision: "pending",
        });
    evidence.uniqueSideEffects = store.db
      .prepare("SELECT COUNT(*) AS count FROM effects WHERE tenant=?")
      .get(tenant).count;
  } finally {
    store.close();
  }
  return courseResult(
    number,
    output,
    evidence,
    "SDK interruptions preserve proposed calls. Approval resolves the pause, and current authorization plus a transactional idempotency key govern execution.",
    { reviewRecords, reviewId: number === 127 ? runId : undefined },
  );
}
