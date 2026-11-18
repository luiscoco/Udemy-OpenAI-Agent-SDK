import OpenAI from "openai";

export function apiMessage(text) {
  return {
    type: "message",
    id: "msg_classroom",
    role: "assistant",
    status: "completed",
    content: [{ type: "output_text", text, annotations: [] }],
  };
}

export function capturedTransport(plan) {
  const requests = [];
  const client = new OpenAI({
    apiKey: "classroom-local-transport",
    maxRetries: 0,
    fetch: async (_url, options) => {
      const body = JSON.parse(options.body);
      requests.push(body);
      const entry = plan[requests.length - 1];
      if (!entry)
        throw new Error("The classroom transport exhausted its response plan.");
      const output = typeof entry === "function" ? entry(body) : entry;
      return new Response(
        JSON.stringify({
          id: `resp_classroom_${requests.length}`,
          object: "response",
          created_at: 0,
          status: "completed",
          model: body.model,
          output: Array.isArray(output) ? output : [output],
          error: null,
          incomplete_details: null,
          usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "x-request-id": "classroom-request",
          },
        },
      );
    },
  });
  return { client, requests };
}
