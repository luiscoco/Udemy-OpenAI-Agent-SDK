# Prompt 156 — Interruptions

Implement user interruption handling so audio playback and conversation history remain consistent.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:156
```

Open http://localhost:3256. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- interrupt
- complete

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 156
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
