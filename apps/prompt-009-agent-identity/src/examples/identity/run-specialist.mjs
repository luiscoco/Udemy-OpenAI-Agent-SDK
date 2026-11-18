import { loadConfig } from "../../../../foundations-runtime/examples/organized/config.mjs";
import { createSpecialistAgent } from "./specialist-agent.mjs";

export async function runSpecialist({ input, env, signal, dependencies }) {
  const config = loadConfig(env);
  const sdk = dependencies ?? (await import("@openai/agents"));
  const OpenAI = dependencies?.OpenAI ?? (await import("openai")).default;
  const { agent, identity } = createSpecialistAgent({
    ...sdk,
    input,
    model: config.model,
  });
  const question = input.question ?? identity.question;
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.trim().length > 1000
  ) {
    throw new Error("Enter a question between 1 and 1,000 characters.");
  }
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
  const provider = new sdk.OpenAIProvider({ openAIClient: client });
  const runner = new sdk.Runner({
    modelProvider: provider,
    tracingDisabled: true,
  });
  const result = await runner.run(agent, question.trim(), {
    signal,
    maxTurns: 3,
  });
  if (typeof result.finalOutput !== "string" || !result.finalOutput.trim()) {
    throw new Error("The specialist returned no completed text answer.");
  }
  if (result.interruptions?.length)
    throw new Error("The specialist run paused before completion.");
  return { identity, result, question: question.trim() };
}
