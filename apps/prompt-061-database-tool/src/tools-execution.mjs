import * as sdk from "@openai/agents";
import OpenAI from "openai";
import { z } from "zod";
import { setTimeout as pause } from "node:timers/promises";
import {
  scriptedModel,
  message,
  functionCall,
} from "../../foundations-runtime/examples/context/scripted-model.mjs";
import { ClassroomStreamModel } from "../../foundations-runtime/examples/streaming/classroom-model.ts";
import { summarizeStreamEvent } from "../../foundations-runtime/examples/streaming/result-inspection.mjs";
import { createCalculator } from "../../foundations-runtime/examples/tools/calculator.ts";
import {
  createTenantDatabase,
  classroomProfiles,
} from "./examples/tools/tenant-database.mjs";
import {
  createWeatherFixture,
  fetchWeather,
  ServiceError,
} from "../../foundations-runtime/examples/tools/external-api.mjs";
import { runSSEClientDemo } from "../../foundations-runtime/examples/tools/sse-client-demo.mjs";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";

const stage = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});
function choose(value, options) {
  if (!options.includes(value))
    throw new Error("Choose a listed lesson scenario.");
  return value;
}
function completed(result) {
  if (result.interruptions.length || result.finalOutput === undefined)
    throw new Error("The run has no completed final output.");
  return result.finalOutput;
}
function toolOutputs(result) {
  return result.newItems
    .filter((item) => item.type === "tool_call_output_item")
    .map((item) => item.rawItem.output);
}
function lastToolOutput(request) {
  return [...request.input]
    .reverse()
    .find((item) => item.type === "function_call_result")?.output;
}
function readableToolOutput(request) {
  const raw = lastToolOutput(request);
  let value = raw?.type === "text" ? raw.text : raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

export async function executeTools(
  number,
  input,
  { env = {}, signal, onProgress = () => {} } = {},
) {
  const live = input.mode === "live";
  if (live && ![57, 58, 59, 61, 62].includes(number))
    throw new Error("This lesson uses controlled local SDK execution.");
  if (live) loadConfig(env);
  const runner = () =>
    new sdk.Runner({
      tracingDisabled: true,
      ...(live
        ? {
            modelProvider: new sdk.OpenAIProvider({
              openAIClient: new OpenAI({
                apiKey: env.OPENAI_API_KEY,
                timeout: 45000,
                maxRetries: 0,
              }),
            }),
          }
        : {}),
    });
  const modelFor = (local) =>
    live ? env.OPENAI_MODEL || "gpt-6-astra" : local;
  let output, evidence, events, takeaway;
  const label = live
    ? "Actual SDK tool execution · live model"
    : "Actual SDK tool execution · scripted classroom model";

  // lesson:55
  if (number === 55) {
    const decision = choose(input.approvalDecision ?? "pause", [
      "pause",
      "approve",
      "reject",
    ]);
    let executed = 0;
    const reservation = sdk.tool({
      name: "reserve_classroom_seat",
      description: "Reserve a local fixture seat after approval.",
      parameters: z.object({}),
      needsApproval: true,
      execute: async () => {
        executed++;
        return "Classroom fixture seat reserved.";
      },
    });
    const model = new ClassroomStreamModel(
      "approval-stream",
      (_request, call) =>
        call === 1
          ? [functionCall(reservation.name)]
          : [
              message(
                decision === "approve"
                  ? "The approved fixture reservation completed."
                  : "The fixture reservation was rejected.",
              ),
            ],
    );
    const agent = new sdk.Agent({
      name: "Approval tutor",
      model,
      tools: [reservation],
    });
    const run = runner();
    const recorded = [];
    async function drain(stream) {
      const completion = stream.completed;
      try {
        for await (const event of stream) {
          const entry = summarizeStreamEvent(event, agent.name);
          recorded.push(entry);
          onProgress(entry);
        }
      } finally {
        await completion;
        await model.whenIdle();
      }
    }
    const first = await run.run(agent, "Reserve a classroom fixture seat.", {
      stream: true,
      signal,
    });
    await drain(first);
    const beforeDecisionExecutions = executed;
    if (first.interruptions.length !== 1)
      throw new Error("The fixture did not pause for one approval.");
    const snapshot = first.state.toString();
    const restored = await sdk.RunState.fromString(agent, snapshot);
    const pending = restored.getInterruptions();
    let result = first;
    if (decision !== "pause") {
      for (const item of pending) {
        if (decision === "approve") restored.approve(item);
        else
          restored.reject(item, {
            message: "The instructor rejected this fixture reservation.",
          });
      }
      result = await run.run(agent, restored, { stream: true, signal });
      await drain(result);
    }
    const paused = result.interruptions.length > 0;
    const finalOutput = paused ? null : completed(result);
    evidence = {
      decision,
      initialInterruptions: first.interruptions.length,
      restoredInterruptions: pending.length,
      beforeDecisionExecutions,
      toolExecutions: executed,
      serializedState: snapshot,
      snapshotBytes: Buffer.byteLength(snapshot),
      streamEvents: recorded,
      settled: true,
      paused,
      consumed: !paused,
      finalOutput,
    };
    output = `Outcome — ${paused ? "paused" : decision === "approve" ? "approved" : "rejected"}\nExecutions before decision — ${beforeDecisionExecutions}\nTool executions — ${executed}\nPreserved state — ${evidence.snapshotBytes} bytes${finalOutput ? "\n" + finalOutput : ""}`;
    events = [
      stage(
        "Wait for the streamed interruption",
        "The actual SDK records a pending approval.",
        "sdk",
      ),
      stage(
        "Preserve resumable state",
        `${evidence.snapshotBytes} serialized bytes after settlement.`,
      ),
      stage("Restore and apply the selected decision", decision),
      stage(
        "Inspect execution and consumption",
        `Tool executions: ${executed}. Consumed: ${!paused}.`,
      ),
    ];
    takeaway =
      "Wait for the stream to settle, preserve its RunState, and resume the same run after resolving pending approvals.";
  }

  // lesson:56
  if (number === 56) {
    const policy = choose(input.sseClient ?? "complete", [
      "complete",
      "disconnect",
    ]);
    const report = await runSSEClientDemo({
      disconnect: policy === "disconnect",
      signal,
      onProgress,
    });
    evidence = {
      ...report,
      policy,
      cancelled: report.cancellationObserved,
      client:
        "Controlled teaching HTTP client on a separate loopback SSE connection",
      inferenceIsScripted: true,
    };
    output = `Received HTTP events — ${report.receivedEvents}\nText chunks — ${report.chunks}\nClient disconnected — ${report.clientDisconnected}\nSDK cancellation observed — ${report.cancellationObserved}\nStream settled — ${report.settled}\nResources closed — ${report.resourceClosed}`;
    events = [
      stage(
        "Expose the application SSE endpoint",
        "Serve actual SDK events as text/event-stream.",
      ),
      stage("Run the teaching HTTP client", policy),
      stage(
        "Observe disconnect propagation",
        `Cancelled: ${report.cancellationObserved}.`,
        "sdk",
      ),
      stage(
        "Await cleanup",
        `Stream settled: ${report.settled}. Model idle: ${report.modelIdle}.`,
      ),
    ];
    takeaway =
      "A client disconnect aborts the owned SDK stream. Await stream and model settlement before closing the application endpoint.";
  }

  // lesson:57
  if (number === 57) {
    const question = choose(input.calculatorQuestion ?? "arithmetic", [
      "arithmetic",
      "concept",
    ]);
    const observed = [];
    const calculator = createCalculator((value) => observed.push(value));
    const local = scriptedModel([
      question === "arithmetic"
        ? functionCall(calculator.name, {
            operation: "multiply",
            left: 12.5,
            right: 3,
          })
        : message("A calculator tool performs arithmetic in application code."),
      (request) =>
        message(`The calculator returned ${readableToolOutput(request)}.`),
    ]);
    const agent = new sdk.Agent({
      name: "Calculator tutor",
      model: modelFor(local),
      instructions:
        "Use calculate for arithmetic. Explain conceptual questions directly.",
      tools: [calculator],
    });
    const result = await runner().run(
      agent,
      question === "arithmetic"
        ? "What is 12.5 times 3?"
        : "What does a calculator function tool do?",
      { signal, maxTurns: 3 },
    );
    output = completed(result);
    evidence = {
      question,
      toolExecutions: observed.length,
      observedResults: observed,
      modelVisibleResults: toolOutputs(result),
      inferenceIsScripted: !live,
    };
    events = [
      stage(
        "Register the calculator",
        "A Zod schema documents operation and operands.",
      ),
      stage("Run the question", question, "model"),
      stage(
        "Inspect tool execution",
        `${observed.length} observed callback executions.`,
        "tool",
      ),
      stage("Read the completed answer", output),
    ];
    takeaway =
      "Register application arithmetic as a function tool. The model can call the tool when it needs that capability.";
  }

  // lesson:58
  if (number === 58) {
    const scenario = choose(input.argumentCase ?? "valid", [
      "valid",
      "wrong-type",
      "too-many",
      "unknown-city",
    ]);
    const candidate = { city: "Madrid", participants: 8, date: "2026-11-12" };
    if (scenario === "wrong-type") candidate.participants = "eight";
    if (scenario === "too-many") candidate.participants = 40;
    if (scenario === "unknown-city") candidate.city = "Atlantis";
    const schema = z.object({
      city: z.enum(["Madrid", "Paris"]).describe("A supported workshop city."),
      participants: z
        .number()
        .int()
        .min(1)
        .max(20)
        .describe("An integer participant count from 1 to 20."),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("A date formatted YYYY-MM-DD."),
    });
    const calls = [];
    const validationErrors = [];
    const tool = sdk.tool({
      name: "validate_workshop",
      description: "Validate proposed workshop requirements.",
      parameters: schema,
      errorFunction: (_context, error) => {
        validationErrors.push({ type: error.name });
        return JSON.stringify({
          ok: false,
          code: "INVALID_ARGUMENTS",
          message:
            "Use a supported city, an integer count from 1 to 20, and YYYY-MM-DD.",
        });
      },
      execute: async (args) => {
        calls.push(args);
        return { ok: true, ...args };
      },
    });
    const local = scriptedModel([
      functionCall(tool.name, candidate),
      (request) =>
        message(`Observed tool result: ${readableToolOutput(request)}`),
    ]);
    const result = await runner().run(
      new sdk.Agent({
        name: "Argument validation tutor",
        model: modelFor(local),
        tools: [tool],
        instructions:
          "Use the validation tool to inspect the supplied proposal.",
      }),
      `Validate this proposal: ${JSON.stringify(candidate)}`,
      { signal, maxTurns: 3 },
    );
    output = completed(result);
    evidence = {
      scenario,
      candidate,
      callbackExecutions: calls.length,
      validatedArguments: calls,
      validationErrors,
      modelVisibleResults: toolOutputs(result),
      inferenceIsScripted: !live,
    };
    events = [
      stage(
        "Define constrained arguments",
        "Enum city, bounded integer participants, and date format.",
      ),
      stage(
        "Receive candidate model arguments",
        JSON.stringify(candidate),
        "model",
      ),
      stage(
        "Apply SDK argument validation",
        `${calls.length} callback executions.`,
        "sdk",
      ),
      stage(
        "Return useful validation feedback",
        JSON.stringify(toolOutputs(result)),
      ),
    ];
    takeaway =
      "Validate tool arguments before executing application work. Return concise validation feedback so the model can correct its next call.";
  }

  // lesson:59
  if (number === 59) {
    const quality = choose(input.descriptionQuality ?? "clear", [
      "clear",
      "vague",
    ]);
    const observed = [];
    let definitions = [];
    function shipmentTool(action) {
      const clear = quality === "clear";
      const read = action === "read";
      return sdk.tool({
        name: clear
          ? read
            ? "read_shipment_status"
            : "create_shipment"
          : read
            ? "process_order"
            : "handle_order",
        description: clear
          ? read
            ? "Read latest delivery status for an existing order. This performs a read-only lookup."
            : "Create a new shipment only when the user explicitly requests a new shipment."
          : "Handle an order.",
        parameters: clear
          ? z.object({
              orderId: z
                .string()
                .describe(
                  "Identifier of the existing order, such as order-42.",
                ),
            })
          : z.object({ id: z.string() }),
        execute: async (args) => {
          const result = {
            action,
            orderId: args.orderId ?? args.id,
            status: read ? "in_transit" : "fixture_draft_created",
          };
          observed.push(result);
          return result;
        },
      });
    }
    const tools = [shipmentTool("create"), shipmentTool("read")];
    const local = scriptedModel([
      (request) => {
        definitions = request.tools;
        const selected =
          request.tools.find((tool) =>
            tool.description.includes("Read latest delivery status"),
          ) ?? request.tools[0];
        return functionCall(
          selected.name,
          quality === "clear" ? { orderId: "order-42" } : { id: "order-42" },
        );
      },
      (request) =>
        message(
          `The selected capability returned ${readableToolOutput(request)}.`,
        ),
    ]);
    const result = await runner().run(
      new sdk.Agent({
        name: "Tool selection tutor",
        model: modelFor(local),
        instructions:
          "Answer the user using the appropriate capability for an existing order status.",
        tools,
      }),
      "Where is my existing shipment for order-42?",
      { signal, maxTurns: 3 },
    );
    output = completed(result);
    evidence = {
      quality,
      observedActions: observed,
      selectedCorrectCapability:
        observed.length === 1 && observed[0].action === "read",
      actualModelToolDefinitions: live
        ? tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          }))
        : definitions,
      inferenceIsScripted: !live,
      classroomSelection:
        "A controlled metadata-based selection illustrates ambiguity. Live decisions can vary.",
    };
    events = [
      stage("Choose the tool definitions", quality),
      stage(
        "Expose names, descriptions and schemas",
        `${tools.length} capabilities.`,
      ),
      stage(
        "Observe the selected capability",
        observed.map((row) => row.action).join(", "),
        "tool",
      ),
      stage("Inspect downstream output", output),
    ];
    takeaway =
      "Use specific capability names, descriptions and parameter documentation to communicate when a model should select each tool.";
  }

  // lesson:60
  if (number === 60) {
    const scenario = choose(input.apiScenario ?? "success", [
      "success",
      "unauthorized",
      "timeout",
      "server-error",
    ]);
    const service = await createWeatherFixture(scenario);
    const observed = [];
    try {
      const tool = sdk.tool({
        name: "get_weather",
        description: "Read current weather from the configured classroom API.",
        parameters: z.object({ city: z.enum(["Madrid"]) }),
        errorFunction: (_context, error) =>
          JSON.stringify({
            ok: false,
            code: error instanceof ServiceError ? error.code : "API_FAILURE",
            message: "The weather lookup could not be completed.",
          }),
        execute: async ({ city }) => {
          try {
            const value = await fetchWeather({
              baseURL: service.baseURL,
              token:
                scenario === "unauthorized"
                  ? "invalid-fixture-token"
                  : service.token,
              city,
              signal,
              timeoutMs: scenario === "timeout" ? 50 : 1500,
            });
            observed.push({ ok: true, value });
            return { ok: true, ...value };
          } catch (error) {
            observed.push({ ok: false, code: error.code });
            throw error;
          }
        },
      });
      const local = scriptedModel([
        functionCall(tool.name, { city: "Madrid" }),
        (request) =>
          message(`Weather tool result: ${readableToolOutput(request)}`),
      ]);
      const result = await runner().run(
        new sdk.Agent({
          name: "External API tutor",
          model: local,
          tools: [tool],
        }),
        "Read the weather in Madrid.",
        { signal, maxTurns: 3 },
      );
      output = completed(result);
      evidence = {
        scenario,
        observedRequests: service.requests,
        observedResults: observed,
        modelVisibleResults: toolOutputs(result),
        externalService: "Separate loopback HTTP API fixture",
        credentialsExposed: false,
        resourceClosed: false,
      };
    } finally {
      await service.close();
      if (evidence) evidence.resourceClosed = true;
    }
    events = [
      stage(
        "Configure the API client",
        "Bearer authentication and a request deadline.",
      ),
      stage("Execute the asynchronous SDK tool", scenario, "tool"),
      stage(
        "Map service failures to public codes",
        JSON.stringify(evidence.observedResults),
      ),
      stage("Close owned HTTP resources", String(evidence.resourceClosed)),
    ];
    takeaway =
      "Keep API credentials in the server-owned client, enforce request deadlines, and expose actionable public error codes.";
  }

  // lesson:61
  if (number === 61) {
    const profile = choose(
      input.databaseProfile ?? "alice",
      Object.keys(classroomProfiles),
    );
    const recordCase = choose(input.recordCase ?? "own", [
      "own",
      "cross",
      "injection",
    ]);
    const context = classroomProfiles[profile];
    const own = context.tenantId === "tenant-a" ? "workshop-a" : "workshop-b";
    const recordId =
      recordCase === "own"
        ? own
        : recordCase === "cross"
          ? own === "workshop-a"
            ? "workshop-b"
            : "workshop-a"
          : "workshop-a' OR 1=1 --";
    const database = await createTenantDatabase();
    const observed = [];
    try {
      const tool = sdk.tool({
        name: "read_workshop",
        description:
          "Read an authorized workshop by ID for the authenticated tenant.",
        parameters: z.object({ recordId: z.string().max(120) }),
        execute: async (args, runContext) => {
          const value = database.read(runContext.context, args.recordId);
          observed.push(value);
          return value;
        },
      });
      const local = scriptedModel([
        functionCall(tool.name, { recordId }),
        (request) =>
          message(`Database tool result: ${readableToolOutput(request)}`),
      ]);
      const result = await runner().run(
        new sdk.Agent({
          name: "Tenant database tutor",
          model: modelFor(local),
          tools: [tool],
          instructions: "Use the read-only workshop tool for the requested ID.",
        }),
        `Read workshop ID ${JSON.stringify(recordId)}.`,
        { context, signal, maxTurns: 3 },
      );
      output = completed(result);
      evidence = {
        profile,
        context,
        recordCase,
        recordId,
        observedResults: observed,
        queries: database.queries,
        queryOnly:
          database.database.prepare("PRAGMA query_only").get().query_only === 1,
        engine: "Embedded SQLite in this Node process, in-memory fixture",
        resourceClosed: false,
        inferenceIsScripted: !live,
      };
    } finally {
      database.close();
      if (evidence) evidence.resourceClosed = true;
    }
    events = [
      stage(
        "Resolve authenticated application context",
        `${context.userId} / ${context.tenantId}`,
      ),
      stage("Bind SQL parameters", JSON.stringify(evidence.queries), "tool"),
      stage(
        "Inspect tenant-scoped results",
        JSON.stringify(evidence.observedResults),
      ),
      stage("Close the SQLite connection", String(evidence.resourceClosed)),
    ];
    takeaway =
      "Bind query parameters and obtain tenant identity from authenticated application context. The tool accepts a record ID and enforces a read-only tenant-scoped query.";
  }

  // lesson:62
  if (number === 62) {
    const format = choose(input.returnFormat ?? "structured", [
      "structured",
      "text",
    ]);
    const value = {
      topic: "Robotics",
      durationMinutes: 30,
      materials: ["kits", "projector"],
    };
    let downstream;
    const schema = z.object({
      topic: z.string(),
      durationMinutes: z.number().int().positive(),
      materials: z.array(z.string()),
    });
    const tool = sdk.tool({
      name: "read_workshop_plan",
      description: "Read the workshop plan and its duration and materials.",
      parameters: z.object({}),
      ...(format === "structured" ? { outputSchema: schema } : {}),
      execute: async () =>
        format === "structured"
          ? value
          : "Robotics workshop lasts 30 minutes. Materials: kits, projector.",
    });
    const local = scriptedModel([
      functionCall(tool.name),
      (request) => {
        downstream = lastToolOutput(request);
        return message(
          `The downstream model received ${readableToolOutput(request)}.`,
        );
      },
    ]);
    const result = await runner().run(
      new sdk.Agent({
        name: "Tool output tutor",
        model: modelFor(local),
        tools: [tool],
        instructions:
          "Read the workshop plan, then summarize the duration and materials.",
      }),
      "What duration and materials does the workshop require?",
      { signal, maxTurns: 3 },
    );
    output = completed(result);
    evidence = {
      format,
      actualToolOutputs: toolOutputs(result),
      classroomDownstreamInput: downstream ?? null,
      outputSchemaEnabled: format === "structured",
      inferenceIsScripted: !live,
    };
    events = [
      stage("Select the return format", format),
      stage(
        "Execute and validate the tool output",
        format === "structured"
          ? "The SDK validates the output schema."
          : "The tool returns descriptive text.",
        "tool",
      ),
      stage(
        "Inspect the next model input",
        JSON.stringify(toolOutputs(result)),
        "sdk",
      ),
      stage("Read downstream reasoning", output),
    ];
    takeaway =
      "Return concise text or schema-validated structured data according to the downstream task. Inspect the actual model-visible representation.";
  }

  // lesson:63
  if (number === 63) {
    const policy = choose(input.toolErrorPolicy ?? "safe-result", [
      "safe-result",
      "propagate",
    ]);
    const secret = "CLASSROOM_SECRET_DO_NOT_EXPOSE";
    const audit = [];
    const safe = {
      ok: false,
      code: "UPSTREAM_UNAVAILABLE",
      message: "The inventory lookup is temporarily unavailable.",
    };
    const tool = sdk.tool({
      name: "read_inventory",
      description: "Read the classroom inventory.",
      parameters: z.object({}),
      errorFunction:
        policy === "safe-result" ? () => JSON.stringify(safe) : null,
      execute: async () => {
        audit.push({ event: "tool_failed", code: safe.code });
        throw new Error(
          `Internal credential=${secret}; private_backend_detail_942`,
        );
      },
    });
    const local = scriptedModel(
      [
        functionCall(tool.name),
        (request) =>
          message(
            `The inventory tool reported ${readableToolOutput(request)}.`,
          ),
      ],
      { captureRequests: true },
    );
    try {
      const result = await runner().run(
        new sdk.Agent({
          name: "Safe failure tutor",
          model: local,
          tools: [tool],
        }),
        "Read inventory.",
        { signal, maxTurns: 3 },
      );
      output = completed(result);
      evidence = {
        policy,
        completed: true,
        safeResults: toolOutputs(result),
        audit,
        modelRequests: local.requests,
      };
    } catch (error) {
      if (!(error instanceof sdk.ToolCallError)) throw error;
      output =
        "ToolCallError handled by the application.\nPublic code — UPSTREAM_UNAVAILABLE";
      evidence = {
        policy,
        completed: false,
        errorType: error.name,
        publicCode: safe.code,
        audit,
        modelRequests: local.requests,
      };
    }
    const serialized = JSON.stringify(evidence);
    if (serialized.includes(secret))
      throw new Error("The safe diagnostic boundary failed.");
    evidence.secretAbsentFromEvidence = true;
    events = [
      stage(
        "Reproduce the tool failure",
        "The synthetic exception includes a private diagnostic.",
        "tool",
      ),
      stage("Apply the configured error policy", policy, "sdk"),
      stage("Inspect allowlisted diagnostics", JSON.stringify(audit)),
      stage(
        "Check the model and application boundary",
        "Synthetic secret absent from returned evidence.",
      ),
    ];
    takeaway =
      "Return allowlisted tool errors or handle SDK exceptions at the application boundary. Preserve useful public codes while keeping internal diagnostics server-side.";
  }

  // lesson:64
  if (number === 64) {
    const policy = choose(input.timeoutPolicy ?? "as-result", [
      "as-result",
      "raise",
      "retry",
    ]);
    const pending = [];
    let calls = 0,
      retries = 0;
    const trace = [];
    const tool = sdk.tool({
      name: "read_slow_fixture",
      description: "Read an idempotent local fixture.",
      parameters: z.object({}),
      timeoutMs: 40,
      timeoutBehavior:
        policy === "as-result" ? "error_as_result" : "raise_exception",
      timeoutErrorFunction: () =>
        JSON.stringify({
          ok: false,
          code: "TOOL_TIMEOUT",
          message: "The fixture read exceeded its deadline.",
        }),
      errorFunction: null,
      execute: async (_args, _context, details) => {
        calls++;
        const call = calls;
        let resolveDone;
        pending.push(
          new Promise((resolve) => {
            resolveDone = resolve;
          }),
        );
        trace.push(`call.${call}.start`);
        try {
          await pause(policy === "retry" && call === 2 ? 5 : 180, undefined, {
            signal: details?.signal,
          });
          return { ok: true, value: "Fixture read complete." };
        } finally {
          trace.push(`call.${call}.settled`);
          resolveDone();
        }
      },
    });
    let finalOutput = null,
      handledError = null,
      visible = [];
    const attempt = async () => {
      const local = scriptedModel([
        functionCall(tool.name),
        (request) =>
          message(`Observed tool output: ${readableToolOutput(request)}`),
      ]);
      const result = await runner().run(
        new sdk.Agent({
          name: "Tool timeout tutor",
          model: local,
          tools: [tool],
        }),
        "Read the fixture.",
        { signal, maxTurns: 3 },
      );
      visible = toolOutputs(result);
      return completed(result);
    };
    try {
      finalOutput = await attempt();
    } catch (error) {
      if (!(error instanceof sdk.ToolTimeoutError)) throw error;
      handledError = { type: error.name, timeoutMs: error.timeoutMs };
      await Promise.all(pending);
      trace.push("application.timeout_handled");
      if (policy === "retry") {
        signal?.throwIfAborted();
        retries++;
        trace.push("application.retry");
        finalOutput = await attempt();
      }
    } finally {
      await Promise.all(pending);
      trace.push("application.cleanup_complete");
    }
    evidence = {
      policy,
      toolTimeoutMs: 40,
      toolExecutions: calls,
      applicationRetries: retries,
      handledError,
      modelVisibleResults: visible,
      trace,
      backendSettled: true,
      consumed: finalOutput !== null,
    };
    output = `Tool executions — ${calls}\nApplication retries — ${retries}\nOutcome — ${finalOutput ?? handledError.type}\nBackend cleanup — complete`;
    events = [
      stage(
        "Configure the supported tool timeout",
        "timeoutMs=40 with an explicit timeoutBehavior.",
      ),
      stage(
        "Run cooperative backend work",
        `${calls} observed tool invocations.`,
        "tool",
      ),
      stage(
        "Apply application retry policy",
        `${retries} explicit retry attempts.`,
      ),
      stage("Await backend settlement", trace.join(" → ")),
    ];
    takeaway =
      "A per-tool timeout handles the invocation deadline. Application retry logic is a separate explicit decision, and backend work must settle before another attempt.";
  }
  return { label, output, evidence, events, takeaway };
}
