# Agent Academy applications

For the complete course, begin with the [course README](../README.md), [student setup guide](../docs/GETTING_STARTED.md), and [180-lesson curriculum](../docs/CURRICULUM.md). The shared runtime supports Prompts 2–200; the core Udemy course covers 1–180.

Local teaching applications for the implementation prompt series. Prompt 1 compares the four OpenAI developer products. Prompts 2–8 cover foundations, 9–16 cover agent definitions and instructions, 17–24 cover context and dependency injection, 25–32 cover structured and multimodal outputs, 33–40 cover model configuration and provider transports, 41–48 cover execution and results, 49–56 cover streaming and cancellation, 57–64 cover function tools, 65–72 cover tool execution and discovery, 73–80 cover hosted tools and retrieval, 81–88 cover MCP connections and lifecycle, and 89–94 cover handoffs and specialist ownership. The applications include interactive exercises, source explorers, execution evidence, knowledge checks, instructor guides, and recording views.

## Run on Windows

Use Node.js 24 or later. From Windows Terminal with PowerShell, install the shared dependencies once.

```powershell
cd ".\apps"
npm ci
npm run lesson:2
```

Open http://127.0.0.1:3102. Replace `lesson:2` with any script from `lesson:2` through `lesson:200`. Each lesson uses port 3100 plus its prompt number, such as http://127.0.0.1:3125 for Prompt 25. Press Ctrl+C to stop. You can also run `npm start` inside each application's folder. The navigation opens the other lessons through the same running server.

Prompts 25 and 41 run the actual Python SDK. Install its workspace-local Windows x64 Python environment once. This requires PowerShell 7 (`pwsh`), internet access to python.org and PyPI, and no global Python changes. Setup can take several minutes.

```powershell
npm run setup:python
npm run lesson:25
```

Python and its direct pinned dependencies live under `apps/.runtime`. To use your own interpreter, install `foundations-runtime/requirements-python.txt` in that environment and set `CLASSROOM_PYTHON` to its executable path in the selected Python lesson's `.env`. The PNG and PDF fixtures are already bundled, so other lessons use their shared Node runtime. Optional asset regeneration uses `requirements-media.txt` and `scripts/create-media-fixtures.py` under `foundations-runtime`.

