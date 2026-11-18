# Course curriculum

[Course home](../README.md) · [Student setup guide](GETTING_STARTED.md)

**23 sections · 180 core lessons · Prompt numbers match the applications and course videos.**

Run Prompts 1–180 from `apps` with `npm run lesson:NUMBER`. Their default port is `3100 + NUMBER`. All prompts use the same launcher and src/application.mjs folder layout.

Each lesson combines an implementation prompt, a runnable application, a code walkthrough, execution evidence, and a knowledge check.

## Section 1: Getting Started with the OpenAI Agents SDK

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 1 | [OpenAI product map](../apps/prompt-001-product-map/) | [Implementation](../apps/prompt-001-product-map/src/adapters/agents-sdk.mjs) | Compare the developer products and locate the agent orchestration boundary. |
| 2 | [Language support](../apps/prompt-002-language-support/) | [Implementation](../apps/prompt-002-language-support/src/execute.mjs) | Compare Python and TypeScript, follow the same task, and inspect their idiomatic APIs. |
| 3 | [Project bootstrap](../apps/prompt-003-project-bootstrap/) | [Implementation](../apps/prompt-003-project-bootstrap/src/execute.mjs) | Inspect a minimal project, verify package releases, and download a runnable starter. |
| 4 | [Authentication](../apps/prompt-004-authentication/) | [Implementation](../apps/prompt-004-authentication/src/execute.mjs) | Reproduce credential errors, inspect the recovery steps, and probe your server configuration. |
| 5 | [First agent](../apps/prompt-005-first-agent/) | [Implementation](../apps/prompt-005-first-agent/src/execute.mjs) | Define a tutor, send a question, and follow the result through to the console. |
| 6 | [Agent loop](../apps/prompt-006-agent-loop/) | [Implementation](../apps/prompt-006-agent-loop/src/execute.mjs) | Look up a club activity using a real local function, then inspect each stage of the loop. |
| 7 | [Project organization](../apps/prompt-007-project-organization/) | [Implementation](../apps/prompt-007-project-organization/src/execute.mjs) | Explore working modules for configuration, agents, tools, application services, and tests. |
| 8 | [Troubleshooting](../apps/prompt-008-troubleshooting/) | [Implementation](../apps/prompt-008-troubleshooting/src/execute.mjs) | Diagnose installation, import, model, authentication, and configuration failures. |

## Section 2: Agent Identity and Instruction Design

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 9 | [Agent identity](../apps/prompt-009-agent-identity/) | [Implementation](../apps/prompt-009-agent-identity/src/identity-lesson.mjs) | Define a tutor's name, responsibility, boundaries, and response style, then test relevant and unrelated requests. |
| 10 | [Instruction design](../apps/prompt-010-instruction-design/) | [Implementation](../apps/prompt-010-instruction-design/src/definition-lessons.mjs) | Build instructions around a goal, available facts, permitted actions, and completion criteria. |
| 11 | [Examples in instructions](../apps/prompt-011-examples-in-instructions/) | [Implementation](../apps/prompt-011-examples-in-instructions/src/definition-lessons.mjs) | Inspect three labeled examples and compare two agents on the same support ticket. |
| 12 | [Dynamic instructions](../apps/prompt-012-dynamic-instructions/) | [Implementation](../apps/prompt-012-dynamic-instructions/src/definition-lessons.mjs) | Resolve an actual SDK callback using a sample user, language, and application context. |
| 13 | [Prompt versioning](../apps/prompt-013-stored-prompts/) | [Implementation](../apps/prompt-013-stored-prompts/src/definition-lessons.mjs) | Compare versioned prompt builders with the installed SDK's legacy hosted-prompt reference. |
| 14 | [Reusable definitions](../apps/prompt-014-reusable-definitions/) | [Implementation](../apps/prompt-014-reusable-definitions/src/definition-lessons.mjs) | Use the actual SDK clone method and inspect the base and customized definitions. |
| 15 | [Clarification behavior](../apps/prompt-015-clarification-behavior/) | [Implementation](../apps/prompt-015-clarification-behavior/src/definition-lessons.mjs) | Test a workshop planner with incomplete and complete audience and duration requirements. |
| 16 | [Configuration reference](../apps/prompt-016-configuration-reference/) | [Implementation](../apps/prompt-016-configuration-reference/src/definition-lessons.mjs) | Inspect public Agent fields, construct examples, and distinguish run-level settings. |

## Section 3: Context, Dependencies, and Authorization

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 17 | [Typed context](../apps/prompt-017-typed-context/) | [Implementation](../apps/prompt-017-typed-context/src/context-execution.mjs) | Validate user, tenant, preferences, and request metadata before using typed SDK context. |
| 18 | [Dependencies](../apps/prompt-018-dependencies/) | [Implementation](../apps/prompt-018-dependencies/src/context-execution.mjs) | Pass local database, API, and logging adapters through SDK context and inspect their use. |
| 19 | [Context visibility](../apps/prompt-019-context-visibility/) | [Implementation](../apps/prompt-019-context-visibility/src/context-execution.mjs) | Capture actual requests to a local model adapter and inspect explicit visibility channels. |
| 20 | [Authorization](../apps/prompt-020-authorization/) | [Implementation](../apps/prompt-020-authorization/src/context-execution.mjs) | Use tenant-scoped lookups to allow or deny a requested document in the classroom dataset. |
| 21 | [Personalization](../apps/prompt-021-personalization/) | [Implementation](../apps/prompt-021-personalization/src/context-execution.mjs) | Convert a workshop time and adapt language and detail using focused instructions. |
| 22 | [Shared context](../apps/prompt-022-shared-context/) | [Implementation](../apps/prompt-022-shared-context/src/context-execution.mjs) | Compare real SDK handoffs, nested shared context, and nested copied context. |
| 23 | [Tool-call context](../apps/prompt-023-tool-call-context/) | [Implementation](../apps/prompt-023-tool-call-context/src/context-execution.mjs) | Read the installed SDK's ToolCallDetails and log a small allowlist of metadata. |
| 24 | [Dependency lifecycle](../apps/prompt-024-dependency-lifecycle/) | [Implementation](../apps/prompt-024-dependency-lifecycle/src/context-execution.mjs) | Inspect initialization, successful execution, failure, cancellation, and finally cleanup. |

