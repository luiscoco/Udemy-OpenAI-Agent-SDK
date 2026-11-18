# Prompt 162 — Streaming audio input

Process supported streaming audio input and stream the resulting speech back to the application.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run setup:python
npm run lesson:162
```

Open http://localhost:3262. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- chunks
- complete

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [voice.mjs](../foundations-runtime/course/voice.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 162
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
