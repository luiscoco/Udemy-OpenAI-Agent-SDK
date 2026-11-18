# Prompt 187 — Provider adapters

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/course/advanced.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Evaluate documented LiteLLM, Any-LLM, or equivalent adapters for my language, recording unsupported features and configuration differences.

## Run in Windows Terminal

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:187
```

Open http://localhost:3287. Select a scenario, run the exercise, and expand its evidence.

## Compare scenarios

- compatible
- unsupported

The classroom model responses are scripted. The exercise executes the SDK and application mechanisms in [advanced.mjs](../foundations-runtime/course/advanced.mjs). Provider configuration and unavailable capabilities are identified in the evidence.

## Capture a teaching video

```powershell
npm run record -- 187
```

The recorder saves a WebM walkthrough and final-frame.png in this application's recordings folder. It uses locally installed Chrome or Edge.

For live-client setup, storage boundaries and deployment details see [the course integration guide](../foundations-runtime/course/README.md).
