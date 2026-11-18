# Prompt 52 — Tool progress

Display tool-start, tool-completion, and tool-failure progress using supported events or lifecycle hooks.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:52
```

Open http://127.0.0.1:3152.

Runner hooks report tool start and end. The application wrapper reports failure and preserves the SDK error.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

Streaming lessons use a live HTTP event stream to display actual SDK progress while execution is active. The four-stage teaching timeline replays the observed operation after it settles. Stop aborts the browser request and propagates cancellation to the server.

Supported Runner lifecycle hooks report tool start and end. The application wrapper publishes failure progress because this installed SDK has no corresponding tool-failure hook. The original SDK ToolCallError is preserved. A tool-end hook can also follow failure, so the display includes the observed success or failure status.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-052-tool-progress"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
