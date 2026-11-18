# Prompt 33 — Model selection

Configure explicit models at agent, workflow, and process levels, and demonstrate which configuration takes precedence.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:33
```

Open http://127.0.0.1:3133. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

The isolated run captures the resolved model in the actual provider request.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode.

Record this lesson

```powershell
cd ".\apps\prompt-033-model-selection"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
