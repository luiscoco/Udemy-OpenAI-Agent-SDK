# Prompt 60 — External API tool

Create an asynchronous tool that calls an external API with authentication, timeouts, and clear errors.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:60
```

Open http://127.0.0.1:3160.

Send credentials through the configured client, enforce deadlines and expose actionable public errors.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

The exercise uses local SDK execution and requires no API credential.

The asynchronous tool sends a bearer credential to a separate loopback weather API. It uses an AbortSignal deadline and maps HTTP authentication, service, network and deadline failures to public codes. The service fixture closes owned connections and pending work. External production API connectivity has not been tested.

Record from this app folder.

```powershell
cd ".\apps\prompt-060-external-api-tool"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
