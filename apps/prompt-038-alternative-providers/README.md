# Prompt 38 — Alternative providers

Connect another model provider through a supported adapter and document differences in tools, outputs, streaming, and usage reporting.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:38
```

Open http://127.0.0.1:3138. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

Provider omissions can produce zero SDK counters. Treat that as unavailable accounting and verify capabilities for each provider.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

Copy this app’s .env.example to .env and configure the required account credentials for live mode. Live calls can incur provider charges. Account-backed inference has not been tested with paid credentials.

External-provider live mode requires ALT_PROVIDER_URL, ALT_PROVIDER_MODEL, and OPENAI_API_KEY containing that provider’s credential. The adapter uses the Chat Completions-compatible protocol. Verify your provider’s tools, schemas, SSE streaming and usage reporting individually. No external provider is installed or started by this lesson.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-038-alternative-providers"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
