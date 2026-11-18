# Prompt 012 — Dynamic instructions

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/definition-lessons.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

> Generate agent instructions dynamically from the current user, language, and application context.

Resolve an actual SDK callback using a sample user, language, and application context.

## Run in Windows Terminal

Requires Node.js 24+. Install shared dependencies once in the apps folder.

```powershell
cd ".\apps"
npm ci
npm run lesson:12
```

Open **http://127.0.0.1:3112**. You can also run `npm start` from this application's folder. Press Ctrl+C to stop.

## Teach and record

Select the inputs, inspect the generated instructions, and use **Next step** or **Run exercise**. Open the source tabs and execution evidence. Lesson guide includes the exact prompt, teaching steps, and setup notes. Manual stepping replays the completed local operation.

From this application's folder run `npm run record`. The script records a repeatable 1920×1080 walkthrough using local classroom fixtures and saves a WebM plus final-frame PNG in `recordings`. It closes its temporary browser and server. Installed Chrome or Edge is used on Windows. Otherwise run `npx playwright install chromium` from the apps folder.

## Execution

Classroom mode uses actual installed SDK Agent construction and labeled scripted model output. It requires installed dependencies. Live API executes the actual SDK using your configured account. Copy .env.example to .env, set OPENAI_API_KEY and an accessible OPENAI_MODEL, and restart. Requests can incur API charges. Credentials stay on the server.

Dynamic instructions execute through agent.getSystemPrompt with an actual SDK RunContext in classroom mode. Live mode passes the same context into runner.run. The callback explicitly exposes displayName, language, and application. userId stays in local context.

## Verify

From the apps folder run `npm test` and `npm run test:e2e`. Checks cover the shared-runtime lessons, distinct input combinations, actual SDK construction, live adapter request contracts, failures, cancellation, and browser controls. Live account execution needs configured credentials and access.

[OpenAI agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents)
