# Practical application source — Prompt 6: Agent loop

This folder contains the lesson's executable implementation, not just a launcher.

## Start here

- [Application entry point](src/application.mjs) — binds this prompt's local implementation to the shared HTTP/UI framework.
- [Practical implementation](src/execute.mjs) — the code that implements the demonstrated behavior.
- [Execution flow](src/execute.mjs) — dispatches this lesson's classroom/live path.
- [Server entry point](server.mjs).

## Source shown in the application

- [agents/club-agent.mjs](src/examples/organized/agents/club-agent.mjs)
- [tools/club.mjs](src/examples/organized/tools/club.mjs)
- [services/club-service.mjs](src/examples/organized/services/club-service.mjs)
- [implementation/execute.mjs](src/execute.mjs)
- [application.mjs](src/application.mjs)

## Run and edit

From the repository root, install the shared dependencies once:

```powershell
Set-Location .\apps
npm ci
npm run lesson:6
```

Open http://127.0.0.1:3106. You can also run `npm start` from this prompt folder after installing the shared dependencies.

Edit the implementation files under `src`, restart the server, and rerun the exercise. The in-app source explorer reads these local files. Shared UI, SDK plumbing, and common utilities remain in [foundations-runtime](../foundations-runtime/); retain that folder and the shared `apps/node_modules`. This is not an isolated folder-only distribution. Some implementation modules expose several related scenarios; the application binds prompt 6.

`src/source-map.json` records the exact local paths. These are executable working copies: changes are not overwritten unless an instructor explicitly reruns the materialization script.
