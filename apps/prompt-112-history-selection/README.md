# Prompt 112 — History selection

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/sessions.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Limit or summarize conversation history while preserving valid tool-call relationships and necessary task context.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:112
```

Open http://localhost:3212. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- retain pairs
- remove pairs

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 112
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
