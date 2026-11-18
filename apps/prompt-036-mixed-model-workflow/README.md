# Prompt 36 — Mixed-model workflow

Use a smaller model for routing and a more capable model for difficult tasks, then measure the tradeoff.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:36
```

Open http://127.0.0.1:3136. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

The router adds work. Compare the selected model, actual calls, token reports, latency, and task acceptance.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

Copy this app’s .env.example to .env and configure the required account credentials for live mode. Live calls can incur provider charges. Account-backed inference has not been tested with paid credentials.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-036-mixed-model-workflow"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
