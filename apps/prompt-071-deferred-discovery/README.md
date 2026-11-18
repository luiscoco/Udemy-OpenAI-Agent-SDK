# Prompt 71 — Deferred discovery

Configure hosted tool search with deferred tools and namespaces, checking support in my selected SDK.

The installed SDK serializes hosted tool search, deferLoading and toolNamespace. Classroom discovery uses injected provider responses. Live mode performs hosted discovery.

## Run in Windows Terminal

Requires Node.js 24 or later. Install shared dependencies once from apps.

```powershell
cd ".\apps"
npm ci
npm run lesson:71
```

Open http://127.0.0.1:3171. Use the scenario controls, source explorer, execution evidence, knowledge check and Recording view.

For live execution, copy .env.example to .env in this app folder, enter OPENAI_API_KEY locally, select an accessible compatible OPENAI_MODEL and restart. Live runs incur API charges. Model decisions can vary.

## Record the lesson

```powershell
cd ".\apps\prompt-071-deferred-discovery"
npm run record
```

The recorder saves a WebM and a final-frame PNG in recordings. Classroom recording uses local fixtures.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-tool-search).
