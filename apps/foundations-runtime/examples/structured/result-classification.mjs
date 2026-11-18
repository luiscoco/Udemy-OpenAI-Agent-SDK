export function classifyStructuredResult(result, schema) {
  if (result.interruptions?.length)
    return { status: "paused", consumed: false };
  const responses = result.rawResponses ?? [];
  const items = responses.flatMap((response) => response.output ?? []);
  if (
    items.some((item) => item.content?.some((part) => part.type === "refusal"))
  )
    return { status: "refused", consumed: false };
  if (
    items.some((item) => item.status === "incomplete") ||
    responses.some((response) => response.providerData?.status === "incomplete")
  )
    return { status: "incomplete", consumed: false };
  if (result.finalOutput === undefined)
    return { status: "incomplete", consumed: false };
  const validation = schema.safeParse(result.finalOutput);
  return validation.success
    ? { status: "completed", consumed: true, value: validation.data }
    : { status: "invalid", consumed: false };
}
