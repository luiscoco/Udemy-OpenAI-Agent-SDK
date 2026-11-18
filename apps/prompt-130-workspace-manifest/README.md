# Prompt 130 — Workspace manifest

Define a manifest containing input files, directories, environment configuration, and an output location.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:130
```

Open http://localhost:3230. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- full manifest
- minimal manifest

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 130
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
