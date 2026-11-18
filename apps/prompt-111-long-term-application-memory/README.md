# Prompt 111 — Long-term application memory

Build an explicit memory store for user-approved facts, with retrieval, correction, deletion, and tenant isolation.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:111
```

Open http://localhost:3211. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- approved fact
- correct fact
- delete fact
- unapproved

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sessions.mjs](../foundations-runtime/course/sessions.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 111
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
