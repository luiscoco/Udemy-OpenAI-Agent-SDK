export async function createRetrievalDatabase() {
  const { DatabaseSync } = await import("node:sqlite");
  const database = new DatabaseSync(":memory:");
  try {
    database.exec(
      "CREATE TABLE documents (id TEXT PRIMARY KEY, tenant TEXT, topic TEXT, content TEXT)",
    );
    const insert = database.prepare(
      "INSERT INTO documents VALUES (?, ?, ?, ?)",
    );
    insert.run(
      "doc-a",
      "tenant-a",
      "robotics",
      "Robotics starts at 16:00 in Lab 2. Bring robotics kits.",
    );
    insert.run(
      "doc-b",
      "tenant-b",
      "robotics",
      "Tenant B Robotics starts at 18:00 in Room 4.",
    );
    database.exec("PRAGMA query_only = ON");
    const sql =
      "SELECT id, content FROM documents WHERE tenant = ? AND topic = ? LIMIT 3";
    const query = database.prepare(sql);
    const queries = [];
    return {
      queries,
      search(context, topic) {
        if (!context?.tenantId || !context?.userId)
          throw new Error("Authenticated context is required.");
        queries.push({ sql, parameters: [context.tenantId, topic] });
        const rows = query.all(context.tenantId, topic);
        return {
          sufficient: rows.length > 0,
          documents: rows.map((row) => ({
            sourceId: row.id,
            text: row.content,
          })),
        };
      },
      close() {
        database.close();
      },
    };
  } catch (error) {
    database.close();
    throw error;
  }
}
