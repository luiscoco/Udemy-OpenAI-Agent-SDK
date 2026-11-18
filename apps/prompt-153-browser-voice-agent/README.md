# Prompt 153 — Browser voice agent

Build a TypeScript realtime voice agent using WebRTC and an ephemeral credential issued by my backend.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:153
```

Open http://localhost:3253. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- connect
- permission denied

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [realtime.mjs](../foundations-runtime/course/realtime.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 153
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
