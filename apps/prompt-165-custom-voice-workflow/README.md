# Prompt 165 — Custom voice workflow

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/voice.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Create a custom voice workflow around several agents while retaining access to intermediate text.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run setup:python
npm run lesson:165
```

Open http://localhost:3265. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- support
- billing

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [voice.mjs](../foundations-runtime/course/voice.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 165
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
