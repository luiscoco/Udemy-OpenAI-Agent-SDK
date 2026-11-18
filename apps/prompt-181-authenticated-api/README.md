# Prompt 181 — Authenticated API

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/reliability.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

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
