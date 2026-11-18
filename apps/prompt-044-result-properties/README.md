# Prompt 44 — Result properties

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/runtime-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Inspect final output, the last active agent, response identifiers, and continuation information.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:44
```

Open http://127.0.0.1:3144. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

A paused result provides interruption and state information. Inspect completion and permission before using output.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

This lesson uses controlled local execution and requires no API key.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-044-result-properties"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
