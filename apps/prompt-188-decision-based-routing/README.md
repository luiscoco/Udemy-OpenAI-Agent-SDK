# Prompt 188 — Decision-based routing

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/advanced.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Use the Decisions API as an application-level classification step before selecting an SDK agent.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:188
```

Open http://localhost:3288. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- route
- refusal

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [advanced.mjs](../foundations-runtime/course/advanced.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 188
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
