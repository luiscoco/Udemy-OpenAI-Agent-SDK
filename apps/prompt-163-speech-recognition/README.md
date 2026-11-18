# Prompt 163 — Speech recognition

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/voice.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Configure transcription language and relevant recognition settings, then evaluate errors on representative recordings.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run setup:python
npm run lesson:163
```

Open http://localhost:3263. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- english
- spanish

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [voice.mjs](../foundations-runtime/course/voice.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 163
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
