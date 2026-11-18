export const toolsLessons = [
  {
    number: 55,
    section: "7. Streaming and event handling",
    title: "Streaming interruptions",
    prompt:
      "Detect approval interruptions during streaming, wait for the run to settle, and preserve resumable state.",
    slug: "streaming-interruptions",
    headline: "Preserve a paused streamed run.",
    summary:
      "Wait for the stream to settle, preserve RunState, and resume the same run after resolving approvals.",
    question: "When should a streamed approval interruption be serialized?",
    answers: [
      "Assume every operation succeeded",
      "After stream settlement",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Wait for the stream to settle, preserve RunState, and resume the same run after resolving approvals.",
    category: "Streaming",
    live: false,
  },
  {
    number: 56,
    section: "7. Streaming and event handling",
    title: "Web streaming",
    prompt:
      "Expose agent events through an application SSE endpoint and handle client disconnection cleanly.",
    slug: "web-streaming",
    headline: "Observe an SSE client disconnect.",
    summary:
      "A client disconnect propagates cancellation to the owned run. Stream and backend settlement precede resource cleanup.",
    question:
      "What should the server do when its active SSE client disconnects?",
    answers: [
      "Assume every operation succeeded",
      "Abort the owned SDK stream and await cleanup",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "A client disconnect propagates cancellation to the owned run. Stream and backend settlement precede resource cleanup.",
    category: "Streaming",
    live: false,
  },
  {
    number: 57,
    section: "8. Custom function tools",
    title: "First function tool",
    prompt:
      "Create a calculator tool and let the agent decide when to call it.",
    slug: "first-function-tool",
    headline: "Give the agent a calculator.",
    summary:
      "The SDK invokes application code when the model calls the registered calculator capability.",
    question: "What executes calculator arithmetic?",
    answers: [
      "Assume every operation succeeded",
      "The registered application tool callback",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "The SDK invokes application code when the model calls the registered calculator capability.",
    category: "Function tools",
    live: true,
  },
  {
    number: 58,
    section: "8. Custom function tools",
    title: "Argument schemas",
    prompt:
      "Define a tool with constrained arguments and demonstrate how invalid arguments are handled.",
    slug: "argument-schemas",
    headline: "Validate arguments before execution.",
    summary:
      "Constrained enums, bounded integers and documented formats validate model-supplied arguments before application work.",
    question: "What happens before the tool callback receives arguments?",
    answers: [
      "Assume every operation succeeded",
      "The SDK validates the configured argument schema",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Constrained enums, bounded integers and documented formats validate model-supplied arguments before application work.",
    category: "Function tools",
    live: true,
  },
  {
    number: 59,
    section: "8. Custom function tools",
    title: "Tool descriptions",
    prompt:
      "Improve tool names, descriptions, and parameter documentation so the agent selects the correct capability.",
    slug: "tool-descriptions",
    headline: "Describe each capability clearly.",
    summary:
      "Tool metadata communicates the capability and when it should be selected. Actual model choices can vary.",
    question: "What helps distinguish reading from creating a shipment?",
    answers: [
      "Assume every operation succeeded",
      "Specific names, descriptions and parameter documentation",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Tool metadata communicates the capability and when it should be selected. Actual model choices can vary.",
    category: "Function tools",
    live: true,
  },
  {
    number: 60,
    section: "8. Custom function tools",
    title: "External API tool",
    prompt:
      "Create an asynchronous tool that calls an external API with authentication, timeouts, and clear errors.",
    slug: "external-api-tool",
    headline: "Call an authenticated HTTP API.",
    summary:
      "Send credentials through the configured client, enforce deadlines and expose actionable public errors.",
    question: "Where should an API credential be used?",
    answers: [
      "Assume every operation succeeded",
      "In the server-owned API client",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Send credentials through the configured client, enforce deadlines and expose actionable public errors.",
    category: "Function tools",
    live: false,
  },
  {
    number: 61,
    section: "8. Custom function tools",
    title: "Database tool",
    prompt:
      "Create a read-only database tool using parameterized queries and authenticated tenant context.",
    slug: "database-tool",
    headline: "Query within the authenticated tenant.",
    summary:
      "Bind SQL parameters and derive tenant identity from server-owned context. The tool accepts only a record ID.",
    question: "Where does the query tenant ID come from?",
    answers: [
      "Assume every operation succeeded",
      "Authenticated application context",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Bind SQL parameters and derive tenant identity from server-owned context. The tool accepts only a record ID.",
    category: "Function tools",
    live: true,
  },
  {
    number: 62,
    section: "8. Custom function tools",
    title: "Tool return values",
    prompt:
      "Compare text and structured tool results and choose a useful format for downstream reasoning.",
    slug: "tool-return-values",
    headline: "Choose the downstream data format.",
    summary:
      "The structured path validates its output before forwarding it. Inspect the actual model-visible representation.",
    question: "What does the structured output path validate?",
    answers: [
      "Assume every operation succeeded",
      "The configured tool output schema",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "The structured path validates its output before forwarding it. Inspect the actual model-visible representation.",
    category: "Function tools",
    live: true,
  },
  {
    number: 63,
    section: "8. Custom function tools",
    title: "Tool failures",
    prompt:
      "Configure tool-error behavior so the agent receives useful failure information without exposing internal secrets.",
    slug: "tool-failures",
    headline: "Return useful failure information.",
    summary:
      "Use a configured error handler or an application exception boundary to keep internal diagnostics server-side.",
    question: "What should a model-visible tool failure contain?",
    answers: [
      "Assume every operation succeeded",
      "Allowlisted public codes and useful messages",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Use a configured error handler or an application exception boundary to keep internal diagnostics server-side.",
    category: "Function tools",
    live: false,
  },
  {
    number: 64,
    section: "8. Custom function tools",
    title: "Tool timeouts",
    prompt:
      "Add supported per-tool timeouts and distinguish timeout handling from application retry logic.",
    slug: "tool-timeouts",
    headline: "Separate deadlines and retry policy.",
    summary:
      "Per-tool timeout behavior controls deadline handling. A retry is a separate explicit application decision.",
    question: "What starts another application attempt after a tool timeout?",
    answers: [
      "Assume every operation succeeded",
      "Explicit application retry logic",
      "Skip the SDK outcome checks",
    ],
    correct: 1,
    explanation:
      "Per-tool timeout behavior controls deadline handling. A retry is a separate explicit application decision.",
    category: "Function tools",
    live: false,
  },
];
