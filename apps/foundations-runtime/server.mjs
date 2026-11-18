import { readArtifact } from "./artifacts.mjs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { getLesson, lessons } from "./catalog.mjs";
import { capabilities, executeLesson, lessonSources } from "./execute.mjs";
import { starterArchive, releases } from "./bootstrap.mjs";
import { diagnose, redact } from "./diagnostics.mjs";
import OpenAI from "openai";
import { getPilotLesson } from "./teaching/pilot-lessons.mjs";
import { renderPilotGuide, teachingArchive, teachingFiles } from "./teaching/materials.mjs";

const publicFiles = {
  ...Object.fromEntries(
    [
      "highlight.js",
      "theme.css",
      "vendor/core.min.js",
      ...[
        "javascript", "typescript", "python", "json", "sql", "powershell",
        "bash", "yaml", "xml", "css", "dockerfile", "markdown", "ini",
      ].map((language) => `vendor/languages/${language}.min.js`),
    ].map((file) => [
      `/syntax/${file}`,
      [`syntax/${file}`, file.endsWith(".css") ? "text/css" : "text/javascript"],
    ]),
  ),
  "/pilot.css": ["pilot.css", "text/css"],
  "/pilot-ui.js": ["pilot-ui.js", "text/javascript"],
  "/pilot-guide.js": ["pilot-guide.js", "text/javascript"],
  "/assets/openai-icon.svg": ["assets/openai-icon.svg", "image/svg+xml"],
  "/remaining-lessons.js": ["remaining-lessons.js", "text/javascript"],
  "/course-panel.js": ["course-panel.js", "text/javascript"],
  "/voice-client.js": ["voice-client.js", "text/javascript"],
  "/handoff-lessons.js": ["handoff-lessons.js", "text/javascript"],
  "/hosted-lessons.js": ["hosted-lessons.js", "text/javascript"],
  "/control-lessons.js": ["control-lessons.js", "text/javascript"],
  "/tools-lessons.js": ["tools-lessons.js", "text/javascript"],
  "/streaming-lessons.js": ["streaming-lessons.js", "text/javascript"],
  "/runtime-lessons.js": ["runtime-lessons.js", "text/javascript"],
  "/structured-lessons.js": ["structured-lessons.js", "text/javascript"],
  "/assets/classroom-shapes.png": ["assets/classroom-shapes.png", "image/png"],
  "/assets/classroom-workshop.pdf": [
    "assets/classroom-workshop.pdf",
    "application/pdf",
  ],
  "/assets/classroom-workshop-preview.png": [
    "assets/classroom-workshop-preview.png",
    "image/png",
  ],
  "/assets/classroom-workshop.txt": [
    "assets/classroom-workshop.txt",
    "text/plain",
  ],
  "/": ["index.html", "text/html"],
  "/app.js": ["app.js", "text/javascript"],
  "/styles.css": ["styles.css", "text/css"],
  "/identity.js": ["identity.js", "text/javascript"],
  "/definitions.js": ["definitions.js", "text/javascript"],
  "/context-lessons.js": ["context-lessons.js", "text/javascript"],
};
const json = (response, status, data) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
};

async function readBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 12288) throw new Error("Request exceeds the 12 KiB limit.");
    chunks.push(chunk);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!body || Array.isArray(body) || typeof body !== "object")
    throw new Error("Send a JSON object.");
  return body;
}

