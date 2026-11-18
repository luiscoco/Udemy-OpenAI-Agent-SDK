# Prompt 149 — Agent hooks

Attach agent-specific lifecycle hooks and compare their scope with workflow-level hooks.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:149
```

Open http://localhost:3249. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- agent hooks
- inspect

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 149
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
