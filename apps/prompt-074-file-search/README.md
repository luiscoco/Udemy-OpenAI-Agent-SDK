# Prompt 74 — File search

Connect a document collection through a vector store and answer questions using the hosted file-search tool.

Classroom retrieval is a provider fixture. For live retrieval, run setup:documents from this app folder, put its vector-store ID in the app .env, then restart. Uploaded documents live in an OpenAI-hosted vector store.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:74
```

Open http://127.0.0.1:3174. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Hosted document setup

The bundled workshop-handbook.txt contains synthetic teaching data. The setup command creates an OpenAI-hosted vector store, uploads that file and waits for indexing. It saves owned resource IDs in .runtime/documents.json and prints the VECTOR_STORE_ID setting. Put that setting in this app folder’s .env and restart.

```powershell
cd ".\apps\prompt-074-file-search"
Copy-Item .env.example .env
notepad .env
npm run setup:documents
# Add the printed VECTOR_STORE_ID to .env, then start the app.
npm start
```

Run `npm run setup:documents -- --cleanup` to delete the vector store and uploaded file tracked in this app’s manifest. The command reuses an existing completed setup.

## Record the lesson

```powershell
cd ".\apps\prompt-074-file-search"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-file-search).
