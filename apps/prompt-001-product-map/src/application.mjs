import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { products, challenges, implementationPrompt } from "./public/lesson.js";
import { createDemo } from "./lib/demo.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicRoot = resolve(root, "public");
const knownProducts = new Set(products.map((product) => product.id));
const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
};

export function getConfiguration(env) {
  const keyReady = Boolean(env.OPENAI_API_KEY?.trim());
  return {
    model: env.OPENAI_MODEL || "gpt-6-astra",
    live: {
      "agents-sdk": {
        available: keyReady,
        reason: keyReady
          ? "Server API key configured"
          : "Set OPENAI_API_KEY in .env and restart the server.",
      },
      responses: {
        available: keyReady,
        reason: keyReady
          ? "Server API key configured"
          : "Set OPENAI_API_KEY in .env and restart the server.",
      },
      "agents-api": {
        available: keyReady && env.ENABLE_AGENTS_API === "true",
        reason:
          "Requires OPENAI_API_KEY, ENABLE_AGENTS_API=true, and project access to the Agents API.",
      },
      codex: {
        available: env.ENABLE_CODEX === "true",
        reason:
          "Requires ENABLE_CODEX=true and configured local Codex authentication.",
      },
    },
  };
}

async function getLesson() {
  const catalog = await Promise.all(
    products.map(async (product) => {
      const source = await readFile(
        resolve(root, "adapters", `${product.id}.mjs`),
        "utf8",
      );
      const excerpt = source
        .split("// teaching-start")[1]
        .split("// teaching-end")[0];
      const lines = excerpt.trim().split("\n");
      const indentation = Math.min(
        ...lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => line.match(/^ */)[0].length),
      );
      const code = [
        lines[0].trimStart(),
        ...lines.slice(1).map((line) => line.slice(indentation)),
      ]
        .join("\n")
        .trimEnd();
      return { ...product, code, sourcePath: `/source/${product.id}` };
    }),
  );
  return { products: catalog, challenges, implementationPrompt };
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 8192)
      throw Object.assign(new Error("Request is too large."), { status: 413 });
  }
  try {
    return JSON.parse(body);
  } catch {
    throw Object.assign(new Error("Send a valid JSON request."), {
      status: 400,
    });
  }
}

