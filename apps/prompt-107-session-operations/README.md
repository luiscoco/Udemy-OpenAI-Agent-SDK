# Prompt 107 — Session operations

Demonstrate supported session operations for retrieving, adding, correcting, and clearing conversation items.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:107
```

Open http://localhost:3207. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- correct
- clear

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 107
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
