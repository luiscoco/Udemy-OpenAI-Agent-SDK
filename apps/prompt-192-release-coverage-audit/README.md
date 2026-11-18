# Prompt 192 — Release coverage audit

Compare my installed SDK against its current official documentation and release notes, then add exercises for uncovered public capabilities.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:192
```

Open http://localhost:3292. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- audit
- compatibility

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [advanced.mjs](../foundations-runtime/course/advanced.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 192
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
