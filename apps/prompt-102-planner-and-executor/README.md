# Prompt 102 — Planner and executor

Build a planner that produces a structured task list and an executor that reports completion evidence.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:102
```

Open http://localhost:3202. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- execute plan
- reject plan

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 102
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
