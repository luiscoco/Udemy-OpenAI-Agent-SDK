# Prompt 41 — Execution methods

Demonstrate asynchronous execution and, where supported, synchronous execution, explaining when each is appropriate.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run setup:python
npm run lesson:41
```

Open http://127.0.0.1:3141. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

Await async SDK execution inside an event loop. Python run_sync wraps execution for synchronous callers.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

This lesson uses controlled local execution and requires no API key.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-041-execution-methods"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
