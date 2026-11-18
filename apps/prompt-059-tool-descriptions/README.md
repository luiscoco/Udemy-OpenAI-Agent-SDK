# Prompt 59 — Tool descriptions

Improve tool names, descriptions, and parameter documentation so the agent selects the correct capability.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:59
```

Open http://127.0.0.1:3159.

Tool metadata communicates the capability and when it should be selected. Actual model choices can vary.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

Copy .env.example to .env in this app folder and configure OPENAI_API_KEY and an accessible OPENAI_MODEL for actual model inference. Live runs execute the same local tools and can incur provider charges. Account-backed inference has not been verified with paid credentials.

The classroom model uses a deterministic metadata-based selection to illustrate an ambiguous tool definition. The named read and create capabilities operate on local fixtures. Live API demonstrates actual model selection, whose results can vary.

Record from this app folder.

```powershell
cd ".\apps\prompt-059-tool-descriptions"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
