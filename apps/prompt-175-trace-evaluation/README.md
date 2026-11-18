# Prompt 175 — Trace evaluation

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/evaluation.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Evaluate whether the workflow chose appropriate tools, made correct handoffs, and respected its instructions.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:175
```

Open http://localhost:3275. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- passing trace
- failing trace

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [evaluation.mjs](../foundations-runtime/course/evaluation.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 175
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
