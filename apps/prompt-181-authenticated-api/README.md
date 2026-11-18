# Prompt 181 — Authenticated API

Expose an authenticated backend endpoint with tenant isolation, request validation, and rate limits.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:181
```

Open http://localhost:3281. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- authorized
- unauthorized
- other tenant

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [reliability.mjs](../foundations-runtime/course/reliability.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 181
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
