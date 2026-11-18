import {
  Usage,
  type Model,
  type ModelProvider,
  type ModelRequest,
  type ModelResponse,
  type ResponseStreamEvent,
} from "@openai/agents";

type Reply = (request: ModelRequest, call: number) => ModelResponse["output"];

export class ControlledModel implements Model {
  readonly requests: Array<{
    input: ModelRequest["input"];
    settings: ModelRequest["modelSettings"];
    instructions?: string;
  }> = [];
  readonly name: string;
  private readonly reply: Reply;
  constructor(name: string, reply: Reply) {
    this.name = name;
    this.reply = reply;
  }

  async getResponse(request: ModelRequest): Promise<ModelResponse> {
    request.signal?.throwIfAborted();
    this.requests.push({
      input: structuredClone(request.input),
      settings: structuredClone(request.modelSettings),
      instructions: request.systemInstructions,
    });
    return {
      output: this.reply(request, this.requests.length),
      usage: new Usage(),
      responseId: `${this.name}-${this.requests.length}`,
    };
  }

  async *getStreamedResponse(
    request: ModelRequest,
  ): AsyncIterable<ResponseStreamEvent> {
    const response = await this.getResponse(request);
    yield { type: "response_started" };
    for (const item of response.output) {
      if (item.type === "message") {
        for (const part of item.content) {
          if (part.type === "output_text") {
            for (const delta of part.text.match(/\S+\s*/g) ?? []) {
              request.signal?.throwIfAborted();
              yield { type: "output_text_delta", delta };
            }
          }
        }
      }
    }
    yield {
      type: "response_done",
      response: {
        id: response.responseId!,
        output: response.output,
        usage: response.usage,
      },
    };
  }
}

export class ControlledProvider implements ModelProvider {
  readonly models = new Map<string, ControlledModel>();
  private readonly reply: Reply;
  constructor(reply: Reply) {
    this.reply = reply;
  }
  getModel(name = "classroom-default"): Model {
    name ||= "classroom-default";
    if (!this.models.has(name))
      this.models.set(name, new ControlledModel(name, this.reply));
    return this.models.get(name)!;
  }
}
