# Prompt 49 — Text streaming

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/streaming-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Stream an agent’s text response incrementally to the terminal.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:49
```

Open http://127.0.0.1:3149.

toTextStream yields incremental text. Await completion before consuming final output and usage.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Streaming lessons use a live HTTP event stream to display actual SDK progress while execution is active. The four-stage teaching timeline replays the observed operation after it settles. Stop aborts the browser request and propagates cancellation to the server.

Run incremental terminal output with the same SDK streaming implementation.

```powershell
npm run terminal:49
```

Press Ctrl+C to cancel. The terminal command awaits SDK and model cleanup before exiting.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-049-text-streaming"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
