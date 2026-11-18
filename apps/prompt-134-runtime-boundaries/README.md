# Prompt 134 — Runtime boundaries

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/sandboxes.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Configure sandbox network access and credentials while keeping application control-plane secrets outside the workspace.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:134
```

Open http://localhost:3234. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- allowed
- denied

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 134
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
