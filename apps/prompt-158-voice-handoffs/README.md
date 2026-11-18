# Prompt 158 — Voice handoffs

Transfer a spoken conversation between specialists while preserving relevant context.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:158
```

Open http://localhost:3258. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- handoff
- stay

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 158
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
