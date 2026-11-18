# Prompt 198 — Coding assistant

Build a sandbox coding assistant that inspects a repository, applies changes, runs relevant checks, and presents the resulting diff.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:198
```

Open http://localhost:3298. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- fix
- failing tests

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [projects.mjs](../foundations-runtime/course/projects.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 198
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
