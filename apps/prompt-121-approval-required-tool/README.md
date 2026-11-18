# Prompt 121 — Approval-required tool

Create a tool that pauses for approval before making a change to an external system.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:121
```

Open http://localhost:3221. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- approve
- pause

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [approvals.mjs](../foundations-runtime/course/approvals.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 121
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
