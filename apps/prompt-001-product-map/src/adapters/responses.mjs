export async function execute({ env, signal, emit, task }, dependencies = {}) {
  const OpenAI = dependencies.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: 60000,
    maxRetries: 0,
  });
  const model = env.OPENAI_MODEL || "gpt-6-astra";
  emit({ type: "step", index: 0 });
  emit({ type: "step", index: 1 });
  // teaching-start
  const response = await client.responses.create(
    {
      model,
      input: task,
    },
    { signal },
  );
  const text = response.output_text;
  // teaching-end
  if (response.status !== "completed" || !text)
    throw new Error("The model response did not complete with text.");
  emit({ type: "step", index: 2 });
  return {
    text,
    evidenceTitle: "Actual response",
    evidence: JSON.stringify(
      { id: response.id, status: response.status },
      null,
      2,
    ),
  };
}
