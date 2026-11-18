# Prompt 003 — Project bootstrap

## Practical application source

**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/execute.mjs)

The lesson now runs the local source in this folder; the common UI and utilities are shared.

An interactive local teaching application in the foundations series.

## Run in Windows Terminal

Requires Node.js 24+. Install shared dependencies once from the apps folder.

```powershell
cd ".\apps"
npm ci
cd "prompt-003-project-bootstrap"
npm start
```

Open http://127.0.0.1:3103. Classroom mode works immediately. Use Run exercise for automatic playback or Next step to explain each stage. The operation executes before its event replay. Evidence distinguishes scripted model output from actual local execution.

## Record the lesson

```powershell
npm run record
```

The script uses a separate temporary server, records classroom mode at 1920×1080, and closes its browser and server. The WebM video and final-frame PNG are saved in this application's recordings folder. A system Chrome or Edge installation is used on Windows. If neither is installed, run `npx playwright install chromium` from the apps folder.

## Source and live setup

The application shares the UI and server in ../foundations-runtime. Each prompt has distinct controls, examples, evidence, and a knowledge check. Source explorer opens the runnable example modules. Lesson guide contains the exact prompt and teaching steps.

Download starter produces a real ZIP for TypeScript or Python. The bundled package versions were checked against npm and PyPI on 2026-11-12. Check current releases performs fresh registry reads and displays the result alongside the starter pins. TypeScript includes a real transitive npm lockfile. Python pins the SDK directly and gives a pip freeze command to capture the resolved environment. Run the extracted project using its README.

## Verify

From the apps folder run `npm test` and `npm run test:e2e`. Browser checks cover all seven foundation applications. Live adapter checks use doubles. Real account calls require credentials and model access.

[Official OpenAI Agents SDK guide](https://developers.openai.com/api/docs/guides/agents/quickstart)