| Prompt | Application folder                       | Default port | Exercise                                                          |
| ------ | ---------------------------------------- | ------------ | ----------------------------------------------------------------- |
| 1      | prompt-001-product-map                   | 3101         | Compare four OpenAI products                                      |
| 2      | prompt-002-language-support              | 3102         | Compare Python and TypeScript APIs and capabilities               |
| 3      | prompt-003-project-bootstrap             | 3103         | Generate a starter ZIP and verify SDK releases                    |
| 4      | prompt-004-authentication                | 3104         | Reproduce credential errors and inspect recovery steps            |
| 5      | prompt-005-first-agent                   | 3105         | Ask one question and inspect the final answer                     |
| 6      | prompt-006-agent-loop                    | 3106         | Follow a model–tool–model loop with a real local lookup           |
| 7      | prompt-007-project-organization          | 3107         | Explore configuration, agents, tools, services, and tests         |
| 8      | prompt-008-troubleshooting               | 3108         | Diagnose installation, import, model, and configuration failures  |
| 9      | prompt-009-agent-identity                | 3109         | Define and test a specialist's identity, boundaries, and style    |
| 10     | prompt-010-instruction-design            | 3110         | Build goal, information, action, and completion instructions      |
| 11     | prompt-011-examples-in-instructions      | 3111         | Compare three-example instructions against a baseline             |
| 12     | prompt-012-dynamic-instructions          | 3112         | Resolve instructions from user, language, and application context |
| 13     | prompt-013-stored-prompts                | 3113         | Inspect code-managed versions and legacy hosted references        |
| 14     | prompt-014-reusable-definitions          | 3114         | Customize an Agent with the actual SDK clone method               |
| 15     | prompt-015-clarification-behavior        | 3115         | Ask for missing workshop requirements before planning             |
| 16     | prompt-016-configuration-reference       | 3116         | Inspect and construct public installed-SDK option categories      |
| 17     | prompt-017-typed-context                 | 3117         | Typed context                                                     |
| 18     | prompt-018-dependencies                  | 3118         | Dependencies                                                      |
| 19     | prompt-019-context-visibility            | 3119         | Context visibility                                                |
| 20     | prompt-020-authorization                 | 3120         | Authorization                                                     |
| 21     | prompt-021-personalization               | 3121         | Personalization                                                   |
| 22     | prompt-022-shared-context                | 3122         | Shared context                                                    |
| 23     | prompt-023-tool-call-context             | 3123         | Tool-call context                                                 |
| 24     | prompt-024-dependency-lifecycle          | 3124         | Dependency lifecycle                                              |
| 25     | prompt-025-python-structured-output      | 3125         | Actual Python SDK and Pydantic Product validation                 |
| 26     | prompt-026-typescript-structured-output  | 3126         | Actual SDK structured output with Zod                             |
| 27     | prompt-027-complex-output-schemas        | 3127         | Nested objects, arrays, enums, and nullable fields                |
| 28     | prompt-028-business-validation           | 3128         | Calendar dates, quantity, and supporting evidence                 |
| 29     | prompt-029-incomplete-results            | 3129         | Completion gates, refusals, and actual approval interruption      |
| 30     | prompt-030-image-understanding           | 3130         | Actual PNG input and observations                                 |
| 31     | prompt-031-document-inputs               | 3131         | Actual PDF and plain-text inputs                                  |
| 32     | prompt-032-multimodal-tool-results       | 3132         | Actual tools returning text, image, and PDF content               |
| 33     | prompt-033-model-selection               | 3133         | Agent, workflow, and process model precedence                     |
| 34     | prompt-034-generation-settings           | 3134         | Model compatibility and actual SDK request settings               |
| 35     | prompt-035-reasoning-settings            | 3135         | Same-task effort and verbosity comparisons                        |
| 36     | prompt-036-mixed-model-workflow          | 3136         | Measured routing and specialist selection                         |
| 37     | prompt-037-api-compatibility             | 3137         | Responses and Chat Completions adapters                           |
| 38     | prompt-038-alternative-providers         | 3138         | OpenAI-compatible HTTP provider capabilities                      |
| 39     | prompt-039-custom-model-integration      | 3139         | Executable TypeScript Model and ModelProvider contracts           |
| 40     | prompt-040-responses-websocket-transport | 3140         | Actual WebSocket connections and reuse                            |
| 41     | prompt-041-execution-methods             | 3141         | Async TypeScript and async/sync Python                            |
| 42     | prompt-042-turn-limits                   | 3142         | SDK model-turn limits and completed tool work                     |
| 43     | prompt-043-run-configuration             | 3143         | Workflow defaults and explicit agent precedence                   |
| 44     | prompt-044-result-properties             | 3144         | Output, ownership, identifiers and continuation                   |
| 45     | prompt-045-run-items                     | 3145         | Run items                                                         |
| 46     | prompt-046-usage-accounting              | 3146         | Usage accounting                                                  |
| 47     | prompt-047-sdk-exceptions                | 3147         | SDK exceptions                                                    |
| 48     | prompt-048-manual-continuation           | 3148         | Manual continuation                                               |
| 49     | prompt-049-text-streaming                | 3149         | Text streaming                                                    |
| 50     | prompt-050-event-categories              | 3150         | Event categories                                                  |
| 51     | prompt-051-agent-changes                 | 3151         | Agent changes                                                     |
| 52     | prompt-052-tool-progress                 | 3152         | Tool progress                                                     |
| 53     | prompt-053-completion-handling           | 3153         | Completion handling                                               |
| 54     | prompt-054-cancellation                  | 3154         | Cancellation                                                      |
| 55     | prompt-055-streaming-interruptions       | 3155         | Streaming interruptions                                           |
| 56     | prompt-056-web-streaming                 | 3156         | Web streaming                                                     |
| 57     | prompt-057-first-function-tool           | 3157         | First function tool                                               |
| 58     | prompt-058-argument-schemas              | 3158         | Argument schemas                                                  |
| 59     | prompt-059-tool-descriptions             | 3159         | Tool descriptions                                                 |
| 60     | prompt-060-external-api-tool             | 3160         | External API tool                                                 |
| 61     | prompt-061-database-tool                 | 3161         | Database tool                                                     |
| 62     | prompt-062-tool-return-values            | 3162         | Tool return values                                                |
| 63     | prompt-063-tool-failures                 | 3163         | Tool failures                                                     |
| 64     | prompt-064-tool-timeouts                 | 3164         | Tool timeouts                                                     |
| 65 | prompt-065-tool-choice | 3165 | Tool choice |
| 66 | prompt-066-stopping-after-tools | 3166 | Stopping after tools |
| 67 | prompt-067-custom-completion-policy | 3167 | Custom completion policy |
| 68 | prompt-068-conditional-availability | 3168 | Conditional availability |
| 69 | prompt-069-concurrency | 3169 | Concurrency |
| 70 | prompt-070-repeated-call-prevention | 3170 | Repeated-call prevention |
| 71 | prompt-071-deferred-discovery | 3171 | Deferred discovery |
| 72 | prompt-072-programmatic-tool-calling | 3172 | Programmatic tool calling |
| 73 | prompt-073-web-search | 3173 | Web search |
| 74 | prompt-074-file-search | 3174 | File search |
| 75 | prompt-075-retrieval-controls | 3175 | Retrieval controls |
| 76 | prompt-076-custom-rag | 3176 | Custom RAG |
| 77 | prompt-077-code-interpreter | 3177 | Code Interpreter |
| 78 | prompt-078-image-generation | 3178 | Image generation |
| 79 | prompt-079-hosted-shell | 3179 | Hosted shell |
| 80 | prompt-080-computer-use | 3180 | Computer use |
| 81 | prompt-081-local-mcp | 3181 | Local MCP |
| 82 | prompt-082-remote-mcp | 3182 | Remote MCP |
| 83 | prompt-083-hosted-mcp | 3183 | Hosted MCP |
| 84 | prompt-084-mcp-authentication | 3184 | MCP authentication |
| 85 | prompt-085-tool-filtering | 3185 | Tool filtering |
| 86 | prompt-086-tool-list-caching | 3186 | Tool-list caching |
| 87 | prompt-087-connection-failures | 3187 | Connection failures |
| 88 | prompt-088-prompts-and-resources | 3188 | Prompts and resources |
| 89 | prompt-089-first-handoff | 3189 | First handoff |
| 90 | prompt-090-ownership-comparison | 3190 | Ownership comparison |
| 91 | prompt-091-routing-descriptions | 3191 | Routing descriptions |
| 92 | prompt-092-handoff-metadata | 3192 | Handoff metadata |
| 93 | prompt-093-handoff-callbacks | 3193 | Handoff callbacks |
| 94 | prompt-094-history-filtering | 3194 | History filtering |

