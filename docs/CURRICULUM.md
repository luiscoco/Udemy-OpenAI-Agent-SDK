# Course curriculum

[Course home](../README.md) · [Student setup guide](GETTING_STARTED.md)

**23 sections · 180 core lessons · Prompt numbers match the applications and course videos.**

Run Prompts 2–180 from `apps` with `npm run lesson:NUMBER`. Their default port is `3100 + NUMBER`. Prompt 1 has a standalone install; follow the setup guide.

Each lesson combines an implementation prompt, a runnable application, a code walkthrough, execution evidence, and a knowledge check.

## Section 1: Getting Started with the OpenAI Agents SDK

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 1 | [OpenAI product map](../apps/prompt-001-product-map/) | Compare the developer products and locate the agent orchestration boundary. |
| 2 | [Language support](../apps/prompt-002-language-support/) | Compare Python and TypeScript, follow the same task, and inspect their idiomatic APIs. |
| 3 | [Project bootstrap](../apps/prompt-003-project-bootstrap/) | Inspect a minimal project, verify package releases, and download a runnable starter. |
| 4 | [Authentication](../apps/prompt-004-authentication/) | Reproduce credential errors, inspect the recovery steps, and probe your server configuration. |
| 5 | [First agent](../apps/prompt-005-first-agent/) | Define a tutor, send a question, and follow the result through to the console. |
| 6 | [Agent loop](../apps/prompt-006-agent-loop/) | Look up a club activity using a real local function, then inspect each stage of the loop. |
| 7 | [Project organization](../apps/prompt-007-project-organization/) | Explore working modules for configuration, agents, tools, application services, and tests. |
| 8 | [Troubleshooting](../apps/prompt-008-troubleshooting/) | Diagnose installation, import, model, authentication, and configuration failures. |

## Section 2: Agent Identity and Instruction Design

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 9 | [Agent identity](../apps/prompt-009-agent-identity/) | Define a tutor's name, responsibility, boundaries, and response style, then test relevant and unrelated requests. |
| 10 | [Instruction design](../apps/prompt-010-instruction-design/) | Build instructions around a goal, available facts, permitted actions, and completion criteria. |
| 11 | [Examples in instructions](../apps/prompt-011-examples-in-instructions/) | Inspect three labeled examples and compare two agents on the same support ticket. |
| 12 | [Dynamic instructions](../apps/prompt-012-dynamic-instructions/) | Resolve an actual SDK callback using a sample user, language, and application context. |
| 13 | [Prompt versioning](../apps/prompt-013-stored-prompts/) | Compare versioned prompt builders with the installed SDK's legacy hosted-prompt reference. |
| 14 | [Reusable definitions](../apps/prompt-014-reusable-definitions/) | Use the actual SDK clone method and inspect the base and customized definitions. |
| 15 | [Clarification behavior](../apps/prompt-015-clarification-behavior/) | Test a workshop planner with incomplete and complete audience and duration requirements. |
| 16 | [Configuration reference](../apps/prompt-016-configuration-reference/) | Inspect public Agent fields, construct examples, and distinguish run-level settings. |

## Section 3: Context, Dependencies, and Authorization

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 17 | [Typed context](../apps/prompt-017-typed-context/) | Validate user, tenant, preferences, and request metadata before using typed SDK context. |
| 18 | [Dependencies](../apps/prompt-018-dependencies/) | Pass local database, API, and logging adapters through SDK context and inspect their use. |
| 19 | [Context visibility](../apps/prompt-019-context-visibility/) | Capture actual requests to a local model adapter and inspect explicit visibility channels. |
| 20 | [Authorization](../apps/prompt-020-authorization/) | Use tenant-scoped lookups to allow or deny a requested document in the classroom dataset. |
| 21 | [Personalization](../apps/prompt-021-personalization/) | Convert a workshop time and adapt language and detail using focused instructions. |
| 22 | [Shared context](../apps/prompt-022-shared-context/) | Compare real SDK handoffs, nested shared context, and nested copied context. |
| 23 | [Tool-call context](../apps/prompt-023-tool-call-context/) | Read the installed SDK's ToolCallDetails and log a small allowlist of metadata. |
| 24 | [Dependency lifecycle](../apps/prompt-024-dependency-lifecycle/) | Inspect initialization, successful execution, failure, cancellation, and finally cleanup. |

