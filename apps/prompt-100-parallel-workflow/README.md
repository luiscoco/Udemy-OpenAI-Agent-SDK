# Prompt 100 — Parallel workflow

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/workflows.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Run independent specialists concurrently, collect their results, and handle partial failures.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:100
```

Open http://localhost:3200. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- all success
- partial failure

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 100
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
