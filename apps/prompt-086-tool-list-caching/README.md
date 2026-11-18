# Prompt 86 — Tool-list caching

Configure supported MCP tool-list caching and demonstrate when cached definitions must be invalidated.

The fixture uses an MCP session ID because the installed SDK refreshes stateless HTTP catalogs. Compare one cached tools/list request with an explicit invalidation or uncached discovery. No model inference is used.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:86
```

Open http://127.0.0.1:3186. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

This HTTP fixture supplies Mcp-Session-Id. The installed SDK deliberately refreshes tool definitions on stateless connections. It retains cached definitions within the same session until invalidated.

This exercise performs actual local MCP transport operations and uses no model inference or API credential.

## Record the walkthrough

```powershell
cd ".\apps\prompt-086-tool-list-caching"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/integrations-observability).