## Section 4: Structured Outputs and Multimodal Inputs

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 25 | [Python structured output](../apps/prompt-025-python-structured-output/) | The SDK validates the final object with strict Pydantic validation and rejects numeric strings. |
| 26 | [TypeScript structured output](../apps/prompt-026-typescript-structured-output/) | z.number() requires a number. This lesson does not enable coercion. |
| 27 | [Complex output schemas](../apps/prompt-027-complex-output-schemas/) | Nullable permits null. The field still needs to be present in this schema. |
| 28 | [Business validation](../apps/prompt-028-business-validation/) | A structurally valid string can still contain an impossible date or an unverified evidence ID. |
| 29 | [Incomplete results](../apps/prompt-029-incomplete-results/) | Check interruptions, refusals, provider completion, and schema validation before consumption. |
| 30 | [Image understanding](../apps/prompt-030-image-understanding/) | Classroom responses are scripted. The actual PNG is attached through the SDK in both modes. |
| 31 | [Document inputs](../apps/prompt-031-document-inputs/) | PDF processing includes text and page images. Endpoint size and model context limits still apply. |
| 32 | [Multimodal tool results](../apps/prompt-032-multimodal-tool-results/) | The actual SDK tool returns the selected modality and the adapter captures its forwarding. |

## Section 5: Models, Settings, and API Integration

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 33 | [Model selection](../apps/prompt-033-model-selection/) | The isolated run captures the resolved model in the actual provider request. |
| 34 | [Generation settings](../apps/prompt-034-generation-settings/) | The compatibility profile checks the requested combination before transmission. |
| 35 | [Reasoning settings](../apps/prompt-035-reasoning-settings/) | Run the same calculation with two supported configurations and inspect correctness, usage, and elapsed time. |
| 36 | [Mixed-model workflow](../apps/prompt-036-mixed-model-workflow/) | Observe which model a router selects and compare its extra call with direct capable-model execution. |
| 37 | [API compatibility](../apps/prompt-037-api-compatibility/) | Execute Responses and Chat Completions adapters and inspect their requests and capability checks. |
| 38 | [Alternative providers](../apps/prompt-038-alternative-providers/) | Connect the SDK to a separate OpenAI-compatible HTTP server and exercise tools, schemas, streaming, and usage reporting. |
| 39 | [Custom model integration](../apps/prompt-039-custom-model-integration/) | A TypeScript controlled backend implements complete and streaming responses through the installed SDK interfaces. |
| 40 | [Responses WebSocket transport](../apps/prompt-040-responses-websocket-transport/) | Two actual SDK runs use a local WebSocket endpoint. Inspect connection IDs and cleanup. |

## Section 6: Execution, Results, and Usage

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 41 | [Execution methods](../apps/prompt-041-execution-methods/) | Run TypeScript asynchronous execution and actual Python asynchronous or synchronous execution. |
| 42 | [Turn limits](../apps/prompt-042-turn-limits/) | The agent needs two tool lookups and a final model answer. Observe the SDK stop at lower budgets. |
| 43 | [Run configuration](../apps/prompt-043-run-configuration/) | Follow a real handoff and inspect the effective model and settings received by each adapter. |
| 44 | [Result properties](../apps/prompt-044-result-properties/) | Read actual result getters after handoff, explicit-history continuation, or approval interruption. |
| 45 | [Run items](../apps/prompt-045-run-items/) | newItems contains typed SDK records with agent ownership. history contains replay-ready model input. |
| 46 | [Usage accounting](../apps/prompt-046-usage-accounting/) | These nested runs own separate usage contexts. Deduplicate response IDs and aggregate each response once. |
| 47 | [SDK exceptions](../apps/prompt-047-sdk-exceptions/) | Map known installed SDK classes to useful errors and propagate unexpected failures. |
| 48 | [Manual continuation](../apps/prompt-048-manual-continuation/) | The SDK history preserves earlier messages and model records for application-managed continuation. |

