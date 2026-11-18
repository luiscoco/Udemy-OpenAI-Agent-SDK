import { designInstructions } from "../../public/definitions.js";

export function createPlanningAgent({ Agent, input, model }) {
  const { instructions } = designInstructions(input);
  return new Agent({ name: "Workshop planner", model, instructions });
}
