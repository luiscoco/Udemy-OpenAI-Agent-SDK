import { handleMcp, timetableTool } from "./fixture-protocol.mjs";
import { setTimeout as pause } from "node:timers/promises";

export function createAdvancedProtocol({
  role = "instructor",
  delayMs = 0,
} = {}) {
  const state = { version: 1 };
  const resource = {
    uri: "classroom://handbook",
    name: "Workshop handbook",
    mimeType: "text/plain",
  };
  const text = "Robotics starts at 16:00 in Lab 2. Bring robotics kits.";
  const budget = {
    name: "read_budget",
    description: "Read the synthetic finance budget when authorized.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  };
  const summary = {
    name: "summarize_handbook",
    description: "A reusable workshop summary prompt.",
    arguments: [],
  };
  async function handle(request, trace) {
    if (request.method === "initialize") {
      const result = handleMcp(request, trace);
      result.result.capabilities = {
        tools: { listChanged: false },
        resources: { listChanged: false },
        prompts: { listChanged: false },
      };
      return result;
    }
    const reply = (result) => {
      trace.push({ method: request.method });
      return { jsonrpc: "2.0", id: request.id, result };
    };
    if (request.method === "tools/list") {
      if (delayMs) await pause(delayMs);
      return reply({
        tools: [
          {
            ...timetableTool,
            description: `Read the timetable. Definition version ${state.version}.`,
          },
          budget,
        ],
      });
    }
    if (
      request.method === "tools/call" &&
      request.params?.name === "read_budget"
    ) {
      trace.push({ authorization: role === "finance" ? "allowed" : "denied" });
      return reply({
        isError: role !== "finance",
        content: [
          {
            type: "text",
            text:
              role === "finance"
                ? "Synthetic classroom budget — EUR 240."
                : "FORBIDDEN",
          },
        ],
      });
    }
    if (request.method === "resources/list")
      return reply({ resources: [resource] });
    if (request.method === "resources/templates/list")
      return reply({ resourceTemplates: [] });
    if (request.method === "resources/read")
      return request.params?.uri === resource.uri
        ? reply({ contents: [{ ...resource, text }] })
        : {
            jsonrpc: "2.0",
            id: request.id,
            error: { code: -32602, message: "Unknown classroom resource" },
          };
    if (request.method === "prompts/list") return reply({ prompts: [summary] });
    if (request.method === "prompts/get")
      return request.params?.name === summary.name
        ? reply({
            description: summary.description,
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: "Summarize the workshop handbook in one sentence using the supplied resource.",
                },
              },
            ],
          })
        : {
            jsonrpc: "2.0",
            id: request.id,
            error: { code: -32602, message: "Unknown classroom prompt" },
          };
    return handleMcp(request, trace);
  }
  return { state, handle, resourceText: text };
}
