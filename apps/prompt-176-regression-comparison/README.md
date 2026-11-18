# Prompt 176 — Regression comparison

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/evaluation.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare prompt or model versions on task success, latency, cost, and failure rate before adopting a change.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:176
```

Open http://localhost:3276. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- v1
- v2

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [evaluation.mjs](../foundations-runtime/course/evaluation.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 176
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
