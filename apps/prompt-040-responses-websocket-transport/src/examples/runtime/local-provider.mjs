import { createServer } from "node:http";
import { once } from "node:events";
import { WebSocketServer } from "ws";
import { apiMessage } from "../../../../foundations-runtime/examples/structured/captured-transport.mjs";

export function responseEnvelope(body, number, output) {
  return {
    id: `resp_local_${number}`,
    object: "response",
    created_at: 0,
    status: "completed",
    model: body.model,
    output,
    error: null,
    incomplete_details: null,
    usage: { input_tokens: 10, output_tokens: 8, total_tokens: 18 },
  };
}

export async function localHTTPProvider({ omitUsage = false } = {}) {
  const requests = [];
  const server = createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      requests.push({ path: req.url, body });
      const responses = req.url.endsWith("/responses");
      const hasToolResult = responses
        ? body.input.some((item) => item.type === "function_call_output")
        : body.messages.some((item) => item.role === "tool");
      const functionTool = body.tools?.find((tool) => tool.type === "function");
      const name = responses
        ? functionTool?.name
        : functionTool?.function?.name;
      const callTool = Boolean(name && !hasToolResult);
      const schema = responses
        ? body.text?.format?.type === "json_schema"
        : body.response_format?.type === "json_schema";
      const text = schema
        ? JSON.stringify({ answer: "Classroom provider answer." })
        : "Classroom provider answer.";
      if (responses) {
        const output = callTool
          ? [
              {
                type: "function_call",
                id: "fc_local",
                call_id: "call_local",
                name,
                arguments: "{}",
                status: "completed",
              },
            ]
          : [apiMessage(text)];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(responseEnvelope(body, requests.length, output)),
        );
        return;
      }
      const usage = omitUsage
        ? {}
        : {
            usage: {
              prompt_tokens: 10,
              completion_tokens: 8,
              total_tokens: 18,
            },
          };
      if (body.stream) {
        res.writeHead(200, { "Content-Type": "text/event-stream" });
        const base = {
          id: `chat_local_${requests.length}`,
          object: "chat.completion.chunk",
          created: 0,
          model: body.model,
        };
        res.write(
          `data: ${JSON.stringify({ ...base, choices: [{ index: 0, delta: { role: "assistant", content: "Classroom provider " }, finish_reason: null }] })}\n\n`,
        );
        res.write(
          `data: ${JSON.stringify({ ...base, choices: [{ index: 0, delta: { content: "answer." }, finish_reason: "stop" }] })}\n\n`,
        );
        if (!omitUsage)
          res.write(
            `data: ${JSON.stringify({ ...base, choices: [], ...usage })}\n\n`,
          );
        res.end("data: [DONE]\n\n");
        return;
      }
      const message = callTool
        ? {
            role: "assistant",
            content: null,
            tool_calls: [
              {
                id: "call_local",
                type: "function",
                function: { name, arguments: "{}" },
              },
            ],
          }
        : { role: "assistant", content: text };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          id: `chat_local_${requests.length}`,
          object: "chat.completion",
          created: 0,
          model: body.model,
          choices: [
            {
              index: 0,
              message,
              finish_reason: callTool ? "tool_calls" : "stop",
            },
          ],
          ...usage,
        }),
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: error.message } }));
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    baseURL: `http://127.0.0.1:${server.address().port}/v1`,
    requests,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

export async function localWebSocketProvider() {
  const server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
  const observations = { connections: 0, closed: 0, frames: [] };
  const socketClosures = [];
  server.on("connection", (socket) => {
    const connectionId = ++observations.connections;
    socketClosures.push(
      new Promise((resolve) =>
        socket.once("close", () => {
          observations.closed++;
          resolve();
        }),
      ),
    );
    socket.on("message", (data) => {
      const frame = JSON.parse(data.toString());
      observations.frames.push({ connectionId, frame });
      const response = responseEnvelope(frame, observations.frames.length, [
        apiMessage("A completed Responses text session."),
      ]);
      socket.send(JSON.stringify({ type: "response.completed", response }));
    });
  });
  await once(server, "listening");
  return {
    url: `ws://127.0.0.1:${server.address().port}/v1`,
    observations,
    close: async () => {
      for (const socket of server.clients) socket.terminate();
      await new Promise((resolve) => server.close(resolve));
      await Promise.all(socketClosures);
    },
  };
}
