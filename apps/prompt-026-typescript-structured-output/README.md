# Prompt 26 — TypeScript structured output

Create a TypeScript agent that returns a validated object defined with Zod.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:26
```

Open http://127.0.0.1:3126. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

z.number() requires a number. This lesson does not enable coercion.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

Record this lesson

```powershell
cd ".\apps\prompt-026-typescript-structured-output"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
