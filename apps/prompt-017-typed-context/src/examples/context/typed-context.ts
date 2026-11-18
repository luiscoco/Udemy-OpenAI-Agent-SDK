import { z } from "zod";
import { Agent, RunContext } from "@openai/agents";

export const contextSchema = z.object({
  user: z.object({ id: z.string().min(1), displayName: z.string().min(1) }),
  tenant: z.object({ id: z.string().min(1) }),
  preferences: z.object({
    language: z.enum(["English", "Spanish"]),
    timezone: z.enum(["Europe/Madrid", "America/New_York"]),
    detail: z.enum(["brief", "detailed"]),
  }),
  request: z.object({ id: z.string().min(1), source: z.literal("classroom") }),
});

export type AppContext = z.infer<typeof contextSchema>;

export function parseContext(value: unknown): AppContext {
  return contextSchema.parse(value);
}

export function createTypedTutor(model: string) {
  return new Agent<AppContext>({
    name: "Context-aware tutor",
    model,
    instructions: (runContext: RunContext<AppContext>) =>
      `Teach ${runContext.context.user.displayName} in ${runContext.context.preferences.language}.`,
  });
}
