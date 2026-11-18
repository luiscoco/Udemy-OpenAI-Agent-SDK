# Prompt 48 — Manual continuation

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/streaming-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Build a two-turn conversation by carrying forward the SDK’s replay-ready history.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:48
```

Open http://127.0.0.1:3148.

The SDK history preserves earlier messages and model records for application-managed continuation.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-048-manual-continuation"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
