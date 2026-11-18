import {
  Usage,
  type ModelRequest,
  type ModelResponse,
  type ResponseStreamEvent,
} from "@openai/agents";
import { setTimeout as pause } from "node:timers/promises";
import { ControlledModel } from "../../../../foundations-runtime/examples/runtime/controlled-model.ts";

type Reply = (request: ModelRequest, call: number) => ModelResponse["output"];

export class ClassroomStreamModel extends ControlledModel {
  readonly generatorClosures: Promise<void>[] = [];
  activeGenerators = 0;
  readonly reports: Array<{
    responseId: string;
    usage: ModelResponse["usage"];
  }> = [];
  delayMs: number;
  failAfter: number;
  inputTokens: number;
  outputTokens: number;

  constructor(
    name: string,
    reply: Reply,
    options: {
      delayMs?: number;
      failAfter?: number;
      inputTokens?: number;
      outputTokens?: number;
    } = {},
  ) {
    super(name, reply);
    this.delayMs = options.delayMs ?? 35;
    this.failAfter = options.failAfter ?? 0;
    this.inputTokens = options.inputTokens ?? 10;
    this.outputTokens = options.outputTokens ?? 5;
  }

  async getResponse(request: ModelRequest): Promise<ModelResponse> {
    const response = await super.getResponse(request);
    response.usage = new Usage({
      requests: 1,
      inputTokens: this.inputTokens,
      outputTokens: this.outputTokens,
      totalTokens: this.inputTokens + this.outputTokens,
    });
    this.reports.push({
      responseId: response.responseId!,
      usage: response.usage,
    });
    return response;
  }

  async *getStreamedResponse(
    request: ModelRequest,
  ): AsyncIterable<ResponseStreamEvent> {
    let markClosed!: () => void;
    this.generatorClosures.push(
      new Promise<void>((resolve) => {
        markClosed = resolve;
      }),
    );
    this.activeGenerators++;
    try {
      const response = await this.getResponse(request);
      yield { type: "response_started" };
      let chunks = 0;
      for (const item of response.output) {
        if (item.type !== "message") continue;
        for (const part of item.content) {
          if (part.type !== "output_text") continue;
          for (const delta of part.text.match(/\S+\s*/g) ?? []) {
            await pause(this.delayMs, undefined, { signal: request.signal });
            yield { type: "output_text_delta", delta };
            chunks++;
            if (this.failAfter && chunks >= this.failAfter)
              throw new Error("Classroom stream failure.");
          }
        }
      }
      request.signal?.throwIfAborted();
      yield {
        type: "response_done",
        response: {
          id: response.responseId!,
          output: response.output,
          usage: response.usage,
        },
      };
    } finally {
      this.activeGenerators--;
      markClosed();
    }
  }

  async whenIdle() {
    await Promise.all(this.generatorClosures);
  }
}
