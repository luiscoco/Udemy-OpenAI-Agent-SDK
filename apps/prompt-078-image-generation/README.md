# Prompt 78 — Image generation

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/hosted-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Add the image-generation tool and correctly extract, store, and display generated image results.

Classroom mode returns the bundled PNG as a provider fixture. Live mode uses the hosted image-generation tool. The application verifies the result format, stores it and displays the saved image.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:78
```

Open http://127.0.0.1:3178. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-078-image-generation"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-image-generation).
