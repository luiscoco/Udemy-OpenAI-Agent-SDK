# Prompt 63 — Tool failures

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/tools-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Configure tool-error behavior so the agent receives useful failure information without exposing internal secrets.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:63
```

Open http://127.0.0.1:3163.

Use a configured error handler or an application exception boundary to keep internal diagnostics server-side.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

The exercise uses local SDK execution and requires no API credential.

The synthetic failing tool includes a fixture secret in its internal exception. Allowlisted error results and application diagnostics exclude that value. The propagated-error path catches SDK ToolCallError and exposes only a public code. The fixture secret is visible in the teaching source.

Record from this app folder.

```powershell
cd ".\apps\prompt-063-tool-failures"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