## Section 4: Structured Outputs and Multimodal Inputs

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 25 | [Python structured output](../apps/prompt-025-python-structured-output/) | [Implementation](../apps/prompt-025-python-structured-output/src/structured-execution.mjs) | The SDK validates the final object with strict Pydantic validation and rejects numeric strings. |
| 26 | [TypeScript structured output](../apps/prompt-026-typescript-structured-output/) | [Implementation](../apps/prompt-026-typescript-structured-output/src/structured-execution.mjs) | z.number() requires a number. This lesson does not enable coercion. |
| 27 | [Complex output schemas](../apps/prompt-027-complex-output-schemas/) | [Implementation](../apps/prompt-027-complex-output-schemas/src/structured-execution.mjs) | Nullable permits null. The field still needs to be present in this schema. |
| 28 | [Business validation](../apps/prompt-028-business-validation/) | [Implementation](../apps/prompt-028-business-validation/src/structured-execution.mjs) | A structurally valid string can still contain an impossible date or an unverified evidence ID. |
| 29 | [Incomplete results](../apps/prompt-029-incomplete-results/) | [Implementation](../apps/prompt-029-incomplete-results/src/structured-execution.mjs) | Check interruptions, refusals, provider completion, and schema validation before consumption. |
| 30 | [Image understanding](../apps/prompt-030-image-understanding/) | [Implementation](../apps/prompt-030-image-understanding/src/structured-execution.mjs) | Classroom responses are scripted. The actual PNG is attached through the SDK in both modes. |
| 31 | [Document inputs](../apps/prompt-031-document-inputs/) | [Implementation](../apps/prompt-031-document-inputs/src/structured-execution.mjs) | PDF processing includes text and page images. Endpoint size and model context limits still apply. |
| 32 | [Multimodal tool results](../apps/prompt-032-multimodal-tool-results/) | [Implementation](../apps/prompt-032-multimodal-tool-results/src/structured-execution.mjs) | The actual SDK tool returns the selected modality and the adapter captures its forwarding. |

## Section 5: Models, Settings, and API Integration

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 33 | [Model selection](../apps/prompt-033-model-selection/) | [Implementation](../apps/prompt-033-model-selection/src/structured-execution.mjs) | The isolated run captures the resolved model in the actual provider request. |
| 34 | [Generation settings](../apps/prompt-034-generation-settings/) | [Implementation](../apps/prompt-034-generation-settings/src/structured-execution.mjs) | The compatibility profile checks the requested combination before transmission. |
| 35 | [Reasoning settings](../apps/prompt-035-reasoning-settings/) | [Implementation](../apps/prompt-035-reasoning-settings/src/runtime-execution.mjs) | Run the same calculation with two supported configurations and inspect correctness, usage, and elapsed time. |
| 36 | [Mixed-model workflow](../apps/prompt-036-mixed-model-workflow/) | [Implementation](../apps/prompt-036-mixed-model-workflow/src/runtime-execution.mjs) | Observe which model a router selects and compare its extra call with direct capable-model execution. |
| 37 | [API compatibility](../apps/prompt-037-api-compatibility/) | [Implementation](../apps/prompt-037-api-compatibility/src/runtime-execution.mjs) | Execute Responses and Chat Completions adapters and inspect their requests and capability checks. |
| 38 | [Alternative providers](../apps/prompt-038-alternative-providers/) | [Implementation](../apps/prompt-038-alternative-providers/src/runtime-execution.mjs) | Connect the SDK to a separate OpenAI-compatible HTTP server and exercise tools, schemas, streaming, and usage reporting. |
| 39 | [Custom model integration](../apps/prompt-039-custom-model-integration/) | [Implementation](../apps/prompt-039-custom-model-integration/src/runtime-execution.mjs) | A TypeScript controlled backend implements complete and streaming responses through the installed SDK interfaces. |
| 40 | [Responses WebSocket transport](../apps/prompt-040-responses-websocket-transport/) | [Implementation](../apps/prompt-040-responses-websocket-transport/src/runtime-execution.mjs) | Two actual SDK runs use a local WebSocket endpoint. Inspect connection IDs and cleanup. |

## Section 6: Execution, Results, and Usage

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 41 | [Execution methods](../apps/prompt-041-execution-methods/) | [Implementation](../apps/prompt-041-execution-methods/src/runtime-execution.mjs) | Run TypeScript asynchronous execution and actual Python asynchronous or synchronous execution. |
| 42 | [Turn limits](../apps/prompt-042-turn-limits/) | [Implementation](../apps/prompt-042-turn-limits/src/runtime-execution.mjs) | The agent needs two tool lookups and a final model answer. Observe the SDK stop at lower budgets. |
| 43 | [Run configuration](../apps/prompt-043-run-configuration/) | [Implementation](../apps/prompt-043-run-configuration/src/runtime-execution.mjs) | Follow a real handoff and inspect the effective model and settings received by each adapter. |
| 44 | [Result properties](../apps/prompt-044-result-properties/) | [Implementation](../apps/prompt-044-result-properties/src/runtime-execution.mjs) | Read actual result getters after handoff, explicit-history continuation, or approval interruption. |
| 45 | [Run items](../apps/prompt-045-run-items/) | [Implementation](../apps/prompt-045-run-items/src/streaming-execution.mjs) | newItems contains typed SDK records with agent ownership. history contains replay-ready model input. |
| 46 | [Usage accounting](../apps/prompt-046-usage-accounting/) | [Implementation](../apps/prompt-046-usage-accounting/src/streaming-execution.mjs) | These nested runs own separate usage contexts. Deduplicate response IDs and aggregate each response once. |
| 47 | [SDK exceptions](../apps/prompt-047-sdk-exceptions/) | [Implementation](../apps/prompt-047-sdk-exceptions/src/streaming-execution.mjs) | Map known installed SDK classes to useful errors and propagate unexpected failures. |
| 48 | [Manual continuation](../apps/prompt-048-manual-continuation/) | [Implementation](../apps/prompt-048-manual-continuation/src/streaming-execution.mjs) | The SDK history preserves earlier messages and model records for application-managed continuation. |

