# Prompt 103 — Evaluator and optimizer

Build a bounded draft-review-revise loop with explicit success criteria and a maximum number of iterations.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:103
```

Open http://localhost:3203. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- converge
- iteration limit

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 103
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
