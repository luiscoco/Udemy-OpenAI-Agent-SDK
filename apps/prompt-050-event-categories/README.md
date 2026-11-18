# Prompt 50 — Event categories

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/streaming-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare raw model events with higher-level SDK events and explain when to consume each.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:50
```

Open http://127.0.0.1:3150.

Raw events supply model data. Higher-level SDK events describe agents, tools, handoffs and run items.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Streaming lessons use a live HTTP event stream to display actual SDK progress while execution is active. The four-stage teaching timeline replays the observed operation after it settles. Stop aborts the browser request and propagates cancellation to the server.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-050-event-categories"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
