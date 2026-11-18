# Prompt 37 — API compatibility

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/runtime-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare Responses and Chat Completions model integrations, identifying capabilities that require the Responses path.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:37
```

Open http://127.0.0.1:3137. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

Hosted tools use Responses. Function-tool support also depends on the selected model and endpoint.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

Copy this app’s .env.example to .env and configure the required account credentials for live mode. Live calls can incur provider charges. Account-backed inference has not been tested with paid credentials.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-037-api-compatibility"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
