# Prompt 129 — First sandbox agent

Create a minimal SandboxAgent that reads an input file and writes a result into its workspace.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:129
```

Open http://localhost:3229. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- input output
- read only

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 129
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
