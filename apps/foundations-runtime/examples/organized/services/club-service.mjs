import { loadConfig } from "../config.mjs";
import { createClubAgent } from "../agents/club-agent.mjs";

export async function askClub({ activity, env, signal, onTool, dependencies }) {
  const config = loadConfig(env);
  const sdk = dependencies ?? (await import("@openai/agents"));
  const { z } = dependencies ?? (await import("zod"));
  const OpenAI = dependencies?.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
  const provider = new sdk.OpenAIProvider({ openAIClient: client });
  const agent = createClubAgent({ ...sdk, z, model: config.model, onTool });
  const runner = new sdk.Runner({
    modelProvider: provider,
    tracingDisabled: true,
  });
  const result = await runner.run(
    agent,
    `When and where is ${activity} club?`,
    { signal, maxTurns: 4 },
  );
  if (result.finalOutput === undefined)
    throw new Error("The run returned no final answer.");
  return result;
}
