export const classroomProfiles = {
  alice: { userId: "user-alice", tenantId: "tenant-a" },
  ben: { userId: "user-ben", tenantId: "tenant-b" },
};

export async function createTenantDatabase() {
  const { DatabaseSync } = await import("node:sqlite");
  const database = new DatabaseSync(":memory:");
  database.exec(
    "CREATE TABLE workshops (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, title TEXT NOT NULL);",
  );
  const insert = database.prepare("INSERT INTO workshops VALUES (?, ?, ?)");
  insert.run("workshop-a", "tenant-a", "Robotics for beginners");
  insert.run("workshop-b", "tenant-b", "Astronomy club");
  database.exec("PRAGMA query_only = ON");
  const sql = "SELECT id, title FROM workshops WHERE tenant_id = ? AND id = ?";
  const statement = database.prepare(sql);
  const queries = [];
  return {
    database,
    sql,
    queries,
    read(context, id) {
      if (!context?.userId || !context?.tenantId)
        throw new Error("Authenticated tenant context is required.");
      queries.push({ sql, parameters: [context.tenantId, id] });
      const row = statement.get(context.tenantId, id);
      return row ? { found: true, ...row } : { found: false };
    },
    close() {
      database.close();
    },
  };
}
