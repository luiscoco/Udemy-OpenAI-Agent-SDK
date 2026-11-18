# Prompt 136 — State and snapshots

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/sandboxes.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare live sandbox reuse, serialized sandbox state, filesystem snapshots, and the agent’s resumable RunState.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:136
```

Open http://localhost:3236. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- reuse
- snapshot
- run state

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 136
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
