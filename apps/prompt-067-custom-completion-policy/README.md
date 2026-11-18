# Prompt 67 — Custom completion policy

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/control-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Implement a supported custom policy that decides whether tool results should end the run or return to the model.

The completion callback examines the actual structured report. Complete reports finish immediately. Incomplete reports return to the model.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:67
```

Open http://127.0.0.1:3167. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-067-custom-completion-policy"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools).
