# Prompt 80 — Computer use

Connect a computer-use agent to an isolated browser or desktop runtime and verify actions through screenshots.

The SDK dispatches actions to a real isolated Playwright context. The bundled counter page has all network routes blocked. Classroom decisions are scripted. Saved screenshots and the actual counter verify the outcome.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:80
```

Open http://127.0.0.1:3180. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

The computer adapter launches a fresh headless Chrome or Edge context using Playwright. It displays bundled HTML, blocks network requests, and forwards SDK computer actions. This exercise controls a temporary browser, with real screenshots saved as local artifacts.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-080-computer-use"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-computer-use).
