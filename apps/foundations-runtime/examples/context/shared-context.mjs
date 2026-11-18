export function createSharedAgents({
  sdk,
  z,
  model,
  childModel,
  pattern,
  makeRunner,
  state,
}) {
  const addNote = sdk.tool({
    name: "add_note",
    description: "Add the classroom note to this run's notes.",
    parameters: z.object({}),
    execute: async (_, runContext) => {
      runContext.context.notes.push("Prepared classroom note.");
      state.childNotes = [...runContext.context.notes];
      return "Note added.";
    },
  });
  const specialist = new sdk.Agent({
    name: "Notes specialist",
    model: childModel ?? model,
    instructions: "Use add_note once, then briefly confirm completion.",
    tools: [addNote],
  });
  if (pattern === "handoff") {
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_notes",
      onHandoff: (runContext) => {
        state.handoffSharesContext = runContext.context === state.parentContext;
      },
    });
    return new sdk.Agent({
      name: "Notes router",
      model,
      instructions: "Transfer to transfer_notes to add the note.",
      handoffs: [transfer],
    });
  }
  const delegate = sdk.tool({
    name: "delegate_notes",
    description: "Ask the notes specialist to add the classroom note.",
    parameters: z.object({}),
    errorFunction: null,
    execute: async (_, runContext, details) => {
      const childContext =
        pattern === "nested-copy"
          ? structuredClone(runContext.context)
          : runContext.context;
      state.nestedSharesContext = childContext === runContext.context;
      const result = await makeRunner().run(
        specialist,
        "Add the classroom note.",
        {
          context: childContext,
          signal: details?.signal,
          maxTurns: 3,
        },
      );
      if (!result.finalOutput || result.interruptions?.length)
        throw new Error("The nested run did not complete.");
      return result.finalOutput;
    },
  });
  return new sdk.Agent({
    name: "Notes manager",
    model,
    instructions: "Use delegate_notes once, then confirm the result.",
    tools: [delegate],
  });
}