Prompt 1 has its own dependency installation and recording scripts. Follow its existing README. Prompts 2–94 share the Node backend and browser interface in `foundations-runtime`, and each has its own server entry point, environment example, README, and recording command.

## Classroom and live execution

Classroom mode works without API credentials or network access. Scripted model responses and injected HTTP failures are labeled. Local timetable tools, missing-configuration failures, import failures, and ZIP generation execute on the server. Manual stepping replays the completed operation so the instructor can explain each stage. Run exercise plays that replay automatically. Prompts 49–56 additionally display actual SDK progress through an HTTP event stream while execution is active. Stop aborts the request and propagates cancellation to its owned server operation.

Live API is available in prompts 2, 4–7, 9–15, 18, 20–23, 25–28, 30–32, 34–38, 57–59, 61–62, 65–69, 71–85, and 88–94. Copy the selected application's `.env.example` to `.env`, set `OPENAI_API_KEY` and an accessible `OPENAI_MODEL`, and restart. The server creates the SDK client with that credential. Live requests use your API account and can incur charges. Prompt 11 performs two model runs for each comparison. Credentials stay in the server environment. Prompts 25 and 41 launch the Python SDK. Other in-app live execution uses the TypeScript SDK through JavaScript ES modules and the typed context example. Prompts 34–37 explicitly select their comparison model profiles. Prompt 38 requires `ALT_PROVIDER_URL`, `ALT_PROVIDER_MODEL`, and `OPENAI_API_KEY` containing the external provider credential. Paid live scenarios for Prompts 57–59 and 61–62 passed on 2026-11-12. Live paths for Prompts 65–74 have not yet been verified against the account.

