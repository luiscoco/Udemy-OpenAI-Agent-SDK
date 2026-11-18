import { createServer } from "node:http";
import { once } from "node:events";
import { Agent, Runner } from "@openai/agents";
import { ClassroomStreamModel } from "../../../../foundations-runtime/examples/streaming/classroom-model.ts";
import { message } from "../../../../foundations-runtime/examples/context/scripted-model.mjs";
import { summarizeStreamEvent } from "../../../../foundations-runtime/examples/streaming/result-inspection.mjs";

// A teaching HTTP client connects to this real local SSE endpoint.
export async function runSSEClientDemo({
  disconnect = false,
  signal,
  onProgress = () => {},
} = {}) {
  const controller = new AbortController();
  const runSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;
  const model = new ClassroomStreamModel(
    "sse-demo",
    () => [
      message(
        "The application sends actual SDK events over an SSE connection and awaits cleanup when its client disconnects.",
      ),
    ],
    { delayMs: 45 },
  );
  const observed = {
    clientDisconnected: false,
    cancellationObserved: false,
    settled: false,
    modelIdle: false,
    resourceClosed: false,
    receivedEvents: 0,
  };
  let resolveJob, rejectJob;
  const job = new Promise((resolve, reject) => {
    resolveJob = resolve;
    rejectJob = reject;
  });
  job.catch(() => {});
  const server = createServer(async (request, response) => {
    if (request.url !== "/events") {
      response.writeHead(404);
      response.end();
      return;
    }
    response.on("close", () => {
      if (!response.writableEnded) {
        observed.clientDisconnected = true;
        controller.abort();
      }
    });
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
    });
    response.flushHeaders();
    let stream;
    try {
      stream = await new Runner({ tracingDisabled: true }).run(
        new Agent({ name: "SSE tutor", model }),
        "Explain web streaming.",
        { stream: true, signal: runSignal },
      );
      const completion = stream.completed.catch((error) => {
        if (!runSignal.aborted) throw error;
      });
      try {
        for await (const event of stream) {
          const entry = summarizeStreamEvent(event, "SSE tutor");
          if (!response.destroyed)
            response.write(`data: ${JSON.stringify(entry)}\n\n`);
        }
      } finally {
        await completion;
        observed.settled = true;
        await model.whenIdle();
        observed.modelIdle = true;
      }
      observed.cancellationObserved = stream.cancelled;
      if (!response.destroyed) response.end();
      resolveJob();
    } catch (error) {
      if (!response.destroyed) response.destroy();
      rejectJob(error);
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const clientController = new AbortController();
  const clientSignal = signal
    ? AbortSignal.any([signal, clientController.signal])
    : clientController.signal;
  let text = "",
    chunks = 0;
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/events`,
      { signal: clientSignal },
    );
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        buffer += decoder.decode(next.value, { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) >= 0) {
          const entry = JSON.parse(buffer.slice(6, boundary));
          buffer = buffer.slice(boundary + 2);
          observed.receivedEvents++;
          onProgress(entry);
          if (entry.delta) {
            text += entry.delta;
            chunks++;
          }
          if (disconnect && chunks === 3) {
            clientController.abort();
            await reader.cancel();
            break;
          }
        }
        if (clientController.signal.aborted) break;
      }
    } catch (error) {
      if (!clientController.signal.aborted && !signal?.aborted) throw error;
    } finally {
      reader.releaseLock();
    }
    await job;
  } finally {
    controller.abort();
    clientController.abort();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await model.whenIdle();
    observed.resourceClosed = true;
  }
  signal?.throwIfAborted();
  return { ...observed, text, chunks, consumed: !observed.clientDisconnected };
}
