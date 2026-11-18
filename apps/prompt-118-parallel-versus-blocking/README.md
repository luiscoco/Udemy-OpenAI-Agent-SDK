# Prompt 118 — Parallel versus blocking

Compare parallel and blocking input guardrails, showing when speculative work can begin.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:118
```

Open http://localhost:3218. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- parallel blocked
- blocking blocked

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [guardrails.mjs](../foundations-runtime/course/guardrails.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 118
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
