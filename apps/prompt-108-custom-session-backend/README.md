# Prompt 108 — Custom session backend

Implement the SDK session interface using my application’s database and test concurrent access.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:108
```

Open http://localhost:3208. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- concurrent appends
- tenant isolation

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 108
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
