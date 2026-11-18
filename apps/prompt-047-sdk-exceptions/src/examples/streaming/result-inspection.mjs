export function summarizeItem(item) {
  return {
    type: item.type,
    agent: item.agent?.name ?? null,
    ...(item.sourceAgent ? { fromAgent: item.sourceAgent.name } : {}),
    ...(item.targetAgent ? { toAgent: item.targetAgent.name } : {}),
    rawItem: item.rawItem ?? null,
    ...(item.output !== undefined ? { output: item.output } : {}),
  };
}

export function applicationError(error, sdk) {
  if (error instanceof sdk.UserError)
    return {
      code: "CONFIGURATION",
      message: "Check the agent configuration before running again.",
      sdkType: error.name,
    };
  if (error instanceof sdk.ModelTimeoutError)
    return {
      code: "MODEL_TIMEOUT",
      message:
        "The model call exceeded its timeout. Inspect completed work before retrying.",
      sdkType: error.name,
      timeoutMs: error.timeoutMs,
    };
  if (error instanceof sdk.MaxTurnsExceededError)
    return {
      code: "TURN_LIMIT",
      message:
        "The model-turn budget ended before a final answer. Inspect completed tools and adjust the budget.",
      sdkType: error.name,
    };
  if (error instanceof sdk.ModelBehaviorError)
    return {
      code: "MODEL_OUTPUT",
      message:
        "The model returned output that failed the application contract.",
      sdkType: error.name,
    };
  throw error;
}

export function summarizeStreamEvent(event, activeAgent) {
  if (event.type === "raw_model_stream_event")
    return {
      kind: event.type,
      event: event.data.type,
      ...(event.data.type === "output_text_delta"
        ? { delta: event.data.delta }
        : {}),
      agent: activeAgent,
    };
  if (event.type === "agent_updated_stream_event")
    return {
      kind: event.type,
      event: "agent_changed",
      agent: event.agent.name,
    };
  return {
    kind: event.type,
    event: event.name,
    agent:
      event.item?.agent?.name ?? event.item?.targetAgent?.name ?? activeAgent,
    itemType: event.item?.type,
    ...(event.item?.sourceAgent
      ? {
          fromAgent: event.item.sourceAgent.name,
          toAgent: event.item.targetAgent.name,
        }
      : {}),
  };
}
