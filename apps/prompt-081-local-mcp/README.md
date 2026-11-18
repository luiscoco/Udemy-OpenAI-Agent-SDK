# Prompt 81 — Local MCP

Connect an agent to a local MCP server using stdio and close the connection reliably.

A real Node subprocess serves newline-delimited MCP JSON-RPC. The SDK discovers and invokes read_timetable. The connection closes in finally. Classroom model decisions are scripted.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:81
```

Open http://127.0.0.1:3181. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-081-local-mcp"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
