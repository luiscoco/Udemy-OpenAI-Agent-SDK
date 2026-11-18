const documents = [
  {
    id: "doc-a",
    tenantId: "school-a",
    title: "Robotics workshop",
    body: "Robotics club meets Tuesday at 16:00 in Lab 2.",
  },
  {
    id: "doc-b",
    tenantId: "school-b",
    title: "Music workshop",
    body: "Music club meets Wednesday at 15:30 in Studio B.",
  },
];

// In-memory adapters keep the teaching example self-contained.
export function createClassroomServices(
  trace,
  { outcome = "success", controller } = {},
) {
  const database = {
    closed: false,
    async connect() {
      trace.push({ event: "database.open" });
    },
    async findDocument({ tenantId, documentId }) {
      if (this.closed) throw new Error("Database client is closed.");
      trace.push({ event: "database.find", tenantId, documentId });
      return documents.find(
        (row) => row.tenantId === tenantId && row.id === documentId,
      );
    },
    async close() {
      this.closed = true;
      trace.push({ event: "database.close" });
    },
  };
  const api = {
    closed: false,
    async connect() {
      trace.push({ event: "api.open" });
      if (outcome === "init-failure")
        throw new Error("Classroom API initialization failed.");
    },
    async getMaterials({ signal, tenantId } = {}) {
      if (this.closed) throw new Error("API client is closed.");
      trace.push({ event: "api.materials" });
      signal?.throwIfAborted();
      if (outcome === "failure")
        throw new Error("Classroom API operation failed.");
      if (outcome === "cancel") {
        controller.abort(new Error("Classroom run cancelled."));
        signal.throwIfAborted();
      }
      return tenantId === "school-b"
        ? ["Musical instruments", "Speaker"]
        : ["Robotics kits", "Projector"];
    },
    async close() {
      this.closed = true;
      trace.push({ event: "api.close" });
    },
  };
  const logger = {
    info: (metadata) => trace.push({ event: "application.log", ...metadata }),
  };
  return { database, api, logger };
}

export async function withClassroomServices(
  { trace, outcome, controller },
  operation,
) {
  const services = createClassroomServices(trace, { outcome, controller });
  const owned = [];
  let primaryError;
  try {
    owned.push(services.database);
    await services.database.connect();
    owned.push(services.api);
    await services.api.connect();
    return await operation(services);
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    const cleanupErrors = [];
    for (const client of owned.reverse()) {
      try {
        await client.close();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    if (cleanupErrors.length && !primaryError)
      throw new AggregateError(cleanupErrors, "Client cleanup failed.");
    if (cleanupErrors.length && primaryError)
      trace.push({ event: "cleanup.error", count: cleanupErrors.length });
  }
}
