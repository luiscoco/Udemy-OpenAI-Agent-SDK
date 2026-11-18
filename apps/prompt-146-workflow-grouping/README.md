# Prompt 146 — Workflow grouping

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/tracing.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Group several related agent runs into one trace with useful workflow and conversation metadata.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:146
```

Open http://localhost:3246. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- grouped
- inspect

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 146
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
