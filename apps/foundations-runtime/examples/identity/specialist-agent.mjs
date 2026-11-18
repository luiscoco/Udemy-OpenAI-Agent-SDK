import { buildIdentity } from "../../public/identity.js";

export function createSpecialistAgent({ Agent, input, model }) {
  const identity = buildIdentity(input);
  const agent = new Agent({
    name: identity.name,
    instructions: identity.instructions,
    model,
    tools: [],
  });
  return { agent, identity };
}
