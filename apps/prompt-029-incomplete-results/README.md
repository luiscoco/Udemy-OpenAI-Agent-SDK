# Prompt 29 — Incomplete results

Handle refusals, interrupted generation, and incomplete structured results without treating them as successful output.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:29
```

Open http://127.0.0.1:3129. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

Check interruptions, refusals, provider completion, and schema validation before consumption.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode.

Record this lesson

```powershell
cd ".\apps\prompt-029-incomplete-results"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
