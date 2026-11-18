# Prompt 77 — Code Interpreter

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/hosted-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Use Code Interpreter to analyze a CSV, validate calculations, and return generated charts or files.

Classroom Code Interpreter output is injected. The source CSV is independently parsed and checked, and the classroom summary file is created locally. The incorrect-total scenario deliberately fails acceptance. Live mode uses an owned hosted container.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:77
```

Open http://127.0.0.1:3177. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

The bundled CSV has attendances 30, 40 and 50. Expected total is 120 and mean is 40. The incorrect analysis scenario is classroom-only fault injection. Live mode creates an owned hosted container, validates the result and downloaded summary CSV, then attempts deletion of every owned container and uploaded file. Inspect resourceCleanup for each deletion outcome.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-077-code-interpreter"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-code-interpreter).