Prompts 10–16 require installed dependencies for actual SDK construction in classroom mode. Prompt 12 resolves a real dynamic instructions callback. Prompt 14 calls the actual clone method. Prompt 16 reads the installed SDK's public declaration file and constructs each configuration category locally. Classroom model answers are labeled fixtures.

Prompt 13 defaults to versioned application-code prompts. Its legacy hosted path demonstrates the installed SDK's `promptId`, `version`, and `variables` fields. Live hosted execution needs an existing `STORED_PROMPT_ID` and an accessible selected version that declares the language variable. OpenAI has scheduled reusable prompt-object shutdown for November 30, 2026. The lesson includes the official migration guidance.

Prompts 17–24 require installed dependencies and run actual SDK context operations. Prompt 17 validates the executable TypeScript context. The other context lessons use a scripted local Model adapter so the real runner can invoke tools, perform handoffs, run nested specialists, and exercise cancellation without an API call. All database and API adapters use in-memory classroom fixtures. Profile selection simulates authenticated application context. Production applications obtain identity from their authentication layer. The context examples suppress SDK diagnostic payload logging and demonstrate allowlisted application logs.

The bootstrap starter pins TypeScript `@openai/agents` 0.21.0 with Zod 4.6.7 and Python `openai-agents` 0.24.0. These stable releases were checked against npm and PyPI on 2026-11-12. Check current releases reads the package registries again and compares them with the starter pins. Its result can differ as releases change. The TypeScript ZIP includes a transitive npm lockfile. The Python starter pins the direct SDK dependency and documents how to freeze its resolved environment.

Prompts 25–28 run the actual SDK output validators. The Python SDK's strict Pydantic validation rejects numeric strings, as does this Zod number schema. Business checks run after structural validation. Prompt 29 uses actual completed SDK runs and approval interruptions, plus explicitly injected refusal and incomplete-provider fixtures. Partial objects are never consumed as success.

Prompts 30–32 attach actual bundled PNG/PDF assets and execute actual SDK tools. Classroom mode captures the real provider payload through a local transport with scripted inference. Live API performs real model inference and needs compatible image/file capabilities. PDF inputs include text and page images. Current documented limits require each file under 50 MB and combined request files at most 50 MB. Inspect the original assets through the interface. Their generation script and rendered PDF preview are included.

Prompt 33 runs the actual model-resolution path in an isolated Node process. The captured request demonstrates explicit agent model, workflow default, then process fallback precedence in the installed SDK. Prompt 34 maps `modelSettings.text.verbosity`, `maxTokens`, sampling, and reasoning settings to provider fields. Unsupported Astra sampling is rejected before transmission. Its Luna sampling profile uses reasoning `none`. Compatibility profiles follow the linked model documentation as checked on 2026-11-12 and may need updating as model support changes.

Prompts 35–36 run the same acceptance checks against their selected tasks and report observed calls, usage and wall time. Classroom inference is scripted, so local timing demonstrates the measurement code. Live comparisons need repeated trials before drawing quality, cost or latency conclusions. No fabricated model benchmark or pricing estimate is displayed.

Prompts 37–38 execute actual SDK adapters against a separate loopback OpenAI-compatible HTTP provider. The fixture supports tools, structured output, SSE streaming and missing usage scenarios. Its token reports are synthetic. The strict Chat adapter rejects hosted web search configuration before transmission. External providers need their own endpoint, accessible model and provider credential. Verify each provider’s capabilities individually. Prompt 39 implements the installed SDK Model and ModelProvider interfaces in executable TypeScript.

Prompt 40 uses the actual SDK Responses WebSocket model and a controlled local WebSocket endpoint. Two runs demonstrate one reused connection or two separate connections. Socket and server cleanup are awaited. Responses text-and-tool events and realtime voice audio sessions use different protocols.

Prompts 41–44 execute actual SDK methods, limits, handoffs and result getters. Python run_sync is called from a synchronous subprocess entry point. Prompt 43 captures the installed runner’s behavior, where explicit agent model and modelSettings precede workflow defaults. This differs from broad override wording in its RunConfig declarations. Prompt 44 demonstrates continuation through actual history and inspects approval state before consumption.

Prompts 45–48 inspect actual run items and agent ownership, collect separate parent and nested usage, reproduce installed-SDK exception classes, and carry replay-ready history into a second turn. Usage amounts are synthetic provider reports and are labeled as fixtures. Nested runs own separate usage contexts, and their disjoint response IDs are counted once.

