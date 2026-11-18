import { clarificationInstructions } from "../../public/definitions.js";

export function createClarifyingAgent({ Agent, model }) {
  return new Agent({
    name: "Clarifying workshop planner",
    model,
    instructions: clarificationInstructions,
  });
}
