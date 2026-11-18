import { exampleInstructions } from "../../public/definitions.js";

export function createTicketAgents({ Agent, model }) {
  const before = new Agent({
    name: "Triage before examples",
    model,
    instructions: exampleInstructions(false),
  });
  const after = new Agent({
    name: "Triage with three examples",
    model,
    instructions: exampleInstructions(true),
  });
  return { before, after };
}
