# Prompt 110 — Context compaction

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/sessions.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Add supported compaction or context management and verify that important task state survives.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:110
```

Open http://localhost:3210. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- compact context
- full context

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 110
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
