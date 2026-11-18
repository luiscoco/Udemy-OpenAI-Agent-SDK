import { randomUUID } from "node:crypto";
import { runAgent, message, courseResult, selectScenario } from "./common.mjs";
import { openStore } from "./storage.mjs";

export function clientDelegationHandler({ tenant, store, send, signal }) {
  const transcripts = [];
  return async (event) => {
    if (
      event.type === "session.input_transcript.delta" ||
      event.type === "session.output_transcript.delta"
    ) {
      transcripts.push({
        role: event.type.includes("input") ? "user" : "assistant",
        text: event.delta,
        startMs: event.start_ms,
        endMs: event.end_ms,
      });
      return;
    }
    if (
      event.type !== "session.delegation.created" ||
      event.delegation.target !== "client"
    )
      return;
    const id = event.delegation.id;
    const previous = store.getRun(id, tenant);
    if (previous) {
      send(previous.update);
      return previous;
    }
    let text,
      modelCalls = 0;
    if (!store.authorized(tenant))
      text = "Current account permissions do not allow this order lookup.";
    else {
      const request = transcripts
        .map((item) => `${item.role}: ${item.text}`)
        .join("\n");
      const result = await runAgent(
        "Authorized order backend",
        [message("Order ORD-42 is shipped. Tracking reference TRACK-42.")],
        request,
        { run: { signal } },
      );
      text = result.result.finalOutput;
      modelCalls = result.requests.length;
    }
    const update = {
      type: "session.commentary.append",
      event_id: randomUUID(),
      delegation_id: id,
      content: text,
    };
    const result = { update, modelCalls, transcripts: [...transcripts] };
    store.saveRun(id, tenant, result);
    send(update);
    return result;
  };
}
export async function executeLiveDelegation(input, { signal } = {}) {
  const scenario = selectScenario(input.scenario, ["delegate", "reject-tool"]);
  const store = openStore();
  const tenant = randomUUID();
  const sent = [];
  try {
    store.allow(tenant, scenario !== "reject-tool");
    const handle = clientDelegationHandler({
      tenant,
      store,
      send: (event) => sent.push(event),
      signal,
    });
    await handle({
      type: "session.input_transcript.delta",
      delta: "Where is order ORD-42?",
      start_ms: 0,
      end_ms: 1200,
    });
    const event = {
      type: "session.delegation.created",
      offset_ms: 1200,
      delegation: { id: randomUUID(), target: "client", type: "delegation" },
    };
    const result = await handle(event);
    await handle(event);
    return courseResult(
      166,
      result.update.content,
      {
        scenario,
        sessionConfig: { model: "gpt-live-1", delegation: { type: "client" } },
        received: event,
        transcripts: result.transcripts,
        sent,
        backendModelCalls: result.modelCalls,
        replayedEventUsesSavedResult: sent[0].event_id === sent[1].event_id,
        transport: "Documented GPT-Live event fixtures",
      },
      "Delegation IDs identify work. Transcript events and authenticated application state supply its context. The handler can attach to an actual LiveWS connection.",
    );
  } finally {
    store.close();
  }
}