## Section 7: Streaming and Interactive Applications

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 49 | [Text streaming](../apps/prompt-049-text-streaming/) | toTextStream yields incremental text. Await completion before consuming final output and usage. |
| 50 | [Event categories](../apps/prompt-050-event-categories/) | Raw events supply model data. Higher-level SDK events describe agents, tools, handoffs and run items. |
| 51 | [Agent changes](../apps/prompt-051-agent-changes/) | Track active-agent updates and handoff progress from supported SDK stream events. |
| 52 | [Tool progress](../apps/prompt-052-tool-progress/) | Runner hooks report tool start and end. The application wrapper reports failure and preserves the SDK error. A tool-end hook can also follow failure. |
| 53 | [Completion handling](../apps/prompt-053-completion-handling/) | Partial text may precede a failure. Await completion and check success before reading final results or saving state. |
| 54 | [Cancellation](../apps/prompt-054-cancellation/) | Use an AbortController signal and await stream settlement and backend cleanup before closing resources. |
| 55 | [Streaming interruptions](../apps/prompt-055-streaming-interruptions/) | Wait for the stream to settle, preserve RunState, and resume the same run after resolving approvals. |
| 56 | [Web streaming](../apps/prompt-056-web-streaming/) | A client disconnect propagates cancellation to the owned run. Stream and backend settlement precede resource cleanup. |

## Section 8: Building Function Tools

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 57 | [First function tool](../apps/prompt-057-first-function-tool/) | The SDK invokes application code when the model calls the registered calculator capability. |
| 58 | [Argument schemas](../apps/prompt-058-argument-schemas/) | Constrained enums, bounded integers and documented formats validate model-supplied arguments before application work. |
| 59 | [Tool descriptions](../apps/prompt-059-tool-descriptions/) | Tool metadata communicates the capability and when it should be selected. Actual model choices can vary. |
| 60 | [External API tool](../apps/prompt-060-external-api-tool/) | Send credentials through the configured client, enforce deadlines and expose actionable public errors. |
| 61 | [Database tool](../apps/prompt-061-database-tool/) | Bind SQL parameters and derive tenant identity from server-owned context. The tool accepts only a record ID. |
| 62 | [Tool return values](../apps/prompt-062-tool-return-values/) | The structured path validates its output before forwarding it. Inspect the actual model-visible representation. |
| 63 | [Tool failures](../apps/prompt-063-tool-failures/) | Use a configured error handler or an application exception boundary to keep internal diagnostics server-side. |
| 64 | [Tool timeouts](../apps/prompt-064-tool-timeouts/) | Per-tool timeout behavior controls deadline handling. A retry is a separate explicit application decision. |

## Section 9: Controlling Tool Execution

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 65 | [Tool choice](../apps/prompt-065-tool-choice/) | Tool choice is sent through modelSettings. The SDK resets a forced choice after use by default. |
| 66 | [Stopping after tools](../apps/prompt-066-stopping-after-tools/) | toolUseBehavior controls completion after function tools. |
| 67 | [Custom completion policy](../apps/prompt-067-custom-completion-policy/) | The callback returns isFinalOutput and supplies finalOutput when finishing. |
| 68 | [Conditional availability](../apps/prompt-068-conditional-availability/) | Availability controls exposure. Current application permissions govern resource access. |
| 69 | [Concurrency](../apps/prompt-069-concurrency/) | Run options can bound local function-tool execution independently of provider parallelToolCalls. |
| 70 | [Repeated-call prevention](../apps/prompt-070-repeated-call-prevention/) | resetToolChoice permits a subsequent response to finish. maxTurns bounds repeated-call failure. |
| 71 | [Deferred discovery](../apps/prompt-071-deferred-discovery/) | The installed SDK supports hosted tool search, deferred functions and namespaces. |
| 72 | [Programmatic tool calling](../apps/prompt-072-programmatic-tool-calling/) | allowedCallers controls direct and programmatic eligibility. Child calls retain caller metadata. |

