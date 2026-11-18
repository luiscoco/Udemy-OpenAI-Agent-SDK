# Prompt 69 — Concurrency

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/control-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare model-side parallel tool calls with application-side execution concurrency and enforce an appropriate concurrency limit.

Classroom call batches are scripted. Tool delays execute locally. Compare measured peak concurrency with the independent executor limit.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:69
```

Open http://127.0.0.1:3169. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-069-concurrency"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools).
