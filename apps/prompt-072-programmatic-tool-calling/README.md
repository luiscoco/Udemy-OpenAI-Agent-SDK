# Prompt 72 — Programmatic tool calling

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/discovery-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Enable supported programmatic tool calling, restrict eligible tools, and aggregate several read-only results in generated JavaScript.

Live mode uses hosted generated JavaScript. Classroom mode injects a fixed program and child calls, then executes a fixed aggregation expression over actual callback rows. Only the read tool permits programmatic callers.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:72
```

Open http://127.0.0.1:3172. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-072-programmatic-tool-calling"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).
