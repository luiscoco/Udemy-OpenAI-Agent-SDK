# Prompt 106 — Persistent storage

Persist conversation history across process restarts using an appropriate documented session backend.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:106
```

Open http://localhost:3206. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- restart persistent
- new memory

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 106
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
