import { Usage } from "@openai/agents";

export function functionCall(name, args = {}, callId = "classroom-call-1") {
  return {
    type: "function_call",
    name,
    arguments: JSON.stringify(args),
    callId,
  };
}

export function message(text) {
  return {
    type: "message",
    role: "assistant",
    status: "completed",
    content: [{ type: "output_text", text }],
  };
}

// This deterministic Model adapter drives the real SDK loop without a network call.
export function scriptedModel(responses, { captureRequests = false } = {}) {
  let index = 0;
  const requests = [];
  return {
    requests,
    get calls() {
      return index;
    },
    async getResponse(request) {
      request.signal?.throwIfAborted();
      if (captureRequests)
        requests.push(
          structuredClone({
            systemInstructions: request.systemInstructions,
            input: request.input,
          }),
        );
      if (index >= responses.length)
        throw new Error(
          "The classroom model exhausted its scripted responses.",
        );
      const response = responses[index++];
      const output =
        typeof response === "function" ? await response(request) : response;
      return {
        output: Array.isArray(output) ? output : [output],
        usage: new Usage(),
        responseId: `classroom-response-${index}`,
      };
    },
    async *getStreamedResponse() {
      throw new Error("The classroom model uses non-streaming SDK runs.");
    },
  };
}