## Section 10: Search, Retrieval, and Hosted Tools

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 73 | [Web search](../apps/prompt-073-web-search/) | The interface renders actual returned citation annotations as usable source links. |
| 74 | [File search](../apps/prompt-074-file-search/) | Configure a vector store with indexed files, then pass its ID to fileSearchTool. |
| 75 | [Retrieval controls](../apps/prompt-075-retrieval-controls/) | File attribute filters constrain retrieval. Returned evidence and citations show what the provider used. |
| 76 | [Custom RAG](../apps/prompt-076-custom-rag/) | The tool binds the tenant from application context to its SQLite query and reports insufficient evidence for empty results. |
| 77 | [Code Interpreter](../apps/prompt-077-code-interpreter/) | The application compares totals and means against the source CSV before offering its generated file. |
| 78 | [Image generation](../apps/prompt-078-image-generation/) | The application decodes returned base64, verifies its format and serves a stored artifact. |
| 79 | [Hosted shell](../apps/prompt-079-hosted-shell/) | The application configures container input files and network policy, then passes a container reference to shellTool. |
| 80 | [Computer use](../apps/prompt-080-computer-use/) | A fresh browser context runs a local counter page. Screenshots and the actual counter verify SDK-dispatched actions. |

## Section 11: Model Context Protocol — MCP

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 81 | [Local MCP](../apps/prompt-081-local-mcp/) | The SDK starts a local MCP subprocess, discovers its timetable tool and closes the connection after the run. |
| 82 | [Remote MCP](../apps/prompt-082-remote-mcp/) | The SDK exchanges MCP JSON-RPC requests with a separate loopback HTTP server and closes both owned resources. |
| 83 | [Hosted MCP](../apps/prompt-083-hosted-mcp/) | SDK-managed MCP runs through the application connection. Hosted MCP sends a public server definition to the provider. |
| 84 | [MCP authentication](../apps/prompt-084-mcp-authentication/) | A private server checks the transport header before discovery. Model-visible requests contain only the timetable task and results. |
| 85 | [Tool filtering](../apps/prompt-085-tool-filtering/) | Static and context filters select exposed MCP capabilities. Resource permissions remain enforced inside implementations. |
| 86 | [Tool-list caching](../apps/prompt-086-tool-list-caching/) | In this installed SDK, HTTP tool-list caching is tied to a session. The fixture supplies a session ID to demonstrate invalidation. |
| 87 | [Connection failures](../apps/prompt-087-connection-failures/) | The exercise observes real refused connections, request deadlines and a server restart. Owned clients and servers close after the attempt. |
| 88 | [Prompts and resources](../apps/prompt-088-prompts-and-resources/) | Resources contain application data and prompts contain reusable messages. Their contents are included through an explicit application decision. |