## Section 7: Streaming and Interactive Applications

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 49 | [Text streaming](../apps/prompt-049-text-streaming/) | [Implementation](../apps/prompt-049-text-streaming/src/streaming-execution.mjs) | toTextStream yields incremental text. Await completion before consuming final output and usage. |
| 50 | [Event categories](../apps/prompt-050-event-categories/) | [Implementation](../apps/prompt-050-event-categories/src/streaming-execution.mjs) | Raw events supply model data. Higher-level SDK events describe agents, tools, handoffs and run items. |
| 51 | [Agent changes](../apps/prompt-051-agent-changes/) | [Implementation](../apps/prompt-051-agent-changes/src/streaming-execution.mjs) | Track active-agent updates and handoff progress from supported SDK stream events. |
| 52 | [Tool progress](../apps/prompt-052-tool-progress/) | [Implementation](../apps/prompt-052-tool-progress/src/streaming-execution.mjs) | Runner hooks report tool start and end. The application wrapper reports failure and preserves the SDK error. A tool-end hook can also follow failure. |
| 53 | [Completion handling](../apps/prompt-053-completion-handling/) | [Implementation](../apps/prompt-053-completion-handling/src/streaming-execution.mjs) | Partial text may precede a failure. Await completion and check success before reading final results or saving state. |
| 54 | [Cancellation](../apps/prompt-054-cancellation/) | [Implementation](../apps/prompt-054-cancellation/src/streaming-execution.mjs) | Use an AbortController signal and await stream settlement and backend cleanup before closing resources. |
| 55 | [Streaming interruptions](../apps/prompt-055-streaming-interruptions/) | [Implementation](../apps/prompt-055-streaming-interruptions/src/tools-execution.mjs) | Wait for the stream to settle, preserve RunState, and resume the same run after resolving approvals. |
| 56 | [Web streaming](../apps/prompt-056-web-streaming/) | [Implementation](../apps/prompt-056-web-streaming/src/tools-execution.mjs) | A client disconnect propagates cancellation to the owned run. Stream and backend settlement precede resource cleanup. |

## Section 8: Building Function Tools

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 57 | [First function tool](../apps/prompt-057-first-function-tool/) | [Implementation](../apps/prompt-057-first-function-tool/src/tools-execution.mjs) | The SDK invokes application code when the model calls the registered calculator capability. |
| 58 | [Argument schemas](../apps/prompt-058-argument-schemas/) | [Implementation](../apps/prompt-058-argument-schemas/src/tools-execution.mjs) | Constrained enums, bounded integers and documented formats validate model-supplied arguments before application work. |
| 59 | [Tool descriptions](../apps/prompt-059-tool-descriptions/) | [Implementation](../apps/prompt-059-tool-descriptions/src/tools-execution.mjs) | Tool metadata communicates the capability and when it should be selected. Actual model choices can vary. |
| 60 | [External API tool](../apps/prompt-060-external-api-tool/) | [Implementation](../apps/prompt-060-external-api-tool/src/tools-execution.mjs) | Send credentials through the configured client, enforce deadlines and expose actionable public errors. |
| 61 | [Database tool](../apps/prompt-061-database-tool/) | [Implementation](../apps/prompt-061-database-tool/src/tools-execution.mjs) | Bind SQL parameters and derive tenant identity from server-owned context. The tool accepts only a record ID. |
| 62 | [Tool return values](../apps/prompt-062-tool-return-values/) | [Implementation](../apps/prompt-062-tool-return-values/src/tools-execution.mjs) | The structured path validates its output before forwarding it. Inspect the actual model-visible representation. |
| 63 | [Tool failures](../apps/prompt-063-tool-failures/) | [Implementation](../apps/prompt-063-tool-failures/src/tools-execution.mjs) | Use a configured error handler or an application exception boundary to keep internal diagnostics server-side. |
| 64 | [Tool timeouts](../apps/prompt-064-tool-timeouts/) | [Implementation](../apps/prompt-064-tool-timeouts/src/tools-execution.mjs) | Per-tool timeout behavior controls deadline handling. A retry is a separate explicit application decision. |

## Section 9: Controlling Tool Execution

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 65 | [Tool choice](../apps/prompt-065-tool-choice/) | [Implementation](../apps/prompt-065-tool-choice/src/control-execution.mjs) | Tool choice is sent through modelSettings. The SDK resets a forced choice after use by default. |
| 66 | [Stopping after tools](../apps/prompt-066-stopping-after-tools/) | [Implementation](../apps/prompt-066-stopping-after-tools/src/control-execution.mjs) | toolUseBehavior controls completion after function tools. |
| 67 | [Custom completion policy](../apps/prompt-067-custom-completion-policy/) | [Implementation](../apps/prompt-067-custom-completion-policy/src/control-execution.mjs) | The callback returns isFinalOutput and supplies finalOutput when finishing. |
| 68 | [Conditional availability](../apps/prompt-068-conditional-availability/) | [Implementation](../apps/prompt-068-conditional-availability/src/control-execution.mjs) | Availability controls exposure. Current application permissions govern resource access. |
| 69 | [Concurrency](../apps/prompt-069-concurrency/) | [Implementation](../apps/prompt-069-concurrency/src/control-execution.mjs) | Run options can bound local function-tool execution independently of provider parallelToolCalls. |
| 70 | [Repeated-call prevention](../apps/prompt-070-repeated-call-prevention/) | [Implementation](../apps/prompt-070-repeated-call-prevention/src/control-execution.mjs) | resetToolChoice permits a subsequent response to finish. maxTurns bounds repeated-call failure. |
| 71 | [Deferred discovery](../apps/prompt-071-deferred-discovery/) | [Implementation](../apps/prompt-071-deferred-discovery/src/discovery-execution.mjs) | The installed SDK supports hosted tool search, deferred functions and namespaces. |
| 72 | [Programmatic tool calling](../apps/prompt-072-programmatic-tool-calling/) | [Implementation](../apps/prompt-072-programmatic-tool-calling/src/discovery-execution.mjs) | allowedCallers controls direct and programmatic eligibility. Child calls retain caller metadata. |

