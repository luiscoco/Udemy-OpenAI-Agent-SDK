# Prompt 196 — Business-workflow assistant

Build a workflow assistant that prepares proposed record changes, obtains approval, executes them once, and records an audit trail.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:196
```

Open http://localhost:3296. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- approve
- reject
- duplicate

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [projects.mjs](../foundations-runtime/course/projects.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 196
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
