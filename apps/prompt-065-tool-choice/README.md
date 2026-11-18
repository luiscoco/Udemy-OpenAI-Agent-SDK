# Prompt 65 — Tool choice

Demonstrate automatic tool selection, required tool use, and forcing a specific tool where supported.

Classroom model decisions are scripted. The actual SDK receives auto, required or a specific tool name. Inspect observed callbacks and tool-choice reset.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:65
```

Open http://127.0.0.1:3165. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-065-tool-choice"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools).
