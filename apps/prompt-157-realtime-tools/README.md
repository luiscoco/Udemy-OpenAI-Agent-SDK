# Prompt 157 — Realtime tools

Add a private order-lookup tool to a voice agent while keeping execution and credentials on the backend.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:157
```

Open http://localhost:3257. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- authorized
- forbidden

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 157
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
