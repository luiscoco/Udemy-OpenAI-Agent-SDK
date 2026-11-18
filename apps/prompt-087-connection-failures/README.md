# Prompt 87 — Connection failures

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/mcp-control-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Handle MCP connection failures, timeouts, server restarts, and cleanup without hiding the underlying problem.

The exercise causes real loopback refusal, delayed discovery or a server restart. It retains actual error diagnostics, closes failed clients, and explicitly reconnects for the restart scenario. No model inference is used.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:87
```

Open http://127.0.0.1:3187. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

This exercise performs actual local MCP transport operations and uses no model inference or API credential.

## Record the walkthrough

```powershell
cd ".\apps\prompt-087-connection-failures"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/integrations-observability).
