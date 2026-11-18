# Prompt 75 — Retrieval controls

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/hosted-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Apply supported file-search filters and result limits, and inspect retrieved evidence and citations.

Classroom search results are provider fixtures. Live mode requires a vector store whose files have department attributes. Compare the actual filter, result limit, returned evidence and citations.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:75
```

Open http://127.0.0.1:3175. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

Live retrieval needs VECTOR_STORE_ID for files with a department attribute set to robotics or astronomy. The department selector is a retrieval filter. Prompt 76 demonstrates application authorization. A Node setup example is included below.

```javascript
// Run in a local script with your configured OpenAI client.
await client.vectorStores.files.update(fileId, {
  vector_store_id: vectorStoreId,
  attributes: {department: "robotics"}
});
```

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-075-retrieval-controls"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-file-search).

## Create the live collection

The setup command uploads six synthetic text documents with department attributes and waits for indexing. It records owned resource IDs so repeated setup can resume. Vector stores are configured to expire after one inactive day.

```powershell
cd ".\apps\prompt-075-retrieval-controls"
Copy-Item .env.example .env
notepad .env
npm run setup:documents
# Add the printed VECTOR_STORE_ID to this app’s .env, then restart.
npm start
```

Run `npm run setup:documents -- --cleanup` to delete the resources recorded in this app’s .runtime/retrieval.json. If a terminated setup leaves its lock file, confirm the process has exited before removing .runtime/retrieval.lock.
