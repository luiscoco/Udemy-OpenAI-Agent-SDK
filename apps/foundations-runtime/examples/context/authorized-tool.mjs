export function authorizedDocumentTool({ sdk, z, state }) {
  return sdk.tool({
    name: "read_document",
    description:
      "Read a document permitted for the current authenticated school.",
    parameters: z.object({ documentId: z.string() }),
    errorFunction: null,
    execute: async ({ documentId }, runContext) => {
      const { tenant, services } = runContext.context;
      const row = await services.database.findDocument({
        tenantId: tenant.id,
        documentId,
      });
      if (!row) {
        state.authorization = "denied";
        throw new Error("Document unavailable.");
      }
      state.authorization = "allowed";
      state.value = { title: row.title, text: row.body };
      return state.value;
    },
  });
}
