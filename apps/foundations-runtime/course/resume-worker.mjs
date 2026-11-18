import { sdk } from "./common.mjs";
import { openStore } from "./storage.mjs";
import { createApprovalAgent } from "./approval-agent.mjs";

const [path, tenant, runId] = process.argv.slice(2);
const store = openStore(path);
try {
  const saved = store.getRun(runId, tenant);
  if (!saved) throw new Error("Paused state not found for tenant.");
  const factory = createApprovalAgent(store, {
    ...saved.config,
    phase: "resume",
  });
  const state = await sdk.RunState.fromString(factory.agent, saved.snapshot);
  for (const item of state.getInterruptions()) state.approve(item);
  const result = await new sdk.Runner({ tracingDisabled: true }).run(
    factory.agent,
    state,
  );
  console.log(
    JSON.stringify({
      pid: process.pid,
      output: result.finalOutput,
      effects: factory.effects,
    }),
  );
} finally {
  store.close();
}
