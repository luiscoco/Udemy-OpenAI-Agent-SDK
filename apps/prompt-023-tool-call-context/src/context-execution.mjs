import * as sdk from "@openai/agents";
import { z } from "zod";
import { makeContext, contextCandidate } from "./public/context-lessons.js";
import {
  contextSchema,
  parseContext,
  createTypedTutor,
} from "../../foundations-runtime/examples/context/typed-context.ts";
import {
  scriptedModel,
  functionCall,
  message,
} from "./examples/context/scripted-model.mjs";
import { withClassroomServices } from "../../foundations-runtime/examples/context/services.mjs";
import { dependencyTool } from "../../foundations-runtime/examples/context/dependency-tool.mjs";
import { authorizedDocumentTool } from "../../foundations-runtime/examples/context/authorized-tool.mjs";
import { createVisibilityAgent } from "../../foundations-runtime/examples/context/visibility.mjs";
import {
  personalize,
  workshopInstant,
} from "../../foundations-runtime/examples/context/personalization.mjs";
import { createSharedAgents } from "../../foundations-runtime/examples/context/shared-context.mjs";
import { metadataTool } from "./examples/context/tool-call-metadata.mjs";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";

// Keep model and tool payloads out of SDK diagnostic logs in these privacy lessons.
process.env.OPENAI_AGENTS_DONT_LOG_MODEL_DATA = "1";
process.env.OPENAI_AGENTS_DONT_LOG_TOOL_DATA = "1";

const stage = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});
const select = (value, choices, label) => {
  if (!choices.includes(value)) throw new Error(`Choose a listed ${label}.`);
  return value;
};

function completedText(result) {
  if (
    typeof result.finalOutput !== "string" ||
    !result.finalOutput.trim() ||
    result.interruptions?.length
  )
    throw new Error("The SDK run did not return a completed text result.");
  return result.finalOutput;
}

async function runnerFactory({ live, env, dependencies }) {
  if (!live) return () => new sdk.Runner({ tracingDisabled: true });
  const config = loadConfig(env);
  const OpenAI = dependencies?.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
  const provider = new sdk.OpenAIProvider({ openAIClient: client });
  const Runner = dependencies?.Runner ?? sdk.Runner;
  return () => new Runner({ modelProvider: provider, tracingDisabled: true });
}

