# Prompt 91 — Routing descriptions

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/handoff-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Write specialist descriptions that clearly distinguish when each handoff should occur.

Compare the actual handoff function names and descriptions. The vague classroom route is intentionally ambiguous. Live decisions depend on the selected model and should be inspected.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:91
```

Open http://127.0.0.1:3191. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

Classroom vague routing is a deliberately controlled ambiguity case. It illustrates inspectable metadata and ownership without establishing a model-accuracy benchmark.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-091-routing-descriptions"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/orchestration).
