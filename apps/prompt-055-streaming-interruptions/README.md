# Prompt 55 — Streaming interruptions

Detect approval interruptions during streaming, wait for the run to settle, and preserve resumable state.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:55
```

Open http://127.0.0.1:3155.

Wait for the stream to settle, preserve RunState, and resume the same run after resolving approvals.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

The exercise uses local SDK execution and requires no API credential.

The actual stream settles with an approval interruption before the tool runs. RunState is serialized, restored with RunState.fromString and optionally approved or rejected before resuming the same run. The serialized paused snapshot is included in returned evidence for inspection and lasts within this exercise result.

Record from this app folder.

```powershell
cd ".\apps\prompt-055-streaming-interruptions"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
