import { z } from "zod";
import { productSchema } from "./product-agent.ts";
export { productSchema };

export const nestedSchema = z.object({
  customer: z.object({ name: z.string() }),
  items: z.array(z.object({ name: z.string(), quantity: z.number() })),
  priority: z.enum(["low", "high"]),
  note: z.string().nullable(),
});
export const orderSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  quantity: z.number(),
  evidenceIds: z.array(z.string()),
});

export function nestedFixture(scenario = "null-note") {
  const value = {
    customer: { name: "Ada" },
    items: [{ name: "Robotics kit", quantity: 2 }],
    priority: "high",
    note: null,
  };
  if (scenario === "with-note") value.note = "For the school workshop.";
  if (scenario === "invalid-enum") value.priority = "urgent";
  if (scenario === "missing-name") delete value.customer.name;
  if (
    !["null-note", "with-note", "invalid-enum", "missing-name"].includes(
      scenario,
    )
  )
    throw new Error("Choose a listed nested schema scenario.");
  return value;
}

export function createStructuredAgent({
  Agent,
  model,
  outputType = productSchema,
}) {
  return new Agent({
    name: "Classroom extractor",
    model,
    instructions:
      "Extract the requested data faithfully using the configured output schema.",
    outputType,
  });
}
