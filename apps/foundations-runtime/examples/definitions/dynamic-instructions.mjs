import { dynamicInstructions } from "../../public/definitions.js";

export function createDynamicAgent({ Agent, model }) {
  return new Agent({
    name: "Personal tutor",
    model,
    instructions: dynamicInstructions,
  });
}

// The runner creates RunContext from this per-request context object.
export async function resolveDynamicInstructions({ sdk, agent, context }) {
  return agent.getSystemPrompt(new sdk.RunContext(context));
}
