export const hostedLessons = [
  {
    number: 75,
    section: "10. Hosted tools and retrieval",
    title: "Retrieval controls",
    prompt:
      "Apply supported file-search filters and result limits, and inspect retrieved evidence and citations.",
    slug: "retrieval-controls",
    headline: "Filter the collection and inspect returned evidence.",
    summary:
      "File attribute filters constrain retrieval. Returned evidence and citations show what the provider used.",
    question: "What does a file-search attribute filter select?",
    answers: [
      "Files with matching attributes",
      "The browser history",
      "The API credential",
    ],
    correct: 0,
    explanation:
      "File attribute filters constrain retrieval. Returned evidence and citations show what the provider used.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 76,
    section: "10. Hosted tools and retrieval",
    title: "Custom RAG",
    prompt:
      "Implement a custom retrieval tool backed by my chosen database, including authorization and an insufficient-evidence response.",
    slug: "custom-rag",
    headline: "Retrieve evidence through an authorized database tool.",
    summary:
      "The tool binds the tenant from application context to its SQLite query and reports insufficient evidence for empty results.",
    question: "Where does the trusted tenant ID come from?",
    answers: ["Application context", "Model-supplied SQL", "A source citation"],
    correct: 0,
    explanation:
      "The tool binds the tenant from application context to its SQLite query and reports insufficient evidence for empty results.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 77,
    section: "10. Hosted tools and retrieval",
    title: "Code Interpreter",
    prompt:
      "Use Code Interpreter to analyze a CSV, validate calculations, and return generated charts or files.",
    slug: "code-interpreter",
    headline: "Analyze a CSV and validate its generated file.",
    summary:
      "The application compares totals and means against the source CSV before offering its generated file.",
    question: "What gates acceptance of the analysis?",
    answers: [
      "Independent application calculations",
      "A confident model explanation",
      "The tool name",
    ],
    correct: 0,
    explanation:
      "The application compares totals and means against the source CSV before offering its generated file.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 78,
    section: "10. Hosted tools and retrieval",
    title: "Image generation",
    prompt:
      "Add the image-generation tool and correctly extract, store, and display generated image results.",
    slug: "image-generation",
    headline: "Extract, verify and display stored image results.",
    summary:
      "The application decodes returned base64, verifies its format and serves a stored artifact.",
    question: "What contains the generated image bytes?",
    answers: [
      "The image-generation result field",
      "The assistant name",
      "The API key",
    ],
    correct: 0,
    explanation:
      "The application decodes returned base64, verifies its format and serves a stored artifact.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 79,
    section: "10. Hosted tools and retrieval",
    title: "Hosted shell",
    prompt:
      "Integrate supported hosted-shell execution, including container reuse, input files, and appropriate network configuration.",
    slug: "hosted-shell",
    headline: "Reuse a hosted container with an input file.",
    summary:
      "The application configures container input files and network policy, then passes a container reference to shellTool.",
    question: "Where is hosted-shell network policy configured?",
    answers: [
      "On the hosted container environment",
      "In the generated command comments",
      "In the browser viewport",
    ],
    correct: 0,
    explanation:
      "The application configures container input files and network policy, then passes a container reference to shellTool.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 80,
    section: "10. Hosted tools and retrieval",
    title: "Computer use",
    prompt:
      "Connect a computer-use agent to an isolated browser or desktop runtime and verify actions through screenshots.",
    slug: "computer-use",
    headline: "Observe browser actions through real screenshots.",
    summary:
      "A fresh browser context runs a local counter page. Screenshots and the actual counter verify SDK-dispatched actions.",
    question: "What verifies that a requested UI action worked?",
    answers: [
      "An observed screenshot and application state",
      "The proposed action alone",
      "The tool description",
    ],
    correct: 0,
    explanation:
      "A fresh browser context runs a local counter page. Screenshots and the actual counter verify SDK-dispatched actions.",
    live: true,
    category: "Hosted tools and retrieval",
  },
  {
    number: 81,
    section: "11. Model Context Protocol: MCP",
    title: "Local MCP",
    prompt:
      "Connect an agent to a local MCP server using stdio and close the connection reliably.",
    slug: "local-mcp",
    headline: "Discover and call a tool over stdio.",
    summary:
      "The SDK starts a local MCP subprocess, discovers its timetable tool and closes the connection after the run.",
    question: "What must run after a stdio MCP session?",
    answers: [
      "Connection cleanup in finally",
      "Printing logs to protocol stdout",
      "A hosted vector-store upload",
    ],
    correct: 0,
    explanation:
      "The SDK starts a local MCP subprocess, discovers its timetable tool and closes the connection after the run.",
    live: true,
    category: "Model Context Protocol",
  },
  {
    number: 82,
    section: "11. Model Context Protocol: MCP",
    title: "Remote MCP",
    prompt:
      "Connect to an MCP server using Streamable HTTP and demonstrate a successful tool call.",
    slug: "remote-mcp",
    headline: "Call a timetable tool through Streamable HTTP.",
    summary:
      "The SDK exchanges MCP JSON-RPC requests with a separate loopback HTTP server and closes both owned resources.",
    question: "Which transport does this remote MCP example use?",
    answers: ["Streamable HTTP", "A plain model message", "A database cursor"],
    correct: 0,
    explanation:
      "The SDK exchanges MCP JSON-RPC requests with a separate loopback HTTP server and closes both owned resources.",
    live: true,
    category: "Model Context Protocol",
  },
  {
    number: 83,
    section: "11. Model Context Protocol: MCP",
    title: "Hosted MCP",
    prompt:
      "Configure hosted MCP and compare its execution path with an SDK-managed MCP connection.",
    slug: "hosted-mcp",
    headline: "Compare application and provider MCP connections.",
    summary:
      "SDK-managed MCP runs through the application connection. Hosted MCP sends a public server definition to the provider.",
    question: "Who connects to the server in the hosted path?",
    answers: [
      "The OpenAI service",
      "The browser source explorer",
      "The SQLite engine",
    ],
    correct: 0,
    explanation:
      "SDK-managed MCP runs through the application connection. Hosted MCP sends a public server definition to the provider.",
    live: true,
    category: "Model Context Protocol",
  },
  {
    number: 84,
    section: "11. Model Context Protocol: MCP",
    title: "MCP authentication",
    prompt:
      "Authenticate to a private MCP server while keeping credentials outside model-visible content.",
    slug: "mcp-authentication",
    headline: "Authenticate the transport and inspect model-visible data.",
    summary:
      "A private server checks the transport header before discovery. Model-visible requests contain only the timetable task and results.",
    question: "Where should the private MCP bearer credential be supplied?",
    answers: [
      "Transport request headers",
      "The model instructions",
      "The final answer",
    ],
    correct: 0,
    explanation:
      "A private server checks the transport header before discovery. Model-visible requests contain only the timetable task and results.",
    live: true,
    category: "Model Context Protocol",
  },
];