export function createApp({
  env = process.env,
  executeLive,
  demoDelay = 1100,
} = {}) {
  let liveBusy = false;
  const ownedSessions = new Set();
  const server = http.createServer(async (request, response) => {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("referrer-policy", "no-referrer");
    response.setHeader(
      "content-security-policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'",
    );
    try {
      const host = new URL(`http://${request.headers.host || "localhost"}`);
      if (!["localhost", "127.0.0.1", "[::1]"].includes(host.hostname))
        return sendJson(response, 403, {
          error: "Use the local application URL.",
        });
      if (request.headers.origin && request.headers.origin !== host.origin)
        return sendJson(response, 403, {
          error: "Cross-origin requests are disabled.",
        });
      const url = new URL(request.url, host);
      if (request.method === "GET" && url.pathname === "/api/config")
        return sendJson(response, 200, getConfiguration(env));
      if (request.method === "GET" && url.pathname === "/api/lesson")
        return sendJson(response, 200, await getLesson());
      if (request.method === "GET" && url.pathname === "/api/sessions")
        return sendJson(response, 200, { sessions: [...ownedSessions] });
      if (request.method === "GET" && url.pathname === "/api/demo") {
        const product = url.searchParams.get("product");
        if (!knownProducts.has(product))
          return sendJson(response, 400, { error: "Choose a known product." });
        return sendJson(response, 200, await createDemo(product));
      }
      if (request.method === "POST" && url.pathname === "/api/run") {
        const input = await readJson(request);
        if (!input || typeof input !== "object" || Array.isArray(input))
          return sendJson(response, 400, {
            error: "Send an object with product and mode.",
          });
        if (
          !knownProducts.has(input.product) ||
          !["demo", "live"].includes(input.mode)
        )
          return sendJson(response, 400, {
            error: "Choose a known product and execution mode.",
          });
        if (
          input.mode === "live" &&
          !getConfiguration(env).live[input.product].available
        )
          return sendJson(response, 503, {
            error: getConfiguration(env).live[input.product].reason,
          });
        if (input.mode === "live" && liveBusy)
          return sendJson(response, 409, {
            error:
              "A live request is already running. Wait for it to finish or stop it.",
          });
        if (input.mode === "live") liveBusy = true;
        const controller = new AbortController();
        const deadline = setTimeout(
          () =>
            controller.abort(
              new Error(
                "The two-minute request deadline was reached. Inspect any hosted session before retrying.",
              ),
            ),
          120000,
        );
        const disconnected = () => {
          if (!response.writableEnded)
            controller.abort(new Error("The browser disconnected."));
        };
        response.on("close", disconnected);
        response.writeHead(200, {
          "content-type": "application/x-ndjson",
          "cache-control": "no-store",
        });
        const emit = (event) => {
          if (event.sessionId) ownedSessions.add(event.sessionId);
          if (!response.destroyed && !response.writableEnded)
            response.write(JSON.stringify(event) + "\n");
        };
        try {
          emit({
            type: "start",
            mode: input.mode,
            simulated: input.mode === "demo",
          });
          let result;
          if (input.mode === "demo") {
            const demo = await createDemo(input.product);
            for (let index = 0; index < demo.steps.length; index++) {
              emit({ type: "step", index });
              await sleep(demoDelay, undefined, { signal: controller.signal });
            }
            result = demo.result;
          } else {
            const execute =
              executeLive ??
              (await import(`./adapters/${input.product}.mjs`)).execute;
            const product = products.find((item) => item.id === input.product);
            result = await execute({
              env,
              signal: controller.signal,
              emit,
              task: product.task,
              product: input.product,
            });
          }
          controller.signal.throwIfAborted();
          emit({
            type: "result",
            ...result,
            mode: input.mode,
            simulated: input.mode === "demo",
          });
        } catch (error) {
          const message = controller.signal.aborted
            ? controller.signal.reason?.message || "Request stopped."
            : error.message;
          // Provider messages may contain request context. Keep the browser error
          // concise and remove credential-shaped values before returning it.
          let safeMessage = String(message).replace(
            /sk-[A-Za-z0-9_-]+/g,
            "[redacted]",
          );
          if (env.OPENAI_API_KEY)
            safeMessage = safeMessage
              .split(env.OPENAI_API_KEY)
              .join("[redacted]");
          emit({
            type: "error",
            message: safeMessage.slice(0, 700),
            sessionId: error.sessionId,
          });
        } finally {
          clearTimeout(deadline);
          response.off("close", disconnected);
          if (input.mode === "live") liveBusy = false;
          response.end();
        }
        return;
      }
      if (
        request.method === "DELETE" &&
        url.pathname.startsWith("/api/sessions/")
      ) {
        const id = decodeURIComponent(
          url.pathname.slice("/api/sessions/".length),
        );
        if (!ownedSessions.has(id))
          return sendJson(response, 404, {
            error: "This session was not created by this server process.",
          });
        const { default: OpenAI } = await import("openai");
        const client = new OpenAI({
          apiKey: env.OPENAI_API_KEY,
          timeout: 30000,
          maxRetries: 0,
        });
        try {
          await client.beta.agents.sessions.delete(id);
        } catch (error) {
          if (error.status !== 404) throw error;
        }
        ownedSessions.delete(id);
        return sendJson(response, 200, { deleted: true });
      }
      if (request.method === "GET" && url.pathname.startsWith("/source/")) {
        const product = url.pathname.slice("/source/".length);
        if (!knownProducts.has(product))
          return sendJson(response, 404, { error: "Source file unavailable." });
        response.writeHead(200, {
          "content-type": "text/plain; charset=utf-8",
        });
        return response.end(
          await readFile(resolve(root, "adapters", `${product}.mjs`), "utf8"),
        );
      }
      if (!["GET", "HEAD"].includes(request.method))
        return sendJson(response, 405, { error: "Method not allowed." });
      const pathname = decodeURIComponent(
        url.pathname === "/" ? "/index.html" : url.pathname,
      );
      const path = resolve(publicRoot, "." + pathname);
      const local = relative(publicRoot, path);
      if (
        local.startsWith("..") ||
        local.includes("\0") ||
        !contentTypes[extname(path)]
      )
        return sendJson(response, 404, { error: "File unavailable." });
      const content = await readFile(path);
      response.writeHead(200, {
        "content-type": `${contentTypes[extname(path)]}; charset=utf-8`,
        "cache-control": "no-cache",
      });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch (error) {
      if (!response.headersSent)
        sendJson(
          response,
          error.status || (error.code === "ENOENT" ? 404 : 500),
          {
            error: error.status
              ? error.message
              : "The request could not be completed.",
          },
        );
      else response.end();
    }
  });
  return server;
}

export const lessonNumber=1;

export function startApplication() {
  const port = Number(process.env.PORT || 3101);
  const server = createApp();
  server.listen(port, "127.0.0.1", () =>
    console.log(`Product Map Lab is ready at http://127.0.0.1:${server.address().port}`),
  );
  server.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
  for (const signal of ["SIGINT", "SIGTERM"])
    process.once(signal, () => {
      server.close();
      server.closeAllConnections();
    });
  return server;
}
