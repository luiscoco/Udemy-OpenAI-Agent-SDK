# Prompt 197 — Data-analysis assistant

Build an assistant that analyzes uploaded datasets, validates calculations, creates charts, and returns downloadable artifacts.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:197
```

Open http://localhost:3297. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- analyze
- invalid data

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [projects.mjs](../foundations-runtime/course/projects.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 197
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
