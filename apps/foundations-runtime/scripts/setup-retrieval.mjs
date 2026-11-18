import OpenAI, { toFile } from "openai";
import {
  readFile,
  writeFile,
  mkdir,
  rename,
  unlink,
  open,
} from "node:fs/promises";
import { parseEnv } from "node:util";

const app = new URL("../../prompt-075-retrieval-controls/", import.meta.url);
async function optional(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}
const shared = parseEnv(await optional(new URL("../../.env", import.meta.url)));
const local = parseEnv(await optional(new URL(".env", app)));
const key =
  process.env.OPENAI_API_KEY?.trim() ||
  local.OPENAI_API_KEY?.trim() ||
  shared.OPENAI_API_KEY?.trim();
if (!key)
  throw new Error(
    "Configure OPENAI_API_KEY locally before setting up the retrieval collection.",
  );
const client = new OpenAI({ apiKey: key, maxRetries: 0, timeout: 60000 });
await mkdir(new URL(".runtime/", app), { recursive: true });
const lockPath = new URL(".runtime/retrieval.lock", app);
const manifest = new URL(".runtime/retrieval.json", app);
let lock;
try {
  lock = await open(lockPath, "wx");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  throw new Error(
    "Retrieval setup is already running. If an earlier process was terminated, remove .runtime/retrieval.lock after confirming it has exited.",
  );
}
const state = { files: {} };
async function save() {
  const temporary = new URL(".runtime/retrieval.json.tmp", app);
  await writeFile(temporary, JSON.stringify(state, null, 2) + "\n");
  await rename(temporary, manifest);
}
async function removeOwned(operation) {
  try {
    await operation();
  } catch (error) {
    if (error.status !== 404) throw error;
  }
}
try {
  const previous = await optional(manifest);
  if (previous) Object.assign(state, JSON.parse(previous));
  if (process.argv.includes("--cleanup")) {
    if (state.vectorStoreId) {
      await removeOwned(() => client.vectorStores.delete(state.vectorStoreId));
      delete state.vectorStoreId;
      for (const file of Object.values(state.files)) file.attached = false;
      await save();
    }
    for (const [name, file] of Object.entries(state.files)) {
      await removeOwned(() => client.files.delete(file.id));
      delete state.files[name];
      await save();
    }
    await unlink(manifest).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    console.log("Deleted the retrieval resources tracked by this app.");
  } else {
    if (!state.vectorStoreId) {
      const store = await client.vectorStores.create({
        name: "Prompt 75 department collection",
        expires_after: { anchor: "last_active_at", days: 1 },
      });
      state.vectorStoreId = store.id;
      await save();
    }
    for (const department of ["robotics", "astronomy"]) {
      for (let index = 1; index <= 3; index++) {
        const name = `${department}-${index}.txt`;
        if (!state.files[name]) {
          const content = `${department} workshop document ${index}. ${department === "robotics" ? "Robotics starts at 16:00 in Lab 2. Bring robotics kits." : "Astronomy starts at 18:00 in Room 4. Bring a star chart."} This is synthetic teaching data.`;
          const file = await client.files.create({
            file: await toFile(Buffer.from(content), name),
            purpose: "assistants",
          });
          state.files[name] = { id: file.id, attached: false };
          await save();
        }
        const file = state.files[name];
        if (!file.attached) {
          let existing;
          try {
            existing = await client.vectorStores.files.retrieve(file.id, {
              vector_store_id: state.vectorStoreId,
            });
          } catch (error) {
            if (error.status !== 404) throw error;
          }
          if (!existing)
            await client.vectorStores.files.create(state.vectorStoreId, {
              file_id: file.id,
              attributes: { department },
            });
          file.attached = true;
          await save();
        }
        const indexed = await client.vectorStores.files.poll(
          state.vectorStoreId,
          file.id,
          { pollIntervalMs: 1000, signal: AbortSignal.timeout(120000) },
        );
        if (indexed.status !== "completed")
          throw new Error(
            `Indexing failed for ${name}. Run cleanup before creating another collection.`,
          );
      }
    }
    console.log(`VECTOR_STORE_ID=${state.vectorStoreId}`);
    console.log(
      "Add the setting to prompt-075-retrieval-controls/.env and restart. Run setup:documents -- --cleanup when finished.",
    );
  }
} catch (error) {
  console.error(
    String(error.message)
      .replaceAll(key, "[redacted]")
      .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]"),
  );
  console.error(
    "Owned resource IDs are retained in .runtime/retrieval.json for retry or cleanup.",
  );
  process.exitCode = 1;
} finally {
  await lock.close();
  await unlink(lockPath);
}
