# Prompt 28 — Business validation

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/structured-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Validate business rules after schema validation, including inconsistent dates, impossible quantities, and missing supporting evidence.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:28
```

Open http://127.0.0.1:3128. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

A structurally valid string can still contain an impossible date or an unverified evidence ID.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

Record this lesson

```powershell
cd ".\apps\prompt-028-business-validation"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
