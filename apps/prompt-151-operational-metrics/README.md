# Prompt 151 — Operational metrics

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/tracing.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Report latency, token usage, tool failures, handoff frequency, and estimated cost using observable run data.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:151
```

Open http://localhost:3251. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- metrics
- estimate

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 151
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
