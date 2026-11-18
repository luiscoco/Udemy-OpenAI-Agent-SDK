# Prompt 70 — Repeated-call prevention

Demonstrate tool-choice reset behavior and prevent a forced tool from causing an endless execution loop.

A controlled model repeats the forced tool while that setting remains active. The reset scenario completes. The retained choice reaches a finite maxTurns budget.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:70
```

Open http://127.0.0.1:3170. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

The exercise runs locally without API credentials.

## Record the lesson

```powershell
cd ".\apps\prompt-070-repeated-call-prevention"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools).
