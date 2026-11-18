# Prompt 152 — Workflow visualization

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/tracing.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Visualize the agent-and-handoff structure using a supported SDK utility or a graph generated from application configuration.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:152
```

Open http://localhost:3252. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- graph
- export

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [tracing.mjs](../foundations-runtime/course/tracing.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 152
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
