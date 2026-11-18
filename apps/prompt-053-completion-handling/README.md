# Prompt 53 — Completion handling

Wait for stream completion before reading final results, usage information, or persisted state.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:53
```

Open http://127.0.0.1:3153.

Partial text may precede a failure. Await completion and check success before reading final results or saving state.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Streaming lessons use a live HTTP event stream to display actual SDK progress while execution is active. The four-stage teaching timeline replays the observed operation after it settles. Stop aborts the browser request and propagates cancellation to the server.

Successful completion stores a serialized RunState in a request-owned in-memory Map. The lesson reports the saved snapshot size. Failed streams keep partial text unconsumed and save no completed snapshot. The fixture store lasts for the exercise invocation.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-053-completion-handling"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
