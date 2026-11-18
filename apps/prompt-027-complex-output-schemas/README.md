# Prompt 27 — Complex output schemas

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/structured-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Return nested objects, arrays, enums, and nullable fields using a schema supported by the selected model.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:27
```

Open http://127.0.0.1:3127. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

Nullable permits null. The field still needs to be present in this schema.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

Record this lesson

```powershell
cd ".\apps\prompt-027-complex-output-schemas"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
