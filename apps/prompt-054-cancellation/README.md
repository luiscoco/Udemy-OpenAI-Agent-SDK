# Prompt 54 — Cancellation

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/streaming-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Cancel a running stream and clean up application resources using the SDK’s supported cancellation mechanism.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:54
```

Open http://127.0.0.1:3154.

Use an AbortController signal and await stream settlement and backend cleanup before closing resources.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Streaming lessons use a live HTTP event stream to display actual SDK progress while execution is active. The four-stage teaching timeline replays the observed operation after it settles. Stop aborts the browser request and propagates cancellation to the server.

Cancellation uses an AbortController signal. The model cooperates with that signal. The application awaits stream.completed and its owned model-generator promises before closing its resource. Completion, cancellation and failures have separate result checks.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-054-cancellation"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
