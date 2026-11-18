# Prompt 90 — Ownership comparison

Implement the same task using a handoff and an agent-as-tool, then compare who produces the final answer.

Both paths handle the same duplicate invoice request. A handoff ends with the specialist. agent.asTool returns a nested result so the manager can answer. Model output is scripted in classroom mode.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:90
```

Open http://127.0.0.1:3190. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-090-ownership-comparison"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/orchestration).
