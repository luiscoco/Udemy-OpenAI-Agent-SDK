# Prompt 161 — Python voice pipeline

Create a Python VoicePipeline that connects speech recognition, an existing agent, and speech generation.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run setup:python
npm run lesson:161
```

Open http://localhost:3261. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- complete
- failure

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [voice.mjs](../foundations-runtime/course/voice.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 161
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
