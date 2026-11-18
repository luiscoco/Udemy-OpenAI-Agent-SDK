import { EventEmitter, once } from "node:events";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import { WebSocket, WebSocketServer } from "ws";
import {
  sdk,
  z,
  runAgent,
  message,
  courseResult,
  selectScenario,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import { randomUUID } from "node:crypto";

export const realtimeScenarios = {
  153: ["connect", "permission-denied"],
  154: ["websocket", "disconnect"],
  155: ["server-vad", "semantic-vad", "manual-commit"],
  156: ["interrupt", "complete"],
  157: ["authorized", "forbidden"],
  158: ["handoff", "stay"],
  159: ["events", "failure"],
  160: ["approve", "reject", "guardrail-blocked"],
  166: ["delegate", "reject-tool"],
  167: ["duplicate", "revoked"],
  168: ["media-stop", "disconnect"],
  199: ["interrupt", "tool-failure"],
};
// A deterministic transport exercises RealtimeSession event handling without
// sending audio to a provider. The browser client uses actual WebRTC separately.
export class ClassroomRealtimeTransport extends EventEmitter {
  status = "disconnected";
  muted = false;
  sent = [];
  async connect(options) {
    this.status = "connected";
    this.sent.push({ type: "connect", model: options.model });
    this.emit("connection_change", "connected");
  }
  sendEvent(event) {
    this.sent.push(event);
  }
  sendMessage(message) {
    this.sent.push({ type: "message", message });
  }
  sendAudio(audio, options) {
    this.sent.push({
      type: "audio",
      bytes: audio.byteLength,
      commit: Boolean(options?.commit),
    });
  }
  updateSessionConfig(config) {
    this.sent.push({ type: "session.update", config });
  }
  close() {
    this.status = "disconnected";
    this.emit("connection_change", "disconnected");
  }
  mute(value) {
    this.muted = value;
  }
  interrupt() {
    this.sent.push({ type: "response.cancel" });
    this.emit("audio_interrupted");
  }
  resetHistory(_old, newHistory) {
    this.sent.push({ type: "history.reset", items: newHistory.length });
  }
  sendFunctionCallOutput(call, output) {
    this.sent.push({
      type: "function_call_output",
      callId: call.callId,
      output,
    });
    this.emit("tool_settled");
  }
  sendMcpResponse() {}
  addImage(image) {
    this.sent.push({ type: "image", bytes: image.length });
  }
}
async function socketExercise(disconnect) {
  const server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
  await once(server, "listening");
  const received = [];
  server.on("connection", (socket) =>
    socket.on("message", (bytes) => {
      const event = JSON.parse(bytes.toString());
      received.push(event);
      socket.send(
        JSON.stringify({
          type: event.type === "stop" ? "closed" : "media.received",
          sequence: event.sequence,
        }),
      );
    }),
  );
  const socket = new WebSocket(`ws://127.0.0.1:${server.address().port}`);
  await once(socket, "open");
  try {
    for (const event of [
      { type: "start", streamId: "classroom" },
      {
        type: "media",
        sequence: 1,
        payload: Buffer.alloc(160).toString("base64"),
      },
      ...(disconnect ? [] : [{ type: "stop" }]),
    ]) {
      const pending = once(socket, "message");
      socket.send(JSON.stringify(event));
      await pending;
    }
    return {
      received,
      codec: "Fixture frames, 160 bytes per frame",
      closed: true,
    };
  } finally {
    socket.close();
    await once(socket, "close");
    await new Promise((resolve) => server.close(resolve));
  }
}
export async function executeRealtime(number, input, { signal } = {}) {
  const scenario = selectScenario(input.scenario, realtimeScenarios[number]);
  const evidence = {
    scenario,
    provider: "Deterministic transport fixture",
    liveAudio: false,
  };
  if ([154, 168].includes(number)) {
    Object.assign(evidence, await socketExercise(scenario === "disconnect"));
    return courseResult(
      number,
      "Loopback WebSocket frames delivered and connections closed.",
      evidence,
      "Inspect real socket lifecycle and fixture media frames. Provider speech generation requires a live service.",
    );
  }
  const transport = new ClassroomRealtimeTransport();
  let executions = 0;
  const tools = [
    sdk.tool({
      name: "lookup_order",
      parameters: z.object({ orderId: z.enum(["ORD-42"]) }),
      needsApproval: number === 160,
      execute: async () => {
        if (
          scenario === "forbidden" ||
          scenario === "revoked" ||
          scenario === "tool-failure"
        )
          throw new Error("Current tenant lacks order permission");
        executions++;
        return { orderId: "ORD-42", status: "shipped" };
      },
      errorFunction: () => "ORDER_ACCESS_DENIED",
    }),
  ];
  const specialist = new RealtimeAgent({
    name: "Billing voice specialist",
    instructions: "Explain the invoice.",
    tools,
  });
  const agent = new RealtimeAgent({
    name: "Voice support",
    instructions: "Help with classroom orders.",
    tools,
    handoffs: [158, 199].includes(number) ? [specialist] : [],
  });
  const events = [];
  const session = new RealtimeSession(agent, {
    transport,
    model: "gpt-realtime",
    tracingDisabled: true,
    ...(number === 160
      ? {
          outputGuardrails: [
            {
              name: "Classroom output policy",
              execute: async ({ agentOutput }) => {
                evidence.guardrailChecked = true;
                return {
                  tripwireTriggered: agentOutput.includes("BLOCKED_FIXTURE"),
                  outputInfo: { source: "classroom transcript check" },
                };
              },
            },
          ],
          outputGuardrailSettings: { debounceTextLength: 1 },
        }
      : {}),
    config: {
      audio: {
        input: {
          turnDetection:
            scenario === "manual-commit"
              ? null
              : {
                  type:
                    scenario === "semantic-vad" ? "semantic_vad" : "server_vad",
                },
        },
      },
    },
  });
  for (const name of [
    "audio_start",
    "audio_stopped",
    "audio_interrupted",
    "history_updated",
    "agent_handoff",
    "agent_tool_start",
    "agent_tool_end",
    "transport_event",
    "error",
    "guardrail_tripped",
  ]) {
    session.on(name, (...args) =>
      events.push({
        name,
        detail: name === "error" ? String(args.at(-1)?.error) : undefined,
      }),
    );
  }
  session.on("tool_approval_requested", async (_ctx, _agent, request) => {
    events.push({ name: "approval_requested", tool: request.tool?.name });
    await (scenario === "reject"
      ? session.reject(request.approvalItem)
      : session.approve(request.approvalItem));
  });
  try {
    if (scenario === "permission-denied") {
      evidence.permission =
        "Microphone permission fixture denied before connect";
    } else {
      await session.connect({ apiKey: "classroom-fixture" });
      session.sendMessage("Where is order ORD-42?");
      transport.emit("item_update", {
        itemId: "user-1",
        type: "message",
        role: "user",
        status: "completed",
        content: [
          { type: "input_audio", transcript: "Where is order ORD-42?" },
        ],
      });
      session.sendAudio(new ArrayBuffer(480), {
        commit: scenario === "manual-commit",
      });
      transport.emit("audio", {
        type: "audio",
        data: new ArrayBuffer(480),
        responseId: "response-fixture",
      });
      if ([156, 199].includes(number) && scenario === "interrupt")
        session.interrupt();
      else transport.emit("audio_done");
      if (scenario === "guardrail-blocked") {
        transport.emit("output_text_delta", {
          type: "output_text_delta",
          itemId: "assistant-1",
          delta: "BLOCKED_FIXTURE",
          responseId: "response-fixture",
        });
        await new Promise((resolve) => setTimeout(resolve, 25));
        evidence.audioAlreadyDeliveredBytes = 480;
        evidence.policyLimitation =
          "Stopping future audio cannot retract samples already played";
      }
      transport.emit("*", {
        type: "conversation.item.input_audio_transcription.completed",
        item_id: "user-1",
        transcript: "Where is order ORD-42?",
      });
      if (
        [157, 160, 199].includes(number) &&
        scenario !== "guardrail-blocked"
      ) {
        const pending = once(transport, "tool_settled");
        transport.emit("function_call", {
          type: "function_call",
          name: "lookup_order",
          callId: "call-1",
          arguments: '{"orderId":"ORD-42"}',
          responseId: "response-fixture",
        });
        await Promise.race([
          pending,
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Realtime fixture tool deadline")),
              3000,
            ),
          ),
        ]);
      }
      if (number === 199 || (number === 158 && scenario === "handoff")) {
        const handoffs = await agent.getEnabledHandoffs(new sdk.RunContext());
        const pending = once(transport, "tool_settled");
        transport.emit("function_call", {
          type: "function_call",
          name: handoffs[0].toolName,
          callId: "transfer-1",
          arguments: "{}",
          responseId: "response-fixture",
        });
        await Promise.race([
          pending,
          new Promise((resolve) => setTimeout(resolve, 100)),
        ]);
        evidence.activeAgent = session.currentAgent?.name;
      }
      if (number === 159 && scenario === "failure")
        transport.emit("error", {
          type: "error",
          error: "Controlled provider transport failure",
        });
      if (number === 166) {
        const delegated = await runAgent(
          "Private knowledge specialist",
          [message("Order ORD-42 is shipped.")],
          "Lookup authorized order.",
          { run: { signal } },
        );
        evidence.delegation = {
          request: "Lookup authorized order",
          output:
            scenario === "reject-tool"
              ? "Tool request rejected by application"
              : delegated.result.finalOutput,
        };
      }
      if (number === 167) {
        const store = openStore();
        try {
          const tenant = randomUUID();
          store.allow(tenant, scenario !== "revoked");
          if (store.authorized(tenant)) {
            evidence.first = store.effect(tenant, "voice-write", {
              order: "ORD-42",
            });
            evidence.retry = store.effect(tenant, "voice-write", {
              order: "ORD-42",
            });
          } else evidence.denied = true;
        } finally {
          store.close();
        }
      }
    }
  } finally {
    evidence.history = session.history;
    session.close();
    evidence.closed = transport.status === "disconnected";
  }
  Object.assign(evidence, { events, executions, sent: transport.sent });
  return courseResult(
    number,
    `${events.length} SDK events observed. Tool executions ${executions}. Session closed ${evidence.closed}.`,
    evidence,
    "The SDK session runs against a deterministic transport. Use the separate browser WebRTC client for live microphone sessions.",
  );
}
