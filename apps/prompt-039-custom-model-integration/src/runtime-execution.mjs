import * as sdk from "@openai/agents";
import OpenAI from "openai";
import { z } from "zod";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import {
  ControlledModel,
  ControlledProvider,
} from "./examples/runtime/controlled-model.ts";
import {
  localHTTPProvider,
  localWebSocketProvider,
} from "../../foundations-runtime/examples/runtime/local-provider.mjs";
import {
  capturedTransport,
  apiMessage,
} from "../../foundations-runtime/examples/structured/captured-transport.mjs";
import {
  message,
  functionCall,
  scriptedModel,
} from "../../foundations-runtime/examples/context/scripted-model.mjs";
import { pythonExecutable, runJsonProcess } from "../../foundations-runtime/python-runtime.mjs";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";

const stage = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});
function choose(value, choices) {
  if (!choices.includes(value))
    throw new Error("Choose a listed lesson scenario.");
  return value;
}
function complete(result) {
  if (result.finalOutput === undefined || result.interruptions?.length)
    throw new Error("The SDK run returned no completed output.");
  return result.finalOutput;
}
const arithmeticSchema = z.object({
  total: z.number(),
  explanation: z.string(),
});
const orderTask =
  "Calculate the total for 3 robotics kits at 12 each and 2 sensors at 7 each. Explain the calculation in at most 30 words.";
const localOrder = {
  total: 50,
  explanation:
    "Three kits cost 36 and two sensors cost 14. Together they cost 50.",
};
function acceptance(value, expected) {
  return {
    correctTotal: value.total === expected,
    hasExplanation: value.explanation.trim().length > 0,
    withinWordLimit: value.explanation.trim().split(/\s+/).length <= 30,
  };
}
function liveClient(env) {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: 45000,
    maxRetries: 0,
  });
}
const runnerFor = (client) =>
  new sdk.Runner({
    tracingDisabled: true,
    ...(client
      ? { modelProvider: new sdk.OpenAIProvider({ openAIClient: client }) }
      : {}),
  });