## Section 10: Search, Retrieval, and Hosted Tools

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 73 | [Web search](../apps/prompt-073-web-search/) | [Implementation](../apps/prompt-073-web-search/src/discovery-execution.mjs) | The interface renders actual returned citation annotations as usable source links. |
| 74 | [File search](../apps/prompt-074-file-search/) | [Implementation](../apps/prompt-074-file-search/src/discovery-execution.mjs) | Configure a vector store with indexed files, then pass its ID to fileSearchTool. |
| 75 | [Retrieval controls](../apps/prompt-075-retrieval-controls/) | [Implementation](../apps/prompt-075-retrieval-controls/src/hosted-execution.mjs) | File attribute filters constrain retrieval. Returned evidence and citations show what the provider used. |
| 76 | [Custom RAG](../apps/prompt-076-custom-rag/) | [Implementation](../apps/prompt-076-custom-rag/src/hosted-execution.mjs) | The tool binds the tenant from application context to its SQLite query and reports insufficient evidence for empty results. |
| 77 | [Code Interpreter](../apps/prompt-077-code-interpreter/) | [Implementation](../apps/prompt-077-code-interpreter/src/hosted-execution.mjs) | The application compares totals and means against the source CSV before offering its generated file. |
| 78 | [Image generation](../apps/prompt-078-image-generation/) | [Implementation](../apps/prompt-078-image-generation/src/hosted-execution.mjs) | The application decodes returned base64, verifies its format and serves a stored artifact. |
| 79 | [Hosted shell](../apps/prompt-079-hosted-shell/) | [Implementation](../apps/prompt-079-hosted-shell/src/hosted-execution.mjs) | The application configures container input files and network policy, then passes a container reference to shellTool. |
| 80 | [Computer use](../apps/prompt-080-computer-use/) | [Implementation](../apps/prompt-080-computer-use/src/hosted-execution.mjs) | A fresh browser context runs a local counter page. Screenshots and the actual counter verify SDK-dispatched actions. |

## Section 11: Model Context Protocol — MCP

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 81 | [Local MCP](../apps/prompt-081-local-mcp/) | [Implementation](../apps/prompt-081-local-mcp/src/mcp-execution.mjs) | The SDK starts a local MCP subprocess, discovers its timetable tool and closes the connection after the run. |
| 82 | [Remote MCP](../apps/prompt-082-remote-mcp/) | [Implementation](../apps/prompt-082-remote-mcp/src/mcp-execution.mjs) | The SDK exchanges MCP JSON-RPC requests with a separate loopback HTTP server and closes both owned resources. |
| 83 | [Hosted MCP](../apps/prompt-083-hosted-mcp/) | [Implementation](../apps/prompt-083-hosted-mcp/src/mcp-execution.mjs) | SDK-managed MCP runs through the application connection. Hosted MCP sends a public server definition to the provider. |
| 84 | [MCP authentication](../apps/prompt-084-mcp-authentication/) | [Implementation](../apps/prompt-084-mcp-authentication/src/mcp-execution.mjs) | A private server checks the transport header before discovery. Model-visible requests contain only the timetable task and results. |
| 85 | [Tool filtering](../apps/prompt-085-tool-filtering/) | [Implementation](../apps/prompt-085-tool-filtering/src/mcp-control-execution.mjs) | Static and context filters select exposed MCP capabilities. Resource permissions remain enforced inside implementations. |
| 86 | [Tool-list caching](../apps/prompt-086-tool-list-caching/) | [Implementation](../apps/prompt-086-tool-list-caching/src/mcp-control-execution.mjs) | In this installed SDK, HTTP tool-list caching is tied to a session. The fixture supplies a session ID to demonstrate invalidation. |
| 87 | [Connection failures](../apps/prompt-087-connection-failures/) | [Implementation](../apps/prompt-087-connection-failures/src/mcp-control-execution.mjs) | The exercise observes real refused connections, request deadlines and a server restart. Owned clients and servers close after the attempt. |
| 88 | [Prompts and resources](../apps/prompt-088-prompts-and-resources/) | [Implementation](../apps/prompt-088-prompts-and-resources/src/mcp-control-execution.mjs) | Resources contain application data and prompts contain reusable messages. Their contents are included through an explicit application decision. |

