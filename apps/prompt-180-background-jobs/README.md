# Prompt 180 — Background jobs

Run agent work in a queue worker with job identifiers, cancellation, and idempotent result handling.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:180
```

Open http://localhost:3280. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- complete job
- retry job

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [reliability.mjs](../foundations-runtime/course/reliability.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 180
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
