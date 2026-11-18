# Prompt 58 — Argument schemas

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/tools-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Define a tool with constrained arguments and demonstrate how invalid arguments are handled.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:58
```

Open http://127.0.0.1:3158.

Constrained enums, bounded integers and documented formats validate model-supplied arguments before application work.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

Copy .env.example to .env in this app folder and configure OPENAI_API_KEY and an accessible OPENAI_MODEL for actual model inference. Live runs execute the same local tools and can incur provider charges. Account-backed inference has not been verified with paid credentials.

Record from this app folder.

```powershell
cd ".\apps\prompt-058-argument-schemas"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
