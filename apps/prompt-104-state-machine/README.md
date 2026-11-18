# Prompt 104 — State machine

Implement an agent workflow as explicit application states with validated transitions and recoverable failure states.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:104
```

Open http://localhost:3204. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- complete
- recover

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [workflows.mjs](../foundations-runtime/course/workflows.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 104
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