## Section 12: Handoffs and Specialist Ownership

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 89 | [First handoff](../apps/prompt-089-first-handoff/) | [Implementation](../apps/prompt-089-first-handoff/src/handoff-execution.mjs) | The SDK transfers conversation ownership to the receiving specialist and reports its identity through lastAgent. |
| 90 | [Ownership comparison](../apps/prompt-090-ownership-comparison/) | [Implementation](../apps/prompt-090-ownership-comparison/src/handoff-execution.mjs) | A handoff transfers ownership. An agent-as-tool returns a bounded specialist result to the manager. |
| 91 | [Routing descriptions](../apps/prompt-091-routing-descriptions/) | [Implementation](../apps/prompt-091-routing-descriptions/src/handoff-execution.mjs) | Specific names and descriptions clarify routing. Classroom ambiguous decisions are controlled examples, and live choices can vary. |
| 92 | [Handoff metadata](../apps/prompt-092-handoff-metadata/) | [Implementation](../apps/prompt-092-handoff-metadata/src/handoff-execution.mjs) | inputType validates handoff arguments before the callback runs. Metadata supplements the fixed destination and application context. |
| 93 | [Handoff callbacks](../apps/prompt-093-handoff-callbacks/) | [Implementation](../apps/prompt-093-handoff-callbacks/src/handoff-execution.mjs) | The supported onHandoff callback records the actual routing event before the receiving agent starts. |
| 94 | [History filtering](../apps/prompt-094-history-filtering/) | [Implementation](../apps/prompt-094-history-filtering/src/handoff-execution.mjs) | The filter retains the invoice and amount and removes unrelated history plus tool-history pairs through the supported helper. |
| 95 | [Conditional handoffs](../apps/prompt-095-conditional-handoffs/) | [Implementation](../apps/prompt-095-conditional-handoffs/src/course/workflows.mjs) | Enable or disable specialist handoffs based on authenticated context and supported SDK configuration. |
| 96 | [Next-turn ownership](../apps/prompt-096-next-turn-ownership/) | [Implementation](../apps/prompt-096-next-turn-ownership/src/course/workflows.mjs) | Continue the next user turn with the last specialist when that agent should remain responsible. |

## Section 13: Multi-Agent Orchestration Patterns

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 97 | [Manager and specialists](../apps/prompt-097-manager-and-specialists/) | [Implementation](../apps/prompt-097-manager-and-specialists/src/course/workflows.mjs) | Create a manager agent that calls specialist agents as tools and synthesizes their results. |
| 98 | [Specialist contracts](../apps/prompt-098-specialist-contracts/) | [Implementation](../apps/prompt-098-specialist-contracts/src/course/workflows.mjs) | Define structured inputs and output extraction for an agent exposed as a tool. |
| 99 | [Sequential workflow](../apps/prompt-099-sequential-workflow/) | [Implementation](../apps/prompt-099-sequential-workflow/src/course/workflows.mjs) | Build a research, drafting, and review sequence with explicit data contracts between stages. |
| 100 | [Parallel workflow](../apps/prompt-100-parallel-workflow/) | [Implementation](../apps/prompt-100-parallel-workflow/src/course/workflows.mjs) | Run independent specialists concurrently, collect their results, and handle partial failures. |
| 101 | [Deterministic routing](../apps/prompt-101-deterministic-routing/) | [Implementation](../apps/prompt-101-deterministic-routing/src/course/workflows.mjs) | Route requests with application logic when rules are clear, and use model routing only where needed. |
| 102 | [Planner and executor](../apps/prompt-102-planner-and-executor/) | [Implementation](../apps/prompt-102-planner-and-executor/src/course/workflows.mjs) | Build a planner that produces a structured task list and an executor that reports completion evidence. |
| 103 | [Evaluator and optimizer](../apps/prompt-103-evaluator-and-optimizer/) | [Implementation](../apps/prompt-103-evaluator-and-optimizer/src/course/workflows.mjs) | Build a bounded draft-review-revise loop with explicit success criteria and a maximum number of iterations. |
| 104 | [State machine](../apps/prompt-104-state-machine/) | [Implementation](../apps/prompt-104-state-machine/src/course/workflows.mjs) | Implement an agent workflow as explicit application states with validated transitions and recoverable failure states. |

## Section 14: Sessions, Conversation History, and Memory

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 105 | [SDK session](../apps/prompt-105-sdk-session/) | [Implementation](../apps/prompt-105-sdk-session/src/course/sessions.mjs) | Implement a multi-turn conversation using a session backend supported by my selected SDK. |
| 106 | [Persistent storage](../apps/prompt-106-persistent-storage/) | [Implementation](../apps/prompt-106-persistent-storage/src/course/sessions.mjs) | Persist conversation history across process restarts using an appropriate documented session backend. |
| 107 | [Session operations](../apps/prompt-107-session-operations/) | [Implementation](../apps/prompt-107-session-operations/src/course/sessions.mjs) | Demonstrate supported session operations for retrieving, adding, correcting, and clearing conversation items. |
| 108 | [Custom session backend](../apps/prompt-108-custom-session-backend/) | [Implementation](../apps/prompt-108-custom-session-backend/src/course/sessions.mjs) | Implement the SDK session interface using my application’s database and test concurrent access. |
| 109 | [Server-managed continuation](../apps/prompt-109-server-managed-continuation/) | [Implementation](../apps/prompt-109-server-managed-continuation/src/course/sessions.mjs) | Compare Conversations-based state and response-ID chaining in separate examples, checking incompatible combinations with SDK sessions. |
| 110 | [Context compaction](../apps/prompt-110-context-compaction/) | [Implementation](../apps/prompt-110-context-compaction/src/course/sessions.mjs) | Add supported compaction or context management and verify that important task state survives. |
| 111 | [Long-term application memory](../apps/prompt-111-long-term-application-memory/) | [Implementation](../apps/prompt-111-long-term-application-memory/src/course/sessions.mjs) | Build an explicit memory store for user-approved facts, with retrieval, correction, deletion, and tenant isolation. |
| 112 | [History selection](../apps/prompt-112-history-selection/) | [Implementation](../apps/prompt-112-history-selection/src/course/sessions.mjs) | Limit or summarize conversation history while preserving valid tool-call relationships and necessary task context. |

