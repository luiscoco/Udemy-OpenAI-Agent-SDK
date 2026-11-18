# Prompt 200 — Production capstone

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/projects.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Take one completed project through evaluation, deployment, monitoring, failure recovery, and a documented capability-and-limitations review.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:200
```

Open http://localhost:3300. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- healthy
- recover
- regression

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [projects.mjs](../foundations-runtime/course/projects.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 200
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