## Section 12: Handoffs and Specialist Ownership

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 89 | [First handoff](../apps/prompt-089-first-handoff/) | The SDK transfers conversation ownership to the receiving specialist and reports its identity through lastAgent. |
| 90 | [Ownership comparison](../apps/prompt-090-ownership-comparison/) | A handoff transfers ownership. An agent-as-tool returns a bounded specialist result to the manager. |
| 91 | [Routing descriptions](../apps/prompt-091-routing-descriptions/) | Specific names and descriptions clarify routing. Classroom ambiguous decisions are controlled examples, and live choices can vary. |
| 92 | [Handoff metadata](../apps/prompt-092-handoff-metadata/) | inputType validates handoff arguments before the callback runs. Metadata supplements the fixed destination and application context. |
| 93 | [Handoff callbacks](../apps/prompt-093-handoff-callbacks/) | The supported onHandoff callback records the actual routing event before the receiving agent starts. |
| 94 | [History filtering](../apps/prompt-094-history-filtering/) | The filter retains the invoice and amount and removes unrelated history plus tool-history pairs through the supported helper. |
| 95 | [Conditional handoffs](../apps/prompt-095-conditional-handoffs/) | Enable or disable specialist handoffs based on authenticated context and supported SDK configuration. |
| 96 | [Next-turn ownership](../apps/prompt-096-next-turn-ownership/) | Continue the next user turn with the last specialist when that agent should remain responsible. |

## Section 13: Multi-Agent Orchestration Patterns

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 97 | [Manager and specialists](../apps/prompt-097-manager-and-specialists/) | Create a manager agent that calls specialist agents as tools and synthesizes their results. |
| 98 | [Specialist contracts](../apps/prompt-098-specialist-contracts/) | Define structured inputs and output extraction for an agent exposed as a tool. |
| 99 | [Sequential workflow](../apps/prompt-099-sequential-workflow/) | Build a research, drafting, and review sequence with explicit data contracts between stages. |
| 100 | [Parallel workflow](../apps/prompt-100-parallel-workflow/) | Run independent specialists concurrently, collect their results, and handle partial failures. |
| 101 | [Deterministic routing](../apps/prompt-101-deterministic-routing/) | Route requests with application logic when rules are clear, and use model routing only where needed. |
| 102 | [Planner and executor](../apps/prompt-102-planner-and-executor/) | Build a planner that produces a structured task list and an executor that reports completion evidence. |
| 103 | [Evaluator and optimizer](../apps/prompt-103-evaluator-and-optimizer/) | Build a bounded draft-review-revise loop with explicit success criteria and a maximum number of iterations. |
| 104 | [State machine](../apps/prompt-104-state-machine/) | Implement an agent workflow as explicit application states with validated transitions and recoverable failure states. |

## Section 14: Sessions, Conversation History, and Memory

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 105 | [SDK session](../apps/prompt-105-sdk-session/) | Implement a multi-turn conversation using a session backend supported by my selected SDK. |
| 106 | [Persistent storage](../apps/prompt-106-persistent-storage/) | Persist conversation history across process restarts using an appropriate documented session backend. |
| 107 | [Session operations](../apps/prompt-107-session-operations/) | Demonstrate supported session operations for retrieving, adding, correcting, and clearing conversation items. |
| 108 | [Custom session backend](../apps/prompt-108-custom-session-backend/) | Implement the SDK session interface using my application’s database and test concurrent access. |
| 109 | [Server-managed continuation](../apps/prompt-109-server-managed-continuation/) | Compare Conversations-based state and response-ID chaining in separate examples, checking incompatible combinations with SDK sessions. |
| 110 | [Context compaction](../apps/prompt-110-context-compaction/) | Add supported compaction or context management and verify that important task state survives. |
| 111 | [Long-term application memory](../apps/prompt-111-long-term-application-memory/) | Build an explicit memory store for user-approved facts, with retrieval, correction, deletion, and tenant isolation. |
| 112 | [History selection](../apps/prompt-112-history-selection/) | Limit or summarize conversation history while preserving valid tool-call relationships and necessary task context. |

