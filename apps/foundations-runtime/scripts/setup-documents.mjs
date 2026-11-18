import OpenAI from "openai";
import { createReadStream } from "node:fs";
import {
  readFile,
  writeFile,
  mkdir,
  rename,
  unlink,
  open,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const app = new URL("../../prompt-074-file-search/", import.meta.url);
const manifestPath = new URL(".runtime/documents.json", app);
async function readOptional(url) {
  try {
    return await readFile(url, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}
const env = {
  ...parseEnv(await readOptional(new URL("../../.env", import.meta.url))),
  ...parseEnv(await readOptional(new URL(".env", app))),
  ...process.env,
};
if (!env.OPENAI_API_KEY?.trim())
  throw new Error(
    "Configure OPENAI_API_KEY locally in apps/.env or this app's .env.",
  );
const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  maxRetries: 0,
  timeout: 60000,
});
await mkdir(new URL(".runtime/", app), { recursive: true });
const lockPath = new URL(".runtime/documents.lock", app);
let lock;
try {
  lock = await open(lockPath, "wx");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  throw new Error(
    "A document setup or cleanup is already running. If an earlier process was terminated, remove .runtime/documents.lock after confirming it has exited.",
  );
}
const state = {};
async function save() {
  await mkdir(new URL(".runtime/", app), { recursive: true });
  const temporary = new URL(".runtime/documents.json.tmp", app);
  await writeFile(temporary, JSON.stringify(state, null, 2) + "\n");
  await rename(temporary, manifestPath);
}
async function deleteOwned(operation) {
  try {
    await operation();
  } catch (error) {
    if (error.status !== 404) throw error;
  }
}
try {
  const text = await readOptional(manifestPath);
  Object.assign(state, text ? JSON.parse(text) : {});
  if (process.argv.includes("--cleanup")) {
    if (state.vectorStoreId) {
      await deleteOwned(() => client.vectorStores.delete(state.vectorStoreId));
      delete state.vectorStoreId;
      delete state.attached;
      await save();
    }
    if (state.fileId) {
      await deleteOwned(() => client.files.delete(state.fileId));
      delete state.fileId;
      await save();
    }
    await unlink(manifestPath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    console.log(
      "Deleted the document resources tracked by this application's manifest.",
    );
  } else {
    if (!state.vectorStoreId) {
      const store = await client.vectorStores.create({
        name: "Prompt 74 classroom handbook",
        expires_after: { anchor: "last_active_at", days: 1 },
      });
      state.vectorStoreId = store.id;
      await save();
    }
    if (!state.fileId) {
      const file = await client.files.create({
        file: createReadStream(
          fileURLToPath(new URL("workshop-handbook.txt", app)),
        ),
        purpose: "assistants",
      });
      state.fileId = file.id;
      await save();
    }
    if (!state.attached) {
      // Check for a previously completed attachment after an interrupted setup.
      let attached;
      try {
        attached = await client.vectorStores.files.retrieve(state.fileId, {
          vector_store_id: state.vectorStoreId,
        });
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      if (!attached)
        await client.vectorStores.files.create(state.vectorStoreId, {
          file_id: state.fileId,
        });
      state.attached = true;
      await save();
    }
    const indexed = await client.vectorStores.files.poll(
      state.vectorStoreId,
      state.fileId,
      { pollIntervalMs: 1000, signal: AbortSignal.timeout(120000) },
    );
    if (indexed.status !== "completed")
      throw new Error(
        `Document indexing ended with status ${indexed.status}. Run cleanup before creating another collection.`,
      );
    state.completed = true;
    await save();
    console.log(`VECTOR_STORE_ID=${state.vectorStoreId}`);
    console.log(
      "Add this setting to prompt-074-file-search/.env and restart the app. Use --cleanup when finished.",
    );
  }
} catch (error) {
  const safe = String(error.message)
    .replaceAll(env.OPENAI_API_KEY, "[redacted]")
    .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]");
  console.error(`Document setup failed. ${safe}`);
  console.error(
    "Owned resource IDs are retained in .runtime/documents.json for retry or cleanup.",
  );
  process.exitCode = 1;
} finally {
  await lock.close();
  await unlink(lockPath);
}
