import { fixtureDirectory } from "../lib/demo.mjs";

export async function execute({ env, signal, emit, task }, dependencies = {}) {
  const { Codex } = dependencies.codex ?? (await import("@openai/codex-sdk"));
  const codex = new Codex();
  const workspace = fixtureDirectory;
  emit({ type: "step", index: 0 });
  emit({ type: "step", index: 1 });
  // teaching-start
  const thread = codex.startThread({
    workingDirectory: workspace,
    sandboxMode: "read-only",
    skipGitRepoCheck: true,
    approvalPolicy: "never",
    model: env.CODEX_MODEL || undefined,
  });
  const turn = await thread.run(task, { signal });
  const text = turn.finalResponse;
  // teaching-end
  const commands = turn.items
    .filter((item) => item.type === "command_execution")
    .map((item) => item.command);
  if (commands.length) emit({ type: "step", index: 2 });
  emit({ type: "step", index: 3 });
  if (!text) throw new Error("The Codex thread returned no final response.");
  return {
    text,
    evidenceTitle: "Actual Codex thread",
    evidence: JSON.stringify(
      {
        threadId: thread.id,
        workspace: "fixtures/robotics-club",
        sandboxMode: "read-only",
        commands,
      },
      null,
      2,
    ),
  };
}