## Section 15: Guardrails and Validation

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 113 | [Input guardrail](../apps/prompt-113-input-guardrail/) | Create a blocking input guardrail that rejects requests outside the application’s supported scope. |
| 114 | [Output guardrail](../apps/prompt-114-output-guardrail/) | Validate a final answer against application requirements and handle a triggered output guardrail. |
| 115 | [Tool-input guardrail](../apps/prompt-115-tool-input-guardrail/) | Validate tool arguments before a supported function tool executes. |
| 116 | [Tool-output guardrail](../apps/prompt-116-tool-output-guardrail/) | Check a function tool’s output before the agent uses it in subsequent reasoning. |
| 117 | [Model-based guardrail](../apps/prompt-117-model-based-guardrail/) | Implement a guardrail using a separate classifier agent and a structured decision. |
| 118 | [Parallel versus blocking](../apps/prompt-118-parallel-versus-blocking/) | Compare parallel and blocking input guardrails, showing when speculative work can begin. |
| 119 | [Guardrail scope](../apps/prompt-119-guardrail-scope/) | Demonstrate exactly which guardrails run before handoffs, after handoffs, and around nested tool-agent calls. |
| 120 | [Streaming validation](../apps/prompt-120-streaming-validation/) | Design output validation for streaming and explain what must be buffered before being shown to users. |

## Section 16: Human Approval and Resumable Execution

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 121 | [Approval-required tool](../apps/prompt-121-approval-required-tool/) | Create a tool that pauses for approval before making a change to an external system. |
| 122 | [Conditional approval](../apps/prompt-122-conditional-approval/) | Require approval only when a tool’s arguments meet a specified application policy. |
| 123 | [Approve or reject](../apps/prompt-123-approve-or-reject/) | Implement both approval and rejection paths and show how the agent responds to each decision. |
| 124 | [Persisted pause](../apps/prompt-124-persisted-pause/) | Serialize a paused run, store it, and restore it in another process before resuming. |
| 125 | [Nested approvals](../apps/prompt-125-nested-approvals/) | Demonstrate an approval interruption inside a specialist tool-agent and after a handoff. |
| 126 | [Multiple pending actions](../apps/prompt-126-multiple-pending-actions/) | Review several pending tool calls individually and resume only after their decisions are resolved. |
| 127 | [Review interface](../apps/prompt-127-review-interface/) | Build a review screen showing the proposed action, exact arguments, approving identity, and decision outcome. |
| 128 | [Safe resumption](../apps/prompt-128-safe-resumption/) | Revalidate authorization before resumed actions and prevent duplicate side effects with application-level idempotency. |

## Section 17: Sandbox Agents and Workspaces

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 129 | [First sandbox agent](../apps/prompt-129-first-sandbox-agent/) | Create a minimal SandboxAgent that reads an input file and writes a result into its workspace. |
| 130 | [Workspace manifest](../apps/prompt-130-workspace-manifest/) | Define a manifest containing input files, directories, environment configuration, and an output location. |
| 131 | [Sandbox providers](../apps/prompt-131-sandbox-providers/) | Compare supported local, Docker, and hosted sandbox clients, including their isolation and lifecycle responsibilities. |
| 132 | [Repository workspace](../apps/prompt-132-repository-workspace/) | Initialize a sandbox from a repository and supply task instructions through workspace files. |
| 133 | [Storage mounts](../apps/prompt-133-storage-mounts/) | Mount supported external storage with narrowly scoped access and verify where output files are persisted. |
| 134 | [Runtime boundaries](../apps/prompt-134-runtime-boundaries/) | Configure sandbox network access and credentials while keeping application control-plane secrets outside the workspace. |
| 135 | [Artifacts and previews](../apps/prompt-135-artifacts-and-previews/) | Retrieve generated artifacts and expose a preview port using the selected sandbox provider. |
| 136 | [State and snapshots](../apps/prompt-136-state-and-snapshots/) | Compare live sandbox reuse, serialized sandbox state, filesystem snapshots, and the agent’s resumable RunState. |

