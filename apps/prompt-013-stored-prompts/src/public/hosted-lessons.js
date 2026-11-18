export const hostedControls = {
  75: [
    {
      key: "retrievalDepartment",
      label: "File attribute filter",
      options: [
        ["robotics", "Robotics documents"],
        ["astronomy", "Astronomy documents"],
      ],
    },
    {
      key: "retrievalLimit",
      label: "Maximum retrieval results",
      options: [
        ["1", "One result"],
        ["3", "Up to three results"],
      ],
    },
  ],
  76: [
    {
      key: "ragProfile",
      label: "Application identity fixture",
      options: [
        ["alice", "Alice · tenant A"],
        ["ben", "Ben · tenant B"],
      ],
    },
    {
      key: "ragQuestion",
      label: "Retrieval topic",
      options: [
        ["robotics", "Known workshop topic"],
        ["unknown", "Topic with insufficient evidence"],
      ],
    },
  ],
  77: [
    {
      key: "analysisCase",
      label: "Calculation scenario",
      options: [
        ["correct", "Correct provider analysis"],
        ["incorrect", "Injected incorrect total"],
      ],
    },
  ],
  78: [
    {
      key: "imageTask",
      label: "Image request",
      options: [
        ["poster", "Robotics workshop poster"],
        ["icon", "Robotics workshop icon"],
      ],
    },
  ],
  79: [
    {
      key: "containerPolicy",
      label: "Container lifecycle",
      options: [
        ["reuse", "Reuse one container"],
        ["fresh", "Use a new container each time"],
      ],
    },
    {
      key: "shellNetwork",
      label: "Container network policy",
      options: [
        ["disabled", "Disable outbound network"],
        ["allowlist", "Allow developers.openai.com"],
      ],
    },
  ],
  80: [
    {
      key: "computerActions",
      label: "Requested counter actions",
      options: [
        ["1", "Enroll one student"],
        ["2", "Enroll two students"],
      ],
    },
  ],
  81: [
    {
      key: "mcpTopic",
      label: "Timetable request",
      options: [
        ["robotics", "Robotics workshop"],
        ["astronomy", "Astronomy workshop"],
      ],
    },
  ],
  82: [
    {
      key: "mcpTopic",
      label: "Timetable request",
      options: [
        ["robotics", "Robotics workshop"],
        ["astronomy", "Astronomy workshop"],
      ],
    },
  ],
  83: [
    {
      key: "mcpPath",
      label: "MCP execution path",
      options: [
        ["sdk", "SDK-managed connection"],
        ["hosted", "Provider-hosted connection"],
      ],
    },
    {
      key: "mcpTopic",
      label: "Timetable request",
      options: [
        ["robotics", "Robotics workshop"],
        ["astronomy", "Astronomy workshop"],
      ],
    },
  ],
  84: [
    {
      key: "mcpCredential",
      label: "Transport credential",
      options: [
        ["valid", "Valid ephemeral fixture credential"],
        ["invalid", "Invalid fixture credential"],
        ["missing", "Credential missing"],
      ],
    },
    {
      key: "mcpTopic",
      label: "Timetable request",
      options: [
        ["robotics", "Robotics workshop"],
        ["astronomy", "Astronomy workshop"],
      ],
    },
  ],
};
export const hostedHints = {
  75: "Classroom search results are provider fixtures. Live mode requires a vector store whose files have department attributes. Compare the actual filter, result limit, returned evidence and citations.",
  76: "This lesson chooses embedded SQLite for its teaching collection. Profiles simulate authenticated context. Bound tenant parameters enforce access before retrieved snippets reach the model. Unknown topics produce insufficient evidence.",
  77: "Classroom Code Interpreter output is injected. The source attendance values are 30, 40 and 50. The CSV is independently parsed and checked, and the classroom summary file is created locally. The incorrect-total scenario deliberately fails acceptance. Live mode uses an owned hosted container.",
  78: "Classroom mode returns the bundled PNG as a provider fixture. Live mode uses the hosted image-generation tool. The application verifies the result format, stores it and displays the saved image.",
  79: "Classroom hosted-shell results are injected provider fixtures. Live mode uploads the CSV and creates owned hosted containers. Compare reuse with fresh containers. Network allowlists also require organization support.",
  80: "The SDK dispatches actions to a real isolated Playwright context. The bundled counter page has all network routes blocked. Classroom decisions are scripted. Saved screenshots and the actual counter verify the outcome.",
  81: "A real Node subprocess serves newline-delimited MCP JSON-RPC. The SDK discovers and invokes read_timetable. The connection closes in finally. Classroom model decisions are scripted.",
  82: "A real separate loopback HTTP server responds to MCP initialization, discovery and tool requests. The SDK makes the tool call through Streamable HTTP and closes the client and server.",
  83: "The SDK path uses the real loopback MCP server. The hosted classroom path injects provider MCP results. Live hosted mode requires MCP_SERVER_URL pointing to a publicly reachable timetable server.",
  84: "Each exercise creates a private loopback MCP server with an ephemeral bearer credential. The credential stays in the transport. Invalid or missing headers are rejected before tool discovery.",
};
const previews = {
  75: "fileSearchTool(VECTOR_STORE_ID, {filters: {type: eq, key: department, value}, maxNumResults, includeSearchResults: true})",
  76: "SELECT id, content FROM documents WHERE tenant = ? AND topic = ? LIMIT 3\nBind trusted context.tenantId\nEmpty authorized result → insufficient evidence",
  77: "codeInterpreterTool({container: ownedContainerId})\nUploaded CSV → Python analysis → cited summary.csv\nIndependent total and mean checks → downloadable file",
  78: "imageGenerationTool({outputFormat: png})\nimage_generation_call.result → base64 bytes\nVerify format → save artifact → display saved image",
  79: "Upload CSV → create container with network_policy\nshellTool({environment: {type: container_reference, containerId}})\nRun twice → compare container IDs → cleanup",
  80: "computerTool({computer: ownedPlaywrightAdapter})\nInitial screenshot → click → returned screenshot\nVerify actual counter → close browser",
  81: "MCPServerStdio({command: process.execPath, args: [serverPath]})\nconnect → tools/list → tools/call → close in finally",
  82: "MCPServerStreamableHttp({url: loopbackMcpUrl})\nJSON-RPC over HTTP POST\nInitialize → discover → call → close",
  83: "SDK-managed → application opens MCP connection\nHosted → hostedMcpTool({serverUrl, allowedTools})\nOpenAI service connects to a public MCP server",
  84: "requestInit.headers.Authorization = Bearer <server-owned token>\nPrivate MCP checks header before initialization\nModel requests contain task and result only",
};
export function hostedPreview(number) {
  return previews[number];
}
