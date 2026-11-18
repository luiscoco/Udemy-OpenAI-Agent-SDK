import { lookupOrder } from "../lib/demo.mjs";

export async function execute({ env, signal, emit, task }, dependencies = {}) {
  const { Agent, run, tool } =
    dependencies.agents ?? (await import("@openai/agents"));
  const { z } = dependencies.zod ?? (await import("zod"));
  let toolResult;
  const lookup = tool({
    name: "lookup_order",
    description:
      "Read the classroom sample order. The available order ID is 1042.",
    parameters: z.object({ orderId: z.string() }),
    async execute({ orderId }) {
      signal.throwIfAborted();
      toolResult = lookupOrder(orderId);
      emit({
        type: "step",
        index: 2,
        detail: `Your lookup_order tool returned ${JSON.stringify(toolResult)}.`,
      });
      return JSON.stringify(toolResult);
    },
  });
  const model = env.OPENAI_MODEL || "gpt-6-astra";
  emit({ type: "step", index: 0 });
  emit({ type: "step", index: 1 });
  // teaching-start
  const agent = new Agent({
    name: "Classroom support",
    model,
    instructions:
      "Use lookup_order to check the order. Explain its actual result briefly.",
    tools: [lookup],
  });
  const result = await run(agent, task, { signal, maxTurns: 5 });
  const text = result.finalOutput;
  // teaching-end
  emit({ type: "step", index: 3 });
  if (!text) throw new Error("The agent returned no final text.");
  return {
    text: String(text),
    evidenceTitle: "Actual tool result",
    evidence: toolResult
      ? JSON.stringify(toolResult, null, 2)
      : "The model completed without invoking lookup_order.",
  };
}
