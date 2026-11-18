# Applications for prompts 95–200

Each prompt has a standalone application, selectable scenarios, executable source, execution evidence and a Playwright recording command. Prompts 1–94 retain their existing applications.

## Windows Terminal

Use Node.js 24 or later. The repository-workspace lesson also uses Git. Python voice lessons, the experimental Python capability probe and the ChatKit companion use the project-local Python 3.12 runtime installed with `npm run setup:python`.

```powershell
Set-Location '.\apps'
npm ci
npm run lesson:95
```

Open http://localhost:3195. Replace `95` with any prompt through `200`. The default port is `3100 + prompt number`. Prompt 200 opens at http://localhost:3300. Press Ctrl+C before starting another application on an occupied port.

```powershell
npm run lesson:127
npm run lesson:197
npm run lesson:200
```

Run these commands in separate terminal tabs when using several applications together. Every application also supports `npm start` from its own directory.

## Implemented groups

| Prompts | Executed mechanisms |
| --- | --- |
| 95–104 | Conditional handoffs, next-turn ownership, manager tools, contracts, sequential and parallel workflows, routing, planning, review loops, state transitions |
| 105–112 | SDK sessions, process-independent SQLite persistence, atomic operations, tenant namespaces, captured server-continuation payloads, context selection and facts |
| 113–120 | Input, output and tool guardrails, classifier guards, parallel execution scope and buffered stream validation |
| 121–128 | SDK approval interruptions, conditional policies, decisions, serialized state, fresh-process resumption, nested calls, multi-action review and idempotency |
| 129–144 | SDK SandboxAgent, manifests, bounded filesystem operations, repository fixtures, storage configuration, artifacts, snapshots, shell and filesystem tools, skills, memory policies and capabilities |
| 145–152 | SDK traces in isolated worker processes, custom spans, grouping, lifecycle hooks, local export, operational metrics and trace graph export |
| 153–168 | RealtimeSession transport fixtures, actual loopback WebSockets, VAD settings, interruptions, private tools, handoffs, approval and output guards, Python VoicePipeline, GPT-Live client delegation and media lifecycle |
| 169–176 | SDK testing helpers, assertions, route and approval checks, runtime fixtures, representative evaluation cases and measured version comparisons |
| 177–184 | Bounded retry, model/tool/request deadlines, budgets, durable SQLite jobs, authenticated loopback API, streaming chat, deployment health and process crash recovery |
| 185–192 | AES-GCM session wrapper, branches, provider compatibility, captured Decisions API requests, bounded coding delegation, installed experimental capability probes, self-hosted ChatKit and release audit |
| 193–200 | Combined support, retrieval, research, approval workflow, uploaded CSV analysis, code review, voice support and readiness/recovery projects |

## Classroom and provider execution

Classroom runs use deterministic model decisions and synthetic teaching data. SDK orchestration, guardrails, interruptions, tools, local HTTP requests, SQLite transactions, file writes, cryptography, assertions and worker-process recovery execute on the computer. The evidence identifies protocol fixtures and capabilities that require a provider.

The portable workspace adapter exposes a small command vocabulary and validates paths under its owned directory. A Docker or hosted client supplies operating-system isolation for arbitrary agent shell execution. Its optional Docker companion uses the installed SDK's actual `DockerSandboxClient` and disables container network access.

```powershell
npm run sandbox:docker
```

Docker Desktop must run Linux containers. The first run can download `node:24-bookworm-slim`. The companion creates its owned files under `apps\.runtime\docker-workspaces` and closes its container after reading the report.

Python pipeline lessons use the project-local Python runtime installed by the existing setup command. They invoke actual SDK agents between deterministic transcription and PCM tone fixtures. Downloadable WAV files illustrate audio chunk delivery. Speech-recognition accuracy and synthesized speech quality require representative recordings and live speech models.

```powershell
npm run setup:python
```

## Live voice clients

