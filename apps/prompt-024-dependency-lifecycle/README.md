# Prompt 024 — Dependency lifecycle

> Manage application-client initialization and cleanup around agent runs, including cancellation and failure.

Inspect initialization, successful execution, failure, cancellation, and finally cleanup.

## Run in Windows Terminal

Requires Node.js 24+. Install shared dependencies once.

```powershell
cd ".\apps"
npm ci
npm run lesson:24
```

Open **http://127.0.0.1:3124**. You can also run `npm start` in this application's folder. Press Ctrl+C to stop.

## Teach the exercise

Choose the scenario, inspect the context preview, then use Next step or Run exercise. Open the evidence to inspect actual SDK behavior, safe logs, and local fixture results. Lesson guide includes the exact prompt and instructor notes. Manual stepping replays a completed operation.

Classroom mode requires installed dependencies and works without API credentials. It uses an actual SDK runner with a deterministic local Model adapter for reproducible decisions and wording. Tools, tenant-scoped lookups, handoffs, nested runs, and lifecycle operations actually execute. Prompt 17 performs TypeScript SDK construction and runtime Zod validation without running a model. All application database and API adapters use in-memory teaching fixtures. Classroom profile selection simulates authenticated application context. Production code should obtain that identity from its authentication layer.

This lesson uses local validation or controlled SDK execution. Its scenarios support inspection without model API requests.

The owned-client helper initializes local adapters, awaits the operation, and closes owned clients in reverse order in finally. Controlled scenarios include operation failure, cancellation during a tool, and partial initialization failure. The API adapter actually aborts the exercise's signal in the cancellation case. The trace records cleanup after each outcome.

## Record

Run `npm run record` from this application's folder. The script records a 1920×1080 WebM and saves a final-frame PNG in `recordings`. It closes its temporary server and browser. On Windows it uses installed Chrome or Edge. Otherwise install Chromium with `npx playwright install chromium` from the apps folder.

## Verify

Run `npm test` and `npm run test:e2e` from the apps folder. Checks exercise the actual SDK with a local scripted model, tenant authorization, context visibility, nested context behavior, safe metadata, cleanup, browser controls, and mobile layouts. Live adapter tests use local doubles. Account-backed execution requires credentials and model access.

[OpenAI local and model context guide](https://developers.openai.com/api/docs/guides/agents/define-agents#keep-local-context-separate-from-model-context)
