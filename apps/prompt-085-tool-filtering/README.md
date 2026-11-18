# Prompt 85 — Tool filtering

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/mcp-control-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Expose only approved MCP tools using supported static or context-dependent filters.

The SDK applies a static allowlist or a filter based on the simulated application role. Inspect actual model tool definitions. The fixture separately checks permission before returning budget data.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:85
```

Open http://127.0.0.1:3185. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-085-tool-filtering"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/integrations-observability).