export async function executeRuntime(number, input, { env = {}, signal } = {}) {
  const live = input.mode === "live";
  if (live && ![35, 36, 37, 38].includes(number))
    throw new Error("This lesson runs a controlled local SDK example.");
  if (live) loadConfig(env);
  let output, evidence, events, takeaway;
  let label = live
    ? "Actual SDK execution · live model"
    : "Actual SDK execution · scripted classroom inference";

  // lesson:35
  if (number === 35) {
    const comparison = choose(input.reasoningComparison ?? "effort", [
      "effort",
      "verbosity",
    ]);
    const rows = [];
    for (const level of ["low", "high"]) {
      const settings = {
        reasoning: { effort: comparison === "effort" ? level : "low" },
        text: { verbosity: comparison === "verbosity" ? level : "low" },
        maxTokens: 1024,
      };
      const transport = capturedTransport([
        apiMessage(JSON.stringify(localOrder)),
      ]);
      const agent = new sdk.Agent({
        name: "Reasoning comparison",
        model: "gpt-6-astra",
        modelSettings: settings,
        outputType: arithmeticSchema,
        instructions: "Return the requested total and a concise explanation.",
      });
      const started = performance.now();
      const result = await runnerFor(
        live ? liveClient(env) : transport.client,
      ).run(agent, orderTask, { signal, maxTurns: 3 });
      const value = arithmeticSchema.parse(complete(result));
      const checks = acceptance(value, 50);
      rows.push({
        level,
        settings,
        value,
        checks,
        accepted: Object.values(checks).every(Boolean),
        elapsedSdkMs: Math.round((performance.now() - started) * 100) / 100,
        usage: result.runContext.usage,
        ...(!live ? { capturedRequest: transport.requests[0] } : {}),
      });
    }
    output = rows
      .map(
        (row) =>
          `${row.level} — total ${row.value.total} · checks ${row.accepted ? "pass" : "fail"} · ${row.elapsedSdkMs} ms`,
      )
      .join("\n");
    evidence = {
      task: orderTask,
      expectedTotal: 50,
      rows,
      inferenceIsScripted: !live,
      measurementScope: live
        ? "Account-backed end-to-end SDK runs. Repeat trials before drawing performance conclusions."
        : "Local transport and SDK execution. Token counts are zero fixtures and timing describes local execution.",
    };
    events = [
      stage(
        "Fix the task and criteria",
        "Both runs calculate the same order with the same schema.",
      ),
      stage(
        "Run both settings",
        `${comparison} low and high on GPT-6 Astra.`,
        "model",
      ),
      stage(
        "Measure each completed run",
        "Record elapsed wall time, usage, and acceptance checks.",
        "sdk",
      ),
      stage("Compare the observed results", output),
    ];
    takeaway =
      "Compare settings on the same task with explicit correctness criteria. Local fixtures demonstrate measurement plumbing. Live repeated trials measure model behavior.";
  }

  // lesson:36
  if (number === 36) {
    const task = choose(input.routingTask ?? "easy", ["easy", "hard"]);
    const strategy = choose(input.routingStrategy ?? "mixed", [
      "mixed",
      "direct",
    ]);
    const question =
      task === "easy" ? "What is 2 + 2? Explain briefly." : orderTask;
    const expected = task === "easy" ? 4 : 50;
    const routeSchema = z.object({ route: z.enum(["small", "capable"]) });
    const route = task === "easy" ? "small" : "capable";
    const value =
      task === "easy"
        ? { total: 4, explanation: "Two plus two equals four." }
        : localOrder;
    const plan =
      strategy === "mixed"
        ? [
            apiMessage(JSON.stringify({ route })),
            apiMessage(JSON.stringify(value)),
          ]
        : [apiMessage(JSON.stringify(value))];
    const transport = capturedTransport(plan);
    const runner = runnerFor(live ? liveClient(env) : transport.client);
    const observed = [];
    const started = performance.now();
    let selected = "capable";
    if (strategy === "mixed") {
      const router = new sdk.Agent({
        name: "Small routing model",
        model: "gpt-6-luna",
        outputType: routeSchema,
        instructions:
          "Route simple addition to small and multistep order calculations to capable.",
      });
      const routed = await runner.run(router, question, {
        signal,
        maxTurns: 3,
      });
      selected = routeSchema.parse(complete(routed)).route;
      observed.push({
        agent: router.name,
        model: router.model,
        usage: routed.runContext.usage,
      });
    }
    const model = selected === "small" ? "gpt-6-luna" : "gpt-6-astra";
    const specialist = new sdk.Agent({
      name: "Calculation specialist",
      model,
      outputType: arithmeticSchema,
      instructions:
        "Calculate accurately. Include an explanation in at most 30 words.",
    });
    const result = await runner.run(specialist, question, {
      signal,
      maxTurns: 3,
    });
    const answer = arithmeticSchema.parse(complete(result));
    observed.push({
      agent: specialist.name,
      model,
      usage: result.runContext.usage,
    });
    const checks = acceptance(answer, expected);
    evidence = {
      strategy,
      task: question,
      selectedModel: model,
      observed,
      modelCalls: observed.reduce(
        (count, row) => count + row.usage.requests,
        0,
      ),
      elapsedSdkMs: Math.round((performance.now() - started) * 100) / 100,
      checks,
      inferenceIsScripted: !live,
      performanceInterpretation: live
        ? "Observed wall time and provider token reports for this trial. No pricing estimate is applied."
        : "Local adapter timing and fixture output. No model quality, cost or latency benchmark is inferred.",
      ...(!live ? { capturedRequests: transport.requests } : {}),
    };
    output = `Selected model — ${model}\nSDK model calls — ${evidence.modelCalls}\nTotal — ${answer.total}\nAcceptance — ${Object.values(checks).every(Boolean) ? "pass" : "fail"}\nElapsed — ${evidence.elapsedSdkMs} ms`;
    events = [
      stage("Select the task and strategy", question),
      stage(
        "Resolve the route",
        strategy === "mixed"
          ? `Router selected ${selected}.`
          : "Direct capable-model execution.",
        "model",
      ),
      stage("Run the selected specialist", model, "sdk"),
      stage("Measure the tradeoff", output),
    ];
    takeaway =
      "Routing adds a model call. Compare actual usage, elapsed time, and task acceptance across strategies before choosing a production policy.";
  }

  // lesson:37
  if (number === 37 || number === 38) {
    const feature =
      number === 37
        ? choose(input.apiFeature ?? "text", ["text", "tool", "hosted"])
        : choose(input.providerFeature ?? "tools", [
            "tools",
            "structured",
            "streaming",
            "missing-usage",
          ]);
    if (
      number === 38 &&
      live &&
      (!env.ALT_PROVIDER_URL || !env.ALT_PROVIDER_MODEL)
    )
      throw new Error(
        "Set ALT_PROVIDER_URL and ALT_PROVIDER_MODEL for your OpenAI-compatible external provider. OPENAI_API_KEY supplies that provider credential.",
      );
    const local = live
      ? undefined
      : await localHTTPProvider({ omitUsage: feature === "missing-usage" });
    const client = live
      ? new OpenAI({
          apiKey: env.OPENAI_API_KEY,
          ...(number === 38 ? { baseURL: env.ALT_PROVIDER_URL } : {}),
          timeout: 45000,
          maxRetries: 0,
        })
      : new OpenAI({
          apiKey: "classroom-local-provider",
          baseURL: local.baseURL,
          maxRetries: 0,
          timeout: 10000,
        });
    const observedTools = [];
    const tool = sdk.tool({
      name: "classroom_lookup",
      description: "Read the classroom fixture.",
      parameters: z.object({}),
      execute: async () => {
        observedTools.push("classroom_lookup");
        return "Verified classroom data.";
      },
    });
    const rows = [];
    try {
      for (const api of number === 37 ? ["responses", "chat"] : ["chat"]) {
        const modelName =
          number === 38
            ? live
              ? env.ALT_PROVIDER_MODEL
              : "classroom-compatible-model"
            : "gpt-6-luna";
        const adapter =
          api === "responses"
            ? new sdk.OpenAIResponsesModel(client, modelName)
            : new sdk.OpenAIChatCompletionsModel(client, modelName, {
                strictFeatureValidation: true,
              });
        const agent = new sdk.Agent({
          name: `${api} provider tutor`,
          model: adapter,
          modelSettings: number === 37 ? { reasoning: { effort: "none" } } : {},
          instructions:
            "Use the provided tool when available, then answer briefly.",
          tools:
            feature === "hosted"
              ? [sdk.webSearchTool()]
              : ["tool", "tools"].includes(feature)
                ? [tool]
                : [],
          ...(feature === "structured"
            ? { outputType: z.object({ answer: z.string() }) }
            : {}),
        });
        const before = local?.requests.length ?? 0;
        const streamedEvents = [];
        try {
          const result = await new sdk.Runner({ tracingDisabled: true }).run(
            agent,
            "Describe the classroom data.",
            {
              signal,
              maxTurns: 4,
              ...(feature === "streaming" ? { stream: true } : {}),
            },
          );
          if (feature === "streaming") {
            for await (const event of result)
              streamedEvents.push(
                event.type === "raw_model_stream_event"
                  ? event.data.type
                  : event.type,
              );
            await result.completed;
          }
          rows.push({
            api,
            accepted: true,
            finalOutput: complete(result),
            usage: result.runContext.usage,
            streamedEvents,
            localRequests: (local?.requests.length ?? 0) - before,
          });
        } catch (error) {
          if (!(
            number === 37 &&
            api === "chat" &&
            feature === "hosted" &&
            error.message.startsWith("Hosted tools are not supported")
          ))
            throw error;
          rows.push({
            api,
            accepted: false,
            errorType: error.name,
            error: error.message,
            localRequests: (local?.requests.length ?? 0) - before,
          });
        }
      }
      evidence = {
        feature,
        rows,
        observedTools,
        ...(local
          ? {
              actualRequests: local.requests,
              provider: "Controlled loopback OpenAI-compatible HTTP server",
              usageReporting:
                feature === "missing-usage"
                  ? "Provider omitted usage. SDK zero counters indicate unavailable reporting."
                  : "Token counts are synthetic provider fixtures.",
              inferenceIsScripted: true,
            }
          : {
              provider:
                number === 38
                  ? "Configured external OpenAI-compatible provider"
                  : "OpenAI",
              inferenceIsScripted: false,
            }),
        capabilityScope:
          "These observations apply to the selected provider and adapter. Verify tools, schemas, streaming and usage for every external provider.",
      };
    } finally {
      await local?.close();
    }
    output = rows
      .map(
        (row) =>
          `${row.api} — ${row.accepted ? "completed" : "rejected"}\n${row.accepted ? JSON.stringify(row.finalOutput) : row.error}`,
      )
      .join("\n\n");
    events = [
      stage("Select the adapter and feature", feature),
      stage(
        "Execute the provider integration",
        live
          ? "Use the configured account-backed endpoint."
          : "Use the controlled loopback HTTP provider.",
        "model",
      ),
      stage(
        "Inspect SDK operations",
        `Observed tools: ${observedTools.length}.`,
        "sdk",
      ),
      stage("Compare observed capabilities", output),
    ];
    takeaway =
      number === 37
        ? "Responses supports hosted tools and response chaining. This strict Chat adapter rejects unsupported hosted tools before making a request. Model-specific function-tool compatibility also applies."
        : "An OpenAI-compatible adapter is a protocol boundary. Verify each provider capability and treat absent usage as unavailable accounting.";
  }

  // lesson:39
  if (number === 39) {
    const scenario = choose(input.adapterScenario ?? "text", [
      "text",
      "stream",
      "invalid",
    ]);
    const provider = new ControlledProvider(() => [
      message(
        scenario === "invalid"
          ? "incomplete JSON"
          : "A controlled backend completed the request.",
      ),
    ]);
    const agent = new sdk.Agent({
      name: "Custom adapter tutor",
      model: "controlled-backend",
      ...(scenario === "invalid"
        ? { outputType: z.object({ answer: z.string() }) }
        : {}),
    });
    let accepted = true,
      errorType,
      finalOutput;
    const streamEvents = [];
    try {
      const result = await new sdk.Runner({
        tracingDisabled: true,
        modelProvider: provider,
      }).run(agent, "Explain custom model integration.", {
        signal,
        ...(scenario === "stream" ? { stream: true } : {}),
      });
      if (scenario === "stream") {
        for await (const event of result)
          streamEvents.push(
            event.type === "raw_model_stream_event"
              ? event.data.type
              : event.type,
          );
        await result.completed;
      }
      finalOutput = complete(result);
    } catch (error) {
      if (scenario !== "invalid" || !(error instanceof sdk.ModelBehaviorError))
        throw error;
      accepted = false;
      errorType = error.name;
    }
    const model = provider.models.get("controlled-backend");
    evidence = {
      accepted,
      ...(accepted ? { finalOutput } : { errorType }),
      requests: model.requests,
      streamEvents,
      modelInterface: ["getResponse", "getStreamedResponse"],
      providerInterface: "getModel",
      usageKind: "Zero-token controlled backend fixture",
      externalNetworkRequests: 0,
    };
    output = accepted
      ? `${finalOutput}\nObserved model calls — ${model.requests.length}\nStream events — ${streamEvents.length}`
      : `SDK rejected invalid structured output — ${errorType}`;
    events = [
      stage(
        "Resolve the custom provider",
        "getModel resolves the controlled backend.",
      ),
      stage(
        "Execute the installed Model contract",
        scenario === "stream"
          ? "getStreamedResponse yields typed events."
          : "getResponse returns output, usage, and an identifier.",
        "model",
      ),
      stage(
        "Inspect the SDK result",
        accepted
          ? "A complete result is available."
          : "Structured output failed SDK validation.",
        "sdk",
      ),
      stage(
        "Gate application use",
        accepted
          ? "The completed output can be consumed."
          : "The invalid output is rejected.",
      ),
    ];
    takeaway =
      "Implement both complete-response and streaming contracts and return correctly shaped SDK output, usage and identifiers.";
  }

  // lesson:40
  if (number === 40) {
    const policy = choose(input.connectionPolicy ?? "reuse", [
      "reuse",
      "fresh",
    ]);
    const local = await localWebSocketProvider();
    const client = new OpenAI({
      apiKey: "classroom-local-socket",
      timeout: 10000,
      maxRetries: 0,
    });
    const model = new sdk.OpenAIResponsesWSModel(client, "gpt-6-luna", {
      websocketBaseURL: local.url,
      reuseConnection: policy === "reuse",
    });
    const answers = [];
    try {
      const agent = new sdk.Agent({ name: "Responses socket tutor", model });
      const runner = new sdk.Runner({ tracingDisabled: true });
      for (const question of [
        "Explain the transport.",
        "Explain connection reuse.",
      ]) {
        const result = await runner.run(agent, question, {
          signal,
          maxTurns: 2,
        });
        answers.push({
          answer: complete(result),
          responseId: result.lastResponseId,
        });
      }
    } finally {
      await model.close();
      await local.close();
    }
    evidence = {
      policy,
      ...local.observations,
      answers,
      inferenceIsScripted: true,
      transport: "Actual SDK Responses WebSocket model over loopback",
      cleanupCompleted: true,
      externalNetworkRequests: 0,
    };
    output = `Completed SDK runs — ${answers.length}\nObserved WebSocket connections — ${evidence.connections}\nObserved request frames — ${evidence.frames.length}\nConnection IDs — ${evidence.frames.map((item) => item.connectionId).join(", ")}\nCleanup — completed`;
    events = [
      stage(
        "Start the local Responses endpoint",
        "Listen on an ephemeral loopback WebSocket port.",
      ),
      stage("Execute two SDK runs", `Connection policy: ${policy}.`, "sdk"),
      stage("Observe actual connection reuse", output),
      stage(
        "Close owned resources",
        "Close the SDK model and the fixture server.",
      ),
    ];
    takeaway =
      "Responses sockets carry response.create requests and response events for text-and-tool workflows. Realtime voice uses its own session and audio-event protocol.";
    label = "Actual SDK WebSocket transport · local protocol fixture";
  }

  // lesson:41
  if (number === 41) {
    const method = choose(input.executionMethod ?? "async-ts", [
      "async-ts",
      "async-python",
      "sync-python",
    ]);
    if (method === "async-ts") {
      const model = new ControlledModel("async-typescript", () => [
        message("Completed asynchronous TypeScript SDK execution."),
      ]);
      const started = performance.now();
      const result = await new sdk.Runner({ tracingDisabled: true }).run(
        new sdk.Agent({ name: "Async execution tutor", model }),
        "Explain async execution.",
        { signal },
      );
      evidence = {
        method,
        finalOutput: complete(result),
        lastResponseId: result.lastResponseId,
        elapsedSdkMs: Math.round((performance.now() - started) * 100) / 100,
        scriptedInference: true,
      };
    } else {
      evidence = await runJsonProcess(
        pythonExecutable(env),
        [
          fileURLToPath(
            new URL("../../foundations-runtime/examples/runtime/execution_methods.py", import.meta.url),
          ),
          method,
        ],
        {
          env: {
            ...process.env,
            OPENAI_API_KEY: "",
            OPENAI_AGENTS_DONT_LOG_MODEL_DATA: "1",
          },
          signal,
        },
      );
    }
    output = `${evidence.finalOutput}\nMethod — ${method}\nResponse ID — ${evidence.lastResponseId}\nSDK time — ${evidence.elapsedSdkMs} ms`;
    events = [
      stage("Select the language and method", method),
      stage(
        "Execute the real SDK method",
        "Await the complete result or call the Python synchronous wrapper.",
        "sdk",
      ),
      stage("Inspect completion", evidence.lastResponseId),
      stage(
        "Choose the caller integration",
        method === "sync-python"
          ? "Use run_sync outside an already-running event loop."
          : "Await asynchronous work inside the caller’s event loop.",
      ),
    ];
    takeaway =
      "TypeScript SDK execution is promise-based. Python provides asynchronous execution and a synchronous wrapper. Use async methods inside an active event loop.";
  }

  // lesson:42
  if (number === 42) {
    const budget = Number(
      choose(String(input.turnBudget ?? "3"), ["1", "2", "3"]),
    );
    let toolExecutions = 0;
    const lookup = sdk.tool({
      name: "classroom_lookup",
      description: "Read a local teaching fixture.",
      parameters: z.object({}),
      execute: async () => {
        toolExecutions++;
        return "Local lookup complete.";
      },
    });
    const model = scriptedModel([
      functionCall(lookup.name),
      functionCall(lookup.name, {}, "classroom-call-2"),
      message("Completed after two tool lookups."),
    ]);
    const agent = new sdk.Agent({
      name: "Turn limit tutor",
      model,
      tools: [lookup],
    });
    let completed = false,
      errorType;
    try {
      const result = await new sdk.Runner({ tracingDisabled: true }).run(
        agent,
        "Read the fixture twice, then answer.",
        { maxTurns: budget, signal },
      );
      output = `${complete(result)}\nModel calls — ${model.calls}\nTool executions — ${toolExecutions}`;
      completed = true;
    } catch (error) {
      if (!(error instanceof sdk.MaxTurnsExceededError)) throw error;
      errorType = error.name;
      output = `Run stopped at the SDK turn limit.\nModel calls — ${model.calls}\nTool executions — ${toolExecutions}`;
    }
    evidence = {
      maxTurns: budget,
      modelCalls: model.calls,
      toolExecutions,
      completed,
      ...(errorType ? { errorType } : {}),
      consumed: completed,
    };
    events = [
      stage("Set the model-turn budget", String(budget)),
      stage(
        "Run the tool loop",
        `Observed model calls: ${model.calls}.`,
        "model",
      ),
      stage("Inspect tool executions", String(toolExecutions), "tool"),
      stage(
        "Handle completion or the limit",
        completed
          ? "The third model call produced the final answer."
          : errorType,
        "sdk",
      ),
    ];
    takeaway =
      "Each model invocation consumes a run turn. Tool executions occur within that turn. A final answer requires enough turns to reach its model call.";
  }

  // lesson:43
  if (number === 43) {
    const config = choose(input.workflowConfig ?? "override", [
      "override",
      "agent-only",
    ]);
    const provider = new ControlledProvider((request) =>
      request.handoffs.length
        ? [functionCall(request.handoffs[0].toolName)]
        : [message("The specialist completed the configured workflow.")],
    );
    const agentSettings = { maxTokens: 1024, text: { verbosity: "high" } };
    const specialist = new sdk.Agent({
      name: "Explicit specialist",
      model: "gpt-6-astra",
      modelSettings: agentSettings,
    });
    const coordinator = new sdk.Agent({
      name: "Default coordinator",
      handoffs: [specialist],
    });
    const workflow =
      config === "override"
        ? {
            model: "gpt-6-luna",
            modelSettings: { maxTokens: 128, text: { verbosity: "low" } },
          }
        : {};
    const result = await new sdk.Runner({
      tracingDisabled: true,
      modelProvider: provider,
      ...workflow,
    }).run(coordinator, "Ask the specialist to complete the task.", {
      signal,
      maxTurns: 3,
    });
    const observed = [...provider.models].map(([model, adapter]) => ({
      model,
      requests: adapter.requests.map((request) => ({
        instructions: request.instructions,
        settings: request.settings,
      })),
    }));
    output = `${complete(result)}\nLast agent — ${result.lastAgent.name}\n${observed.map((row) => `${row.model} — maxTokens ${row.requests[0].settings.maxTokens ?? "default"}, verbosity ${row.requests[0].settings.text?.verbosity ?? "default"}`).join("\n")}`;
    evidence = {
      workflow,
      specialistSettings: agentSettings,
      observed,
      lastAgent: result.lastAgent.name,
      installedVersionBehavior:
        "Explicit agent model and modelSettings precede workflow defaults. Workflow settings fill fields omitted by an agent.",
      inferenceIsScripted: true,
    };
    events = [
      stage(
        "Define two agent configurations",
        "One uses a provider default and one explicitly selects Astra.",
      ),
      stage("Apply workflow configuration", JSON.stringify(workflow)),
      stage(
        "Run a real SDK handoff",
        "Coordinator transfers control to the specialist.",
        "sdk",
      ),
      stage("Inspect settings received by each model", output),
    ];
    takeaway =
      "This installed SDK uses workflow defaults for omitted agent configuration and preserves explicit agent model and modelSettings. Inspect observed requests when declaration wording differs.";
  }

  // lesson:44
  if (number === 44) {
    const scenario = choose(input.resultScenario ?? "handoff", [
      "handoff",
      "continuation",
      "approval",
    ]);
    let toolExecuted = false;
    const confirmation = sdk.tool({
      name: "classroom_confirmation",
      description: "An action that requires approval.",
      parameters: z.object({}),
      needsApproval: true,
      execute: async () => {
        toolExecuted = true;
        return "Confirmed.";
      },
    });
    const specialistModel = scriptedModel([
      message("The specialist completed the initial request."),
      message("The specialist continued using explicit history."),
    ]);
    const specialist = new sdk.Agent({
      name: "Result specialist",
      model: specialistModel,
    });
    const rootModel = scriptedModel([
      (request) =>
        functionCall(
          scenario === "approval"
            ? confirmation.name
            : request.handoffs[0].toolName,
        ),
    ]);
    const root = new sdk.Agent({
      name: "Result coordinator",
      model: rootModel,
      ...(scenario === "approval"
        ? { tools: [confirmation] }
        : { handoffs: [specialist] }),
    });
    const runner = new sdk.Runner({ tracingDisabled: true });
    const initial = await runner.run(
      root,
      "Ask the specialist to complete this request.",
      { signal, maxTurns: 3 },
    );
    let result = initial;
    if (scenario === "continuation")
      result = await runner.run(
        initial.lastAgent,
        [
          ...initial.history,
          { role: "user", content: "Continue with a follow-up explanation." },
        ],
        { signal, maxTurns: 2 },
      );
    const interrupted = result.interruptions.length > 0;
    const finalOutput = interrupted ? null : (result.finalOutput ?? null);
    evidence = {
      scenario,
      finalOutput,
      lastAgent: result.lastAgent?.name ?? null,
      activeAgent: result.activeAgent?.name ?? null,
      lastResponseId: result.lastResponseId,
      rawResponseIds: result.rawResponses.map(
        (response) => response.responseId,
      ),
      historyLength: result.history.length,
      initialHistoryLength: initial.history.length,
      interruptionCount: result.interruptions.length,
      stateAvailable: Boolean(result.state),
      toolExecuted,
      consumed: !interrupted && finalOutput !== null,
      continuationMethod:
        scenario === "continuation"
          ? "Actual runner.run(lastAgent, [...history, userMessage])"
          : "Inspect history and resumable RunState",
    };
    output = `Final output — ${evidence.finalOutput ?? "Waiting for approval"}\nLast active agent — ${evidence.lastAgent}\nLast response ID — ${evidence.lastResponseId}\nHistory items — ${evidence.historyLength}\nInterruptions — ${evidence.interruptionCount}`;
    events = [
      stage("Execute the selected run", scenario),
      stage(
        "Inspect output and ownership",
        `${evidence.lastAgent}: ${evidence.finalOutput ?? "paused"}`,
        "sdk",
      ),
      stage(
        "Inspect identifiers and continuation",
        evidence.continuationMethod,
      ),
      stage(
        "Gate consumption",
        `Consumed: ${evidence.consumed}. Tool executed: ${toolExecuted}.`,
      ),
    ];
    takeaway =
      "RunResult exposes final output, agent ownership, identifiers, history and interruption state. Choose explicit history or supported provider state for continuation.";
  }
  // lesson:end
  return { label, output, evidence, events, takeaway };
}
