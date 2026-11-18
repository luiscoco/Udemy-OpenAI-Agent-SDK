# Prompt 142 — Sandbox compaction

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/sandboxes.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Configure compaction for a long sandbox task and verify that workspace references remain usable.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:142
```

Open http://localhost:3242. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- compact
- full

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 142
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
