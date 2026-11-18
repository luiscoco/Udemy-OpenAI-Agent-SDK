export function dependencyTool({ sdk, z, state }) {
  return sdk.tool({
    name: "get_workshop",
    description: "Read the current school's workshop and its materials.",
    parameters: z.object({}),
    errorFunction: null,
    execute: async (_, runContext, details) => {
      const { tenant, services, request } = runContext.context;
      const documentId = tenant.id === "school-a" ? "doc-a" : "doc-b";
      const row = await services.database.findDocument({
        tenantId: tenant.id,
        documentId,
      });
      if (!row) throw new Error("Workshop unavailable.");
      const materials = await services.api.getMaterials({
        tenantId: tenant.id,
        signal: details?.signal,
      });
      services.logger.info({
        requestId: request.id,
        operation: "workshop.read",
      });
      state.value = { title: row.title, description: row.body, materials };
      return state.value;
    },
  });
}
