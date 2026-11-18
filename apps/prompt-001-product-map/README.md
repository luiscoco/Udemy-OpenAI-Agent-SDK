# Prompt 001 — Product Map Lab

A runnable classroom application for this exercise from the source document.

> Explain the OpenAI Agents SDK, Responses API, Agents API, and Codex SDK, and show when each is appropriate.

Students select a product, follow its execution diagram, inspect the matching server code, run the example, and answer a short product-selection quiz. The English interface includes a recording view for classroom videos.

## Start the application

Use Node.js 22.16 or later. Node.js 24 is recommended.

```powershell
cd ".\apps\prompt-001-product-map"
npm ci
npm start
```

Open **http://127.0.0.1:3101**. Classroom mode runs immediately using local scripted examples. You can also run `npm start` before installing dependencies when you only need classroom mode.

`npm run dev` restarts the backend when its source changes. Reload the browser after editing frontend files. Set `PORT` in `.env` to use another local port.

## Teach Prompt 1

1. Ask students who should own the workflow.
2. Select **Responses API** and step through a direct model request.
3. Select **Agents SDK** and follow the model–tool loop around the sample order lookup.
4. Select **Agents API** and distinguish session creation, task execution, and the final turn result.
5. Select **Codex SDK** and inspect its bounded repository task.
6. Run each example, open its evidence, and compare the ownership explanation.
7. Answer the product-selection questions beneath the lab.

**Next step** advances a classroom example manually. **Run demo** plays it automatically. **Stop** cancels playback or signals cancellation to the live adapter. **Reset** clears the current visualization. **Recording view** expands the lab. **Lesson guide** includes the exact implementation prompt and instructor notes.

## Classroom and live execution

Classroom mode is explicitly labeled as a simulation. Model responses, hosted execution, and Codex's explanation use scripted teaching fixtures. The order data and repository source shown as local evidence are read by the application. This makes the walkthrough repeatable during class and recordings.

Live mode runs the actual installed packages through the adapters in `adapters/`. The code panel is extracted from those files, and **Full source** opens the implementation being used. Progress represents application stages and observed runtime events. The live model can choose a different path from the classroom fixture.

| Product       | Live example                                                                | Server configuration                                           |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Responses API | Generate a one-sentence explanation                                         | `OPENAI_API_KEY`                                               |
| Agents SDK    | Run an agent with the sample `lookup_order` function tool                   | `OPENAI_API_KEY`                                               |
| Agents API    | Create a managed session that writes and runs `hello.py` in hosted compute  | `OPENAI_API_KEY`, `ENABLE_AGENTS_API=true`, and project access |
| Codex SDK     | Explain the bundled robotics-club repository using a read-only Codex thread | Configured local Codex authentication and `ENABLE_CODEX=true`  |

Copy `.env.example` to `.env`, configure the relevant values, and restart the server. `OPENAI_MODEL` selects the Responses/Agents model. `CODEX_MODEL` can override the Codex model. Credentials stay on the server. Live requests use your configured account and can incur API or hosted runtime charges.

The Codex example uses `fixtures/robotics-club` as its workspace. It requests an explanation with read-only filesystem access. The fixture can also be checked directly with `node --test fixtures/robotics-club/tests/fees.test.mjs`.

Live managed sessions appear in **Hosted sessions created by this server** below the lab. Their IDs remain available across page refreshes and product switches while the server is running. Delete them there when finished. Save any session IDs you need before restarting the server, which clears the local ownership registry. The hosted service preserves sessions independently. After a disconnect, inspect the existing session before starting another task. Stopping the local request signals cancellation of the request stream, while hosted work can require service-side inspection or cleanup.

## Record a lesson with Playwright

```powershell
npm run record
```

The script starts an isolated local server with classroom mode, opens a 1920×1080 browser context, walks through all four products with manual stepping, and saves a WebM video and a final-frame PNG under `recordings/`. It closes its browser and server when finished. Its output prints the saved video's exact path. The video contains the browser walkthrough and can be narrated during editing.

The browser helper uses installed Google Chrome or Microsoft Edge on Windows. Elsewhere it uses Playwright Chromium. If Chromium is needed, run `npx playwright install chromium`. `PLAYWRIGHT_BROWSER_PATH` can select another installed Chromium executable.

## Verify the application

```powershell
npm test
npm run test:e2e
```

Backend checks exercise all four classroom runs, input validation, credential redaction, SDK adapter contracts, managed-turn failures, cancellation propagation, and live-request concurrency. Browser checks cover product switching, automatic and manual playback, evidence, reset, stop, live setup, the quiz, the guide, recording view, and mobile layout. Adapter tests use local doubles to verify request contracts. Live account execution requires your credentials and project access.

## Source layout

```text
server.mjs                 Local HTTP server and execution endpoints
public/                    Browser interface and lesson content
adapters/                  Executable integrations for the four products
lib/demo.mjs               Classroom simulation and sample order lookup
fixtures/robotics-club/    Bounded repository used by the Codex example
scripts/record-lesson.mjs  Automated lesson recording
tests/                     Backend and Playwright checks
```

The app serves browser files and an explicit adapter-source whitelist. The server binds to loopback. Dependencies and their versions are pinned in `package.json` and `package-lock.json`.

## Official references

- [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [Responses API text generation](https://developers.openai.com/api/docs/guides/text)
- [Agents API quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart)
- [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)

SDK request shapes were checked against these references and the installed package declarations during implementation.
