# Prompt 160 — Voice controls

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/realtime.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Add supported realtime guardrails and approval handling, explaining limitations once audio has already played.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:160
```

Open http://localhost:3260. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- approve
- reject
- guardrail blocked

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 160
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
