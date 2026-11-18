# Prompt 148 — Run hooks

Implement supported run-lifecycle hooks and demonstrate the order in which they execute.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:148
```

Open http://localhost:3248. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- run hooks
- inspect

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 148
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
