import { tool } from "@openai/agents";
import { z } from "zod";

export function createCalculator(observe: (value: unknown) => void) {
  return tool({
    name: "calculate",
    description:
      "Add, subtract, multiply, or divide two finite numbers. Use this for arithmetic calculations.",
    parameters: z.object({
      operation: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("The arithmetic operation to perform."),
      left: z.number().finite().describe("The first operand."),
      right: z
        .number()
        .finite()
        .describe("The second operand. Division requires a nonzero value."),
    }),
    errorFunction: () =>
      JSON.stringify({
        ok: false,
        code: "INVALID_CALCULATION",
        message: "Use finite numbers and a nonzero divisor.",
      }),
    execute: async ({ operation, left, right }) => {
      if (operation === "divide" && right === 0)
        throw new Error("Division by zero.");
      const operations = {
        add: () => left + right,
        subtract: () => left - right,
        multiply: () => left * right,
        divide: () => left / right,
      };
      const value = operations[operation]();
      if (!Number.isFinite(value))
        throw new Error("The arithmetic result is not finite.");
      const result = { ok: true, operation, left, right, value };
      observe(result);
      return result;
    },
  });
}
