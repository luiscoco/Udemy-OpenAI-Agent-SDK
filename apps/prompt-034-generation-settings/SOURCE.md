# Practical application source — Prompt 34: Generation settings

This folder contains the lesson's executable implementation, not just a launcher.

## Start here

- [Application entry point](src/application.mjs) — binds this prompt's local implementation to the shared HTTP/UI framework.
- [Practical implementation](src/structured-execution.mjs) — the code that implements the demonstrated behavior.
- [Execution flow](src/execute.mjs) — dispatches this lesson's classroom/live path.
- [Server entry point](server.mjs).

## Source shown in the application

- [structured/generation-settings.mjs](src/examples/structured/generation-settings.mjs)
- [structured/captured-transport.mjs](src/examples/structured/captured-transport.mjs)
- [implementation/structured-execution.mjs](src/structured-execution.mjs)
- [application.mjs](src/application.mjs)

## Run and edit

From the repository root, install the shared dependencies once:

```powershell
Set-Location .\apps
npm ci
npm run lesson:34
```

Open http://127.0.0.1:3134. You can also run `npm start` from this prompt folder after installing the shared dependencies.

Edit the implementation files under `src`, restart the server, and rerun the exercise. The in-app source explorer reads these local files. Shared UI, SDK plumbing, and common utilities remain in [foundations-runtime](../foundations-runtime/); retain that folder and the shared `apps/node_modules`. This is not an isolated folder-only distribution. Some implementation modules expose several related scenarios; the application binds prompt 34.

`src/source-map.json` records the exact local paths. These are executable working copies: changes are not overwritten unless an instructor explicitly reruns the materialization script.
