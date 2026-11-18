# Prompt 61 — Database tool

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/tools-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Create a read-only database tool using parameterized queries and authenticated tenant context.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:61
```

Open http://127.0.0.1:3161.

Bind SQL parameters and derive tenant identity from server-owned context. The tool accepts only a record ID.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

Copy .env.example to .env in this app folder and configure OPENAI_API_KEY and an accessible OPENAI_MODEL for actual model inference. Live runs execute the same local tools and can incur provider charges. Account-backed inference has not been verified with paid credentials.

The database is real embedded SQLite inside the Node process. It is initialized in memory for each exercise and uses PRAGMA query_only=ON after seeding. Queries bind the application tenant ID and model-supplied record ID. The identity selector simulates authenticated server context. Production identity should come from the authentication layer. Each connection closes in finally. Node may print its built-in SQLite experimental warning.

Record from this app folder.

```powershell
cd ".\apps\prompt-061-database-tool"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
