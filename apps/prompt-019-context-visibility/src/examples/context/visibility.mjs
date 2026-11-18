export function createVisibilityAgent({ sdk, z, model, visibility, state }) {
  const preferenceTool = sdk.tool({
    name: "read_preferences",
    description: "Return the selected safe teaching preferences.",
    parameters: z.object({}),
    execute: async (_, runContext) => {
      const { user, preferences } = runContext.context;
      state.value = {
        displayName: user.displayName,
        language: preferences.language,
      };
      return state.value;
    },
  });
  return new sdk.Agent({
    name: "Visibility inspector",
    model,
    instructions:
      visibility === "instructions"
        ? (runContext) =>
            `Teach ${runContext.context.user.displayName} in ${runContext.context.preferences.language}. Explain an agent briefly.`
        : "Explain an AI agent briefly. Use read_preferences when the tool is available.",
    tools: visibility === "tool" ? [preferenceTool] : [],
  });
}
