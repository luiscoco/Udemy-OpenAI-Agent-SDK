# Prompt 43 — Run configuration

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/runtime-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Apply workflow-level configuration to several agents and explain which agent settings it overrides.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:43
```

Open http://127.0.0.1:3143. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

The installed resolver preserves explicit agent model and settings. Workflow settings fill omitted fields.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

This lesson uses controlled local execution and requires no API key.

The installed SDK 0.21.0 resolver preserves explicit agent models ahead of the workflow model default, while workflow settings fill omitted agent fields. This observed implementation differs from the broad model override wording in its RunConfig declaration. The lesson captures the actual adapter requests.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-043-run-configuration"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
