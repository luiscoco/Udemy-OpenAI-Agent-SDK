export function metadataTool({ sdk, z, logs }) {
  return sdk.tool({
    name: "inspect_record",
    description: "Inspect a record using the supplied classroom note.",
    parameters: z.object({ recordId: z.string(), privateNote: z.string() }),
    errorFunction: null,
    execute: async (argumentsObject, runContext, details) => {
      const call = details?.toolCall;
      const metadata = {
        callId: call?.callId ?? null,
        toolName: call?.name ?? "inspect_record",
        argumentNames: Object.keys(argumentsObject),
        requestId: runContext.context.request.id,
      };
      logs.push(metadata);
      return { inspected: true };
    },
  });
}