export function createApp({
  number = 2,
  env = process.env,
  execute = executeLesson,
  executionTimeoutMs = 60000,
} = {}) {
  if(!Number.isInteger(executionTimeoutMs)||executionTimeoutMs<1000||executionTimeoutMs>300000)throw new Error('Choose an execution timeout from 1000 through 300000 milliseconds.');
  getLesson(number);
  let liveBusy = false;
  return createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://api.openai.com; media-src 'self' blob:; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'",
    );
    const host = request.headers.host;
    if (!host || !/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))
      return json(response, 403, {
        error: "Use the localhost application URL.",
      });
    if (request.headers.origin && request.headers.origin !== `http://${host}`)
      return json(response, 403, { error: "Use the application's own page." });
    const url = new URL(request.url, `http://${host}`);
    if (
      request.method === "GET" &&
      url.pathname.startsWith("/api/artifacts/")
    ) {
      const artifact = await readArtifact(
        url.pathname.slice("/api/artifacts/".length),
      );
      if (!artifact)
        return json(response, 404, { error: "Artifact unavailable." });
      response.writeHead(200, {
        "Content-Type": artifact.mime,
        "Content-Security-Policy": "default-src 'none'; sandbox",
      });
      return response.end(artifact.bytes);
    }
    if (request.method === "GET" && publicFiles[url.pathname]) {
      const [filename, mime] = publicFiles[url.pathname];
      response.writeHead(200, {
        "Content-Type": mime.startsWith("text/")
          ? `${mime}; charset=utf-8`
          : mime,
      });
      return response.end(
        await readFile(new URL(`./public/${filename}`, import.meta.url)),
      );
    }
    if (request.method === "GET" && url.pathname === "/favicon.ico") {
      response.writeHead(204);
      return response.end();
    }
    let ownsRun = false;
    const controller = new AbortController();
    const disconnected = () => {
      if (!response.writableEnded) controller.abort();
    };
    response.on("close", disconnected);
    const timeout = setTimeout(
      () =>
        controller.abort(new Error("The operation exceeded its time limit.")),
      executionTimeoutMs,
    );
    try {
      const lesson = getLesson(url.searchParams.get("prompt") ?? number);
      if (request.method === "GET" && url.pathname === "/api/pilot") {
        return json(response, 200, getPilotLesson(lesson.number));
      }
      if (request.method === "GET" && url.pathname === "/pilot-guide") {
        const html = await renderPilotGuide(lesson.number, url.searchParams.get("view") ?? "student");
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return response.end(html);
      }
      if (request.method === "GET" && url.pathname === "/api/pilot-pack") {
        const archive = await teachingArchive(lesson.number);
        response.writeHead(200, { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${archive.filename}"` });
        return response.end(archive.bytes);
      }
      if (request.method === "GET" && url.pathname === "/api/pilot-file") {
        const files = await teachingFiles(lesson.number);
        const filename = url.searchParams.get("file");
        if (!["narration.txt", "storyboard.csv", "source-map.json"].includes(filename)) return json(response,404,{error:"Choose a listed teaching file."});
        response.writeHead(200, { "Content-Type": filename.endsWith("csv") ? "text/csv; charset=utf-8" : "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="prompt-${lesson.number}-${filename}"` });
        return response.end(files[filename]);
      }
      if (request.method === "GET" && url.pathname === "/health") {
        return json(response, 200, { status: "ready", prompt: lesson.number });
      }
      if (request.method === "POST" && url.pathname === "/api/realtime-token" && lesson.number === 153) {
        if (env.CLASSROOM_LIVE_VOICE !== "1") throw new Error("Enable CLASSROOM_LIVE_VOICE=1 on the server to use paid voice calls.");
        if (!env.OPENAI_API_KEY?.trim()) throw new Error("Configure OPENAI_API_KEY on the server.");
        const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const secret = await client.realtime.clientSecrets.create({ session: { type: "realtime", model: env.REALTIME_MODEL || "gpt-realtime", instructions: "Teach agent concepts concisely. Use classroom examples." } }, { signal: controller.signal });
        return json(response, 200, { value: secret.value, expires_at: secret.expires_at });
      }
      if (request.method === "GET" && url.pathname === "/api/state") {
        return json(response, 200, {
          lesson,
          lessons,
          sources: await lessonSources(lesson.number),
          releases,
          capabilities,
          configured: Boolean(env.OPENAI_API_KEY?.trim()),
          storedPromptConfigured: Boolean(env.STORED_PROMPT_ID?.trim()),
          model: env.OPENAI_MODEL || "gpt-6-astra",
        });
      }
      if (
        request.method === "GET" &&
        url.pathname === "/api/starter" &&
        lesson.number === 3
      ) {
        const language = url.searchParams.get("language");
        if (!["python", "typescript"].includes(language))
          throw new Error("Choose Python or TypeScript.");
        const archive = await starterArchive(language);
        response.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="prompt-003-${language}-starter.zip"`,
        });
        return response.end(archive);
      }
      if (request.method === "GET" && url.pathname === "/api/source") {
        const sources = await lessonSources(lesson.number);
        const name = url.searchParams.get("name");
        if (!Object.hasOwn(sources, name))
          return json(response, 404, { error: "Source file unavailable." });
        response.writeHead(200, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        return response.end(sources[name]);
      }
      if (
        request.method === "POST" &&
        ["/api/execute", "/api/execute-stream"].includes(url.pathname)
      ) {
        if (!request.headers["content-type"]?.includes("application/json"))
          throw new Error("Send application/json.");
        const input = await readBody(request);
        const streaming = url.pathname === "/api/execute-stream";
        if (streaming && (lesson.number < 49 || lesson.number > 56) && ![120,182].includes(lesson.number))
          throw new Error("This lesson uses complete-response execution.");
        if (input.mode === "live") {
          if (liveBusy)
            return json(response, 409, {
              error:
                "A live run is already in progress. Wait for it to finish.",
            });
          liveBusy = true;
          ownsRun = true;
        }
        const send = (type, data) => {
          if (!response.destroyed)
            response.write(`data: ${JSON.stringify({ type, data })}\n\n`);
        };
        if (streaming) {
          response.writeHead(200, {
            "Content-Type": "text/event-stream; charset=utf-8",
            Connection: "keep-alive",
          });
          response.flushHeaders();
        }
        const result = await execute(lesson.number, input, {
          env,
          signal: controller.signal,
          ...(streaming
            ? { onProgress: (entry) => send("progress", entry) }
            : {}),
        });
        if (!response.destroyed) {
          if (streaming) {
            send("result", result);
            response.end();
          } else json(response, 200, result);
        }
        return;
      }
      return json(response, 404, { error: "Route unavailable." });
    } catch (error) {
      if (response.headersSent && !response.destroyed) {
        response.end(
          `data: ${JSON.stringify({ type: "error", data: { error: redact(error.message, env) } })}\n\n`,
        );
        return;
      }
      if (!response.destroyed)
        json(response, 400, {
          error: redact(error.message, env),
          code: error.code,
          status: error.status,
          diagnosis: diagnose(error),
        });
    } finally {
      clearTimeout(timeout);
      response.off("close", disconnected);
      if (ownsRun) liveBusy = false;
    }
  });
}

export function startLesson(number) {
  const lesson = getLesson(number);
  const port = Number(process.env.PORT || lesson.port);
  const server = createApp({ number });
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `Port ${port} is in use. Set PORT to another value and run npm start again.`
        : error.message,
    );
    process.exitCode = 1;
  });
  const shutdown = () => {
    server.close(() => process.exit(0));
    const deadline = setTimeout(() => { server.closeAllConnections(); process.exit(1); }, 10000);
    deadline.unref();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  server.listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(
      `Prompt ${number} — ${lesson.title}\nhttp://127.0.0.1:${server.address().port}\nClassroom mode is ready. Press Ctrl+C to stop.`,
    ),
  );
  return server;
}
