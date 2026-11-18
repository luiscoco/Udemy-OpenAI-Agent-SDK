export const streamingLessons = [
  {
    number: 45,
    section: "6. Running agents and inspecting results",
    title: "Run items",
    prompt:
      "Inspect the run’s model messages, tool calls, tool results, and handoff records.",
    slug: "run-items",
    headline: "Inspect every step the run produced.",
    summary:
      "newItems contains typed SDK records with agent ownership. history contains replay-ready model input.",
    question:
      "Which property associates new model and tool records with SDK agents?",
    answers: [
      "Assume the run already succeeded",
      "RunResult.newItems",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "newItems contains typed SDK records with agent ownership. history contains replay-ready model input.",
    category: "Running agents",
    live: false,
  },
  {
    number: 46,
    section: "6. Running agents and inspecting results",
    title: "Usage accounting",
    prompt:
      "Collect available request counts and token usage for a run and its nested work.",
    slug: "usage-accounting",
    headline: "Account for parent and nested work.",
    summary:
      "These nested runs own separate usage contexts. Deduplicate response IDs and aggregate each response once.",
    question: "How should separate parent and nested usage be combined?",
    answers: [
      "Assume the run already succeeded",
      "Count each disjoint model response once",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "These nested runs own separate usage contexts. Deduplicate response IDs and aggregate each response once.",
    category: "Running agents",
    live: false,
  },
  {
    number: 47,
    section: "6. Running agents and inspecting results",
    title: "SDK exceptions",
    prompt:
      "Handle the installed SDK’s configuration, model-behavior, timeout, and turn-limit exceptions with useful application errors.",
    slug: "sdk-exceptions",
    headline: "Turn SDK failures into useful errors.",
    summary:
      "Map known installed SDK classes to useful errors and propagate unexpected failures.",
    question: "What should the application do with an unexpected exception?",
    answers: [
      "Assume the run already succeeded",
      "Propagate it instead of misclassifying it",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Map known installed SDK classes to useful errors and propagate unexpected failures.",
    category: "Running agents",
    live: false,
  },
  {
    number: 48,
    section: "6. Running agents and inspecting results",
    title: "Manual continuation",
    prompt:
      "Build a two-turn conversation by carrying forward the SDK’s replay-ready history.",
    slug: "manual-continuation",
    headline: "Carry history into the next turn.",
    summary:
      "The SDK history preserves earlier messages and model records for application-managed continuation.",
    question: "What does the second conversation input contain?",
    answers: [
      "Assume the run already succeeded",
      "Replay-ready history plus the new user message",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "The SDK history preserves earlier messages and model records for application-managed continuation.",
    category: "Running agents",
    live: false,
  },
  {
    number: 49,
    section: "7. Streaming and event handling",
    title: "Text streaming",
    prompt: "Stream an agent’s text response incrementally to the terminal.",
    slug: "text-streaming",
    headline: "Read text as it arrives.",
    summary:
      "toTextStream yields incremental text. Await completion before consuming final output and usage.",
    question: "When is streamed text available?",
    answers: [
      "Assume the run already succeeded",
      "Incrementally before the final result settles",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "toTextStream yields incremental text. Await completion before consuming final output and usage.",
    category: "Streaming",
    live: false,
  },
  {
    number: 50,
    section: "7. Streaming and event handling",
    title: "Event categories",
    prompt:
      "Compare raw model events with higher-level SDK events and explain when to consume each.",
    slug: "event-categories",
    headline: "Choose the events your interface needs.",
    summary:
      "Raw events supply model data. Higher-level SDK events describe agents, tools, handoffs and run items.",
    question: "Which event category supplies model text deltas?",
    answers: [
      "Assume the run already succeeded",
      "raw_model_stream_event",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Raw events supply model data. Higher-level SDK events describe agents, tools, handoffs and run items.",
    category: "Streaming",
    live: false,
  },
  {
    number: 51,
    section: "7. Streaming and event handling",
    title: "Agent changes",
    prompt:
      "Display the active agent and handoff progress during a streamed run.",
    slug: "agent-changes",
    headline: "Follow ownership during a handoff.",
    summary:
      "Track active-agent updates and handoff progress from supported SDK stream events.",
    question: "Which event updates the active agent display?",
    answers: [
      "Assume the run already succeeded",
      "agent_updated_stream_event",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Track active-agent updates and handoff progress from supported SDK stream events.",
    category: "Streaming",
    live: false,
  },
  {
    number: 52,
    section: "7. Streaming and event handling",
    title: "Tool progress",
    prompt:
      "Display tool-start, tool-completion, and tool-failure progress using supported events or lifecycle hooks.",
    slug: "tool-progress",
    headline: "Report tool execution progress.",
    summary:
      "Runner hooks report tool start and end. The application wrapper reports failure and preserves the SDK error. A tool-end hook can also follow failure.",
    question: "How is tool failure progress reported in this installed SDK?",
    answers: [
      "Assume the run already succeeded",
      "By the application tool wrapper",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Runner hooks report tool start and end. The application wrapper reports failure and preserves the SDK error.",
    category: "Streaming",
    live: false,
  },
  {
    number: 53,
    section: "7. Streaming and event handling",
    title: "Completion handling",
    prompt:
      "Wait for stream completion before reading final results, usage information, or persisted state.",
    slug: "completion-handling",
    headline: "Wait before consuming the result.",
    summary:
      "Partial text may precede a failure. Await completion and check success before reading final results or saving state.",
    question: "When should final output, usage and state be consumed?",
    answers: [
      "Assume the run already succeeded",
      "After stream completion and outcome checks",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Partial text may precede a failure. Await completion and check success before reading final results or saving state.",
    category: "Streaming",
    live: false,
  },
  {
    number: 54,
    section: "7. Streaming and event handling",
    title: "Cancellation",
    prompt:
      "Cancel a running stream and clean up application resources using the SDK’s supported cancellation mechanism.",
    slug: "cancellation",
    headline: "Cancel and await cleanup.",
    summary:
      "Use an AbortController signal and await stream settlement and backend cleanup before closing resources.",
    question: "When should the application close its owned resources?",
    answers: [
      "Assume the run already succeeded",
      "After the stream and cooperative backend work settle",
      "Skip the SDK outcome check",
    ],
    correct: 1,
    explanation:
      "Use an AbortController signal and await stream settlement and backend cleanup before closing resources.",
    category: "Streaming",
    live: false,
  },
];
