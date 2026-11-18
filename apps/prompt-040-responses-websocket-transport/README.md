# Prompt 40 — Responses WebSocket transport

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/runtime-execution.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

Demonstrate supported Responses WebSocket transport and connection reuse, explaining how it differs from realtime voice.

Run from Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:40
```

Open http://127.0.0.1:3140. The app includes scenario controls, execution evidence, source exploration, a knowledge check, a lesson guide, and Recording view.

Responses WebSocket transport carries response requests and events. Realtime voice has a separate audio-session protocol.

Classroom mode executes the actual SDK with scripted model inference. Local HTTP and WebSocket endpoints are controlled protocol fixtures. Timing describes local execution and fixture token reports are synthetic. Account-backed model quality, cost and latency need live measurements.

This lesson uses controlled local execution and requires no API key.

The SDK OpenAIResponsesWSModel opens actual sockets against an ephemeral loopback endpoint. The comparison runs twice, inspects connection IDs, and closes owned sockets and servers. Responses text/tool events and realtime voice audio events use different protocols.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-040-responses-websocket-transport"
npm run record
```

The recorder creates a WebM and final-frame PNG in recordings and closes its temporary browser and server.

[Official SDK model guidance](https://developers.openai.com/api/docs/guides/agents/models) and [running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents).
