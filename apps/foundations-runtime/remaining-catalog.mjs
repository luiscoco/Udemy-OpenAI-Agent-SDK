export const remainingLessons = [
  {
    number: 95,
    section: "12. Handoffs and specialist ownership",
    title: "Conditional handoffs",
    prompt:
      "Enable or disable specialist handoffs based on authenticated context and supported SDK configuration.",
    slug: "conditional-handoffs",
    headline: "Conditional handoffs",
    summary:
      "Enable or disable specialist handoffs based on authenticated context and supported SDK configuration.",
    question: "What should you inspect in the conditional handoffs exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Handoffs and specialist ownership",
  },
  {
    number: 96,
    section: "12. Handoffs and specialist ownership",
    title: "Next-turn ownership",
    prompt:
      "Continue the next user turn with the last specialist when that agent should remain responsible.",
    slug: "next-turn-ownership",
    headline: "Next-turn ownership",
    summary:
      "Continue the next user turn with the last specialist when that agent should remain responsible.",
    question: "What should you inspect in the next-turn ownership exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Handoffs and specialist ownership",
  },
  {
    number: 97,
    section: "13. Orchestration patterns",
    title: "Manager and specialists",
    prompt:
      "Create a manager agent that calls specialist agents as tools and synthesizes their results.",
    slug: "manager-and-specialists",
    headline: "Manager and specialists",
    summary:
      "Create a manager agent that calls specialist agents as tools and synthesizes their results.",
    question:
      "What should you inspect in the manager and specialists exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 98,
    section: "13. Orchestration patterns",
    title: "Specialist contracts",
    prompt:
      "Define structured inputs and output extraction for an agent exposed as a tool.",
    slug: "specialist-contracts",
    headline: "Specialist contracts",
    summary:
      "Define structured inputs and output extraction for an agent exposed as a tool.",
    question: "What should you inspect in the specialist contracts exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 99,
    section: "13. Orchestration patterns",
    title: "Sequential workflow",
    prompt:
      "Build a research, drafting, and review sequence with explicit data contracts between stages.",
    slug: "sequential-workflow",
    headline: "Sequential workflow",
    summary:
      "Build a research, drafting, and review sequence with explicit data contracts between stages.",
    question: "What should you inspect in the sequential workflow exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 100,
    section: "13. Orchestration patterns",
    title: "Parallel workflow",
    prompt:
      "Run independent specialists concurrently, collect their results, and handle partial failures.",
    slug: "parallel-workflow",
    headline: "Parallel workflow",
    summary:
      "Run independent specialists concurrently, collect their results, and handle partial failures.",
    question: "What should you inspect in the parallel workflow exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 101,
    section: "13. Orchestration patterns",
    title: "Deterministic routing",
    prompt:
      "Route requests with application logic when rules are clear, and use model routing only where needed.",
    slug: "deterministic-routing",
    headline: "Deterministic routing",
    summary:
      "Route requests with application logic when rules are clear, and use model routing only where needed.",
    question: "What should you inspect in the deterministic routing exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 102,
    section: "13. Orchestration patterns",
    title: "Planner and executor",
    prompt:
      "Build a planner that produces a structured task list and an executor that reports completion evidence.",
    slug: "planner-and-executor",
    headline: "Planner and executor",
    summary:
      "Build a planner that produces a structured task list and an executor that reports completion evidence.",
    question: "What should you inspect in the planner and executor exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 103,
    section: "13. Orchestration patterns",
    title: "Evaluator and optimizer",
    prompt:
      "Build a bounded draft-review-revise loop with explicit success criteria and a maximum number of iterations.",
    slug: "evaluator-and-optimizer",
    headline: "Evaluator and optimizer",
    summary:
      "Build a bounded draft-review-revise loop with explicit success criteria and a maximum number of iterations.",
    question:
      "What should you inspect in the evaluator and optimizer exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 104,
    section: "13. Orchestration patterns",
    title: "State machine",
    prompt:
      "Implement an agent workflow as explicit application states with validated transitions and recoverable failure states.",
    slug: "state-machine",
    headline: "State machine",
    summary:
      "Implement an agent workflow as explicit application states with validated transitions and recoverable failure states.",
    question: "What should you inspect in the state machine exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Orchestration patterns",
  },
  {
    number: 105,
    section: "14. Sessions, conversation history, and memory",
    title: "SDK session",
    prompt:
      "Implement a multi-turn conversation using a session backend supported by my selected SDK.",
    slug: "sdk-session",
    headline: "SDK session",
    summary:
      "Implement a multi-turn conversation using a session backend supported by my selected SDK.",
    question: "What should you inspect in the sdk session exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 106,
    section: "14. Sessions, conversation history, and memory",
    title: "Persistent storage",
    prompt:
      "Persist conversation history across process restarts using an appropriate documented session backend.",
    slug: "persistent-storage",
    headline: "Persistent storage",
    summary:
      "Persist conversation history across process restarts using an appropriate documented session backend.",
    question: "What should you inspect in the persistent storage exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 107,
    section: "14. Sessions, conversation history, and memory",
    title: "Session operations",
    prompt:
      "Demonstrate supported session operations for retrieving, adding, correcting, and clearing conversation items.",
    slug: "session-operations",
    headline: "Session operations",
    summary:
      "Demonstrate supported session operations for retrieving, adding, correcting, and clearing conversation items.",
    question: "What should you inspect in the session operations exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 108,
    section: "14. Sessions, conversation history, and memory",
    title: "Custom session backend",
    prompt:
      "Implement the SDK session interface using my application’s database and test concurrent access.",
    slug: "custom-session-backend",
    headline: "Custom session backend",
    summary:
      "Implement the SDK session interface using my application’s database and test concurrent access.",
    question: "What should you inspect in the custom session backend exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 109,
    section: "14. Sessions, conversation history, and memory",
    title: "Server-managed continuation",
    prompt:
      "Compare Conversations-based state and response-ID chaining in separate examples, checking incompatible combinations with SDK sessions.",
    slug: "server-managed-continuation",
    headline: "Server-managed continuation",
    summary:
      "Compare Conversations-based state and response-ID chaining in separate examples, checking incompatible combinations with SDK sessions.",
    question:
      "What should you inspect in the server-managed continuation exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 110,
    section: "14. Sessions, conversation history, and memory",
    title: "Context compaction",
    prompt:
      "Add supported compaction or context management and verify that important task state survives.",
    slug: "context-compaction",
    headline: "Context compaction",
    summary:
      "Add supported compaction or context management and verify that important task state survives.",
    question: "What should you inspect in the context compaction exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 111,
    section: "14. Sessions, conversation history, and memory",
    title: "Long-term application memory",
    prompt:
      "Build an explicit memory store for user-approved facts, with retrieval, correction, deletion, and tenant isolation.",
    slug: "long-term-application-memory",
    headline: "Long-term application memory",
    summary:
      "Build an explicit memory store for user-approved facts, with retrieval, correction, deletion, and tenant isolation.",
    question:
      "What should you inspect in the long-term application memory exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 112,
    section: "14. Sessions, conversation history, and memory",
    title: "History selection",
    prompt:
      "Limit or summarize conversation history while preserving valid tool-call relationships and necessary task context.",
    slug: "history-selection",
    headline: "History selection",
    summary:
      "Limit or summarize conversation history while preserving valid tool-call relationships and necessary task context.",
    question: "What should you inspect in the history selection exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sessions, conversation history, and memory",
  },
  {
    number: 113,
    section: "15. Guardrails and validation",
    title: "Input guardrail",
    prompt:
      "Create a blocking input guardrail that rejects requests outside the application’s supported scope.",
    slug: "input-guardrail",
    headline: "Input guardrail",
    summary:
      "Create a blocking input guardrail that rejects requests outside the application’s supported scope.",
    question: "What should you inspect in the input guardrail exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 114,
    section: "15. Guardrails and validation",
    title: "Output guardrail",
    prompt:
      "Validate a final answer against application requirements and handle a triggered output guardrail.",
    slug: "output-guardrail",
    headline: "Output guardrail",
    summary:
      "Validate a final answer against application requirements and handle a triggered output guardrail.",
    question: "What should you inspect in the output guardrail exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 115,
    section: "15. Guardrails and validation",
    title: "Tool-input guardrail",
    prompt:
      "Validate tool arguments before a supported function tool executes.",
    slug: "tool-input-guardrail",
    headline: "Tool-input guardrail",
    summary:
      "Validate tool arguments before a supported function tool executes.",
    question: "What should you inspect in the tool-input guardrail exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 116,
    section: "15. Guardrails and validation",
    title: "Tool-output guardrail",
    prompt:
      "Check a function tool’s output before the agent uses it in subsequent reasoning.",
    slug: "tool-output-guardrail",
    headline: "Tool-output guardrail",
    summary:
      "Check a function tool’s output before the agent uses it in subsequent reasoning.",
    question: "What should you inspect in the tool-output guardrail exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 117,
    section: "15. Guardrails and validation",
    title: "Model-based guardrail",
    prompt:
      "Implement a guardrail using a separate classifier agent and a structured decision.",
    slug: "model-based-guardrail",
    headline: "Model-based guardrail",
    summary:
      "Implement a guardrail using a separate classifier agent and a structured decision.",
    question: "What should you inspect in the model-based guardrail exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 118,
    section: "15. Guardrails and validation",
    title: "Parallel versus blocking",
    prompt:
      "Compare parallel and blocking input guardrails, showing when speculative work can begin.",
    slug: "parallel-versus-blocking",
    headline: "Parallel versus blocking",
    summary:
      "Compare parallel and blocking input guardrails, showing when speculative work can begin.",
    question:
      "What should you inspect in the parallel versus blocking exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 119,
    section: "15. Guardrails and validation",
    title: "Guardrail scope",
    prompt:
      "Demonstrate exactly which guardrails run before handoffs, after handoffs, and around nested tool-agent calls.",
    slug: "guardrail-scope",
    headline: "Guardrail scope",
    summary:
      "Demonstrate exactly which guardrails run before handoffs, after handoffs, and around nested tool-agent calls.",
    question: "What should you inspect in the guardrail scope exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 120,
    section: "15. Guardrails and validation",
    title: "Streaming validation",
    prompt:
      "Design output validation for streaming and explain what must be buffered before being shown to users.",
    slug: "streaming-validation",
    headline: "Streaming validation",
    summary:
      "Design output validation for streaming and explain what must be buffered before being shown to users.",
    question: "What should you inspect in the streaming validation exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Guardrails and validation",
  },
  {
    number: 121,
    section: "16. Human approval and resumable execution",
    title: "Approval-required tool",
    prompt:
      "Create a tool that pauses for approval before making a change to an external system.",
    slug: "approval-required-tool",
    headline: "Approval-required tool",
    summary:
      "Create a tool that pauses for approval before making a change to an external system.",
    question: "What should you inspect in the approval-required tool exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 122,
    section: "16. Human approval and resumable execution",
    title: "Conditional approval",
    prompt:
      "Require approval only when a tool’s arguments meet a specified application policy.",
    slug: "conditional-approval",
    headline: "Conditional approval",
    summary:
      "Require approval only when a tool’s arguments meet a specified application policy.",
    question: "What should you inspect in the conditional approval exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 123,
    section: "16. Human approval and resumable execution",
    title: "Approve or reject",
    prompt:
      "Implement both approval and rejection paths and show how the agent responds to each decision.",
    slug: "approve-or-reject",
    headline: "Approve or reject",
    summary:
      "Implement both approval and rejection paths and show how the agent responds to each decision.",
    question: "What should you inspect in the approve or reject exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 124,
    section: "16. Human approval and resumable execution",
    title: "Persisted pause",
    prompt:
      "Serialize a paused run, store it, and restore it in another process before resuming.",
    slug: "persisted-pause",
    headline: "Persisted pause",
    summary:
      "Serialize a paused run, store it, and restore it in another process before resuming.",
    question: "What should you inspect in the persisted pause exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 125,
    section: "16. Human approval and resumable execution",
    title: "Nested approvals",
    prompt:
      "Demonstrate an approval interruption inside a specialist tool-agent and after a handoff.",
    slug: "nested-approvals",
    headline: "Nested approvals",
    summary:
      "Demonstrate an approval interruption inside a specialist tool-agent and after a handoff.",
    question: "What should you inspect in the nested approvals exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 126,
    section: "16. Human approval and resumable execution",
    title: "Multiple pending actions",
    prompt:
      "Review several pending tool calls individually and resume only after their decisions are resolved.",
    slug: "multiple-pending-actions",
    headline: "Multiple pending actions",
    summary:
      "Review several pending tool calls individually and resume only after their decisions are resolved.",
    question:
      "What should you inspect in the multiple pending actions exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 127,
    section: "16. Human approval and resumable execution",
    title: "Review interface",
    prompt:
      "Build a review screen showing the proposed action, exact arguments, approving identity, and decision outcome.",
    slug: "review-interface",
    headline: "Review interface",
    summary:
      "Build a review screen showing the proposed action, exact arguments, approving identity, and decision outcome.",
    question: "What should you inspect in the review interface exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 128,
    section: "16. Human approval and resumable execution",
    title: "Safe resumption",
    prompt:
      "Revalidate authorization before resumed actions and prevent duplicate side effects with application-level idempotency.",
    slug: "safe-resumption",
    headline: "Safe resumption",
    summary:
      "Revalidate authorization before resumed actions and prevent duplicate side effects with application-level idempotency.",
    question: "What should you inspect in the safe resumption exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Human approval and resumable execution",
  },
  {
    number: 129,
    section: "17. Sandbox agents and workspaces",
    title: "First sandbox agent",
    prompt:
      "Create a minimal SandboxAgent that reads an input file and writes a result into its workspace.",
    slug: "first-sandbox-agent",
    headline: "First sandbox agent",
    summary:
      "Create a minimal SandboxAgent that reads an input file and writes a result into its workspace.",
    question: "What should you inspect in the first sandbox agent exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 130,
    section: "17. Sandbox agents and workspaces",
    title: "Workspace manifest",
    prompt:
      "Define a manifest containing input files, directories, environment configuration, and an output location.",
    slug: "workspace-manifest",
    headline: "Workspace manifest",
    summary:
      "Define a manifest containing input files, directories, environment configuration, and an output location.",
    question: "What should you inspect in the workspace manifest exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 131,
    section: "17. Sandbox agents and workspaces",
    title: "Sandbox providers",
    prompt:
      "Compare supported local, Docker, and hosted sandbox clients, including their isolation and lifecycle responsibilities.",
    slug: "sandbox-providers",
    headline: "Sandbox providers",
    summary:
      "Compare supported local, Docker, and hosted sandbox clients, including their isolation and lifecycle responsibilities.",
    question: "What should you inspect in the sandbox providers exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 132,
    section: "17. Sandbox agents and workspaces",
    title: "Repository workspace",
    prompt:
      "Initialize a sandbox from a repository and supply task instructions through workspace files.",
    slug: "repository-workspace",
    headline: "Repository workspace",
    summary:
      "Initialize a sandbox from a repository and supply task instructions through workspace files.",
    question: "What should you inspect in the repository workspace exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 133,
    section: "17. Sandbox agents and workspaces",
    title: "Storage mounts",
    prompt:
      "Mount supported external storage with narrowly scoped access and verify where output files are persisted.",
    slug: "storage-mounts",
    headline: "Storage mounts",
    summary:
      "Mount supported external storage with narrowly scoped access and verify where output files are persisted.",
    question: "What should you inspect in the storage mounts exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 134,
    section: "17. Sandbox agents and workspaces",
    title: "Runtime boundaries",
    prompt:
      "Configure sandbox network access and credentials while keeping application control-plane secrets outside the workspace.",
    slug: "runtime-boundaries",
    headline: "Runtime boundaries",
    summary:
      "Configure sandbox network access and credentials while keeping application control-plane secrets outside the workspace.",
    question: "What should you inspect in the runtime boundaries exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 135,
    section: "17. Sandbox agents and workspaces",
    title: "Artifacts and previews",
    prompt:
      "Retrieve generated artifacts and expose a preview port using the selected sandbox provider.",
    slug: "artifacts-and-previews",
    headline: "Artifacts and previews",
    summary:
      "Retrieve generated artifacts and expose a preview port using the selected sandbox provider.",
    question: "What should you inspect in the artifacts and previews exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 136,
    section: "17. Sandbox agents and workspaces",
    title: "State and snapshots",
    prompt:
      "Compare live sandbox reuse, serialized sandbox state, filesystem snapshots, and the agent’s resumable RunState.",
    slug: "state-and-snapshots",
    headline: "State and snapshots",
    summary:
      "Compare live sandbox reuse, serialized sandbox state, filesystem snapshots, and the agent’s resumable RunState.",
    question: "What should you inspect in the state and snapshots exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox agents and workspaces",
  },
  {
    number: 137,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Shell capability",
    prompt:
      "Enable sandbox shell execution and demonstrate command output, failure handling, and supported interactive processes.",
    slug: "shell-capability",
    headline: "Shell capability",
    summary:
      "Enable sandbox shell execution and demonstrate command output, failure handling, and supported interactive processes.",
    question: "What should you inspect in the shell capability exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 138,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Filesystem capability",
    prompt:
      "Use sandbox filesystem capabilities to apply a patch and inspect an image generated during the task.",
    slug: "filesystem-capability",
    headline: "Filesystem capability",
    summary:
      "Use sandbox filesystem capabilities to apply a patch and inspect an image generated during the task.",
    question: "What should you inspect in the filesystem capability exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 139,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Reusable skills",
    prompt:
      "Create a reusable skill containing instructions, scripts, and references, then load it into a sandbox agent.",
    slug: "reusable-skills",
    headline: "Reusable skills",
    summary:
      "Create a reusable skill containing instructions, scripts, and references, then load it into a sandbox agent.",
    question: "What should you inspect in the reusable skills exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 140,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Skill discovery",
    prompt:
      "Compare eager skill loading with supported lazy discovery for a larger skill collection.",
    slug: "skill-discovery",
    headline: "Skill discovery",
    summary:
      "Compare eager skill loading with supported lazy discovery for a larger skill collection.",
    question: "What should you inspect in the skill discovery exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 141,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Sandbox memory",
    prompt:
      "Demonstrate supported memory modes and distinguish reusable memory artifacts from conversation history.",
    slug: "sandbox-memory",
    headline: "Sandbox memory",
    summary:
      "Demonstrate supported memory modes and distinguish reusable memory artifacts from conversation history.",
    question: "What should you inspect in the sandbox memory exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 142,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Sandbox compaction",
    prompt:
      "Configure compaction for a long sandbox task and verify that workspace references remain usable.",
    slug: "sandbox-compaction",
    headline: "Sandbox compaction",
    summary:
      "Configure compaction for a long sandbox task and verify that workspace references remain usable.",
    question: "What should you inspect in the sandbox compaction exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 143,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Custom capabilities",
    prompt:
      "Implement a custom sandbox capability that adds a narrowly defined tool and its supporting instructions.",
    slug: "custom-capabilities",
    headline: "Custom capabilities",
    summary:
      "Implement a custom sandbox capability that adds a narrowly defined tool and its supporting instructions.",
    question: "What should you inspect in the custom capabilities exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 144,
    section: "18. Sandbox capabilities, skills, and memory",
    title: "Capability configuration",
    prompt:
      "Customize the capability list while preserving required defaults, dependencies, and cleanup behavior.",
    slug: "capability-configuration",
    headline: "Capability configuration",
    summary:
      "Customize the capability list while preserving required defaults, dependencies, and cleanup behavior.",
    question:
      "What should you inspect in the capability configuration exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Sandbox capabilities, skills, and memory",
  },
  {
    number: 145,
    section: "19. Tracing, hooks, and observability",
    title: "First trace",
    prompt:
      "Run an agent and inspect its trace to explain the sequence of model and tool activity.",
    slug: "first-trace",
    headline: "First trace",
    summary:
      "Run an agent and inspect its trace to explain the sequence of model and tool activity.",
    question: "What should you inspect in the first trace exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 146,
    section: "19. Tracing, hooks, and observability",
    title: "Workflow grouping",
    prompt:
      "Group several related agent runs into one trace with useful workflow and conversation metadata.",
    slug: "workflow-grouping",
    headline: "Workflow grouping",
    summary:
      "Group several related agent runs into one trace with useful workflow and conversation metadata.",
    question: "What should you inspect in the workflow grouping exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 147,
    section: "19. Tracing, hooks, and observability",
    title: "Custom spans",
    prompt:
      "Add custom spans around retrieval and application services so their latency is visible alongside agent activity.",
    slug: "custom-spans",
    headline: "Custom spans",
    summary:
      "Add custom spans around retrieval and application services so their latency is visible alongside agent activity.",
    question: "What should you inspect in the custom spans exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 148,
    section: "19. Tracing, hooks, and observability",
    title: "Run hooks",
    prompt:
      "Implement supported run-lifecycle hooks and demonstrate the order in which they execute.",
    slug: "run-hooks",
    headline: "Run hooks",
    summary:
      "Implement supported run-lifecycle hooks and demonstrate the order in which they execute.",
    question: "What should you inspect in the run hooks exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 149,
    section: "19. Tracing, hooks, and observability",
    title: "Agent hooks",
    prompt:
      "Attach agent-specific lifecycle hooks and compare their scope with workflow-level hooks.",
    slug: "agent-hooks",
    headline: "Agent hooks",
    summary:
      "Attach agent-specific lifecycle hooks and compare their scope with workflow-level hooks.",
    question: "What should you inspect in the agent hooks exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 150,
    section: "19. Tracing, hooks, and observability",
    title: "Trace controls",
    prompt:
      "Configure trace export and sensitive-data handling using the selected SDK’s supported tracing controls.",
    slug: "trace-controls",
    headline: "Trace controls",
    summary:
      "Configure trace export and sensitive-data handling using the selected SDK’s supported tracing controls.",
    question: "What should you inspect in the trace controls exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 151,
    section: "19. Tracing, hooks, and observability",
    title: "Operational metrics",
    prompt:
      "Report latency, token usage, tool failures, handoff frequency, and estimated cost using observable run data.",
    slug: "operational-metrics",
    headline: "Operational metrics",
    summary:
      "Report latency, token usage, tool failures, handoff frequency, and estimated cost using observable run data.",
    question: "What should you inspect in the operational metrics exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 152,
    section: "19. Tracing, hooks, and observability",
    title: "Workflow visualization",
    prompt:
      "Visualize the agent-and-handoff structure using a supported SDK utility or a graph generated from application configuration.",
    slug: "workflow-visualization",
    headline: "Workflow visualization",
    summary:
      "Visualize the agent-and-handoff structure using a supported SDK utility or a graph generated from application configuration.",
    question: "What should you inspect in the workflow visualization exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Tracing, hooks, and observability",
  },
  {
    number: 153,
    section: "20. Realtime speech-to-speech agents",
    title: "Browser voice agent",
    prompt:
      "Build a TypeScript realtime voice agent using WebRTC and an ephemeral credential issued by my backend.",
    slug: "browser-voice-agent",
    headline: "Browser voice agent",
    summary:
      "Build a TypeScript realtime voice agent using WebRTC and an ephemeral credential issued by my backend.",
    question: "What should you inspect in the browser voice agent exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 154,
    section: "20. Realtime speech-to-speech agents",
    title: "Server voice connection",
    prompt:
      "Run a realtime agent through a supported server WebSocket integration and explain its audio-handling responsibilities.",
    slug: "server-voice-connection",
    headline: "Server voice connection",
    summary:
      "Run a realtime agent through a supported server WebSocket integration and explain its audio-handling responsibilities.",
    question:
      "What should you inspect in the server voice connection exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 155,
    section: "20. Realtime speech-to-speech agents",
    title: "Turn detection",
    prompt:
      "Compare server VAD, semantic VAD, and manual turn control for supported realtime models.",
    slug: "turn-detection",
    headline: "Turn detection",
    summary:
      "Compare server VAD, semantic VAD, and manual turn control for supported realtime models.",
    question: "What should you inspect in the turn detection exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 156,
    section: "20. Realtime speech-to-speech agents",
    title: "Interruptions",
    prompt:
      "Implement user interruption handling so audio playback and conversation history remain consistent.",
    slug: "interruptions",
    headline: "Interruptions",
    summary:
      "Implement user interruption handling so audio playback and conversation history remain consistent.",
    question: "What should you inspect in the interruptions exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 157,
    section: "20. Realtime speech-to-speech agents",
    title: "Realtime tools",
    prompt:
      "Add a private order-lookup tool to a voice agent while keeping execution and credentials on the backend.",
    slug: "realtime-tools",
    headline: "Realtime tools",
    summary:
      "Add a private order-lookup tool to a voice agent while keeping execution and credentials on the backend.",
    question: "What should you inspect in the realtime tools exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 158,
    section: "20. Realtime speech-to-speech agents",
    title: "Voice handoffs",
    prompt:
      "Transfer a spoken conversation between specialists while preserving relevant context.",
    slug: "voice-handoffs",
    headline: "Voice handoffs",
    summary:
      "Transfer a spoken conversation between specialists while preserving relevant context.",
    question: "What should you inspect in the voice handoffs exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 159,
    section: "20. Realtime speech-to-speech agents",
    title: "Realtime events",
    prompt:
      "Display transcripts, session status, tool progress, and conversation updates using documented realtime events.",
    slug: "realtime-events",
    headline: "Realtime events",
    summary:
      "Display transcripts, session status, tool progress, and conversation updates using documented realtime events.",
    question: "What should you inspect in the realtime events exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 160,
    section: "20. Realtime speech-to-speech agents",
    title: "Voice controls",
    prompt:
      "Add supported realtime guardrails and approval handling, explaining limitations once audio has already played.",
    slug: "voice-controls",
    headline: "Voice controls",
    summary:
      "Add supported realtime guardrails and approval handling, explaining limitations once audio has already played.",
    question: "What should you inspect in the voice controls exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Realtime speech-to-speech agents",
  },
  {
    number: 161,
    section: "21. Chained voice and other voice integrations",
    title: "Python voice pipeline",
    prompt:
      "Create a Python VoicePipeline that connects speech recognition, an existing agent, and speech generation.",
    slug: "python-voice-pipeline",
    headline: "Python voice pipeline",
    summary:
      "Create a Python VoicePipeline that connects speech recognition, an existing agent, and speech generation.",
    question: "What should you inspect in the python voice pipeline exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 162,
    section: "21. Chained voice and other voice integrations",
    title: "Streaming audio input",
    prompt:
      "Process supported streaming audio input and stream the resulting speech back to the application.",
    slug: "streaming-audio-input",
    headline: "Streaming audio input",
    summary:
      "Process supported streaming audio input and stream the resulting speech back to the application.",
    question: "What should you inspect in the streaming audio input exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 163,
    section: "21. Chained voice and other voice integrations",
    title: "Speech recognition",
    prompt:
      "Configure transcription language and relevant recognition settings, then evaluate errors on representative recordings.",
    slug: "speech-recognition",
    headline: "Speech recognition",
    summary:
      "Configure transcription language and relevant recognition settings, then evaluate errors on representative recordings.",
    question: "What should you inspect in the speech recognition exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 164,
    section: "21. Chained voice and other voice integrations",
    title: "Speech generation",
    prompt:
      "Configure supported voice and speech-output settings and measure time to first audio.",
    slug: "speech-generation",
    headline: "Speech generation",
    summary:
      "Configure supported voice and speech-output settings and measure time to first audio.",
    question: "What should you inspect in the speech generation exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 165,
    section: "21. Chained voice and other voice integrations",
    title: "Custom voice workflow",
    prompt:
      "Create a custom voice workflow around several agents while retaining access to intermediate text.",
    slug: "custom-voice-workflow",
    headline: "Custom voice workflow",
    summary:
      "Create a custom voice workflow around several agents while retaining access to intermediate text.",
    question: "What should you inspect in the custom voice workflow exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 166,
    section: "21. Chained voice and other voice integrations",
    title: "GPT-Live integration",
    prompt:
      "Connect GPT-Live through client delegation to my existing Agents SDK backend and preserve its authorization rules.",
    slug: "gpt-live-integration",
    headline: "GPT-Live integration",
    summary:
      "Connect GPT-Live through client delegation to my existing Agents SDK backend and preserve its authorization rules.",
    question: "What should you inspect in the gpt-live integration exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 167,
    section: "21. Chained voice and other voice integrations",
    title: "Server-side control",
    prompt:
      "Attach supported server-side voice controls and prevent duplicate execution when events are replayed or delivered twice.",
    slug: "server-side-control",
    headline: "Server-side control",
    summary:
      "Attach supported server-side voice controls and prevent duplicate execution when events are replayed or delivered twice.",
    question: "What should you inspect in the server-side control exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 168,
    section: "21. Chained voice and other voice integrations",
    title: "Telephony integration",
    prompt:
      "Connect an agent workflow to a supported telephony transport and handle call lifecycle, cancellation, and connection failures.",
    slug: "telephony-integration",
    headline: "Telephony integration",
    summary:
      "Connect an agent workflow to a supported telephony transport and handle call lifecycle, cancellation, and connection failures.",
    question: "What should you inspect in the telephony integration exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Chained voice and other voice integrations",
  },
  {
    number: 169,
    section: "22. Testing and evaluation",
    title: "Deterministic model tests",
    prompt:
      "Test agent orchestration using a scripted or fake model, preferring documented SDK testing helpers when available.",
    slug: "deterministic-model-tests",
    headline: "Deterministic model tests",
    summary:
      "Test agent orchestration using a scripted or fake model, preferring documented SDK testing helpers when available.",
    question:
      "What should you inspect in the deterministic model tests exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 170,
    section: "22. Testing and evaluation",
    title: "Tool unit tests",
    prompt:
      "Test tool validation, authorization, successful results, and failures without making paid model calls.",
    slug: "tool-unit-tests",
    headline: "Tool unit tests",
    summary:
      "Test tool validation, authorization, successful results, and failures without making paid model calls.",
    question: "What should you inspect in the tool unit tests exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 171,
    section: "22. Testing and evaluation",
    title: "Routing tests",
    prompt:
      "Test that representative requests reach the correct specialist and preserve the expected conversation ownership.",
    slug: "routing-tests",
    headline: "Routing tests",
    summary:
      "Test that representative requests reach the correct specialist and preserve the expected conversation ownership.",
    question: "What should you inspect in the routing tests exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 172,
    section: "22. Testing and evaluation",
    title: "Approval tests",
    prompt:
      "Test approval, rejection, timeout, serialization, and resumption paths without performing real external writes.",
    slug: "approval-tests",
    headline: "Approval tests",
    summary:
      "Test approval, rejection, timeout, serialization, and resumption paths without performing real external writes.",
    question: "What should you inspect in the approval tests exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 173,
    section: "22. Testing and evaluation",
    title: "Streaming and runtime tests",
    prompt:
      "Use supported test doubles to verify streaming, sandbox, realtime, or voice behavior relevant to this application.",
    slug: "streaming-and-runtime-tests",
    headline: "Streaming and runtime tests",
    summary:
      "Use supported test doubles to verify streaming, sandbox, realtime, or voice behavior relevant to this application.",
    question:
      "What should you inspect in the streaming and runtime tests exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 174,
    section: "22. Testing and evaluation",
    title: "Evaluation dataset",
    prompt:
      "Create a representative evaluation dataset containing normal tasks, ambiguous requests, missing information, and failure cases.",
    slug: "evaluation-dataset",
    headline: "Evaluation dataset",
    summary:
      "Create a representative evaluation dataset containing normal tasks, ambiguous requests, missing information, and failure cases.",
    question: "What should you inspect in the evaluation dataset exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 175,
    section: "22. Testing and evaluation",
    title: "Trace evaluation",
    prompt:
      "Evaluate whether the workflow chose appropriate tools, made correct handoffs, and respected its instructions.",
    slug: "trace-evaluation",
    headline: "Trace evaluation",
    summary:
      "Evaluate whether the workflow chose appropriate tools, made correct handoffs, and respected its instructions.",
    question: "What should you inspect in the trace evaluation exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 176,
    section: "22. Testing and evaluation",
    title: "Regression comparison",
    prompt:
      "Compare prompt or model versions on task success, latency, cost, and failure rate before adopting a change.",
    slug: "regression-comparison",
    headline: "Regression comparison",
    summary:
      "Compare prompt or model versions on task success, latency, cost, and failure rate before adopting a change.",
    question: "What should you inspect in the regression comparison exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Testing and evaluation",
  },
  {
    number: 177,
    section: "23. Reliability and deployment",
    title: "Retry policy",
    prompt:
      "Configure SDK and application retries together, avoiding duplicated retry layers and repeated external side effects.",
    slug: "retry-policy",
    headline: "Retry policy",
    summary:
      "Configure SDK and application retries together, avoiding duplicated retry layers and repeated external side effects.",
    question: "What should you inspect in the retry policy exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 178,
    section: "23. Reliability and deployment",
    title: "Timeout policy",
    prompt:
      "Set model, tool, and overall request timeouts, and verify cleanup when each deadline expires.",
    slug: "timeout-policy",
    headline: "Timeout policy",
    summary:
      "Set model, tool, and overall request timeouts, and verify cleanup when each deadline expires.",
    question: "What should you inspect in the timeout policy exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 179,
    section: "23. Reliability and deployment",
    title: "Execution budgets",
    prompt:
      "Enforce application budgets for time, turns, tool calls, and spending, distinguishing estimates from hard limits.",
    slug: "execution-budgets",
    headline: "Execution budgets",
    summary:
      "Enforce application budgets for time, turns, tool calls, and spending, distinguishing estimates from hard limits.",
    question: "What should you inspect in the execution budgets exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 180,
    section: "23. Reliability and deployment",
    title: "Background jobs",
    prompt:
      "Run agent work in a queue worker with job identifiers, cancellation, and idempotent result handling.",
    slug: "background-jobs",
    headline: "Background jobs",
    summary:
      "Run agent work in a queue worker with job identifiers, cancellation, and idempotent result handling.",
    question: "What should you inspect in the background jobs exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 181,
    section: "23. Reliability and deployment",
    title: "Authenticated API",
    prompt:
      "Expose an authenticated backend endpoint with tenant isolation, request validation, and rate limits.",
    slug: "authenticated-api",
    headline: "Authenticated API",
    summary:
      "Expose an authenticated backend endpoint with tenant isolation, request validation, and rate limits.",
    question: "What should you inspect in the authenticated api exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 182,
    section: "23. Reliability and deployment",
    title: "Application frontend",
    prompt:
      "Build a chat interface showing streaming output, citations, tool progress, and approval requests.",
    slug: "application-frontend",
    headline: "Application frontend",
    summary:
      "Build a chat interface showing streaming output, citations, tool progress, and approval requests.",
    question: "What should you inspect in the application frontend exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 183,
    section: "23. Reliability and deployment",
    title: "Deployment",
    prompt:
      "Containerize the application with persistent storage, health checks, configuration management, and graceful shutdown.",
    slug: "deployment",
    headline: "Deployment",
    summary:
      "Containerize the application with persistent storage, health checks, configuration management, and graceful shutdown.",
    question: "What should you inspect in the deployment exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 184,
    section: "23. Reliability and deployment",
    title: "Durable execution",
    prompt:
      "Integrate a suitable durable workflow engine and demonstrate recovery after a worker crashes during an agent task.",
    slug: "durable-execution",
    headline: "Durable execution",
    summary:
      "Integrate a suitable durable workflow engine and demonstrate recovery after a worker crashes during an agent task.",
    question: "What should you inspect in the durable execution exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Reliability and deployment",
  },
  {
    number: 185,
    section: "24. Advanced extensions and compatibility checks",
    title: "Encrypted sessions",
    prompt:
      "Implement session encryption and retention using a supported backend or an explicit application-level storage wrapper.",
    slug: "encrypted-sessions",
    headline: "Encrypted sessions",
    summary:
      "Implement session encryption and retention using a supported backend or an explicit application-level storage wrapper.",
    question: "What should you inspect in the encrypted sessions exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 186,
    section: "24. Advanced extensions and compatibility checks",
    title: "Conversation branches",
    prompt:
      "Implement supported conversation branching and compare alternate continuations while maintaining valid history.",
    slug: "conversation-branches",
    headline: "Conversation branches",
    summary:
      "Implement supported conversation branching and compare alternate continuations while maintaining valid history.",
    question: "What should you inspect in the conversation branches exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 187,
    section: "24. Advanced extensions and compatibility checks",
    title: "Provider adapters",
    prompt:
      "Evaluate documented LiteLLM, Any-LLM, or equivalent adapters for my language, recording unsupported features and configuration differences.",
    slug: "provider-adapters",
    headline: "Provider adapters",
    summary:
      "Evaluate documented LiteLLM, Any-LLM, or equivalent adapters for my language, recording unsupported features and configuration differences.",
    question: "What should you inspect in the provider adapters exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 188,
    section: "24. Advanced extensions and compatibility checks",
    title: "Decision-based routing",
    prompt:
      "Use the Decisions API as an application-level classification step before selecting an SDK agent.",
    slug: "decision-based-routing",
    headline: "Decision-based routing",
    summary:
      "Use the Decisions API as an application-level classification step before selecting an SDK agent.",
    question: "What should you inspect in the decision-based routing exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 189,
    section: "24. Advanced extensions and compatibility checks",
    title: "Codex delegation",
    prompt:
      "Delegate a bounded coding task to Codex through the currently documented integration, preserving workspace boundaries and reviewable results.",
    slug: "codex-delegation",
    headline: "Codex delegation",
    summary:
      "Delegate a bounded coding task to Codex through the currently documented integration, preserving workspace boundaries and reviewable results.",
    question: "What should you inspect in the codex delegation exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 190,
    section: "24. Advanced extensions and compatibility checks",
    title: "Hosted subagents",
    prompt:
      "Check experimental SDK integration with hosted multi-agent execution, and document its differences from local handoffs and agents-as-tools.",
    slug: "hosted-subagents",
    headline: "Hosted subagents",
    summary:
      "Check experimental SDK integration with hosted multi-agent execution, and document its differences from local handoffs and agents-as-tools.",
    question: "What should you inspect in the hosted subagents exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 191,
    section: "24. Advanced extensions and compatibility checks",
    title: "ChatKit interface",
    prompt:
      "Connect a self-hosted ChatKit interface to my Agents SDK backend, including persistent threads and streamed results.",
    slug: "chatkit-interface",
    headline: "ChatKit interface",
    summary:
      "Connect a self-hosted ChatKit interface to my Agents SDK backend, including persistent threads and streamed results.",
    question: "What should you inspect in the chatkit interface exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 192,
    section: "24. Advanced extensions and compatibility checks",
    title: "Release coverage audit",
    prompt:
      "Compare my installed SDK against its current official documentation and release notes, then add exercises for uncovered public capabilities.",
    slug: "release-coverage-audit",
    headline: "Release coverage audit",
    summary:
      "Compare my installed SDK against its current official documentation and release notes, then add exercises for uncovered public capabilities.",
    question: "What should you inspect in the release coverage audit exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Advanced extensions and compatibility checks",
  },
  {
    number: 193,
    section: "25. Practical projects that combine the capabilities",
    title: "Customer-support assistant",
    prompt:
      "Build a support assistant with specialist handoffs, persistent sessions, order tools, approval-required changes, tracing, and regression tests.",
    slug: "customer-support-assistant",
    headline: "Customer-support assistant",
    summary:
      "Build a support assistant with specialist handoffs, persistent sessions, order tools, approval-required changes, tracing, and regression tests.",
    question:
      "What should you inspect in the customer-support assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 194,
    section: "25. Practical projects that combine the capabilities",
    title: "Knowledge assistant",
    prompt:
      "Build a document assistant with retrieval, source citations, access control, structured answers, and an insufficient-evidence response.",
    slug: "knowledge-assistant",
    headline: "Knowledge assistant",
    summary:
      "Build a document assistant with retrieval, source citations, access control, structured answers, and an insufficient-evidence response.",
    question: "What should you inspect in the knowledge assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 195,
    section: "25. Practical projects that combine the capabilities",
    title: "Research assistant",
    prompt:
      "Build a research assistant that searches sources, delegates independent research tasks, compares findings, and produces a cited report.",
    slug: "research-assistant",
    headline: "Research assistant",
    summary:
      "Build a research assistant that searches sources, delegates independent research tasks, compares findings, and produces a cited report.",
    question: "What should you inspect in the research assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 196,
    section: "25. Practical projects that combine the capabilities",
    title: "Business-workflow assistant",
    prompt:
      "Build a workflow assistant that prepares proposed record changes, obtains approval, executes them once, and records an audit trail.",
    slug: "business-workflow-assistant",
    headline: "Business-workflow assistant",
    summary:
      "Build a workflow assistant that prepares proposed record changes, obtains approval, executes them once, and records an audit trail.",
    question:
      "What should you inspect in the business-workflow assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 197,
    section: "25. Practical projects that combine the capabilities",
    title: "Data-analysis assistant",
    prompt:
      "Build an assistant that analyzes uploaded datasets, validates calculations, creates charts, and returns downloadable artifacts.",
    slug: "data-analysis-assistant",
    headline: "Data-analysis assistant",
    summary:
      "Build an assistant that analyzes uploaded datasets, validates calculations, creates charts, and returns downloadable artifacts.",
    question:
      "What should you inspect in the data-analysis assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 198,
    section: "25. Practical projects that combine the capabilities",
    title: "Coding assistant",
    prompt:
      "Build a sandbox coding assistant that inspects a repository, applies changes, runs relevant checks, and presents the resulting diff.",
    slug: "coding-assistant",
    headline: "Coding assistant",
    summary:
      "Build a sandbox coding assistant that inspects a repository, applies changes, runs relevant checks, and presents the resulting diff.",
    question: "What should you inspect in the coding assistant exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 199,
    section: "25. Practical projects that combine the capabilities",
    title: "Voice support application",
    prompt:
      "Build a voice support application with backend tools, specialist routing, interruption handling, transcripts, and observable failures.",
    slug: "voice-support-application",
    headline: "Voice support application",
    summary:
      "Build a voice support application with backend tools, specialist routing, interruption handling, transcripts, and observable failures.",
    question:
      "What should you inspect in the voice support application exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
  {
    number: 200,
    section: "25. Practical projects that combine the capabilities",
    title: "Production capstone",
    prompt:
      "Take one completed project through evaluation, deployment, monitoring, failure recovery, and a documented capability-and-limitations review.",
    slug: "production-capstone",
    headline: "Production capstone",
    summary:
      "Take one completed project through evaluation, deployment, monitoring, failure recovery, and a documented capability-and-limitations review.",
    question: "What should you inspect in the production capstone exercise?",
    answers: [
      "The execution evidence and scenario outcome",
      "Only the application title",
      "Only the source filename",
    ],
    correct: 0,
    explanation:
      "Compare both scenarios and inspect the actual operations, decisions and resulting state.",
    live: false,
    category: "Practical projects that combine the capabilities",
  },
];