Prompt 153 includes a microphone button and native browser WebRTC signaling. Its local backend issues an ephemeral Realtime credential. Configure the key locally and enable the paid connection explicitly before launching the app.

```powershell
$env:CLASSROOM_LIVE_VOICE = '1'
node --env-file-if-exists=.env foundations-runtime/launch.mjs 153
```

The browser requests microphone permission. The backend reads `OPENAI_API_KEY`. `REALTIME_MODEL` can select an accessible compatible model.

An actual server-side Realtime WebSocket companion includes a backend order tool and specialist handoff. Audio input is 24 kHz mono PCM16. The server reports output-audio chunk sizes and transcripts.

```powershell
npm run voice:server
```

Prompt 166 handles the documented GPT-Live client delegation events. It accumulates transcript context, checks current authorization before invoking the SDK backend, preserves delegation IDs and reuses stored results for event replay. Classroom runs inject these events into the same handler. A live connection requires GPT-Live account access and an audio transport.

## Self-hosted ChatKit

The companion runs the real Python ChatKit server, SDK response streaming and SQLite thread store. The browser component loads from OpenAI's CDN. Its local teacher identity supplies a classroom tenant.

```powershell
npm run chatkit
```

Open http://127.0.0.1:4191. Internet access is required for the ChatKit browser component. A deployment must configure its own domain registration, authentication and tenant identity. The ordinary lesson page also includes a local chat control for inspecting persistent thread behavior.

## Optional Codex delegation

The installed Python SDK's experimental Codex integration is supplied in `codex_delegation.py`. It creates a fresh fixture workspace, disables network and web search, requests a single-file change and returns before/after content for review. Running it requires a compatible Codex CLI and its configured credentials.

```powershell
.\.runtime\python\python.exe foundations-runtime\course\codex_delegation.py
```

## Storage and recovery

SQLite state lives in `apps\.runtime\course\course.sqlite`. ChatKit uses `chatkit.sqlite` beside it. Workspace files live in `apps\.runtime\workspaces`. Downloadable files live in `apps\.runtime\lesson-artifacts`. These are local application stores.

The durable worker checkpoints a job and commits its side effect under an idempotency key. The crash exercise terminates an owned worker immediately after the commit, resumes it in another process and verifies one committed effect after duplicate delivery. This is an application-managed SQLite workflow engine. Managed distributed workflow services require their own deployment and adapters.

The encryption lesson uses a temporary server-memory AES key for classroom runs. A deployed wrapper must load its key from durable key management so sessions remain decryptable after restart.

## Container deployment

```powershell
docker build -t agent-course .
docker run --rm -p 3300:3300 -v agent-course-state:/app/.runtime agent-course
```

The container starts prompt 200, provides `/health`, stores state on the mounted volume and drains connections on termination. The Dockerfile includes Python dependencies for voice and ChatKit lessons. External provider credentials can be passed through the deployment environment.

## Verification and video capture

```powershell
npm test
npm run test:e2e -- course.spec.mjs
npm run record -- 197
npm run record:remaining
```

Recordings are written into each application's `recordings` directory. The recorder compares all listed scenarios and saves a final frame. Installed Chrome or Edge is used. Backend tests and browser recording run separately to avoid resource contention.

## Official references checked during implementation

- [TypeScript Agents SDK](https://openai.github.io/openai-agents-js/)
- [Python Agents SDK](https://openai.github.io/openai-agents-python/)
- [Realtime transports](https://openai.github.io/openai-agents-js/guides/voice-agents/transport/)
- [GPT-Live client delegation](https://developers.openai.com/api/docs/guides/live-delegation)
- [Self-hosted ChatKit](https://developers.openai.com/api/docs/guides/custom-chatkit)
- [Decisions API](https://developers.openai.com/api/docs/guides/decisions)
- [Python SDK releases](https://github.com/openai/openai-agents-python/releases)

Hosted-account integrations, Codex execution and production deployment need environment-specific verification. Each local result identifies its fixtures and measured operations.
