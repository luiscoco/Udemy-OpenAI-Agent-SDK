import { createServer } from "node:http";
import { handleMcp } from "../../../../foundations-runtime/examples/mcp/fixture-protocol.mjs";

export async function createMcpHttpFixture({
  token,
  handle = handleMcp,
  port = 0,
  sessionId,
} = {}) {
  const trace = [];
  const pending = new Set();
  const server = createServer(async (request, response) => {
    let finish;
    const settled = new Promise((resolve) => {
      finish = resolve;
    });
    pending.add(settled);
    try {
      const host = request.headers.host;
      if (
        !host ||
        !/^127\.0\.0\.1:\d+$/.test(host) ||
        (request.headers.origin && request.headers.origin !== `http://${host}`)
      ) {
        response.writeHead(403);
        response.end();
        return;
      }
      if (request.url !== "/mcp") {
        response.writeHead(404);
        response.end();
        return;
      }
      if (token && request.headers.authorization !== `Bearer ${token}`) {
        trace.push({ authentication: "denied" });
        response.writeHead(401, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "UNAUTHORIZED" }));
        return;
      }
      if (
        sessionId &&
        request.method === "DELETE" &&
        request.headers["mcp-session-id"] === sessionId
      ) {
        response.writeHead(204);
        response.end();
        return;
      }
      if (request.method !== "POST") {
        response.writeHead(405, { Allow: "POST" });
        response.end();
        return;
      }
      if (token) trace.push({ authentication: "accepted" });
      try {
        let size = 0;
        const chunks = [];
        for await (const chunk of request) {
          size += chunk.length;
          if (size > 16384) throw new Error("Body too large");
          chunks.push(chunk);
        }
        const message = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (
          sessionId &&
          !["initialize", "server/discover"].includes(message.method) &&
          request.headers["mcp-session-id"] !== sessionId
        ) {
          response.writeHead(400);
          response.end();
          return;
        }
        const result = await handle(message, trace);
        if (!result) {
          response.writeHead(202);
          response.end();
          return;
        }
        response.writeHead(200, {
          "Content-Type": "application/json",
          ...(sessionId && message.method === "initialize"
            ? { "Mcp-Session-Id": sessionId }
            : {}),
        });
        response.end(JSON.stringify(result));
      } catch {
        response.writeHead(400);
        response.end();
      }
    } finally {
      pending.delete(settled);
      finish();
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}/mcp`,
    trace,
    get pendingRequests() {
      return pending.size;
    },
    async close() {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      await Promise.all([...pending]);
    },
  };
}
