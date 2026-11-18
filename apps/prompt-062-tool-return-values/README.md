# Prompt 62 — Tool return values

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/tools-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Compare text and structured tool results and choose a useful format for downstream reasoning.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:62
```

Open http://127.0.0.1:3162.

The structured path validates its output before forwarding it. Inspect the actual model-visible representation.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

Copy .env.example to .env in this app folder and configure OPENAI_API_KEY and an accessible OPENAI_MODEL for actual model inference. Live runs execute the same local tools and can incur provider charges. Account-backed inference has not been verified with paid credentials.

The structured tool uses the SDK outputSchema option. This installed adapter forwards its JSON-compatible result as model-visible JSON text. The evidence shows the actual output representation so it can be compared with descriptive prose.

Record from this app folder.

```powershell
cd ".\apps\prompt-062-tool-return-values"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
