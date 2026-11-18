# Prompt 105 — SDK session

Implement a multi-turn conversation using a session backend supported by my selected SDK.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:105
```

Open http://localhost:3205. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- same session
- new session

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 105
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