## Section 18: Sandbox Capabilities, Skills, and Memory

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 137 | [Shell capability](../apps/prompt-137-shell-capability/) | Enable sandbox shell execution and demonstrate command output, failure handling, and supported interactive processes. |
| 138 | [Filesystem capability](../apps/prompt-138-filesystem-capability/) | Use sandbox filesystem capabilities to apply a patch and inspect an image generated during the task. |
| 139 | [Reusable skills](../apps/prompt-139-reusable-skills/) | Create a reusable skill containing instructions, scripts, and references, then load it into a sandbox agent. |
| 140 | [Skill discovery](../apps/prompt-140-skill-discovery/) | Compare eager skill loading with supported lazy discovery for a larger skill collection. |
| 141 | [Sandbox memory](../apps/prompt-141-sandbox-memory/) | Demonstrate supported memory modes and distinguish reusable memory artifacts from conversation history. |
| 142 | [Sandbox compaction](../apps/prompt-142-sandbox-compaction/) | Configure compaction for a long sandbox task and verify that workspace references remain usable. |
| 143 | [Custom capabilities](../apps/prompt-143-custom-capabilities/) | Implement a custom sandbox capability that adds a narrowly defined tool and its supporting instructions. |
| 144 | [Capability configuration](../apps/prompt-144-capability-configuration/) | Customize the capability list while preserving required defaults, dependencies, and cleanup behavior. |

## Section 19: Tracing, Hooks, and Observability

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 145 | [First trace](../apps/prompt-145-first-trace/) | Run an agent and inspect its trace to explain the sequence of model and tool activity. |
| 146 | [Workflow grouping](../apps/prompt-146-workflow-grouping/) | Group several related agent runs into one trace with useful workflow and conversation metadata. |
| 147 | [Custom spans](../apps/prompt-147-custom-spans/) | Add custom spans around retrieval and application services so their latency is visible alongside agent activity. |
| 148 | [Run hooks](../apps/prompt-148-run-hooks/) | Implement supported run-lifecycle hooks and demonstrate the order in which they execute. |
| 149 | [Agent hooks](../apps/prompt-149-agent-hooks/) | Attach agent-specific lifecycle hooks and compare their scope with workflow-level hooks. |
| 150 | [Trace controls](../apps/prompt-150-trace-controls/) | Configure trace export and sensitive-data handling using the selected SDK’s supported tracing controls. |
| 151 | [Operational metrics](../apps/prompt-151-operational-metrics/) | Report latency, token usage, tool failures, handoff frequency, and estimated cost using observable run data. |
| 152 | [Workflow visualization](../apps/prompt-152-workflow-visualization/) | Visualize the agent-and-handoff structure using a supported SDK utility or a graph generated from application configuration. |

## Section 20: Realtime Speech-to-Speech Agents

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 153 | [Browser voice agent](../apps/prompt-153-browser-voice-agent/) | Build a TypeScript realtime voice agent using WebRTC and an ephemeral credential issued by my backend. |
| 154 | [Server voice connection](../apps/prompt-154-server-voice-connection/) | Run a realtime agent through a supported server WebSocket integration and explain its audio-handling responsibilities. |
| 155 | [Turn detection](../apps/prompt-155-turn-detection/) | Compare server VAD, semantic VAD, and manual turn control for supported realtime models. |
| 156 | [Interruptions](../apps/prompt-156-interruptions/) | Implement user interruption handling so audio playback and conversation history remain consistent. |
| 157 | [Realtime tools](../apps/prompt-157-realtime-tools/) | Add a private order-lookup tool to a voice agent while keeping execution and credentials on the backend. |
| 158 | [Voice handoffs](../apps/prompt-158-voice-handoffs/) | Transfer a spoken conversation between specialists while preserving relevant context. |
| 159 | [Realtime events](../apps/prompt-159-realtime-events/) | Display transcripts, session status, tool progress, and conversation updates using documented realtime events. |
| 160 | [Voice controls](../apps/prompt-160-voice-controls/) | Add supported realtime guardrails and approval handling, explaining limitations once audio has already played. |