## Section 15: Guardrails and Validation

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 113 | [Input guardrail](../apps/prompt-113-input-guardrail/) | [Implementation](../apps/prompt-113-input-guardrail/src/course/guardrails.mjs) | Create a blocking input guardrail that rejects requests outside the application’s supported scope. |
| 114 | [Output guardrail](../apps/prompt-114-output-guardrail/) | [Implementation](../apps/prompt-114-output-guardrail/src/course/guardrails.mjs) | Validate a final answer against application requirements and handle a triggered output guardrail. |
| 115 | [Tool-input guardrail](../apps/prompt-115-tool-input-guardrail/) | [Implementation](../apps/prompt-115-tool-input-guardrail/src/course/guardrails.mjs) | Validate tool arguments before a supported function tool executes. |
| 116 | [Tool-output guardrail](../apps/prompt-116-tool-output-guardrail/) | [Implementation](../apps/prompt-116-tool-output-guardrail/src/course/guardrails.mjs) | Check a function tool’s output before the agent uses it in subsequent reasoning. |
| 117 | [Model-based guardrail](../apps/prompt-117-model-based-guardrail/) | [Implementation](../apps/prompt-117-model-based-guardrail/src/course/guardrails.mjs) | Implement a guardrail using a separate classifier agent and a structured decision. |
| 118 | [Parallel versus blocking](../apps/prompt-118-parallel-versus-blocking/) | [Implementation](../apps/prompt-118-parallel-versus-blocking/src/course/guardrails.mjs) | Compare parallel and blocking input guardrails, showing when speculative work can begin. |
| 119 | [Guardrail scope](../apps/prompt-119-guardrail-scope/) | [Implementation](../apps/prompt-119-guardrail-scope/src/course/guardrails.mjs) | Demonstrate exactly which guardrails run before handoffs, after handoffs, and around nested tool-agent calls. |
| 120 | [Streaming validation](../apps/prompt-120-streaming-validation/) | [Implementation](../apps/prompt-120-streaming-validation/src/course/guardrails.mjs) | Design output validation for streaming and explain what must be buffered before being shown to users. |

## Section 16: Human Approval and Resumable Execution

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 121 | [Approval-required tool](../apps/prompt-121-approval-required-tool/) | [Implementation](../apps/prompt-121-approval-required-tool/src/course/approvals.mjs) | Create a tool that pauses for approval before making a change to an external system. |
| 122 | [Conditional approval](../apps/prompt-122-conditional-approval/) | [Implementation](../apps/prompt-122-conditional-approval/src/course/approvals.mjs) | Require approval only when a tool’s arguments meet a specified application policy. |
| 123 | [Approve or reject](../apps/prompt-123-approve-or-reject/) | [Implementation](../apps/prompt-123-approve-or-reject/src/course/approvals.mjs) | Implement both approval and rejection paths and show how the agent responds to each decision. |
| 124 | [Persisted pause](../apps/prompt-124-persisted-pause/) | [Implementation](../apps/prompt-124-persisted-pause/src/course/approvals.mjs) | Serialize a paused run, store it, and restore it in another process before resuming. |
| 125 | [Nested approvals](../apps/prompt-125-nested-approvals/) | [Implementation](../apps/prompt-125-nested-approvals/src/course/approvals.mjs) | Demonstrate an approval interruption inside a specialist tool-agent and after a handoff. |
| 126 | [Multiple pending actions](../apps/prompt-126-multiple-pending-actions/) | [Implementation](../apps/prompt-126-multiple-pending-actions/src/course/approvals.mjs) | Review several pending tool calls individually and resume only after their decisions are resolved. |
| 127 | [Review interface](../apps/prompt-127-review-interface/) | [Implementation](../apps/prompt-127-review-interface/src/course/approvals.mjs) | Build a review screen showing the proposed action, exact arguments, approving identity, and decision outcome. |
| 128 | [Safe resumption](../apps/prompt-128-safe-resumption/) | [Implementation](../apps/prompt-128-safe-resumption/src/course/approvals.mjs) | Revalidate authorization before resumed actions and prevent duplicate side effects with application-level idempotency. |

## Section 17: Sandbox Agents and Workspaces

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 129 | [First sandbox agent](../apps/prompt-129-first-sandbox-agent/) | [Implementation](../apps/prompt-129-first-sandbox-agent/src/course/sandboxes.mjs) | Create a minimal SandboxAgent that reads an input file and writes a result into its workspace. |
| 130 | [Workspace manifest](../apps/prompt-130-workspace-manifest/) | [Implementation](../apps/prompt-130-workspace-manifest/src/course/sandboxes.mjs) | Define a manifest containing input files, directories, environment configuration, and an output location. |
| 131 | [Sandbox providers](../apps/prompt-131-sandbox-providers/) | [Implementation](../apps/prompt-131-sandbox-providers/src/course/sandboxes.mjs) | Compare supported local, Docker, and hosted sandbox clients, including their isolation and lifecycle responsibilities. |
| 132 | [Repository workspace](../apps/prompt-132-repository-workspace/) | [Implementation](../apps/prompt-132-repository-workspace/src/course/sandboxes.mjs) | Initialize a sandbox from a repository and supply task instructions through workspace files. |
| 133 | [Storage mounts](../apps/prompt-133-storage-mounts/) | [Implementation](../apps/prompt-133-storage-mounts/src/course/sandboxes.mjs) | Mount supported external storage with narrowly scoped access and verify where output files are persisted. |
| 134 | [Runtime boundaries](../apps/prompt-134-runtime-boundaries/) | [Implementation](../apps/prompt-134-runtime-boundaries/src/course/sandboxes.mjs) | Configure sandbox network access and credentials while keeping application control-plane secrets outside the workspace. |
| 135 | [Artifacts and previews](../apps/prompt-135-artifacts-and-previews/) | [Implementation](../apps/prompt-135-artifacts-and-previews/src/course/sandboxes.mjs) | Retrieve generated artifacts and expose a preview port using the selected sandbox provider. |
| 136 | [State and snapshots](../apps/prompt-136-state-and-snapshots/) | [Implementation](../apps/prompt-136-state-and-snapshots/src/course/sandboxes.mjs) | Compare live sandbox reuse, serialized sandbox state, filesystem snapshots, and the agent’s resumable RunState. |

