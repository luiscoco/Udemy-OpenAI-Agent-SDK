# Practical application source — Prompt 1: OpenAI product map

Prompt 1 uses the same layout as the other applications: a small `server.mjs` launcher, an executable `src/application.mjs`, local implementation files, and a source manifest.

## Start here

- [Application entry point and HTTP implementation](src/application.mjs)
- [Agents SDK adapter](src/adapters/agents-sdk.mjs)
- [Responses API adapter](src/adapters/responses.mjs)
- [Managed-agent adapter](src/adapters/agents-api.mjs)
- [Codex adapter](src/adapters/codex.mjs)
- [Classroom execution and order lookup](src/lib/demo.mjs)
- [Lesson definitions](src/public/lesson.js)
- [Browser application](src/public/app.js)
- [HTML](src/public/index.html) and [styles](src/public/styles.css)
- [Sample repository](src/fixtures/robotics-club/)
- [Source manifest](src/source-map.json)

## Run and edit

From the repository root:

```powershell
Set-Location .\apps
npm ci
npm run lesson:1
```

Open http://127.0.0.1:3101. After the shared install, `npm start` also works from this prompt's folder. Its own `npm ci` remains supported if you prefer a separate dependency installation.

Edit files under `src`, restart the server, and rerun the demonstration. The source endpoint reads the adapters in `src/adapters`; the browser runs the assets in `src/public`. The local fixture remains explicitly labeled classroom data.

The product-map UI and API behavior are preserved. Common course dependencies are installed from `apps`, just as for the other lessons; keep the complete repository structure together.
