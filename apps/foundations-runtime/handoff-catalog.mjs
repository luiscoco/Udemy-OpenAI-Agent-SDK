export const handoffLessons = [
  {
    number: 85,
    section: "11. Model Context Protocol: MCP",
    title: "Tool filtering",
    prompt:
      "Expose only approved MCP tools using supported static or context-dependent filters.",
    slug: "tool-filtering",
    headline: "Control which MCP definitions reach the model.",
    summary:
      "Static and context filters select exposed MCP capabilities. Resource permissions remain enforced inside implementations.",
    question: "Where is a context-dependent MCP filter evaluated?",
    answers: [
      "Against the run context before exposure",
      "Inside the final answer",
      "Only in the tool name",
    ],
    correct: 0,
    explanation:
      "Static and context filters select exposed MCP capabilities. Resource permissions remain enforced inside implementations.",
    live: true,
    category: "Model Context Protocol",
  },
  {
    number: 86,
    section: "11. Model Context Protocol: MCP",
    title: "Tool-list caching",
    prompt:
      "Configure supported MCP tool-list caching and demonstrate when cached definitions must be invalidated.",
    slug: "tool-list-caching",
    headline: "Observe cached definitions and explicit invalidation.",
    summary:
      "In this installed SDK, HTTP tool-list caching is tied to a session. The fixture supplies a session ID to demonstrate invalidation.",
    question: "What refreshes a changed cached MCP definition?",
    answers: [
      "invalidateToolsCache",
      "Changing the final answer",
      "Reusing an old description",
    ],
    correct: 0,
    explanation:
      "In this installed SDK, HTTP tool-list caching is tied to a session. The fixture supplies a session ID to demonstrate invalidation.",
    live: false,
    category: "Model Context Protocol",
  },
  {
    number: 87,
    section: "11. Model Context Protocol: MCP",
    title: "Connection failures",
    prompt:
      "Handle MCP connection failures, timeouts, server restarts, and cleanup without hiding the underlying problem.",
    slug: "connection-failures",
    headline: "Diagnose a real failure and reconnect after restart.",
    summary:
      "The exercise observes real refused connections, request deadlines and a server restart. Owned clients and servers close after the attempt.",
    question: "What should a connection recovery preserve?",
    answers: [
      "The original failure diagnostic",
      "A fabricated successful tool result",
      "An open failed connection",
    ],
    correct: 0,
    explanation:
      "The exercise observes real refused connections, request deadlines and a server restart. Owned clients and servers close after the attempt.",
    live: false,
    category: "Model Context Protocol",
  },
  {
    number: 88,
    section: "11. Model Context Protocol: MCP",
    title: "Prompts and resources",
    prompt:
      "Demonstrate supported MCP prompts and resources, explaining how they differ from automatically exposed tools.",
    slug: "prompts-and-resources",
    headline: "Retrieve MCP data and templates explicitly.",
    summary:
      "Resources contain application data and prompts contain reusable messages. Their contents are included through an explicit application decision.",
    question: "How does resource text reach the model in this lesson?",
    answers: [
      "The application explicitly includes it",
      "It is automatically registered as a function tool",
      "It is part of the API credential",
    ],
    correct: 0,
    explanation:
      "Resources contain application data and prompts contain reusable messages. Their contents are included through an explicit application decision.",
    live: true,
    category: "Model Context Protocol",
  },
  {
    number: 89,
    section: "12. Handoffs and specialist ownership",
    title: "First handoff",
    prompt:
      "Build a triage agent that hands requests to billing, technical-support, or account specialists.",
    slug: "first-handoff",
    headline: "Transfer a support request to its specialist.",
    summary:
      "The SDK transfers conversation ownership to the receiving specialist and reports its identity through lastAgent.",
    question: "Who owns the final answer after a handoff?",
    answers: [
      "The receiving specialist",
      "The transport server",
      "The source explorer",
    ],
    correct: 0,
    explanation:
      "The SDK transfers conversation ownership to the receiving specialist and reports its identity through lastAgent.",
    live: true,
    category: "Specialist ownership",
  },
  {
    number: 90,
    section: "12. Handoffs and specialist ownership",
    title: "Ownership comparison",
    prompt:
      "Implement the same task using a handoff and an agent-as-tool, then compare who produces the final answer.",
    slug: "ownership-comparison",
    headline: "Compare handoffs with agents used as tools.",
    summary:
      "A handoff transfers ownership. An agent-as-tool returns a bounded specialist result to the manager.",
    question: "Who answers after an agent-as-tool finishes?",
    answers: [
      "The manager continues to its final answer",
      "The MCP server automatically answers",
      "The browser chooses an owner",
    ],
    correct: 0,
    explanation:
      "A handoff transfers ownership. An agent-as-tool returns a bounded specialist result to the manager.",
    live: true,
    category: "Specialist ownership",
  },
  {
    number: 91,
    section: "12. Handoffs and specialist ownership",
    title: "Routing descriptions",
    prompt:
      "Write specialist descriptions that clearly distinguish when each handoff should occur.",
    slug: "routing-descriptions",
    headline: "Distinguish specialist responsibilities in routing metadata.",
    summary:
      "Specific names and descriptions clarify routing. Classroom ambiguous decisions are controlled examples, and live choices can vary.",
    question: "What helps the model distinguish handoff destinations?",
    answers: [
      "Specific descriptions of each responsibility",
      "Identical vague descriptions",
      "A longer unrelated history",
    ],
    correct: 0,
    explanation:
      "Specific names and descriptions clarify routing. Classroom ambiguous decisions are controlled examples, and live choices can vary.",
    live: true,
    category: "Specialist ownership",
  },
  {
    number: 92,
    section: "12. Handoffs and specialist ownership",
    title: "Handoff metadata",
    prompt:
      "Pass validated structured metadata during a handoff using the selected SDK’s supported API.",
    slug: "handoff-metadata",
    headline: "Validate structured metadata before a transfer.",
    summary:
      "inputType validates handoff arguments before the callback runs. Metadata supplements the fixed destination and application context.",
    question: "When does onHandoff receive structured metadata?",
    answers: [
      "After the input schema validates it",
      "Before argument validation",
      "Only after the browser closes",
    ],
    correct: 0,
    explanation:
      "inputType validates handoff arguments before the callback runs. Metadata supplements the fixed destination and application context.",
    live: true,
    category: "Specialist ownership",
  },
  {
    number: 93,
    section: "12. Handoffs and specialist ownership",
    title: "Handoff callbacks",
    prompt:
      "Run a callback when a handoff occurs to record application-level routing information.",
    slug: "handoff-callbacks",
    headline: "Record an application event when ownership transfers.",
    summary:
      "The supported onHandoff callback records the actual routing event before the receiving agent starts.",
    question: "When does the handoff callback run?",
    answers: [
      "When the SDK invokes the handoff",
      "When an agent is merely constructed",
      "Whenever a description is viewed",
    ],
    correct: 0,
    explanation:
      "The supported onHandoff callback records the actual routing event before the receiving agent starts.",
    live: true,
    category: "Specialist ownership",
  },
  {
    number: 94,
    section: "12. Handoffs and specialist ownership",
    title: "History filtering",
    prompt:
      "Filter the conversation passed to a specialist while preserving the information needed to complete its task.",
    slug: "history-filtering",
    headline: "Keep the invoice request while filtering unrelated history.",
    summary:
      "The filter retains the invoice and amount and removes unrelated history plus tool-history pairs through the supported helper.",
    question: "What must a handoff history filter preserve?",
    answers: [
      "The information needed to complete the task",
      "Every unrelated message",
      "Only the last agent name",
    ],
    correct: 0,
    explanation:
      "The filter retains the invoice and amount and removes unrelated history plus tool-history pairs through the supported helper.",
    live: true,
    category: "Specialist ownership",
  },
];
