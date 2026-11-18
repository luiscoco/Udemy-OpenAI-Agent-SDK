# Prompt 116 — Tool-output guardrail

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/guardrails.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Check a function tool’s output before the agent uses it in subsequent reasoning.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:116
```

Open http://localhost:3216. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- accepted
- rejected

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [guardrails.mjs](../foundations-runtime/course/guardrails.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 116
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
