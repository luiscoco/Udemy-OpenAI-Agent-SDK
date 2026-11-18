# Prompt 137 — Shell capability

Enable sandbox shell execution and demonstrate command output, failure handling, and supported interactive processes.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:137
```

Open http://localhost:3237. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- success
- failure
- interactive capability

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [sandboxes.mjs](../foundations-runtime/course/sandboxes.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 137
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
