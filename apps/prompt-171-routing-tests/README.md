# Prompt 171 — Routing tests

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/evaluation.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Test that representative requests reach the correct specialist and preserve the expected conversation ownership.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:171
```

Open http://localhost:3271. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- billing
- technical

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [evaluation.mjs](../foundations-runtime/course/evaluation.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 171
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
