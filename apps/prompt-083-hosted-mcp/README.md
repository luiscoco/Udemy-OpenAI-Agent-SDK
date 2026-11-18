# Prompt 83 — Hosted MCP

Configure hosted MCP and compare its execution path with an SDK-managed MCP connection.

The SDK path uses the real loopback MCP server. The hosted classroom path injects provider MCP results. Live hosted mode requires MCP_SERVER_URL pointing to a publicly reachable timetable server.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:83
```

Open http://127.0.0.1:3183. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

The SDK path starts a real local fixture server. Classroom hosted mode uses injected provider responses for a placeholder URL. Live hosted mode needs MCP_SERVER_URL for your public timetable MCP server that exposes read_timetable(topic). OpenAI must be able to reach that endpoint.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-083-hosted-mcp"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
