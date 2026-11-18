# Prompt 016 — Configuration reference

> Explain the public agent configuration options available in my installed SDK, with a small example for each category.

Inspect public Agent fields, construct examples, and distinguish run-level settings.

## Run in Windows Terminal

Requires Node.js 24+. Install shared dependencies once in the apps folder.

```powershell
cd ".\apps"
npm ci
npm run lesson:16
```

Open **http://127.0.0.1:3116**. You can also run `npm start` from this application's folder. Press Ctrl+C to stop.

## Teach and record

Select the inputs, inspect the generated instructions, and use **Next step** or **Run exercise**. Open the source tabs and execution evidence. Lesson guide includes the exact prompt, teaching steps, and setup notes. Manual stepping replays the completed local operation.

From this application's folder run `npm run record`. The script records a repeatable 1920×1080 walkthrough using local classroom fixtures and saves a WebM plus final-frame PNG in `recordings`. It closes its temporary browser and server. Installed Chrome or Edge is used on Windows. Otherwise run `npx playwright install chromium` from the apps folder.

## Execution

Classroom mode uses actual installed SDK Agent construction and labeled scripted model output. It requires installed dependencies. Configuration reference reads the public AgentConfiguration declaration from the installed SDK. Each category constructs its local example. No model request is performed. The displayed excerpt comes from the executable example source. Tools, handoffs, and guardrails are configured for inspection. Model runs execute those runtime features.

SDK public option categories include identity, model settings, capabilities, routing, validation, stored prompts, context callbacks, and tool behavior. Run-level options are displayed separately. The covered option list is compared with the installed declaration file.

## Verify

From the apps folder run `npm test` and `npm run test:e2e`. Checks cover the shared-runtime lessons, distinct input combinations, actual SDK construction, live adapter request contracts, failures, cancellation, and browser controls. Live account execution needs configured credentials and access.

[OpenAI agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents)
