import { Agent, Runner, OpenAIProvider } from "@openai/agents";
import { capturedTransport, apiMessage } from "./captured-transport.mjs";

export async function inspectModelSelection(scope) {
  const transport = capturedTransport([
    apiMessage("The model selection was captured locally."),
  ]);
  const provider = new OpenAIProvider({ openAIClient: transport.client });
  const agent = new Agent({
    name: "Model selection tutor",
    instructions: "Explain an agent briefly.",
    ...(scope === "all" ? { model: "gpt-6-astra" } : {}),
  });
  const runner = new Runner({
    tracingDisabled: true,
    modelProvider: provider,
    ...(scope !== "process" ? { model: "gpt-6-sol" } : {}),
  });
  const result = await runner.run(agent, "Explain an AI agent.", {
    maxTurns: 2,
  });
  return {
    resolvedModel: transport.requests[0].model,
    capturedRequest: transport.requests[0],
    agentModel: agent.model || null,
    workflowModel: scope === "process" ? null : "gpt-6-sol",
    processModel: process.env.OPENAI_DEFAULT_MODEL,
    finalOutput: result.finalOutput,
    networkRequests: 0,
  };
}

if (process.argv[2]) {
  const scope = process.argv[2];
  if (!["all", "workflow", "process"].includes(scope))
    throw new Error("Choose a supported model scope.");
  console.log(JSON.stringify(await inspectModelSelection(scope)));
}
