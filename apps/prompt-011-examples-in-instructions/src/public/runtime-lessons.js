const control = (key, label, options) => ({ key, label, options });
export const runtimeControls = {
  35: [
    control("reasoningComparison", "Settings comparison", [
      ["effort", "Low versus high reasoning"],
      ["verbosity", "Low versus high verbosity"],
    ]),
  ],
  36: [
    control("routingTask", "Task", [
      ["easy", "Add two small numbers"],
      ["hard", "Calculate a workshop order"],
    ]),
    control("routingStrategy", "Workflow", [
      ["mixed", "Router and selected specialist"],
      ["direct", "Capable specialist directly"],
    ]),
  ],
  37: [
    control("apiFeature", "Feature", [
      ["text", "Text output"],
      ["tool", "Function tool"],
      ["hosted", "Hosted web search configuration"],
    ]),
  ],
  38: [
    control("providerFeature", "Provider capability", [
      ["tools", "Function tools"],
      ["structured", "Structured output"],
      ["streaming", "Streaming text"],
      ["missing-usage", "Missing usage report"],
    ]),
  ],
  39: [
    control("adapterScenario", "Custom adapter", [
      ["text", "Complete text result"],
      ["stream", "Streamed result"],
      ["invalid", "Invalid structured result"],
    ]),
  ],
  40: [
    control("connectionPolicy", "Connection policy", [
      ["reuse", "Reuse one connection"],
      ["fresh", "Open a connection for each run"],
    ]),
  ],
  41: [
    control("executionMethod", "Execution method", [
      ["async-ts", "TypeScript await runner.run"],
      ["async-python", "Python await Runner.run"],
      ["sync-python", "Python Runner.run_sync"],
    ]),
  ],
  42: [
    control("turnBudget", "Maximum model turns", [
      ["3", "Three turns · completes"],
      ["1", "One turn · limit reached"],
      ["2", "Two turns · limit reached"],
    ]),
  ],
  43: [
    control("workflowConfig", "Workflow configuration", [
      ["override", "Workflow settings applied"],
      ["agent-only", "Agent settings only"],
    ]),
  ],
  44: [
    control("resultScenario", "Result to inspect", [
      ["handoff", "Completed handoff"],
      ["continuation", "Continue with explicit history"],
      ["approval", "Paused for approval"],
    ]),
  ],
};
export const runtimeHints = {
  35: "Both configurations use the same order calculation and acceptance checks. Classroom latency measures local SDK execution with scripted answers. Live API returns model usage and measured wall time.",
  36: "Compare a router plus specialist with one capable-model call. The route, answer, call count, token usage, and elapsed time are observed. Classroom inference is scripted.",
  37: "Run the real Responses and Chat Completions adapters against a local protocol fixture. Strict feature validation rejects unsupported Chat features. Live mode uses OpenAI.",
  38: "A separate loopback HTTP provider serves an OpenAI-compatible protocol. The real adapter exercises tools, schemas, streaming, and missing usage. External live providers need their own URL, model, and credential.",
  39: "This TypeScript class implements the installed Model and ModelProvider interfaces. Inspect getResponse, getStreamedResponse, usage, and response identifiers.",
  40: "The actual Responses WebSocket model connects to a local WebSocket protocol fixture. Compare two runs with one reused connection or separate connections. Text-and-tool sessions use Responses events.",
  41: "Execute JavaScript promises or Python asynchronous and synchronous SDK methods. Python examples run in a separate process. Use run_sync from synchronous Python code.",
  42: "The scripted model requests two local tools before its final answer. Each model call uses one turn. Inspect the calls and tool executions completed before the SDK limit.",
  43: "Observe workflow defaults across a real handoff. The installed SDK preserves explicit agent model and modelSettings. Workflow settings fill omitted fields. Inspect the actual adapter requests.",
  44: "Inspect the actual RunResult getters. Explicit history can continue the conversation. Approval interruption leaves state available and prevents the tool from executing.",
};
export function runtimePreview(number, input) {
  if (number === 35)
    return "Task: 3 kits × 12 + 2 sensors × 7\nExpected total: 50\nAcceptance: correct total, nonempty explanation, at most 30 words.";
  if (number === 36)
    return input.routingTask === "hard"
      ? "3 kits × 12 + 2 sensors × 7 = 50"
      : "2 + 2 = 4";
  if (number === 37)
    return "Responses → OpenAIResponsesModel\nChat Completions → OpenAIChatCompletionsModel\nstrictFeatureValidation: true";
  if (number === 38)
    return "OpenAI-compatible local HTTP provider\nSupported fixture cases: function calls, JSON schema, SSE text, absent usage\nProvider-reported token counts are synthetic classroom fixtures.";
  if (number === 39)
    return "Model.getResponse(request) → ModelResponse\nModel.getStreamedResponse(request) → AsyncIterable\nModelProvider.getModel(name) → Model";
  if (number === 40)
    return "Run 1 → response.create → response.completed\nRun 2 → response.create → response.completed\nObserve socket connection IDs and cleanup.";
  if (number === 41)
    return "TypeScript: await runner.run(agent, input)\nPython async: await Runner.run(agent, input)\nPython sync: Runner.run_sync(agent, input)";
  if (number === 42)
    return "Turn 1 → model requests lookup → local tool executes\nTurn 2 → model requests lookup → local tool executes\nTurn 3 → model returns final answer";
  if (number === 43)
    return "Coordinator: workflow model and settings defaults\nSpecialist: explicit model and settings\nSpecialist maxTokens: 1024 / verbosity: high\nWorkflow maxTokens: 128 / verbosity: low";
  return "finalOutput\nlastAgent / activeAgent\nlastResponseId / rawResponses\nhistory / interruptions / state";
}
