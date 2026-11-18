# Prompt 009 — Agent identity

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/identity-lesson.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

> Create a specialist agent with a clear name, responsibility, boundaries, and expected response style.

A runnable teaching application for defining and testing a specialist tutor. It uses the shared application runtime alongside prompts 2–8.

## Start in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from the apps folder.

```powershell
cd ".\apps"
npm ci
npm run lesson:9
```

Open **http://127.0.0.1:3109**. Press Ctrl+C to stop. You can also start from this application's own folder.

```powershell
cd ".\apps\prompt-009-agent-identity"
npm start
```

## Teach the lesson

1. Start with **Ada, SQL tutor** and inspect the responsibility and boundary instructions.
2. Run **Relevant question** to demonstrate a short SQL GROUP BY explanation.
3. Rename the tutor. Inspect the generated instructions and observe that changing the name preserves its configured responsibility.
4. Run **Unrelated request** to discuss redirection, then **Missing information** to discuss clarification.
5. Compare **Concise explanation** with **Guided lesson**.
6. Switch to **Python tutor** and compare the responsibility, boundary, and example request.
7. Answer the knowledge check and inspect the executable source files.

**Next step** replays one stage of a completed operation. **Run exercise** plays the stages automatically. **Recording view** gives the exercise and source more space. **Lesson guide** includes the exact prompt and teaching steps.

Classroom mode constructs the real identity object and instructions locally. Its answers are labeled scripted teaching fixtures. Those fixtures illustrate intended behavior. Live API mode lets you inspect an actual model's response against the instructions. Boundary instructions guide the model. Application code enforces resource permissions. This agent has no database, filesystem, or code-execution tools.

## Live SDK execution

From this application's folder, copy `.env.example` to `.env`, edit the credential and model, then restart.

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

Set `OPENAI_API_KEY` and an `OPENAI_MODEL` available to your project. Select **Live API** and use the scenario question or enter your own question. Live requests use your API account and can incur charges. Credentials stay on the server. Responses can vary, so compare them with the generated instructions and evidence. This is a TypeScript SDK example implemented in JavaScript ES modules.

## Record a lesson

From this application's folder run the following command.

```powershell
npm run record
```

Playwright records the relevant, unrelated, and missing-information scenarios at 1920×1080. It saves the WebM and final-frame PNG in `recordings`, then closes its temporary server and browser. On Windows the script uses installed Chrome or Edge. If neither is installed, run `npx playwright install chromium` from the apps folder.

## Source

- `../foundations-runtime/public/identity.js` defines the supported specialists, response styles, scenarios, validation, and instruction construction. Both the browser preview and server use it.
- `../foundations-runtime/examples/identity/specialist-agent.mjs` creates the actual SDK Agent with name, instructions, model, and an empty tool list.
- `../foundations-runtime/examples/identity/run-specialist.mjs` configures the client and runner, forwards cancellation, and checks the completed response.
- `../foundations-runtime/identity-lesson.mjs` supplies classroom fixtures and formats live or classroom evidence.

## Verify

From the apps folder run `npm test` and `npm run test:e2e`. Focused checks cover every identity/style/scenario combination, input validation, the installed SDK's actual Agent construction, credential and model configuration, cancellation, empty or paused results, live request failures, UI changes, source inspection, and mobile layout. Adapter tests use doubles. Live account execution needs credentials and model access.

[Official OpenAI agent definitions guide](https://developers.openai.com/api/docs/guides/agents/define-agents)
