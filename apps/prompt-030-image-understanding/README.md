# Prompt 30 — Image understanding

Give an agent an image and ask it to extract observations using a compatible model.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:30
```

Open http://127.0.0.1:3130. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

Classroom responses are scripted. The actual PNG is attached through the SDK in both modes.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

The bundled PNG and one-page PDF are actual teaching assets. Classroom observations are scripted. Inspect actual provider payloads in the evidence. PDFs use text and page images with compatible models. Each file must be under 50 MB and combined request files at most 50 MB. See [official file input guidance](https://developers.openai.com/api/docs/guides/file-inputs).

Record this lesson

```powershell
cd ".\apps\prompt-030-image-understanding"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
