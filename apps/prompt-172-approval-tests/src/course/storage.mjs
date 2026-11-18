import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID, createHash } from "node:crypto";

export const databasePath = fileURLToPath(
  new URL("../../../.runtime/course/course.sqlite", import.meta.url),
);
export function openStore(path = databasePath) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(
    "PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS sessions(tenant TEXT,id TEXT,items TEXT NOT NULL,PRIMARY KEY(tenant,id)); CREATE TABLE IF NOT EXISTS facts(tenant TEXT,id TEXT,value TEXT NOT NULL,PRIMARY KEY(tenant,id)); CREATE TABLE IF NOT EXISTS effects(tenant TEXT,id TEXT,hash TEXT NOT NULL,result TEXT NOT NULL,PRIMARY KEY(tenant,id)); CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,tenant TEXT,body TEXT NOT NULL); CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY,state TEXT,body TEXT NOT NULL); CREATE TABLE IF NOT EXISTS permissions(tenant TEXT PRIMARY KEY,allowed INTEGER NOT NULL);",
  );
  function transaction(action) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const value = action();
      db.exec("COMMIT");
      return value;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  return {
    db,
    path,
    transaction,
    session(tenant, id = randomUUID()) {
      const read = () =>
        JSON.parse(
          db
            .prepare("SELECT items FROM sessions WHERE tenant=? AND id=?")
            .get(tenant, id)?.items ?? "[]",
        );
      const write = (items) =>
        db
          .prepare(
            "INSERT INTO sessions VALUES(?,?,?) ON CONFLICT(tenant,id) DO UPDATE SET items=excluded.items",
          )
          .run(tenant, id, JSON.stringify(items));
      return {
        async getSessionId() {
          return id;
        },
        async getItems(limit) {
          const items = read();
          return structuredClone(
            limit === undefined ? items : items.slice(-limit),
          );
        },
        async addItems(items) {
          const copy = structuredClone(items);
          transaction(() => write([...read(), ...copy]));
        },
        async popItem() {
          return transaction(() => {
            const items = read();
            const item = items.pop();
            write(items);
            return item;
          });
        },
        async clearSession() {
          db.prepare("DELETE FROM sessions WHERE tenant=? AND id=?").run(
            tenant,
            id,
          );
        },
        async replaceHistoryWithCompaction(items) {
          transaction(() => write(items));
        },
      };
    },
    saveRun(id, tenant, body) {
      db.prepare(
        "INSERT INTO runs VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body WHERE tenant=excluded.tenant",
      ).run(id, tenant, JSON.stringify(body));
    },
    getRun(id, tenant) {
      const row = db
        .prepare("SELECT body FROM runs WHERE id=? AND tenant=?")
        .get(id, tenant);
      return row ? JSON.parse(row.body) : null;
    },
    remember(tenant, id, value, approved) {
      if (!approved) throw new Error("Fact requires user approval.");
      db.prepare(
        "INSERT INTO facts VALUES(?,?,?) ON CONFLICT(tenant,id) DO UPDATE SET value=excluded.value",
      ).run(tenant, id, JSON.stringify(value));
    },
    recall(tenant, id) {
      const row = db
        .prepare("SELECT value FROM facts WHERE tenant=? AND id=?")
        .get(tenant, id);
      return row ? JSON.parse(row.value) : null;
    },
    forget(tenant, id) {
      db.prepare("DELETE FROM facts WHERE tenant=? AND id=?").run(tenant, id);
    },
    effect(tenant, id, payload) {
      const hash = createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex");
      return transaction(() => {
        const previous = db
          .prepare("SELECT hash,result FROM effects WHERE tenant=? AND id=?")
          .get(tenant, id);
        if (previous) {
          if (previous.hash !== hash)
            throw new Error("Idempotency key reused with different arguments.");
          return { ...JSON.parse(previous.result), applied: false };
        }
        const result = { receipt: randomUUID(), payload };
        db.prepare("INSERT INTO effects VALUES(?,?,?,?)").run(
          tenant,
          id,
          hash,
          JSON.stringify(result),
        );
        return { ...result, applied: true };
      });
    },
    allow(tenant, allowed) {
      db.prepare(
        "INSERT INTO permissions VALUES(?,?) ON CONFLICT(tenant) DO UPDATE SET allowed=excluded.allowed",
      ).run(tenant, allowed ? 1 : 0);
    },
    authorized(tenant) {
      return (
        db.prepare("SELECT allowed FROM permissions WHERE tenant=?").get(tenant)
          ?.allowed === 1
      );
    },
    close() {
      db.close();
    },
  };
}
