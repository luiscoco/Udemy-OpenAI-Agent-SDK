export const implementationPrompt =
  "Explain the OpenAI Agents SDK, Responses API, Agents API, and Codex SDK, and show when each is appropriate.";

export const products = [
  {
    id: "agents-sdk",
    name: "Agents SDK",
    package: "@openai/agents",
    icon: "workflow",
    category: "Application orchestration",
    color: "purple",
    description: "Build agents with your own tools and workflow.",
    ownership: "Your application runs the SDK agent loop.",
    responsibility:
      "You own deployment, tools, permissions, and storage. The SDK runs the model–tool loop.",
    bestFor: "A support assistant that looks up an order using your backend.",
    task: "Where is order 1042? Use the order lookup tool to check.",
    nodes: ["Your application", "SDK runner", "Model + your tools"],
    boundaries: ["Your server", "Your server", "API + your server"],
    steps: [
      {
        title: "Define the agent",
        detail:
          "Your application supplies instructions and registers lookup_order.",
        node: 0,
        lines: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "Start the SDK runner",
        detail: "run() starts the model–tool loop inside your application.",
        node: 1,
        lines: [8],
      },
      {
        title: "Call your tool",
        detail:
          "The model requests lookup_order. Your backend returns the sample order data.",
        node: 2,
        lines: [6, 8],
      },
      {
        title: "Return the final answer",
        detail:
          "The SDK sends the tool result back to the model and returns finalOutput.",
        node: 1,
        lines: [9],
      },
    ],
    takeaway:
      "Choose the Agents SDK when you want application-owned agent orchestration.",
    source: "https://developers.openai.com/api/docs/guides/agents/quickstart",
  },
  {
    id: "responses",
    name: "Responses API",
    package: "openai",
    icon: "message",
    category: "Direct model access",
    color: "blue",
    description: "Send a request and work with the model response.",
    ownership: "Your application controls the surrounding workflow.",
    responsibility:
      "You define requests, handle responses, and implement any additional orchestration.",
    bestFor: "A focused text-generation feature in an existing application.",
    task: "Explain what an AI agent is in one sentence for a beginner.",
    nodes: ["Your application", "Responses API", "Model response"],
    boundaries: ["Your server", "OpenAI", "Returned to your app"],
    steps: [
      {
        title: "Prepare the request",
        detail:
          "Your application chooses the model and supplies a focused input.",
        node: 0,
        lines: [2, 3, 4, 5],
      },
      {
        title: "Call the model",
        detail: "responses.create() sends the request to OpenAI.",
        node: 1,
        lines: [1, 6, 7],
      },
      {
        title: "Read the response",
        detail: "output_text gives your application the generated text.",
        node: 2,
        lines: [8],
      },
    ],
    takeaway:
      "Choose the Responses API for direct model access and application-defined orchestration.",
    source: "https://developers.openai.com/api/docs/guides/text",
  },
  {
    id: "agents-api",
    name: "Agents API",
    package: "openai · beta",
    icon: "cloud",
    category: "Managed agent runtime",
    color: "teal",
    description: "Let OpenAI manage the agent runtime and session.",
    ownership: "OpenAI runs the managed agent harness.",
    responsibility:
      "Your application submits tasks and follows the session. OpenAI manages agent execution.",
    bestFor:
      "A managed task that creates and runs a script in a hosted sandbox.",
    task: "Create hello.py that prints Hello, classroom! Run it and report the actual output.",
    nodes: ["Your application", "Managed session", "Hosted sandbox"],
    boundaries: ["Your server", "OpenAI", "OpenAI-hosted compute"],
    steps: [
      {
        title: "Create a managed session",
        detail:
          "The request supplies an agent configuration, environment, and input task.",
        node: 0,
        lines: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "Follow runtime events",
        detail:
          "The managed runtime runs the agent. A session ID alone does not show task completion.",
        node: 1,
        lines: [8, 9, 10, 11],
      },
      {
        title: "Run in hosted compute",
        detail:
          "The agent can create hello.py and execute it in the hosted sandbox.",
        node: 2,
        lines: [3, 9, 10, 11],
      },
      {
        title: "Read the completed turn",
        detail:
          "The application checks the final turn result and retains the session ID for inspection or cleanup.",
        node: 1,
        lines: [12],
      },
    ],
    takeaway:
      "Choose the Agents API when OpenAI should manage the agent runtime and session.",
    source:
      "https://developers.openai.com/api/docs/guides/agents-api/quickstart",
  },
  {
    id: "codex",
    name: "Codex SDK",
    package: "@openai/codex-sdk",
    icon: "code",
    category: "Embedded coding agent",
    color: "amber",
    description: "Give a coding agent a bounded repository task.",
    ownership: "Your application starts a local Codex thread.",
    responsibility:
      "Codex inspects a configured workspace. Your application chooses the task and reviews its result.",
    bestFor: "Understanding code or investigating a failing repository check.",
    task: "Inspect this robotics-club example repository. Explain its files and what npm test checks. Read files only.",
    nodes: ["Your application", "Codex thread", "Project workspace"],
    boundaries: ["Your server", "Local Codex process", "Configured repository"],
    steps: [
      {
        title: "Choose the workspace",
        detail:
          "The server points Codex at the bundled robotics-club fixture with read-only access.",
        node: 0,
        lines: [1, 2, 3, 4, 5, 6],
      },
      {
        title: "Start a coding thread",
        detail: "startThread() creates a coding conversation for this task.",
        node: 1,
        lines: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "Inspect the repository",
        detail:
          "Codex can use commands to inspect files inside its configured workspace.",
        node: 2,
        lines: [8],
      },
      {
        title: "Review the explanation",
        detail:
          "finalResponse contains the coding agent’s answer. A thread can be continued for follow-up work.",
        node: 1,
        lines: [9],
      },
    ],
    takeaway:
      "Choose the Codex SDK to embed a coding agent that works with a repository.",
    source: "https://learn.chatgpt.com/docs/codex-sdk",
  },
];

export const challenges = [
  {
    question: "Add a one-sentence explanation to a vocabulary app.",
    answer: "responses",
    why: "This feature needs a direct model response. The application already owns the rest of the flow.",
  },
  {
    question: "Build a support agent that calls your private order tool.",
    answer: "agents-sdk",
    why: "The SDK runs the agent loop in your app, where your tool implementations and permissions live.",
  },
  {
    question: "Submit a task to an OpenAI-managed session with hosted compute.",
    answer: "agents-api",
    why: "The managed runtime owns execution and session state while your application submits and observes work.",
  },
  {
    question: "Explain a repository before investigating its failing tests.",
    answer: "codex",
    why: "A Codex thread gives a coding agent access to a configured project workspace.",
  },
];
