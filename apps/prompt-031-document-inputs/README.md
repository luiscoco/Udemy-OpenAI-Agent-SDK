# Prompt 31 — Document inputs

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/structured-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Pass a PDF or supported document to an agent and explain input formats, processing behavior, and relevant limits.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run lesson:31
```

Open http://127.0.0.1:3131. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

PDF processing includes text and page images. Endpoint size and model context limits still apply.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

The bundled PNG and one-page PDF are actual teaching assets. Classroom observations are scripted. Inspect actual provider payloads in the evidence. PDFs use text and page images with compatible models. Each file must be under 50 MB and combined request files at most 50 MB. See [official file input guidance](https://developers.openai.com/api/docs/guides/file-inputs).

Record this lesson

```powershell
cd ".\apps\prompt-031-document-inputs"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
