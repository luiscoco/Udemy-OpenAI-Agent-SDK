# Prompt 133 — Storage mounts

Mount supported external storage with narrowly scoped access and verify where output files are persisted.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:133
```

Open http://localhost:3233. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- same tenant
- other tenant

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 133
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
