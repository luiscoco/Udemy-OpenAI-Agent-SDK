# Prompt 138 — Filesystem capability

Use sandbox filesystem capabilities to apply a patch and inspect an image generated during the task.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:138
```

Open http://localhost:3238. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- patch
- image

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 138
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
