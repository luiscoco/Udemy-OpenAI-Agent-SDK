# Prompt 164 — Speech generation

Configure supported voice and speech-output settings and measure time to first audio.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run setup:python
npm run lesson:164
```

Open http://localhost:3264. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- normal
- fast

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [voice.mjs](../foundations-runtime/course/voice.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 164
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
