# Prompt 128 — Safe resumption

Revalidate authorization before resumed actions and prevent duplicate side effects with application-level idempotency.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:128
```

Open http://localhost:3228. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- valid on resume
- revoked
- duplicate resume

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [approvals.mjs](../foundations-runtime/course/approvals.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 128
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
