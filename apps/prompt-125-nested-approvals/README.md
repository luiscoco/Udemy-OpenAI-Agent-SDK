# Prompt 125 — Nested approvals

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/approvals.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Demonstrate an approval interruption inside a specialist tool-agent and after a handoff.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:125
```

Open http://localhost:3225. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- nested tool
- handoff

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [approvals.mjs](../foundations-runtime/course/approvals.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 125
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
