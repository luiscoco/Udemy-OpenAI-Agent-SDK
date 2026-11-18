# Prompt 56 — Web streaming

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/tools-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Expose agent events through an application SSE endpoint and handle client disconnection cleanly.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:56
```

Open http://127.0.0.1:3156.

A client disconnect propagates cancellation to the owned run. Stream and backend settlement precede resource cleanup.

The app includes scenario controls, actual source, observed execution evidence, a knowledge check, instructor guidance and Recording view. Classroom model responses are scripted while SDK tools and runtime operations execute. All user profiles, credentials and service data are classroom fixtures.

The exercise uses local SDK execution and requires no API credential.

A controlled teaching HTTP client connects to a real separate loopback SSE endpoint. The disconnect scenario aborts that client after three text chunks. Server response closure aborts the owned SDK stream, then stream settlement, model cleanup and server closure are awaited. The main browser also receives live SDK progress through the shared application SSE route.

Record from this app folder.

```powershell
cd ".\apps\prompt-056-web-streaming"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official tool guidance](https://developers.openai.com/api/docs/guides/tools) and [approval guidance](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).