## Section 18: Sandbox Capabilities, Skills, and Memory

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 137 | [Shell capability](../apps/prompt-137-shell-capability/) | [Implementation](../apps/prompt-137-shell-capability/src/course/sandboxes.mjs) | Enable sandbox shell execution and demonstrate command output, failure handling, and supported interactive processes. |
| 138 | [Filesystem capability](../apps/prompt-138-filesystem-capability/) | [Implementation](../apps/prompt-138-filesystem-capability/src/course/sandboxes.mjs) | Use sandbox filesystem capabilities to apply a patch and inspect an image generated during the task. |
| 139 | [Reusable skills](../apps/prompt-139-reusable-skills/) | [Implementation](../apps/prompt-139-reusable-skills/src/course/sandboxes.mjs) | Create a reusable skill containing instructions, scripts, and references, then load it into a sandbox agent. |
| 140 | [Skill discovery](../apps/prompt-140-skill-discovery/) | [Implementation](../apps/prompt-140-skill-discovery/src/course/sandboxes.mjs) | Compare eager skill loading with supported lazy discovery for a larger skill collection. |
| 141 | [Sandbox memory](../apps/prompt-141-sandbox-memory/) | [Implementation](../apps/prompt-141-sandbox-memory/src/course/sandboxes.mjs) | Demonstrate supported memory modes and distinguish reusable memory artifacts from conversation history. |
| 142 | [Sandbox compaction](../apps/prompt-142-sandbox-compaction/) | [Implementation](../apps/prompt-142-sandbox-compaction/src/course/sandboxes.mjs) | Configure compaction for a long sandbox task and verify that workspace references remain usable. |
| 143 | [Custom capabilities](../apps/prompt-143-custom-capabilities/) | [Implementation](../apps/prompt-143-custom-capabilities/src/course/sandboxes.mjs) | Implement a custom sandbox capability that adds a narrowly defined tool and its supporting instructions. |
| 144 | [Capability configuration](../apps/prompt-144-capability-configuration/) | [Implementation](../apps/prompt-144-capability-configuration/src/course/sandboxes.mjs) | Customize the capability list while preserving required defaults, dependencies, and cleanup behavior. |

## Section 19: Tracing, Hooks, and Observability

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 145 | [First trace](../apps/prompt-145-first-trace/) | [Implementation](../apps/prompt-145-first-trace/src/course/tracing.mjs) | Run an agent and inspect its trace to explain the sequence of model and tool activity. |
| 146 | [Workflow grouping](../apps/prompt-146-workflow-grouping/) | [Implementation](../apps/prompt-146-workflow-grouping/src/course/tracing.mjs) | Group several related agent runs into one trace with useful workflow and conversation metadata. |
| 147 | [Custom spans](../apps/prompt-147-custom-spans/) | [Implementation](../apps/prompt-147-custom-spans/src/course/tracing.mjs) | Add custom spans around retrieval and application services so their latency is visible alongside agent activity. |
| 148 | [Run hooks](../apps/prompt-148-run-hooks/) | [Implementation](../apps/prompt-148-run-hooks/src/course/tracing.mjs) | Implement supported run-lifecycle hooks and demonstrate the order in which they execute. |
| 149 | [Agent hooks](../apps/prompt-149-agent-hooks/) | [Implementation](../apps/prompt-149-agent-hooks/src/course/tracing.mjs) | Attach agent-specific lifecycle hooks and compare their scope with workflow-level hooks. |
| 150 | [Trace controls](../apps/prompt-150-trace-controls/) | [Implementation](../apps/prompt-150-trace-controls/src/course/tracing.mjs) | Configure trace export and sensitive-data handling using the selected SDK’s supported tracing controls. |
| 151 | [Operational metrics](../apps/prompt-151-operational-metrics/) | [Implementation](../apps/prompt-151-operational-metrics/src/course/tracing.mjs) | Report latency, token usage, tool failures, handoff frequency, and estimated cost using observable run data. |
| 152 | [Workflow visualization](../apps/prompt-152-workflow-visualization/) | [Implementation](../apps/prompt-152-workflow-visualization/src/course/tracing.mjs) | Visualize the agent-and-handoff structure using a supported SDK utility or a graph generated from application configuration. |

## Section 20: Realtime Speech-to-Speech Agents

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 153 | [Browser voice agent](../apps/prompt-153-browser-voice-agent/) | [Implementation](../apps/prompt-153-browser-voice-agent/src/course/realtime.mjs) | Build a TypeScript realtime voice agent using WebRTC and an ephemeral credential issued by my backend. |
| 154 | [Server voice connection](../apps/prompt-154-server-voice-connection/) | [Implementation](../apps/prompt-154-server-voice-connection/src/course/realtime.mjs) | Run a realtime agent through a supported server WebSocket integration and explain its audio-handling responsibilities. |
| 155 | [Turn detection](../apps/prompt-155-turn-detection/) | [Implementation](../apps/prompt-155-turn-detection/src/course/realtime.mjs) | Compare server VAD, semantic VAD, and manual turn control for supported realtime models. |
| 156 | [Interruptions](../apps/prompt-156-interruptions/) | [Implementation](../apps/prompt-156-interruptions/src/course/realtime.mjs) | Implement user interruption handling so audio playback and conversation history remain consistent. |
| 157 | [Realtime tools](../apps/prompt-157-realtime-tools/) | [Implementation](../apps/prompt-157-realtime-tools/src/course/realtime.mjs) | Add a private order-lookup tool to a voice agent while keeping execution and credentials on the backend. |
| 158 | [Voice handoffs](../apps/prompt-158-voice-handoffs/) | [Implementation](../apps/prompt-158-voice-handoffs/src/course/realtime.mjs) | Transfer a spoken conversation between specialists while preserving relevant context. |
| 159 | [Realtime events](../apps/prompt-159-realtime-events/) | [Implementation](../apps/prompt-159-realtime-events/src/course/realtime.mjs) | Display transcripts, session status, tool progress, and conversation updates using documented realtime events. |
| 160 | [Voice controls](../apps/prompt-160-voice-controls/) | [Implementation](../apps/prompt-160-voice-controls/src/course/realtime.mjs) | Add supported realtime guardrails and approval handling, explaining limitations once audio has already played. |

