export const timetableTool = {
  name: "read_timetable",
  description: "Read a synthetic classroom workshop timetable.",
  inputSchema: {
    type: "object",
    properties: { topic: { type: "string", enum: ["robotics", "astronomy"] } },
    required: ["topic"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, destructiveHint: false },
};

// Minimal stateless teaching server implementing the MCP initialization and tool methods.
export function handleMcp(message, trace = []) {
  if (message.jsonrpc !== "2.0")
    return {
      jsonrpc: "2.0",
      id: message.id ?? null,
      error: { code: -32600, message: "Invalid JSON-RPC request" },
    };
  if (message.id === undefined) return null;
  const reply = (result) => ({ jsonrpc: "2.0", id: message.id, result });
  trace.push({ method: message.method });
  if (message.method === "initialize")
    return reply({
      protocolVersion: "2025-06-18",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "classroom-timetable", version: "1.0.0" },
    });
  if (message.method === "ping") return reply({});
  if (message.method === "tools/list") return reply({ tools: [timetableTool] });
  if (message.method === "tools/call") {
    const topic = message.params?.arguments?.topic;
    if (
      message.params?.name !== "read_timetable" ||
      !["robotics", "astronomy"].includes(topic)
    )
      return reply({
        isError: true,
        content: [{ type: "text", text: "INVALID_TOOL_ARGUMENTS" }],
      });
    trace.push({ tool: "read_timetable", topic });
    const text =
      topic === "robotics"
        ? "Robotics — 16:00, Lab 2."
        : "Astronomy — 18:00, Room 4.";
    return reply({ content: [{ type: "text", text }] });
  }
  return {
    jsonrpc: "2.0",
    id: message.id,
    error: { code: -32601, message: "Method not found" },
  };
}
