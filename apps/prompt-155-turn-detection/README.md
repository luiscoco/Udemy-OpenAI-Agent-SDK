# Prompt 155 — Turn detection

Compare server VAD, semantic VAD, and manual turn control for supported realtime models.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:155
```

Open http://localhost:3255. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- server vad
- semantic vad
- manual commit

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 155
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
