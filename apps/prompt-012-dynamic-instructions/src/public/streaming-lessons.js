const field = (key, label, options) => ({ key, label, options });
export const streamingControls = {
  45: [
    field("itemView", "Inspect run items", [
      ["all", "All run items"],
      ["tools", "Tool calls and outputs"],
      ["handoffs", "Handoff records"],
    ]),
  ],
  46: [
    field("usageScope", "Usage scope", [
      ["nested", "Parent run and nested specialist"],
      ["single", "One direct run"],
    ]),
  ],
  47: [
    field("exceptionCase", "Failure to reproduce", [
      ["configuration", "Invalid agent configuration"],
      ["model", "Invalid structured model output"],
      ["timeout", "Cooperative model timeout"],
      ["turn-limit", "Model-turn limit"],
    ]),
  ],
  48: [
    field("historyPolicy", "Second-turn input", [
      ["carry", "Carry replay-ready history"],
      ["omit", "Send only the new question"],
    ]),
  ],
  49: [
    field("streamSpeed", "Chunk pacing", [
      ["normal", "Normal classroom pace"],
      ["slow", "Slow classroom pace"],
    ]),
  ],
  50: [
    field("eventView", "Event category", [
      ["both", "Raw and higher-level events"],
      ["raw", "Raw model events"],
      ["sdk", "Higher-level SDK events"],
    ]),
  ],
  51: [
    field("streamSpecialist", "Handoff destination", [
      ["robotics", "Robotics tutor"],
      ["astronomy", "Astronomy tutor"],
    ]),
  ],
  52: [
    field("toolOutcome", "Tool execution", [
      ["success", "Tool completes"],
      ["failure", "Tool throws an error"],
    ]),
  ],
  53: [
    field("completionCase", "Stream outcome", [
      ["success", "Stream completes"],
      ["failure", "Model fails after partial text"],
    ]),
  ],
  54: [
    field("cancelPoint", "Cancellation policy", [
      ["first", "Cancel after the first text chunk"],
      ["third", "Cancel after three text chunks"],
      ["finish", "Let the stream complete"],
    ]),
  ],
};
export const streamingHints = {
  45: "Inspect actual RunResult.newItems and their associated agents. Tool and handoff records come from the SDK execution.",
  46: "Token reports are synthetic classroom fixtures. The parent and nested runs have separate SDK contexts. Aggregate each response once and compare with the separate run totals.",
  47: "Reproduce actual installed-SDK errors and map their classes to useful application messages. The timeout model cooperates with the SDK abort signal.",
  48: "The second run receives result.history plus a new user message. Compare it with a fresh question that lacks the earlier workshop city.",
  49: "Actual SDK text deltas reach this page during execution. Run npm run terminal:49 in the apps folder to observe incremental terminal output.",
  50: "Raw events describe model text and completion. Higher-level SDK events describe agents, items, tools, and handoffs. Change the display filter while executing the same workflow.",
  51: "Watch agent_updated_stream_event and the SDK handoff events as control moves to the selected specialist.",
  52: "Tool start and end use supported Runner lifecycle hooks. The tool wrapper reports its own failure because this installed runner has no tool-failure hook.",
  53: "The application awaits stream.completed, checks the outcome, then reads final output and usage and saves an in-memory state snapshot. Failed partial text remains unconsumed.",
  54: "An AbortController signal cancels the actual SDK stream. The application awaits stream settlement and model-generator cleanup before closing its owned resource.",
};
export function streamingPreview(number, input) {
  if (number === 45)
    return "RunResult.newItems → item.type, item.agent, item.rawItem\nMessages · tool calls · tool outputs · handoff records";
  if (number === 46)
    return "Parent SDK usage + separate nested SDK usage\nCount each observed response once\nAll token amounts are fixture reports.";
  if (number === 47)
    return "UserError → configuration\nModelBehaviorError → invalid output\nModelTimeoutError → per-call deadline\nMaxTurnsExceededError → run budget";
  if (number === 48)
    return "Turn 1: The workshop is in Madrid.\nTurn 2: Which country hosts our workshop?\nrunner.run(agent, [...first.history, newMessage])";
  if (number === 49)
    return "const stream = await runner.run(agent, input, {stream:true});\nfor await (const delta of stream.toTextStream()) process.stdout.write(delta);\nawait stream.completed;";
  if (number === 50)
    return "raw_model_stream_event\nrun_item_stream_event\nagent_updated_stream_event";
  if (number === 51)
    return `Coordinator → ${input.streamSpecialist === "astronomy" ? "Astronomy tutor" : "Robotics tutor"}\nObserve handoff_requested, handoff_occurred and active agent updates.`;
  if (number === 52)
    return 'runner.on("agent_tool_start", ...)\nrunner.on("agent_tool_end", ...)\nApplication tool wrapper catches and reports failure.';
  if (number === 53)
    return "Consume stream → await stream.completed → check outcome\nRead final output and usage → serialize completed RunState\nSave snapshot only after successful completion.";
  return "AbortController.abort()\nawait stream.completed\nawait model.whenIdle()\nfinally close the owned resource";
}
