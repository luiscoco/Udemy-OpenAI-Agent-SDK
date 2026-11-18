# Prompt 154 — Server voice connection

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/realtime.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Run a realtime agent through a supported server WebSocket integration and explain its audio-handling responsibilities.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:154
```

Open http://localhost:3254. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- websocket
- disconnect

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 154
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
