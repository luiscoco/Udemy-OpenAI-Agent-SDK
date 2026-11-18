# Prompt 150 — Trace controls

Configure trace export and sensitive-data handling using the selected SDK’s supported tracing controls.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:150
```

Open http://localhost:3250. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- redact
- include fixture

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 150
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
