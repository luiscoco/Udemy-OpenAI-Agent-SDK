# Prompt 73 — Web search

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/discovery-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Add web search and return answers with usable source citations and supported search restrictions.

Classroom search and citations are provider fixtures. Live mode performs hosted web search. Returned URL annotations become clickable sources below the answer.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:73
```

Open http://127.0.0.1:3173. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-073-web-search"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-web-search).
