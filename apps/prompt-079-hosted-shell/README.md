# Prompt 79 — Hosted shell

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/hosted-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Integrate supported hosted-shell execution, including container reuse, input files, and appropriate network configuration.

Classroom hosted-shell results are injected provider fixtures. Live mode uploads the CSV and creates owned hosted containers. Compare reuse with fresh containers. Network allowlists also require organization support.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:79
```

Open http://127.0.0.1:3179. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

Live mode uploads the synthetic CSV and owns each created hosted container. Containers receive an explicit disabled or allowlist network policy. Enabling the allowlist can require matching organization settings. The task itself reads local container data. Inspect resourceCleanup for deletion outcomes.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-079-hosted-shell"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-shell).