export async function executeContext(
  number,
  input,
  { env = {}, signal, dependencies } = {},
) {
  const live = input.mode === "live";
  if (live && [17, 19, 24].includes(number))
    throw new Error(
      "This lesson uses local validation or controlled SDK runs.",
    );
  if (live) loadConfig(env);
  const context = parseContext(makeContext(input));
  const makeRunner = await runnerFactory({ live, env, dependencies });
  const run = (agent, question, runContext = context, runSignal = signal) =>
    makeRunner().run(agent, question, {
      context: runContext,
      signal: runSignal,
      maxTurns: 5,
    });
  const state = {};
  let localModel;
  let childModel;
  let result;
  let output;
  let evidence;
  let events;
  let takeaway;
  let label = live
    ? "Actual SDK run · OpenAI model"
    : "Actual SDK runner · scripted local model";
  const modelName = env.OPENAI_MODEL || "gpt-6-astra";

  if (number === 17) {
    const candidate = contextCandidate(input);
    const validation = contextSchema.safeParse(candidate);
    const agent = createTypedTutor(modelName);
    const instructions = validation.success
      ? await agent.getSystemPrompt(new sdk.RunContext(validation.data))
      : undefined;
    output = validation.success
      ? `Context accepted.\n${instructions}`
      : "Context rejected before agent execution. Inspect the validation issue paths.";
    evidence = {
      validationSucceeded: validation.success,
      ...(validation.success
        ? { context: validation.data, resolvedInstructions: instructions }
        : {
            issues: validation.error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          }),
      typeSource: "AppContext = z.infer<typeof contextSchema>",
      modelRequests: 0,
    };
    events = [
      stage(
        "Build the application context",
        "User identity, tenant identity, preferences, and request metadata.",
      ),
      stage(
        "Validate its runtime shape",
        validation.success
          ? "Zod accepted the context."
          : "Zod rejected an incomplete or invalid field.",
      ),
      stage(
        "Apply the SDK context type",
        "The executable TypeScript source creates Agent<AppContext>.",
        "sdk",
      ),
      stage(
        "Inspect the result",
        instructions ?? "The rejected payload is not passed to an agent.",
        "sdk",
      ),
    ];
    takeaway =
      "TypeScript describes the context type. Runtime validation checks incoming values before using them.";
    label = "Actual TypeScript SDK construction + Zod validation";
  }

  if ([18, 20, 24].includes(number)) {
    const trace = [];
    const controller = new AbortController();
    const combinedSignal = AbortSignal.any(
      [signal, controller.signal].filter(Boolean),
    );
    const outcome =
      number === 24
        ? select(
            input.lifecycleOutcome ?? "success",
            ["success", "failure", "cancel", "init-failure"],
            "lifecycle scenario",
          )
        : "success";
    const documentId =
      number === 20
        ? select(
            input.documentId ?? "doc-a",
            ["doc-a", "doc-b", "missing"],
            "document identifier",
          )
        : undefined;
    state.authorization = "not_called";
    let handledError;
    try {
      result = await withClassroomServices(
        { trace, outcome, controller },
        async (services) => {
          const runContext = { ...context, services };
          const tool =
            number === 20
              ? authorizedDocumentTool({ sdk, z, state })
              : dependencyTool({ sdk, z, state });
          localModel = scriptedModel([
            functionCall(tool.name, number === 20 ? { documentId } : {}),
            () =>
              message(
                number === 20
                  ? state.value.text
                  : `${state.value.title}\n${state.value.description}\nMaterials — ${state.value.materials.join(", ")}`,
              ),
          ]);
          const agent = new sdk.Agent({
            name:
              number === 20
                ? "Authorized document reader"
                : "Workshop assistant",
            model: live ? modelName : localModel,
            instructions: `Use ${tool.name} to answer the request. Report only the tool's actual result.`,
            tools: [tool],
          });
          return run(
            agent,
            number === 20
              ? `Read document ${documentId}.`
              : "Read my school's workshop and its materials.",
            runContext,
            combinedSignal,
          );
        },
      );
    } catch (error) {
      if (number === 20 && state.authorization === "denied")
        handledError = "Document unavailable.";
      else if (number === 24 && outcome !== "success")
        handledError = controller.signal.aborted
          ? "The run was cancelled."
          : outcome === "init-failure"
            ? "The classroom API client failed to initialize."
            : "The classroom API operation failed.";
      else throw error;
    }
    output = handledError
      ? `${handledError}\nOwned clients were cleaned up. Inspect the lifecycle trace.`
      : completedText(result);
    const closedClients = trace
      .filter((entry) => entry.event.endsWith(".close"))
      .map((entry) => entry.event);
    const initializationFailed =
      number === 24 && outcome === "init-failure" && !localModel;
    if (initializationFailed)
      label = "Actual local client initialization + cleanup";
    evidence = {
      dataSource: "In-memory classroom adapters",
      profile: { userId: context.user.id, tenantId: context.tenant.id },
      trace,
      closedClients,
      ...(state.value ? { actualToolResult: state.value } : {}),
      ...(number === 20
        ? {
            requestedDocumentId: documentId,
            authorization: state.authorization,
            decisionSource: "Tenant-scoped lookup inside the tool",
          }
        : {}),
      ...(number === 24
        ? {
            requestedOutcome: outcome,
            completed: !handledError,
            handledOutcome: handledError ?? "success",
          }
        : {}),
      sdkModelCalls: live
        ? (result?.rawResponses?.length ?? null)
        : (localModel?.calls ?? 0),
    };
    events =
      number === 20
        ? [
            stage(
              "Load a trusted classroom identity",
              `Simulated authenticated tenant ${context.tenant.id}.`,
            ),
            stage("Receive the requested identifier", documentId, "model"),
            stage(
              "Authorize inside the tool",
              `Query by tenantId and documentId. Decision: ${state.authorization}.`,
              "tool",
            ),
            stage(
              "Inspect the response and cleanup",
              handledError ?? "The scoped lookup returned an allowed document.",
            ),
          ]
        : [
            stage(
              "Initialize owned clients",
              "Create local database, API, and logging adapters.",
            ),
            stage(
              initializationFailed
                ? "Inspect initialization failure"
                : "Pass clients through context",
              initializationFailed
                ? "The API adapter failed during initialization."
                : "The registered tool reads services from runContext.context.",
              initializationFailed ? "application" : "sdk",
            ),
            stage(
              initializationFailed
                ? "Skip the SDK run"
                : "Execute the SDK tool",
              initializationFailed
                ? "Initialization ended before an agent run was started."
                : (handledError ?? "The tool reused the injected clients."),
              initializationFailed ? "application" : "tool",
            ),
            stage("Close resources in finally", closedClients.join(" → ")),
          ];
    takeaway =
      number === 20
        ? "Enforce authorization in the resource lookup using authenticated context. Reject unavailable and out-of-scope identifiers with the same generic error."
        : "Await resource operations before cleanup. Close every owned client even when initialization, execution, or cancellation ends the run.";
  }

  if (number === 19) {
    const visibility = select(
      input.visibility ?? "local",
      ["local", "instructions", "tool"],
      "visibility channel",
    );
    context.localOnlyMarker = "CLASSROOM_LOCAL_ONLY_MARKER";
    localModel = scriptedModel(
      visibility === "tool"
        ? [
            functionCall("read_preferences"),
            () =>
              message(
                `Teaching preferences received for ${state.value.displayName}.`,
              ),
          ]
        : [message("An agent can use a model and tools to complete a task.")],
      { captureRequests: true },
    );
    const agent = createVisibilityAgent({
      sdk,
      z,
      model: localModel,
      visibility,
      state,
    });
    result = await run(agent, "Explain an AI agent.");
    const transmitted = JSON.stringify(localModel.requests);
    output = `${completedText(result)}\n\nLocal marker present in adapter requests — ${transmitted.includes(context.localOnlyMarker)}`;
    evidence = {
      localContext: context,
      actualAdapterRequests: localModel.requests,
      localMarkerFoundInRequests: transmitted.includes(context.localOnlyMarker),
      modelTransport:
        "Local scripted Model adapter. These are SDK-normalized requests.",
    };
    events = [
      stage(
        "Prepare local context",
        "The object includes identity, preferences, and a local-only teaching marker.",
      ),
      stage("Select an explicit visibility channel", visibility, "sdk"),
      stage(
        "Execute the actual SDK run",
        `The SDK made ${localModel.calls} local model-adapter calls.`,
        "model",
      ),
      stage(
        "Inspect captured adapter requests",
        "Review systemInstructions, input history, and returned tool information.",
      ),
    ];
    takeaway =
      "Inspect the actual model request when checking visibility. Selected instructions and tool results are explicit channels for application data.";
  }

  if (number === 21) {
    const personalized = personalize(context);
    const spanish = context.preferences.language === "Spanish";
    localModel = scriptedModel([
      message(
        spanish
          ? `El taller comienza el ${personalized.time} (${context.preferences.timezone}). Un agente de IA usa un modelo para decidir su siguiente acción.${context.preferences.detail === "detailed" ? " Una herramienta puede consultar datos y devolver el resultado al modelo para continuar." : ""}`
          : `The workshop begins at ${personalized.time} (${context.preferences.timezone}). An AI agent uses a model to decide its next action.${context.preferences.detail === "detailed" ? " A tool can retrieve data and return its result to the model so the agent can continue." : ""}`,
      ),
    ]);
    const agent = new sdk.Agent({
      name: "Personalized workshop tutor",
      model: live ? modelName : localModel,
      instructions: personalized.instructions,
    });
    result = await run(
      agent,
      "Tell me when to attend and explain an AI agent.",
    );
    output = completedText(result);
    evidence = {
      workshopInstantUTC: workshopInstant,
      localTime: personalized.time,
      modelInstructions: personalized.instructions,
      includedPreferenceKeys: ["language", "timezone", "detail"],
      omittedIdentityFields: ["user.id", "tenant.id", "request.id"],
      context,
    };
    events = [
      stage(
        "Read the selected preferences",
        JSON.stringify(context.preferences),
      ),
      stage(
        "Convert the workshop time",
        `${workshopInstant} → ${personalized.time}`,
      ),
      stage("Build focused instructions", personalized.instructions, "sdk"),
      stage(
        "Inspect the personalized response",
        live
          ? "Actual model response."
          : "Actual SDK run using a scripted local response.",
        "model",
      ),
    ];
    takeaway =
      "Expose the preferences that the response needs. Keep application identifiers in local context.";
  }

  if (number === 22) {
    const pattern = select(
      input.contextPattern ?? "handoff",
      ["handoff", "nested-shared", "nested-copy"],
      "context pattern",
    );
    const shared = { ...context, notes: [] };
    state.parentContext = shared;
    localModel = scriptedModel(
      pattern === "handoff"
        ? [
            functionCall("transfer_notes"),
            functionCall("add_note", {}, "classroom-call-2"),
            message("The specialist added the classroom note."),
          ]
        : [
            functionCall("delegate_notes"),
            message("The nested specialist completed its request."),
          ],
    );
    if (pattern !== "handoff")
      childModel = scriptedModel([
        functionCall("add_note"),
        message("The classroom note was added."),
      ]);
    const agent = createSharedAgents({
      sdk,
      z,
      model: live ? modelName : localModel,
      childModel: live ? undefined : childModel,
      pattern,
      makeRunner,
      state,
    });
    result = await run(
      agent,
      "Add the classroom note using the configured specialist.",
      shared,
    );
    output = `${completedText(result)}\n\nParent notes — ${shared.notes.length}\nSpecialist notes — ${state.childNotes?.length ?? 0}`;
    evidence = {
      pattern,
      parentNotes: shared.notes,
      childNotes: state.childNotes ?? [],
      ...(state.handoffSharesContext !== undefined
        ? { handoffSharesContext: state.handoffSharesContext }
        : {}),
      ...(state.nestedSharesContext !== undefined
        ? { nestedSharesContext: state.nestedSharesContext }
        : {}),
      lastAgent: result.lastAgent?.name ?? null,
      sdkItemTypes: result.newItems?.map((item) => item.type) ?? [],
      sdkModelCalls: live ? null : localModel.calls + (childModel?.calls ?? 0),
    };
    events = [
      stage(
        "Create fresh request-local state",
        "The notes array starts empty for each exercise.",
      ),
      stage("Select context propagation", pattern, "sdk"),
      stage(
        "Execute handoff or nested run",
        "The specialist's actual tool writes to the context it receives.",
        "tool",
      ),
      stage(
        "Compare the resulting arrays",
        `Parent=${shared.notes.length}; specialist=${state.childNotes?.length ?? 0}`,
      ),
    ];
    takeaway =
      "Handoffs share run context. Manual nested calls use the context object you supply. Copying that object gives the child separate mutable state.";
  }

  if (number === 23) {
    const recordId = select(
      input.recordId ?? "record-a",
      ["record-a", "record-b"],
      "record",
    );
    const logs = [];
    const privateNote = "sample-only-keep-private";
    const tool = metadataTool({ sdk, z, logs });
    localModel = scriptedModel([
      functionCall(tool.name, { recordId, privateNote }),
      message(
        "Call metadata was inspected using the application log allowlist.",
      ),
    ]);
    const agent = new sdk.Agent({
      name: "Safe metadata inspector",
      model: live ? modelName : localModel,
      instructions:
        "Use inspect_record with the requested fixture fields. Confirm completion briefly and keep the supplied private note out of the response.",
      tools: [tool],
    });
    result = await run(
      agent,
      `Inspect ${recordId} with privateNote ${privateNote}.`,
    );
    output = completedText(result).replaceAll(privateNote, "[redacted]");
    evidence = {
      safeApplicationLogs: logs,
      loggedFieldNames: ["callId", "toolName", "argumentNames", "requestId"],
      argumentValuesLogged: false,
      installedSDKContract:
        "execute(arguments, RunContext, ToolCallDetails); details.toolCall.callId",
      sdkPayloadLoggingSuppressed: true,
      observedToolCalls: logs.length,
    };
    events = [
      stage(
        "Validate the tool arguments",
        "The actual tool schema validates recordId and privateNote.",
        "sdk",
      ),
      stage(
        "Read supported call details",
        "Call identity comes from ToolCallDetails.toolCall.",
        "tool",
      ),
      stage(
        "Log allowlisted metadata",
        "The application records argument names and call identity.",
      ),
      stage(
        "Inspect the safe log",
        `Observed ${logs.length} actual tool calls.`,
      ),
    ];
    takeaway =
      "Check the installed SDK's tool-call details contract. Log a small allowlist of metadata and keep sensitive argument values out of logs.";
  }

  return { label, events, output, evidence, takeaway };
}
