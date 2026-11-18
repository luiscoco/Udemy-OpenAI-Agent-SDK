import { Agent, type Model } from "@openai/agents";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;

// Node 24 executes this TypeScript module using built-in type stripping.
export function createProductAgent(model: string | Model) {
  return new Agent({
    name: "TypeScript product extractor",
    model,
    instructions:
      "Extract the requested product faithfully using the configured output schema.",
    outputType: productSchema,
  });
}