Prompts 49–54 run the actual streaming SDK against a controlled local Model implementation. Text chunks, raw and higher-level events, handoffs, lifecycle hooks, completion checks and AbortController cancellation execute locally. The browser receives progress before the final result. Prompt 52 reports tool failure through its application wrapper, since the installed Runner hooks expose start and end. Prompt 53 saves a serialized RunState into a request-owned in-memory Map only after successful completion. The fixture snapshot lasts for that exercise invocation. Prompt 54 awaits the stream and its owned model generators before resource cleanup.

Run the Prompt 49 terminal demonstration from the apps folder.

```powershell
npm run terminal:49
```

Each SDK text chunk is written immediately. Ctrl+C requests cancellation and awaits cleanup. These ten lessons use scripted local inference and require no API credentials.

Prompts 55–56 extend streaming with actual approval interruptions and a real teaching HTTP client. Prompt 55 awaits settlement, serializes RunState, restores it, and optionally approves or rejects before resuming the same run. The paused serialized snapshot is included in the result evidence. Prompt 56 exposes a separate loopback SSE endpoint and observes the teaching client disconnect after three text chunks. That disconnect aborts its owned SDK run, followed by awaited stream, model and server cleanup. The browser receives progress through the main application SSE endpoint.

Prompts 57–59 execute a calculator, constrained argument schemas, and a tool metadata comparison. Classroom tool selection is scripted and labeled. Optional Live API uses actual model decisions with the same local callbacks. Prompt 60 calls a separate loopback HTTP API with bearer authentication, deadlines and allowlisted errors. Its service data and credential are fixtures. External production API connectivity has not been tested.

Prompt 61 uses real embedded SQLite inside the Node process, initialized in memory for each exercise. It binds tenant and record parameters and enables PRAGMA query_only after seeding. The application identity selector supplies a server-owned teaching profile. The model supplies only a record ID. Production authenticated identity should come from the authentication layer. Connections close in finally. No Docker service is needed for this lesson.

Prompt 62 validates structured tool output and compares its actual model-visible JSON text representation with descriptive prose. Prompt 63 returns allowlisted failure information or handles the SDK tool exception at the application boundary, keeping a synthetic secret out of returned execution evidence and model inputs. Prompt 64 configures supported per-tool timeout options and demonstrates a separate, explicit, bounded application retry after backend settlement.

## Record lessons

Run from the apps folder.

```powershell
npm run record
npm run record:all
npm run record:definitions
npm run record:context
npm run record:structured
npm run record:runtime
npm run record:streaming
npm run record:tools
```

The first command records Prompt 2. The second records prompts 2–64 sequentially. The third records prompts 10–16, the fourth records prompts 17–24, the fifth records prompts 25–34, the sixth records prompts 35–44, the seventh records prompts 45–54, and the eighth records the ten apps for prompts 55–64. Run `npm run record` inside any application's folder to record that lesson alone. Each script starts a temporary server with classroom fixtures, records a 1920×1080 WebM, saves a final-frame PNG in the application's `recordings` folder, and closes the browser and server. Videos contain browser interaction and can be narrated during editing. Recording uses Chrome or Edge when installed on Windows. Otherwise install Chromium with `npx playwright install chromium`. Set `PLAYWRIGHT_BROWSER_PATH` to use another Chromium executable.

## Verify

Run the paid live scenarios for the latest function-tool batch with the shared validation runner. It covers all 16 UI scenario combinations for prompts 57, 58, 59, 61 and 62. Configure the credential locally before starting.

```powershell
if (!(Test-Path .env)) { Copy-Item prompt-057-first-function-tool/.env.example .env }
notepad .env
npm run test:live:tools
```

The runner reads `apps/.env`, each selected app's `.env`, and the process environment. It makes actual model calls and can incur API charges. JSON reports are saved under `apps/test-results/live-tools`. Checks distinguish completion from scenario acceptance, including model choices that change proposed arguments. SDK request counts, token usage and pricing are unavailable from these lesson results. A missing API key stops the runner before model calls.

```powershell
npm test
npm run test:e2e
```

