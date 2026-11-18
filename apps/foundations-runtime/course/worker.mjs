import { openStore } from "./storage.mjs";
import { sdk, runAgent, functionCall, message } from "./common.mjs";

const [operation, path, tenant, id, payload] = process.argv.slice(2);
const store = openStore(path);
try {
  const session = store.session(tenant, id);
  if (operation === "append") await session.addItems(JSON.parse(payload));
  if (operation === "job") {
    const job = store.db.prepare("SELECT body FROM jobs WHERE id=?").get(id);
    const body = JSON.parse(job.body);
    const tool = sdk.tool({
      name: "commit_record",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      execute: () => {
        const result = store.effect(tenant, body.operationId, body.payload);
        if (payload === "crash") process.exit(23);
        return result;
      },
    });
    const result = await runAgent(
      "Durable job worker",
      [functionCall("commit_record"), message("Job operation committed.")],
      "Process the queued record change.",
      { agent: { tools: [tool] } },
    );
    const effect = store.effect(tenant, body.operationId, body.payload);
    store.db
      .prepare("UPDATE jobs SET state='complete',body=? WHERE id=?")
      .run(
        JSON.stringify({ ...body, effect, output: result.result.finalOutput }),
        id,
      );
  }
  console.log(
    JSON.stringify({ pid: process.pid, items: await session.getItems() }),
  );
} finally {
  store.close();
}
