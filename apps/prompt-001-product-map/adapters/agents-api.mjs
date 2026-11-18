export async function execute({ env, signal, emit, task }, dependencies = {}) {
  const OpenAI = dependencies.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: 120000,
    maxRetries: 0,
  });
  if (!client.beta?.agents?.sessions?.create)
    throw new Error(
      "This installed openai SDK has no Agents API session support. Install the locked dependencies.",
    );
  const model = env.OPENAI_MODEL || "gpt-6-astra";
  const sessions = client.beta.agents.sessions;
  const agentConfiguration = {
    model,
    instructions:
      "Complete the requested script task and report the actual command output.",
  };
  emit({ type: "step", index: 0 });
  let sessionId;
  let stream;
  let commandSeen = false;
  try {
    // teaching-start
    const request = {
      agent: agentConfiguration,
      environment: { type: "openai_hosted" },
      input: task,
      stream: true,
    };
    stream = await sessions.create(request, { signal });
    stream.withResultCollection();
    for await (const event of stream) {
      observeRuntimeEvent(event);
    }
    const result = await stream.finalResult();
    // teaching-end
    sessionId = result.session_id ?? sessionId;
    if (result.turn?.status !== "completed")
      throw new Error(
        `Managed turn ended with status ${result.turn?.status ?? "unknown"}.`,
      );
    if (!result.output_text)
      throw new Error(
        "The managed turn did not return text. Inspect the session before retrying.",
      );
    emit({ type: "step", index: 3 });
    return {
      text: result.output_text,
      sessionId,
      evidenceTitle: "Actual managed turn",
      evidence: JSON.stringify(
        { sessionId, turnId: result.turn_id, status: result.turn.status },
        null,
        2,
      ),
    };
  } catch (error) {
    if (sessionId) error.sessionId = sessionId;
    throw error;
  } finally {
    stream?.controller?.abort();
  }

  function observeRuntimeEvent(event) {
    sessionId = event.session_id ?? event.session?.id ?? sessionId;
    if (
      event.type === "error" ||
      event.type === "agent.session.requires_action"
    ) {
      const error = new Error(
        `Managed runtime reported ${event.type}. Inspect the session before retrying.`,
      );
      error.sessionId = sessionId;
      throw error;
    }
    if (
      event.type?.endsWith("turn.failed") ||
      event.type?.endsWith("session.failed") ||
      event.type?.endsWith("turn.cancelled")
    ) {
      const error = new Error(
        `Managed runtime reported ${event.type}. Inspect this session before retrying.`,
      );
      error.sessionId = sessionId;
      throw error;
    }
    emit({ type: "runtime", name: event.type ?? "session event", sessionId });
    // Runtime events are observed verbatim. A sandbox step is highlighted only
    // when the service reports a tool item, never inferred from session creation.
    if (event.item?.type === "command_execution") commandSeen = true;
    emit({ type: "step", index: commandSeen ? 2 : 1 });
  }
}
