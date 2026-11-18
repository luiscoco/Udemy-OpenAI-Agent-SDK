# Prompt 184 — Durable execution

Integrate a suitable durable workflow engine and demonstrate recovery after a worker crashes during an agent task.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:184
```

Open http://localhost:3284. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- recover crash
- duplicate delivery

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [reliability.mjs](../foundations-runtime/course/reliability.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 184
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
