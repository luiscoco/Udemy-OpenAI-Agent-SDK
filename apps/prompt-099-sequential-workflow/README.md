# Prompt 99 — Sequential workflow

Build a research, drafting, and review sequence with explicit data contracts between stages.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:99
```

Open http://localhost:3199. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- valid contracts
- reject invalid

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 99
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
