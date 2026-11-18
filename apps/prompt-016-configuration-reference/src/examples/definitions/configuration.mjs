import { dynamicInstructions } from "../../public/definitions.js";

export const configurationCategories = {
  identity: {
    fields: ["name", "instructions"],
    explanation: "Give the agent an identifier and task instructions.",
  },
  model: {
    fields: ["model", "modelSettings"],
    explanation:
      "Choose the model and supported model settings. Setting availability depends on the model.",
  },
  capabilities: {
    fields: ["tools", "mcpServers", "mcpConfig"],
    explanation:
      "Register function tools and MCP connections. This local example has no connected MCP servers.",
  },
  routing: {
    fields: [
      "handoffs",
      "handoffDescription",
      "handoffOutputTypeWarningEnabled",
    ],
    explanation:
      "Configure specialist handoffs and their description. Construction alone performs no routing.",
  },
  validation: {
    fields: ["outputType", "inputGuardrails", "outputGuardrails"],
    explanation:
      "Configure a structured result schema and guardrail callbacks. A run executes guardrails and model output validation.",
  },
  prompt: {
    fields: ["prompt"],
    explanation:
      "Inspect the legacy stored-prompt reference. Hosted prompt objects are deprecated, with shutdown scheduled for November 30, 2026.",
  },
  context: {
    fields: ["instructions"],
    explanation:
      "The instructions callback reads per-run context. Resolve it with a RunContext or supply context to the runner.",
  },
  behavior: {
    fields: ["toolUseBehavior", "resetToolChoice"],
    explanation:
      "Choose how the runner handles function-tool output and subsequent tool choice.",
  },
  run: {
    fields: [],
    explanation:
      "maxTurns and context belong to runner.run options. They are execution settings.",
  },
};

export function configurationExample({ sdk, z, model, category }) {
  const base = { name: "Configuration explorer", model };
  // example:identity
  if (category === "identity")
    return new sdk.Agent({
      ...base,
      instructions: "Explain one AI concept clearly.",
    });
  // end-example
  // example:model
  if (category === "model")
    return new sdk.Agent({ ...base, modelSettings: { text: { verbosity: "low" } } });
  // end-example
  // example:capabilities
  if (category === "capabilities") {
    const getFact = sdk.tool({
      name: "get_fact",
      description: "Return a classroom fact.",
      parameters: z.object({}),
      execute: async () => "An agent can call tools.",
    });
    return new sdk.Agent({
      ...base,
      tools: [getFact],
      mcpServers: [],
      mcpConfig: {
        convertSchemasToStrict: true,
        includeServerInToolNames: true,
      },
    });
  }
  // end-example
  // example:routing
  if (category === "routing") {
    const specialist = new sdk.Agent({
      name: "SQL tutor",
      model,
      instructions: "Teach SQL.",
    });
    return new sdk.Agent({
      ...base,
      handoffs: [specialist],
      handoffDescription: "Route beginner questions.",
      handoffOutputTypeWarningEnabled: false,
    });
  }
  // end-example
  // example:validation
  if (category === "validation") {
    const classroomCheck = {
      name: "Classroom check",
      execute: async () => ({
        tripwireTriggered: false,
        outputInfo: "Illustrative callback result",
      }),
    };
    return new sdk.Agent({
      ...base,
      outputType: z.object({ category: z.enum(["billing", "technical"]) }),
      inputGuardrails: [classroomCheck],
      outputGuardrails: [classroomCheck],
    });
  }
  // end-example
  // example:prompt
  if (category === "prompt")
    return new sdk.Agent({
      ...base,
      prompt: {
        promptId: "pmpt_CLASSROOM_FIXTURE",
        version: "1",
        variables: { language: "English" },
      },
    });
  // end-example
  // example:context
  if (category === "context")
    return new sdk.Agent({ ...base, instructions: dynamicInstructions });
  // end-example
  // example:behavior
  if (category === "behavior")
    return new sdk.Agent({
      ...base,
      toolUseBehavior: "run_llm_again",
      resetToolChoice: true,
    });
  // end-example
  // example:run
  if (category === "run")
    return {
      agent: new sdk.Agent(base),
      runOptions: { maxTurns: 3, context: { language: "English" } },
    };
  // end-example
  throw new Error("Choose a listed configuration category.");
}
