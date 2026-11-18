# Prompt 76 — Custom RAG

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/hosted-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Implement a custom retrieval tool backed by my chosen database, including authorization and an insufficient-evidence response.

This lesson chooses embedded SQLite for its teaching collection. Profiles simulate authenticated context. Bound tenant parameters enforce access before retrieved snippets reach the model. Unknown topics produce insufficient evidence.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:76
```

Open http://127.0.0.1:3176. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

The teaching database is embedded SQLite, created and seeded in memory for each exercise. It has query_only enabled. The identity selector simulates authenticated server context. Query parameters bind that tenant before any snippets reach the model.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-076-custom-rag"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools).
