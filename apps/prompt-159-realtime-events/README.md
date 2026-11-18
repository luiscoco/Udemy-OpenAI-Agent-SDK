# Prompt 159 — Realtime events

Display transcripts, session status, tool progress, and conversation updates using documented realtime events.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:159
```

Open http://localhost:3259. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- events
- failure

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 159
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
