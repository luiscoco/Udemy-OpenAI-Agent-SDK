# Prompt 117 — Model-based guardrail

Implement a guardrail using a separate classifier agent and a structured decision.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:117
```

Open http://localhost:3217. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- accepted
- rejected

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [guardrails.mjs](../foundations-runtime/course/guardrails.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 117
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
