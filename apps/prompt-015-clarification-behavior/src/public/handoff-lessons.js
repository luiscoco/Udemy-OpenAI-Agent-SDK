export const handoffControls = {
  85: [
    {
      key: "mcpFilterPolicy",
      label: "MCP tool filter",
      options: [
        ["static", "Static timetable allowlist"],
        ["context", "Context-dependent capability filter"],
      ],
    },
    {
      key: "filterRole",
      label: "Application role fixture",
      options: [
        ["instructor", "Instructor"],
        ["finance", "Finance"],
      ],
    },
  ],
  86: [
    {
      key: "cachePolicy",
      label: "Tool-list cache behavior",
      options: [
        ["cached", "Keep cached definitions"],
        ["invalidate", "Invalidate after the server changes"],
        ["uncached", "Disable tool-list caching"],
      ],
    },
  ],
  87: [
    {
      key: "mcpFailure",
      label: "Real transport scenario",
      options: [
        ["refused", "Connection refused"],
        ["timeout", "Tool discovery exceeds its deadline"],
        ["restart", "Server restarts and client reconnects"],
      ],
    },
  ],
  88: [
    {
      key: "resourcePolicy",
      label: "Application content policy",
      options: [
        ["inspect", "Inspect resources and prompts locally"],
        ["include", "Include the selected resource and template"],
      ],
    },
  ],
  89: [
    {
      key: "supportIssue",
      label: "Support request",
      options: [
        ["billing", "Duplicate invoice charge"],
        ["technical", "Classroom app crash"],
        ["account", "Account sign-in problem"],
      ],
    },
  ],
  90: [
    {
      key: "ownershipPattern",
      label: "Specialist delegation",
      options: [
        ["handoff", "Transfer ownership with a handoff"],
        ["agent-tool", "Call a specialist as a tool"],
      ],
    },
  ],
  91: [
    {
      key: "routingDescriptions",
      label: "Handoff definitions",
      options: [
        ["clear", "Specific names and descriptions"],
        ["vague", "Ambiguous names and descriptions"],
      ],
    },
    {
      key: "supportIssue",
      label: "Support request",
      options: [
        ["billing", "Duplicate invoice charge"],
        ["technical", "Classroom app crash"],
        ["account", "Account sign-in problem"],
      ],
    },
  ],
  92: [
    {
      key: "metadataCase",
      label: "Handoff metadata",
      options: [
        ["valid", "Valid structured metadata"],
        ["invalid", "Invalid priority in a controlled call"],
      ],
    },
  ],
  93: [
    {
      key: "callbackRoute",
      label: "Routing callback destination",
      options: [
        ["billing", "Billing specialist"],
        ["technical", "Technical specialist"],
      ],
    },
  ],
  94: [
    {
      key: "historyPolicy",
      label: "Specialist conversation history",
      options: [
        ["full", "Pass the full history"],
        ["focused", "Retain the invoice request"],
      ],
    },
  ],
};
export const handoffHints = {
  85: "The SDK applies a static allowlist or a filter based on the simulated application role. Inspect actual model tool definitions. The fixture separately checks permission before returning budget data.",
  86: "The fixture uses an MCP session ID because the installed SDK refreshes stateless HTTP catalogs. Compare one cached tools/list request with an explicit invalidation or uncached discovery. No model inference is used.",
  87: "The exercise causes real loopback refusal, delayed discovery or a server restart. It retains actual error diagnostics, closes failed clients, and explicitly reconnects for the restart scenario. No model inference is used.",
  88: "The Agents SDK provides resource methods. The installed MCP client provides prompt methods. Both call a real fixture server. The application explicitly chooses whether retrieved content enters the model request.",
  89: "A real SDK handoff moves the support conversation to billing, technical or account support. Classroom routing is scripted. Inspect the observed handoff items and final answer owner.",
  90: "Both paths handle the same duplicate invoice request. A handoff ends with the specialist. agent.asTool returns a nested result so the manager can answer. Model output is scripted in classroom mode.",
  91: "Compare the actual handoff function names and descriptions. The vague classroom route is intentionally ambiguous. Live decisions depend on the selected model and should be inspected.",
  92: "A Zod schema validates reason, priority and invoiceId before onHandoff runs. The invalid classroom call is rejected before callback side effects or specialist execution.",
  93: "The callback records the application request ID and actual destination. The lifecycle trace shows onHandoff before the receiving specialist starts. Every exercise uses fresh request-local state.",
  94: "Compare the specialist’s actual input. The focused inputFilter removes unrelated messages and tool-history pairs while retaining INV-42 and EUR 18. All history and markers are synthetic fixtures.",
};
const previews = {
  85: "MCPServerStreamableHttp({toolFilter: {allowedToolNames}})\nOr async ({runContext}, tool) => permittedByContext\nServer implementations also check resource permissions.",
  86: "cacheToolsList: true\nlistTools() → server definition v1\nServer changes → cached v1\nawait invalidateToolsCache() → server definition v2",
  87: "Observe refused connection / request deadline\nPreserve the underlying diagnostic\nClose failed connection → restart server → explicit reconnect\nFinally close every owned resource.",
  88: "server.listResources() / server.readResource(uri)\nMCP client.listPrompts() / client.getPrompt({name})\nExplicitly include selected content in the agent input.",
  89: "Triage → transfer_billing / transfer_technical / transfer_account\nReceiving specialist continues the SDK loop\nresult.lastAgent identifies the final owner.",
  90: "handoff(specialist) → specialist owns the final answer\nspecialist.asTool(...) → manager receives tool result and answers",
  91: "Clear definitions describe invoices, application faults and account access.\nVague definitions all say: Handle a support request.\nInspect the observed route.",
  92: "handoff(specialist, {inputType: schema, onHandoff})\nreason: duplicate_charge\npriority: normal | high\ninvoiceId: INV-42",
  93: "onHandoff(runContext) records requestId, source, destination and sequence\nSDK lifecycle → callback → specialist start",
  94: "Input includes an unrelated astronomy note and the INV-42 billing request.\ninputFilter → removeAllTools(data) → retain the invoice request\nInspect actual specialist input.",
};
export function handoffPreview(number) {
  return previews[number];
}
