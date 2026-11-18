# Prompt 94 — History filtering

Filter the conversation passed to a specialist while preserving the information needed to complete its task.

Compare the specialist’s actual input. The focused inputFilter removes unrelated messages and tool-history pairs while retaining INV-42 and EUR 18. All history and markers are synthetic fixtures.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:94
```

Open http://127.0.0.1:3194. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

The focused history filter uses the public removeAllTools helper from @openai/agents-core/extensions and retains the invoice request. Each run supplies explicit client-managed history.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-094-history-filtering"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/orchestration).