## Section 21: Voice Pipelines and Integrations

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 161 | [Python voice pipeline](../apps/prompt-161-python-voice-pipeline/) | Create a Python VoicePipeline that connects speech recognition, an existing agent, and speech generation. |
| 162 | [Streaming audio input](../apps/prompt-162-streaming-audio-input/) | Process supported streaming audio input and stream the resulting speech back to the application. |
| 163 | [Speech recognition](../apps/prompt-163-speech-recognition/) | Configure transcription language and relevant recognition settings, then evaluate errors on representative recordings. |
| 164 | [Speech generation](../apps/prompt-164-speech-generation/) | Configure supported voice and speech-output settings and measure time to first audio. |
| 165 | [Custom voice workflow](../apps/prompt-165-custom-voice-workflow/) | Create a custom voice workflow around several agents while retaining access to intermediate text. |
| 166 | [GPT-Live integration](../apps/prompt-166-gpt-live-integration/) | Connect GPT-Live through client delegation to my existing Agents SDK backend and preserve its authorization rules. |
| 167 | [Server-side control](../apps/prompt-167-server-side-control/) | Attach supported server-side voice controls and prevent duplicate execution when events are replayed or delivered twice. |
| 168 | [Telephony integration](../apps/prompt-168-telephony-integration/) | Connect an agent workflow to a supported telephony transport and handle call lifecycle, cancellation, and connection failures. |

## Section 22: Testing and Evaluation

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 169 | [Deterministic model tests](../apps/prompt-169-deterministic-model-tests/) | Test agent orchestration using a scripted or fake model, preferring documented SDK testing helpers when available. |
| 170 | [Tool unit tests](../apps/prompt-170-tool-unit-tests/) | Test tool validation, authorization, successful results, and failures without making paid model calls. |
| 171 | [Routing tests](../apps/prompt-171-routing-tests/) | Test that representative requests reach the correct specialist and preserve the expected conversation ownership. |
| 172 | [Approval tests](../apps/prompt-172-approval-tests/) | Test approval, rejection, timeout, serialization, and resumption paths without performing real external writes. |
| 173 | [Streaming and runtime tests](../apps/prompt-173-streaming-and-runtime-tests/) | Use supported test doubles to verify streaming, sandbox, realtime, or voice behavior relevant to this application. |
| 174 | [Evaluation dataset](../apps/prompt-174-evaluation-dataset/) | Create a representative evaluation dataset containing normal tasks, ambiguous requests, missing information, and failure cases. |
| 175 | [Trace evaluation](../apps/prompt-175-trace-evaluation/) | Evaluate whether the workflow chose appropriate tools, made correct handoffs, and respected its instructions. |
| 176 | [Regression comparison](../apps/prompt-176-regression-comparison/) | Compare prompt or model versions on task success, latency, cost, and failure rate before adopting a change. |

## Section 23: Reliability and Background Execution

| Prompt | Lesson and application | Practice focus |
| --- | --- | --- |
| 177 | [Retry policy](../apps/prompt-177-retry-policy/) | Configure SDK and application retries together, avoiding duplicated retry layers and repeated external side effects. |
| 178 | [Timeout policy](../apps/prompt-178-timeout-policy/) | Set model, tool, and overall request timeouts, and verify cleanup when each deadline expires. |
| 179 | [Execution budgets](../apps/prompt-179-execution-budgets/) | Enforce application budgets for time, turns, tool calls, and spending, distinguishing estimates from hard limits. |
| 180 | [Background jobs](../apps/prompt-180-background-jobs/) | Run agent work in a queue worker with job identifiers, cancellation, and idempotent result handling. |

## Supplementary applications

Applications 181–200 are included for independent exploration, outside the 180-lesson core course and its video numbering. Run them with `npm run lesson:181` through `npm run lesson:200`.