## Section 21: Voice Pipelines and Integrations

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 161 | [Python voice pipeline](../apps/prompt-161-python-voice-pipeline/) | [Implementation](../apps/prompt-161-python-voice-pipeline/src/course/voice.mjs) | Create a Python VoicePipeline that connects speech recognition, an existing agent, and speech generation. |
| 162 | [Streaming audio input](../apps/prompt-162-streaming-audio-input/) | [Implementation](../apps/prompt-162-streaming-audio-input/src/course/voice.mjs) | Process supported streaming audio input and stream the resulting speech back to the application. |
| 163 | [Speech recognition](../apps/prompt-163-speech-recognition/) | [Implementation](../apps/prompt-163-speech-recognition/src/course/voice.mjs) | Configure transcription language and relevant recognition settings, then evaluate errors on representative recordings. |
| 164 | [Speech generation](../apps/prompt-164-speech-generation/) | [Implementation](../apps/prompt-164-speech-generation/src/course/voice.mjs) | Configure supported voice and speech-output settings and measure time to first audio. |
| 165 | [Custom voice workflow](../apps/prompt-165-custom-voice-workflow/) | [Implementation](../apps/prompt-165-custom-voice-workflow/src/course/voice.mjs) | Create a custom voice workflow around several agents while retaining access to intermediate text. |
| 166 | [GPT-Live integration](../apps/prompt-166-gpt-live-integration/) | [Implementation](../apps/prompt-166-gpt-live-integration/src/course/gpt-live.mjs) | Connect GPT-Live through client delegation to my existing Agents SDK backend and preserve its authorization rules. |
| 167 | [Server-side control](../apps/prompt-167-server-side-control/) | [Implementation](../apps/prompt-167-server-side-control/src/course/realtime.mjs) | Attach supported server-side voice controls and prevent duplicate execution when events are replayed or delivered twice. |
| 168 | [Telephony integration](../apps/prompt-168-telephony-integration/) | [Implementation](../apps/prompt-168-telephony-integration/src/course/realtime.mjs) | Connect an agent workflow to a supported telephony transport and handle call lifecycle, cancellation, and connection failures. |

## Section 22: Testing and Evaluation

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 169 | [Deterministic model tests](../apps/prompt-169-deterministic-model-tests/) | [Implementation](../apps/prompt-169-deterministic-model-tests/src/course/evaluation.mjs) | Test agent orchestration using a scripted or fake model, preferring documented SDK testing helpers when available. |
| 170 | [Tool unit tests](../apps/prompt-170-tool-unit-tests/) | [Implementation](../apps/prompt-170-tool-unit-tests/src/course/evaluation.mjs) | Test tool validation, authorization, successful results, and failures without making paid model calls. |
| 171 | [Routing tests](../apps/prompt-171-routing-tests/) | [Implementation](../apps/prompt-171-routing-tests/src/course/evaluation.mjs) | Test that representative requests reach the correct specialist and preserve the expected conversation ownership. |
| 172 | [Approval tests](../apps/prompt-172-approval-tests/) | [Implementation](../apps/prompt-172-approval-tests/src/course/evaluation.mjs) | Test approval, rejection, timeout, serialization, and resumption paths without performing real external writes. |
| 173 | [Streaming and runtime tests](../apps/prompt-173-streaming-and-runtime-tests/) | [Implementation](../apps/prompt-173-streaming-and-runtime-tests/src/course/evaluation.mjs) | Use supported test doubles to verify streaming, sandbox, realtime, or voice behavior relevant to this application. |
| 174 | [Evaluation dataset](../apps/prompt-174-evaluation-dataset/) | [Implementation](../apps/prompt-174-evaluation-dataset/src/course/evaluation.mjs) | Create a representative evaluation dataset containing normal tasks, ambiguous requests, missing information, and failure cases. |
| 175 | [Trace evaluation](../apps/prompt-175-trace-evaluation/) | [Implementation](../apps/prompt-175-trace-evaluation/src/course/evaluation.mjs) | Evaluate whether the workflow chose appropriate tools, made correct handoffs, and respected its instructions. |
| 176 | [Regression comparison](../apps/prompt-176-regression-comparison/) | [Implementation](../apps/prompt-176-regression-comparison/src/course/evaluation.mjs) | Compare prompt or model versions on task success, latency, cost, and failure rate before adopting a change. |

## Section 23: Reliability and Background Execution

| Prompt | Lesson and application | Practical source | Practice focus |
| --- | --- | --- | --- |
| 177 | [Retry policy](../apps/prompt-177-retry-policy/) | [Implementation](../apps/prompt-177-retry-policy/src/course/reliability.mjs) | Configure SDK and application retries together, avoiding duplicated retry layers and repeated external side effects. |
| 178 | [Timeout policy](../apps/prompt-178-timeout-policy/) | [Implementation](../apps/prompt-178-timeout-policy/src/course/reliability.mjs) | Set model, tool, and overall request timeouts, and verify cleanup when each deadline expires. |
| 179 | [Execution budgets](../apps/prompt-179-execution-budgets/) | [Implementation](../apps/prompt-179-execution-budgets/src/course/reliability.mjs) | Enforce application budgets for time, turns, tool calls, and spending, distinguishing estimates from hard limits. |
| 180 | [Background jobs](../apps/prompt-180-background-jobs/) | [Implementation](../apps/prompt-180-background-jobs/src/course/reliability.mjs) | Run agent work in a queue worker with job identifiers, cancellation, and idempotent result handling. |

## Supplementary applications

Applications 181–200 are included for independent exploration, outside the 180-lesson core course and its video numbering. Run them with `npm run lesson:181` through `npm run lesson:200`.
