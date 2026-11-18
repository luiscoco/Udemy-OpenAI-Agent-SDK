export const controlLessons = [
  {
    number: 65,
    section: "9. Tool execution control and discovery",
    title: "Tool choice",
    prompt:
      "Demonstrate automatic tool selection, required tool use, and forcing a specific tool where supported.",
    slug: "tool-choice",
    headline: "Compare automatic, required and specific tool selection.",
    summary:
      "Tool choice is sent through modelSettings. The SDK resets a forced choice after use by default.",
    question: "Which setting forces a specific function tool?",
    answers: [
      "toolChoice set to its registered name",
      "The tool description alone",
      "The final answer text",
    ],
    correct: 0,
    explanation:
      "Tool choice is sent through modelSettings. The SDK resets a forced choice after use by default.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 66,
    section: "9. Tool execution control and discovery",
    title: "Stopping after tools",
    prompt:
      "Stop a run after a tool result using the SDK’s supported tool-use behavior.",
    slug: "stopping-after-tools",
    headline: "Return a tool result directly or ask the model to continue.",
    summary: "toolUseBehavior controls completion after function tools.",
    question: "Which behavior returns the first function-tool result?",
    answers: ["stop_on_first_tool", "parallelToolCalls", "resetToolChoice"],
    correct: 0,
    explanation: "toolUseBehavior controls completion after function tools.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 67,
    section: "9. Tool execution control and discovery",
    title: "Custom completion policy",
    prompt:
      "Implement a supported custom policy that decides whether tool results should end the run or return to the model.",
    slug: "custom-completion-policy",
    headline: "Decide completion from actual structured tool results.",
    summary:
      "The callback returns isFinalOutput and supplies finalOutput when finishing.",
    question: "What does the completion callback return?",
    answers: [
      "An isFinalOutput decision",
      "A new API key",
      "A tool argument schema",
    ],
    correct: 0,
    explanation:
      "The callback returns isFinalOutput and supplies finalOutput when finishing.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 68,
    section: "9. Tool execution control and discovery",
    title: "Conditional availability",
    prompt:
      "Enable tools dynamically from application context while retaining authorization checks inside their implementations.",
    slug: "conditional-availability",
    headline: "Resolve tool exposure and enforce resource permissions.",
    summary:
      "Availability controls exposure. Current application permissions govern resource access.",
    question: "Where must resource permission be checked?",
    answers: [
      "Inside the implementation before a change",
      "Only in the tool description",
      "Only in the model answer",
    ],
    correct: 0,
    explanation:
      "Availability controls exposure. Current application permissions govern resource access.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 69,
    section: "9. Tool execution control and discovery",
    title: "Concurrency",
    prompt:
      "Compare model-side parallel tool calls with application-side execution concurrency and enforce an appropriate concurrency limit.",
    slug: "concurrency",
    headline: "Measure local execution under provider and executor settings.",
    summary:
      "Run options can bound local function-tool execution independently of provider parallelToolCalls.",
    question: "What bounds local callback concurrency?",
    answers: [
      "maxFunctionToolConcurrency",
      "A tool name",
      "The model answer length",
    ],
    correct: 0,
    explanation:
      "Run options can bound local function-tool execution independently of provider parallelToolCalls.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 70,
    section: "9. Tool execution control and discovery",
    title: "Repeated-call prevention",
    prompt:
      "Demonstrate tool-choice reset behavior and prevent a forced tool from causing an endless execution loop.",
    slug: "repeated-call-prevention",
    headline: "Observe tool-choice reset and bounded repetition.",
    summary:
      "resetToolChoice permits a subsequent response to finish. maxTurns bounds repeated-call failure.",
    question: "What allows completion after forcing a tool?",
    answers: [
      "Resetting the forced tool choice",
      "Removing the turn budget",
      "Repeating the same forced choice forever",
    ],
    correct: 0,
    explanation:
      "resetToolChoice permits a subsequent response to finish. maxTurns bounds repeated-call failure.",
    live: false,
    category: "Tool execution and discovery",
  },
  {
    number: 71,
    section: "9. Tool execution control and discovery",
    title: "Deferred discovery",
    prompt:
      "Configure hosted tool search with deferred tools and namespaces, checking support in my selected SDK.",
    slug: "deferred-discovery",
    headline: "Discover deferred tools grouped in a namespace.",
    summary:
      "The installed SDK supports hosted tool search, deferred functions and namespaces.",
    question: "What loads deferred tool definitions on demand?",
    answers: [
      "toolSearchTool",
      "A plain JavaScript import in the prompt",
      "The final answer",
    ],
    correct: 0,
    explanation:
      "The installed SDK supports hosted tool search, deferred functions and namespaces.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 72,
    section: "9. Tool execution control and discovery",
    title: "Programmatic tool calling",
    prompt:
      "Enable supported programmatic tool calling, restrict eligible tools, and aggregate several read-only results in generated JavaScript.",
    slug: "programmatic-tool-calling",
    headline: "Aggregate read-only results using JavaScript.",
    summary:
      "allowedCallers controls direct and programmatic eligibility. Child calls retain caller metadata.",
    question: "What restricts programmatic tool eligibility?",
    answers: [
      "allowedCallers on each tool",
      "The display title",
      "The number of browser tabs",
    ],
    correct: 0,
    explanation:
      "allowedCallers controls direct and programmatic eligibility. Child calls retain caller metadata.",
    live: true,
    category: "Tool execution and discovery",
  },
  {
    number: 73,
    section: "10. Hosted tools and retrieval",
    title: "Web search",
    prompt:
      "Add web search and return answers with usable source citations and supported search restrictions.",
    slug: "web-search",
    headline: "Search with domain restrictions and usable source citations.",
    summary:
      "The interface renders actual returned citation annotations as usable source links.",
    question: "What should the interface preserve from web-search answers?",
    answers: [
      "Returned source annotations and URLs",
      "Invented source addresses",
      "Only the model name",
    ],
    correct: 0,
    explanation:
      "The interface renders actual returned citation annotations as usable source links.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 74,
    section: "10. Hosted tools and retrieval",
    title: "File search",
    prompt:
      "Connect a document collection through a vector store and answer questions using the hosted file-search tool.",
    slug: "file-search",
    headline: "Connect a hosted document collection and cite retrieved files.",
    summary:
      "Configure a vector store with indexed files, then pass its ID to fileSearchTool.",
    question: "What resource does hosted file search query?",
    answers: [
      "An OpenAI vector store",
      "The browser downloads folder automatically",
      "The model instructions alone",
    ],
    correct: 0,
    explanation:
      "Configure a vector store with indexed files, then pass its ID to fileSearchTool.",
    live: true,
    category: "Hosted tools and retrieval",
  },
];
