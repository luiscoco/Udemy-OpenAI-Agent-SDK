# Prompt 92 — Handoff metadata

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/handoff-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Pass validated structured metadata during a handoff using the selected SDK’s supported API.

A Zod schema validates reason, priority and invoiceId before onHandoff runs. The invalid classroom call is rejected before callback side effects or specialist execution.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:92
```

Open http://127.0.0.1:3192. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

The invalid-metadata option is classroom-only fault injection. Validated model metadata is stored locally, then explicitly included in the specialist instructions. It adds information to the fixed handoff destination.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-092-handoff-metadata"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/orchestration).
