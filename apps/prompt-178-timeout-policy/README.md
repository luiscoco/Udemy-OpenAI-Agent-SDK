# Prompt 178 — Timeout policy

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/reliability.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Set model, tool, and overall request timeouts, and verify cleanup when each deadline expires.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:178
```

Open http://localhost:3278. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- complete
- deadline
- model deadline
- tool deadline

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [reliability.mjs](../foundations-runtime/course/reliability.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 178
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
