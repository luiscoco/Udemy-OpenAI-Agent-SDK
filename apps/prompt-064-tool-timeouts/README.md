# Prompt 64 — Tool timeouts

Add supported per-tool timeouts and distinguish timeout handling from application retry logic.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:64
```

Open http://127.0.0.1:3164.

Per-tool timeout behavior controls deadline handling. A retry is a separate explicit application decision.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

The exercise uses local SDK execution and requires no API credential.

The SDK tool configures timeoutMs and timeoutBehavior. Its callback awaits work using details.signal. Timeout behavior itself adds no application retries. The retry scenario explicitly starts one additional read-only attempt after the first backend invocation settles. Cleanup awaits every owned invocation.

Record from this app folder.

```powershell
cd ".\apps\prompt-064-tool-timeouts"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
