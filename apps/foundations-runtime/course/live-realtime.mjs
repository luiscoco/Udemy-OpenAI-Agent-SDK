// Actual server-side RealtimeSession WebSocket connection. Audio I/O belongs to
// this process, so feed 24 kHz mono PCM16 and consume audio events explicitly.
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import { readFile } from "node:fs/promises";
import { sdk, z } from "./common.mjs";
import { openStore } from "./storage.mjs";
if (!process.env.OPENAI_API_KEY)
  throw new Error("Configure OPENAI_API_KEY on the server");
const store = openStore();
const tenant = "live-classroom";
store.allow(tenant, true);
const lookup = sdk.tool({
  name: "lookup_order",
  parameters: z.object({ id: z.literal("ORD-42") }),
  execute: ({ id }) => {
    if (!store.authorized(tenant)) throw new Error("Order access denied");
    return { id, status: "shipped" };
  },
});
const billing = new RealtimeAgent({
  name: "Billing",
  instructions: "Help with order invoices.",
  tools: [lookup],
});
const session = new RealtimeSession(
  new RealtimeAgent({
    name: "Support",
    instructions: "Help with order ORD-42. Route billing questions to Billing.",
    tools: [lookup],
    handoffs: [billing],
  }),
  {
    transport: "websocket",
    model: process.env.REALTIME_MODEL || "gpt-realtime",
    apiKey: process.env.OPENAI_API_KEY,
    tracingDisabled: true,
  },
);
session.on("error", (event) =>
  console.error("Realtime error", event.error?.message ?? "Connection error"),
);
session.on("transport_event", (event) => {
  if (event.type.includes("transcript")) console.log(JSON.stringify(event));
});
session.on("audio", (event) =>
  console.log(JSON.stringify({ type: "audio", bytes: event.data.byteLength })),
);
const close = () => {
  session.close();
  store.close();
};
process.once("SIGINT", () => {
  close();
  process.exit();
});
try {
  await session.connect({ apiKey: process.env.OPENAI_API_KEY });
  if (process.argv[2]) {
    const pcm = await readFile(process.argv[2]);
    session.sendAudio(
      pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength),
      { commit: true },
    );
  } else session.sendMessage("Where is order ORD-42?");
  await new Promise((resolve) => setTimeout(resolve, 15000));
} finally {
  close();
}
