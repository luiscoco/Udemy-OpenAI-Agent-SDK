# Prompt 177 — Retry policy

Configure SDK and application retries together, avoiding duplicated retry layers and repeated external side effects.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:177
```

Open http://localhost:3277. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- recover
- permanent failure

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [reliability.mjs](../foundations-runtime/course/reliability.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 177
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
