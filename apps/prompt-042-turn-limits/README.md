# Prompt 42 — Turn limits

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/runtime-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Set a maximum run-turn limit and demonstrate what counts as a turn.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:42
```

Open http://127.0.0.1:3142. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

A model invocation consumes a turn. Its tool execution happens within that turn before the next model invocation.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

This lesson uses controlled local execution and requires no API key.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-042-turn-limits"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
