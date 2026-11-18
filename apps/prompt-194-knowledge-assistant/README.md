# Prompt 194 — Knowledge assistant

Build a document assistant with retrieval, source citations, access control, structured answers, and an insufficient-evidence response.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:194
```

Open http://localhost:3294. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- grounded
- no evidence
- forbidden

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [projects.mjs](../foundations-runtime/course/projects.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 194
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
