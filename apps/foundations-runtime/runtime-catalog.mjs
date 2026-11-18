// The exact implementation prompts are copied from the source prompt collection.
export const runtimeLessons = [
  {
    number: 35,
    slug: "reasoning-settings",
    title: "Reasoning settings",
    headline: "Measure a settings comparison.",
    summary:
      "Run the same calculation with two supported configurations and inspect correctness, usage, and elapsed time.",
    prompt:
      "Compare supported reasoning-effort and verbosity settings using the same task and measurable acceptance criteria.",
    question: "What makes a settings comparison measurable?",
    answers: [
      "Changing the task on each run",
      "Using the same task and explicit acceptance checks",
      "Assuming higher effort always improves output",
    ],
    explanation:
      "Hold the task and acceptance criteria fixed, then compare observed quality, usage and elapsed time.",
    live: true,
  },
  {
    number: 36,
    slug: "mixed-model-workflow",
    title: "Mixed-model workflow",
    headline: "Measure the routing tradeoff.",
    summary:
      "Observe which model a router selects and compare its extra call with direct capable-model execution.",
    prompt:
      "Use a smaller model for routing and a more capable model for difficult tasks, then measure the tradeoff.",
    question: "What cost does routing add to this workflow?",
    answers: [
      "A guaranteed quality improvement",
      "An additional routing model call",
      "No work beyond the specialist",
    ],
    explanation:
      "The router adds work. Compare the selected model, actual calls, token reports, latency, and task acceptance.",
    live: true,
  },
  {
    number: 37,
    slug: "api-compatibility",
    title: "API compatibility",
    headline: "Compare model integration paths.",
    summary:
      "Execute Responses and Chat Completions adapters and inspect their requests and capability checks.",
    prompt:
      "Compare Responses and Chat Completions model integrations, identifying capabilities that require the Responses path.",
    question: "Which example requires the Responses adapter?",
    answers: [
      "Every plain text answer",
      "Hosted web search configuration",
      "Every local function tool",
    ],
    explanation:
      "Hosted tools use Responses. Function-tool support also depends on the selected model and endpoint.",
    live: true,
  },
  {
    number: 38,
    slug: "alternative-providers",
    title: "Alternative providers",
    headline: "Verify a provider’s capabilities.",
    summary:
      "Connect the SDK to a separate OpenAI-compatible HTTP server and exercise tools, schemas, streaming, and usage reporting.",
    prompt:
      "Connect another model provider through a supported adapter and document differences in tools, outputs, streaming, and usage reporting.",
    question: "What does missing provider usage mean?",
    answers: [
      "The request necessarily used zero tokens",
      "Accounting is unavailable for that response",
      "The SDK should invent a token count",
    ],
    explanation:
      "Provider omissions can produce zero SDK counters. Treat that as unavailable accounting and verify capabilities for each provider.",
    live: true,
  },
  {
    number: 39,
    slug: "custom-model-integration",
    title: "Custom model integration",
    headline: "Implement the model contract.",
    summary:
      "A TypeScript controlled backend implements complete and streaming responses through the installed SDK interfaces.",
    prompt:
      "Implement the SDK’s model or provider interface for a controlled backend, following the installed version’s contract.",
    question: "What does a custom Model return?",
    answers: [
      "Only arbitrary plain text",
      "SDK output items, usage, and supported response metadata",
      "An unrelated HTTP response object",
    ],
    explanation:
      "The Model interface requires getResponse and getStreamedResponse. A ModelProvider resolves a Model by name.",
    live: false,
  },
  {
    number: 40,
    slug: "responses-websocket-transport",
    title: "Responses WebSocket transport",
    headline: "Observe connection reuse.",
    summary:
      "Two actual SDK runs use a local WebSocket endpoint. Inspect connection IDs and cleanup.",
    prompt:
      "Demonstrate supported Responses WebSocket transport and connection reuse, explaining how it differs from realtime voice.",
    question: "What does the local endpoint receive?",
    answers: [
      "Realtime audio buffers",
      "Responses response.create frames",
      "Only browser navigation events",
    ],
    explanation:
      "Responses WebSocket transport carries response requests and events. Realtime voice has a separate audio-session protocol.",
    live: false,
  },
  {
    number: 41,
    slug: "execution-methods",
    title: "Execution methods",
    headline: "Choose how the caller executes.",
    summary:
      "Run TypeScript asynchronous execution and actual Python asynchronous or synchronous execution.",
    prompt:
      "Demonstrate asynchronous execution and, where supported, synchronous execution, explaining when each is appropriate.",
    question: "What should Python code inside an active event loop use?",
    answers: [
      "A nested blocking run_sync call",
      "Await the asynchronous SDK method",
      "A busy-wait until completion",
    ],
    explanation:
      "Await async SDK execution inside an event loop. Python run_sync wraps execution for synchronous callers.",
    live: false,
  },
  {
    number: 42,
    slug: "turn-limits",
    title: "Turn limits",
    headline: "Count model turns in the loop.",
    summary:
      "The agent needs two tool lookups and a final model answer. Observe the SDK stop at lower budgets.",
    prompt:
      "Set a maximum run-turn limit and demonstrate what counts as a turn.",
    question: "What consumes one turn in this example?",
    answers: [
      "Every individual tool argument",
      "Each model invocation",
      "Every UI replay stage",
    ],
    explanation:
      "A model invocation consumes a turn. Its tool execution happens within that turn before the next model invocation.",
    live: false,
  },
  {
    number: 43,
    slug: "run-configuration",
    title: "Run configuration",
    headline: "Inspect workflow settings across agents.",
    summary:
      "Follow a real handoff and inspect the effective model and settings received by each adapter.",
    prompt:
      "Apply workflow-level configuration to several agents and explain which agent settings it overrides.",
    question: "Which override is observed in this installed SDK?",
    answers: [
      "Every explicit agent model is replaced",
      "Explicit agent settings precede workflow defaults",
      "The workflow cannot affect any settings",
    ],
    explanation:
      "The installed resolver preserves explicit agent model and settings. Workflow settings fill omitted fields.",
    live: false,
  },
  {
    number: 44,
    slug: "result-properties",
    title: "Result properties",
    headline: "Inspect the result and continue.",
    summary:
      "Read actual result getters after handoff, explicit-history continuation, or approval interruption.",
    prompt:
      "Inspect final output, the last active agent, response identifiers, and continuation information.",
    question: "Which state should be checked before consuming final output?",
    answers: [
      "Only the displayed agent name",
      "Completion and interruptions",
      "The number of source tabs",
    ],
    explanation:
      "A paused result provides interruption and state information. Inspect completion and permission before using output.",
    live: false,
  },
].map((lesson) => ({
  ...lesson,
  correct: 1,
  category: lesson.number <= 40 ? "Model configuration" : "Running agents",
}));
