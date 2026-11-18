# Prompt 101 — Deterministic routing

Route requests with application logic when rules are clear, and use model routing only where needed.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:101
```

Open http://localhost:3201. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- known rule
- model fallback

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 101
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