Backend checks cover the lesson results, actual local operations, source access, credential redaction, concurrency, archive contents, identity/style/scenario combinations, dynamic callbacks, clones, versioned prompts, installed configuration options, and SDK adapter contracts. Browser checks cover all shared-runtime exercises, source tabs, reset, stop, quizzes, guide dialogs, downloads, recording mode, and mobile layouts. SDK request tests use doubles and actual SDK construction checks. Live account calls require configured credentials and model access. Python examples require a Python interpreter for execution.

## Official references

- [OpenAI Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [Running agents and the agent loop](https://developers.openai.com/api/docs/guides/agents/running-agents)
- [OpenAI Agents SDK overview](https://developers.openai.com/api/docs/guides/agents/sdk)
- [OpenAI API error codes](https://developers.openai.com/api/docs/guides/error-codes)

- [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)
- [Results and state](https://developers.openai.com/api/docs/guides/agents/results)
- [Responses WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode)
- [Prompt-object migration guide](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object)

The next application in the source sequence is Prompt 65, tool choice.

## Prompts 65–74

These apps execute SDK tool-choice settings, completion policies, availability predicates, authorization checks, concurrency limits, forced-choice resets, and provider serialization. All 25 classroom scenario combinations run locally. Prompts 71–74 use injected provider responses in classroom mode. Prompt 72 labels its fixed classroom program and aggregates actual callback results in JavaScript. Live mode performs hosted discovery, generated JavaScript, web search, or file retrieval through the provider.

Prompt 73 renders returned URL citations as clickable source links. Prompt 74 requires an OpenAI-hosted vector store for live retrieval. Its README documents uploading the bundled teaching handbook, waiting for indexing, reusing setup, and cleaning up owned resources. Store the resulting VECTOR_STORE_ID in that app’s .env.

Record the entire new batch from apps.

```powershell
npm run record:control
```

## Prompts 75–84

The new lessons demonstrate retrieval controls, SQLite RAG with tenant authorization, validated CSV analysis, stored image results, hosted container reuse, an isolated Playwright computer adapter, and MCP connections. Classroom hosted operations use injected provider responses. SQLite queries, artifact storage, browser actions, stdio subprocesses, HTTP MCP calls and authentication checks execute locally.

Prompt 75 includes a setup command for six attributed vector-store documents. Prompt 76 uses embedded SQLite with synthetic data. Prompts 77 and 79 create owned hosted containers during live execution and report cleanup outcomes. Prompt 78 extracts actual image-generation results in live mode and displays stored image files. Prompt 80 verifies browser actions using real screenshots and a local counter.

Prompts 81–84 include a minimal teaching MCP server for stdio and Streamable HTTP. The private transport uses an ephemeral bearer credential. Hosted MCP live execution in Prompt 83 requires your public timetable server URL. Live paths for this batch have not been tested against a paid account.

```powershell
npm run lesson:75
npm run record:hosted
```

## Prompts 85–94

These lessons demonstrate MCP tool filtering, session-aware tool-list caching and invalidation, real connection failures and request deadlines, explicit MCP resources and prompt templates, specialist handoffs, agent-as-tool ownership, routing descriptions, validated handoff metadata, callbacks and filtered history. Every classroom scenario executes the installed SDK with controlled model decisions where inference is involved.

Prompts 86 and 87 perform local transport operations without model inference. The HTTP fixture awaits pending request handlers during cleanup. Prompt 88 uses the Agents SDK for resources and the pinned MCP client for prompt methods. MCP client 2.4.0 and Agents core 0.21.0 are now explicit pinned dependencies.

Prompt 92 rejects invalid metadata before its callback runs. Prompt 94 retains the invoice ID and amount while filtering unrelated history and tool pairs. SDK handoff events retain evidence of the ownership transfer when those tool items are removed from model history. All support cases, identities and notes are synthetic teaching data. Live paths for this batch have not been verified against a paid account.

```powershell
npm ci
npm run lesson:85
npm run record:handoffs
```


## Applications through prompt 200

Prompts 95–200 are available as standalone applications with scenario comparisons, execution evidence and recording commands.

```powershell
Set-Location '.\apps'
npm run lesson:95
# Select any lesson through 200
npm run lesson:200
```

The default port is 3100 plus the prompt number. Prompt 200 uses http://localhost:3300.

See [the integration guide](foundations-runtime/course/README.md) for all new groups, persistent storage, the ChatKit companion, live voice clients, Docker, Codex delegation and teaching-video commands.
