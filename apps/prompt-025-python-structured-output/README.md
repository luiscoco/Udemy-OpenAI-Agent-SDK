# Prompt 25 — Python structured output

Create a Python agent that returns a validated Pydantic object instead of unrestricted text.

From Windows PowerShell

```powershell
cd ".\apps"
npm ci
npm run setup:python
npm run lesson:25
```

Open http://127.0.0.1:3125. The app includes scenario controls, an execution timeline, actual source, execution evidence, a knowledge check, and Recording view.

The SDK validates the final object with strict Pydantic validation and rejects numeric strings.

Classroom mode runs local SDK operations with scripted model responses. Prompt 29 labels injected refusal and incomplete-result fixtures. Prompt 33 captures the real resolved provider request in an isolated process. No API credentials are needed for classroom mode. Copy .env.example to .env in this folder and configure your own API key for Live API. Actual account-backed inference incurs provider costs. Live behavior has not been verified against a paid account.

Python 3.12 and pinned Python dependencies are installed under apps/.runtime, with no global Python changes. The actual Python SDK returns a Pydantic Product. The installed SDK uses strict Pydantic validation and rejects numeric strings. An existing Python environment can be selected with CLASSROOM_PYTHON.

Record this lesson

```powershell
cd ".\apps\prompt-025-python-structured-output"
npm run record
```

Videos and a final screenshot are written to this folder's recordings directory. The recorder owns and closes its temporary server.
