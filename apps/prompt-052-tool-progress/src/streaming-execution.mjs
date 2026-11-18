import * as sdk from "@openai/agents";
import { z } from "zod";
import { setTimeout as pause } from "node:timers/promises";
import { ClassroomStreamModel } from "../../foundations-runtime/examples/streaming/classroom-model.ts";
import {
  summarizeItem,
  applicationError,
  summarizeStreamEvent,
} from "../../foundations-runtime/examples/streaming/result-inspection.mjs";
import {
  scriptedModel,
  message,
  functionCall,
} from "../../foundations-runtime/examples/context/scripted-model.mjs";

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
const newRunner = () => new sdk.Runner({ tracingDisabled: true });
const text =
  "An agent streams text as it arrives. The application waits for completion before consuming its final answer and usage.";

export async function executeStreaming(
  number,
  input,
  { signal, onProgress = () => {} } = {},
) {
  if (input.mode === "live")
    throw new Error(
      "This lesson uses the actual SDK with controlled classroom inference.",
    );
  let output, evidence, events, takeaway;
  const label = "Actual SDK execution · scripted classroom inference";

  // lesson:45
  if (number === 45) {
    const view = choose(input.itemView ?? "all", ["all", "tools", "handoffs"]);
    const lookup = sdk.tool({
      name: "workshop_lookup",
      description: "Read the workshop timetable.",
      parameters: z.object({}),
      execute: async () => "Robotics starts at 10:00.",
    });
    const specialist = new sdk.Agent({
      name: "Timetable specialist",
      model: scriptedModel([message("The robotics workshop starts at 10:00.")]),
    });
    const model = scriptedModel([
      functionCall(lookup.name),
      (request) =>
        functionCall(request.handoffs[0].toolName, {}, "classroom-handoff-2"),
    ]);
    const agent = new sdk.Agent({
      name: "Workshop coordinator",
      model,
      tools: [lookup],
      handoffs: [specialist],
    });
    const result = await newRunner().run(
      agent,
      "Look up the workshop and hand it to the specialist.",
      { signal, maxTurns: 4 },
    );
    const items = result.newItems.map(summarizeItem);
    const visible = items.filter(
      (item) =>
        view === "all" ||
        (view === "tools"
          ? item.type.startsWith("tool_")
          : item.type.startsWith("handoff_")),
    );
    evidence = {
      allItems: items,
      visibleItems: visible,
      rawResponseCount: result.rawResponses.length,
      lastAgent: result.lastAgent.name,
      finalOutput: result.finalOutput,
    };
    output = visible
      .map(
        (item) =>
          `${item.type} — ${item.agent ?? `${item.fromAgent} → ${item.toAgent}`}`,
      )
      .join("\n");
    events = [
      stage(
        "Run a tool and handoff workflow",
        "The registered tool reads the local timetable.",
        "tool",
      ),
      stage(
        "Inspect RunResult.newItems",
        `${items.length} actual SDK items.`,
        "sdk",
      ),
      stage("Associate records with agents", result.lastAgent.name),
      stage(
        "Apply the inspector filter",
        `${visible.length} ${view} records displayed.`,
      ),
    ];
    takeaway =
      "newItems associates model and tool records with SDK agents. rawResponses contains provider responses and history contains replay-ready model input.";
  }

  // lesson:46
  if (number === 46) {
    const scope = choose(input.usageScope ?? "nested", ["single", "nested"]);
    const childModel = new ClassroomStreamModel(
      "usage-child",
      () => [message("Nested work complete.")],
      { inputTokens: 22, outputTokens: 8 },
    );
    const child = new sdk.Agent({
      name: "Usage specialist",
      model: childModel,
    });
    let nestedResult;
    const nested = sdk.tool({
      name: "run_specialist",
      description: "Run an independent nested specialist.",
      parameters: z.object({}),
      execute: async () => {
        nestedResult = await newRunner().run(
          child,
          "Complete the nested work.",
          { signal },
        );
        return nestedResult.finalOutput;
      },
    });
    const parentModel = new ClassroomStreamModel(
      "usage-parent",
      (_request, call) =>
        scope === "nested" && call === 1
          ? [functionCall(nested.name)]
          : [message("Parent work complete.")],
    );
    const parent = new sdk.Agent({
      name: "Usage coordinator",
      model: parentModel,
      tools: scope === "nested" ? [nested] : [],
    });
    const result = await newRunner().run(
      parent,
      "Complete the selected work.",
      { signal, maxTurns: 3 },
    );
    const ledger = [...parentModel.reports, ...childModel.reports].map(
      (report) => ({
        responseId: report.responseId,
        inputTokens: report.usage.inputTokens,
        outputTokens: report.usage.outputTokens,
      }),
    );
    const unique = [
      ...new Map(ledger.map((row) => [row.responseId, row])).values(),
    ];
    const combined = {
      requests: unique.length,
      inputTokens: unique.reduce((sum, row) => sum + row.inputTokens, 0),
      outputTokens: unique.reduce((sum, row) => sum + row.outputTokens, 0),
    };
    combined.totalTokens = combined.inputTokens + combined.outputTokens;
    evidence = {
      scope,
      rootUsage: result.runContext.usage,
      nestedUsage: nestedResult?.runContext.usage ?? null,
      ledger: unique,
      combined,
      tokenReportsAreSynthetic: true,
      contextOwnership:
        "Parent and nested runs have separate RunContext usage. Aggregate their disjoint responses once.",
    };
    output = `Observed requests — ${combined.requests}\nReported input tokens — ${combined.inputTokens}\nReported output tokens — ${combined.outputTokens}\nReported total tokens — ${combined.totalTokens}\nToken reports are classroom fixtures.`;
    events = [
      stage("Choose the work scope", scope),
      stage(
        "Collect SDK usage for each run",
        "The nested run owns a separate usage context.",
        "sdk",
      ),
      stage(
        "Deduplicate observed response IDs",
        `${unique.length} unique responses.`,
      ),
      stage("Aggregate available accounting", output),
    ];
    takeaway =
      "Know whether a nested run shares accounting with its parent. Sum disjoint usage once and preserve unavailable-provider accounting as unknown.";
  }

  // lesson:47
  if (number === 47) {
    const scenario = choose(input.exceptionCase ?? "configuration", [
      "configuration",
      "model",
      "timeout",
      "turn-limit",
    ]);
    let handled;
    try {
      if (scenario === "configuration") new sdk.Agent({ name: "" });
      if (scenario === "model")
        await newRunner().run(
          new sdk.Agent({
            name: "Invalid output tutor",
            outputType: z.object({ answer: z.string() }),
            model: scriptedModel([message("invalid JSON")]),
          }),
          "Return an answer.",
          { signal },
        );
      if (scenario === "timeout") {
        const model = {
          async getResponse(request) {
            await pause(1000, undefined, { signal: request.signal });
            throw new Error("Timeout fixture unexpectedly completed.");
          },
          async *getStreamedResponse() {
            throw new Error("Use complete-response execution.");
          },
        };
        await newRunner().run(
          new sdk.Agent({
            name: "Timeout tutor",
            model,
            modelSettings: { timeoutMs: 25 },
          }),
          "Wait for a response.",
          { signal },
        );
      }
      if (scenario === "turn-limit") {
        const tool = sdk.tool({
          name: "lookup",
          description: "Read a fixture.",
          parameters: z.object({}),
          execute: async () => "Read complete.",
        });
        await newRunner().run(
          new sdk.Agent({
            name: "Budget tutor",
            model: scriptedModel([functionCall(tool.name), message("Done.")]),
            tools: [tool],
          }),
          "Use the tool.",
          { signal, maxTurns: 1 },
        );
      }
    } catch (error) {
      handled = applicationError(error, sdk);
    }
    if (!handled)
      throw new Error(
        "The selected failure did not reproduce its SDK exception.",
      );
    output = `${handled.sdkType}\nApplication code — ${handled.code}\n${handled.message}`;
    evidence = {
      scenario,
      handled,
      origin: "Actual SDK configuration or execution failure",
      consumed: false,
    };
    events = [
      stage("Reproduce the selected failure", scenario),
      stage("Catch the installed SDK exception", handled.sdkType, "sdk"),
      stage("Map it to an application error", handled.code),
      stage("Explain recovery", handled.message),
    ];
    takeaway =
      "Handle known SDK classes explicitly and propagate unexpected errors. Check completed work before retrying failed runs.";
  }

  // lesson:48
  if (number === 48) {
    const policy = choose(input.historyPolicy ?? "carry", ["carry", "omit"]);
    const model = scriptedModel(
      [
        message("The workshop city is Madrid."),
        (request) =>
          message(
            JSON.stringify(request.input).includes("Madrid")
              ? "The workshop is in Spain."
              : "Please provide the workshop city.",
          ),
      ],
      { captureRequests: true },
    );
    const agent = new sdk.Agent({ name: "Conversation tutor", model });
    const runner = newRunner();
    const first = await runner.run(
      agent,
      "Remember that our workshop is in Madrid.",
      { signal },
    );
    const secondInput = [
      ...(policy === "carry" ? first.history : []),
      { role: "user", content: "Which country hosts our workshop?" },
    ];
    const second = await runner.run(first.lastAgent, secondInput, { signal });
    evidence = {
      policy,
      firstOutput: first.finalOutput,
      secondOutput: second.finalOutput,
      firstHistory: first.history,
      secondInput,
      secondHistory: second.history,
      actualModelRequests: model.requests,
      inferenceIsScripted: true,
    };
    output = `First turn — ${first.finalOutput}\nSecond turn — ${second.finalOutput}\nCarried history items — ${policy === "carry" ? first.history.length : 0}`;
    events = [
      stage("Run the first conversation turn", "Remember the workshop city."),
      stage(
        "Read the SDK replay-ready history",
        `${first.history.length} history items.`,
        "sdk",
      ),
      stage(
        "Construct the second input",
        policy === "carry"
          ? "Append a new user message to history."
          : "Send only the new question.",
      ),
      stage("Inspect the second result", second.finalOutput, "model"),
    ];
    takeaway =
      "Carry history plus the new user message when your application owns conversation replay. Reuse lastAgent to preserve specialist ownership after handoffs.";
  }

  // lesson:49
  if (number >= 49 && number <= 54) {
    const record = [];
    const lifecycle = [];
    const controller = new AbortController();
    const runSignal = signal
      ? AbortSignal.any([signal, controller.signal])
      : controller.signal;
    let activeAgent = "Streaming tutor";
    const selectedView =
      number === 50
        ? choose(input.eventView ?? "both", ["both", "raw", "sdk"])
        : "both";
    const publish = (entry) => {
      record.push({ ...entry, sequence: record.length + 1 });
      const visible =
        selectedView === "both" ||
        (selectedView === "raw"
          ? entry.kind === "raw_model_stream_event"
          : entry.kind !== "raw_model_stream_event");
      if (visible) onProgress(record.at(-1));
    };
    const speed =
      number === 49
        ? choose(input.streamSpeed ?? "normal", ["normal", "slow"])
        : "normal";
    const outcome =
      number === 52
        ? choose(input.toolOutcome ?? "success", ["success", "failure"])
        : "success";
    const completionCase =
      number === 53
        ? choose(input.completionCase ?? "success", ["success", "failure"])
        : "success";
    const cancelPoint =
      number === 54
        ? choose(input.cancelPoint ?? "first", ["first", "third", "finish"])
        : "finish";
    const specialistKind =
      number === 51
        ? choose(input.streamSpecialist ?? "robotics", [
            "robotics",
            "astronomy",
          ])
        : "robotics";
    const models = [];
    function model(name, reply, options = {}) {
      const value = new ClassroomStreamModel(name, reply, {
        delayMs: speed === "slow" ? 90 : 35,
        ...options,
      });
      models.push(value);
      return value;
    }
    let toolFailed = false;
    const lookup = sdk.tool({
      name: "streaming_lookup",
      description: "Read the classroom timetable.",
      parameters: z.object({}),
      errorFunction: null,
      execute: async () => {
        try {
          await pause(100, undefined, { signal: runSignal });
          if (outcome === "failure") throw new Error("Classroom tool failure.");
          return "The classroom workshop begins at 10:00.";
        } catch (error) {
          toolFailed = true;
          publish({
            kind: "application",
            event: "tool_failure",
            tool: "streaming_lookup",
            message: error.message,
            agent: activeAgent,
          });
          throw error;
        }
      },
    });
    let agent;
    if (number === 51) {
      const specialist = new sdk.Agent({
        name:
          specialistKind === "robotics" ? "Robotics tutor" : "Astronomy tutor",
        model: model("specialist-stream", () => [
          message(
            specialistKind === "robotics"
              ? "The robotics tutor explains how sensors guide a classroom robot."
              : "The astronomy tutor explains how planets orbit their star.",
          ),
        ]),
      });
      agent = new sdk.Agent({
        name: "Streaming coordinator",
        model: model("handoff-stream", (request) => [
          functionCall(request.handoffs[0].toolName),
        ]),
        handoffs: [specialist],
      });
    } else {
      const useTool = number === 50 || number === 52;
      agent = new sdk.Agent({
        name: "Streaming tutor",
        model: model(
          "classroom-stream",
          (_request, call) =>
            useTool && call === 1
              ? [functionCall(lookup.name)]
              : [message(text)],
          { failAfter: completionCase === "failure" ? 2 : 0 },
        ),
        tools: useTool ? [lookup] : [],
      });
    }
    activeAgent = agent.name;
    const runner = newRunner();
    if (number === 52) {
      runner.on("agent_tool_start", (_context, current, tool) =>
        publish({
          kind: "lifecycle_hook",
          event: "tool_start",
          agent: current.name,
          tool: tool.name,
        }),
      );
      runner.on("agent_tool_end", (_context, current, tool) =>
        publish({
          kind: "lifecycle_hook",
          event: "tool_end",
          status: toolFailed ? "failed" : "succeeded",
          agent: current.name,
          tool: tool.name,
        }),
      );
    }
    let stream, iterationError, completionError;
    let settled = false,
      closed = false;
    let deltas = 0,
      partialText = "";
    const store = new Map();
    let monitorTicks = 0;
    const progressMonitor = setInterval(() => {
      monitorTicks++;
    }, 50);
    progressMonitor.unref();
    lifecycle.push("resource.open");
    let completion;
    try {
      stream = await runner.run(
        agent,
        "Explain the selected classroom concept.",
        { stream: true, signal: runSignal, maxTurns: 4 },
      );
      completion = stream.completed.then(
        () => {
          settled = true;
          lifecycle.push("stream.settled");
        },
        (error) => {
          settled = true;
          completionError = error;
          lifecycle.push("stream.rejected");
        },
      );
      if (number === 49) {
        for await (const delta of stream.toTextStream()) {
          partialText += delta;
          deltas++;
          publish({
            kind: "text_stream",
            event: "text_delta",
            agent: agent.name,
            delta,
          });
        }
      } else {
        for await (const event of stream) {
          if (event.type === "agent_updated_stream_event")
            activeAgent = event.agent.name;
          const entry = summarizeStreamEvent(event, activeAgent);
          if (entry.delta !== undefined) {
            partialText += entry.delta;
            deltas++;
          }
          publish(entry);
          if (
            number === 54 &&
            cancelPoint !== "finish" &&
            deltas >= (cancelPoint === "first" ? 1 : 3)
          ) {
            lifecycle.push("abort.requested");
            controller.abort();
          }
        }
      }
    } catch (error) {
      iterationError = error;
    } finally {
      await completion;
      await Promise.all(models.map((value) => value.whenIdle()));
      lifecycle.push("models.idle");
      clearInterval(progressMonitor);
      closed = true;
      lifecycle.push("resource.close");
    }
    signal?.throwIfAborted();
    const failure = completionError ?? iterationError;
    const cancelled = Boolean(stream?.cancelled || controller.signal.aborted);
    const expectedToolFailure =
      number === 52 &&
      outcome === "failure" &&
      failure instanceof sdk.ToolCallError;
    const expectedModelFailure =
      number === 53 &&
      completionCase === "failure" &&
      failure?.message === "Classroom stream failure.";
    if (failure && !cancelled && !expectedToolFailure && !expectedModelFailure)
      throw failure;
    const successful = Boolean(
      stream &&
      settled &&
      !failure &&
      !cancelled &&
      stream.interruptions.length === 0,
    );
    const finalOutput = successful ? stream.finalOutput : null;
    if (successful && typeof finalOutput !== "string")
      throw new Error("The completed stream returned no text answer.");
    if (number === 53 && successful) {
      lifecycle.push("result.read");
      store.set("completed-run", JSON.parse(stream.state.toString()));
      lifecycle.push("state.saved");
    }
    const visible = record.filter(
      (entry) =>
        selectedView === "both" ||
        (selectedView === "raw"
          ? entry.kind === "raw_model_stream_event"
          : entry.kind !== "raw_model_stream_event"),
    );
    evidence = {
      number,
      streamEvents: record,
      visibleEvents: visible,
      partialText,
      deltaCount: deltas,
      settled,
      cancelled,
      consumed: successful,
      finalOutput,
      usage: successful ? stream.runContext.usage : null,
      ...(failure ? { errorType: failure.name, error: failure.message } : {}),
      lifecycle,
      resourceClosed: closed,
      resourceKind: "Owned progress-monitor interval",
      monitorTicks,
      activeGenerators: models.reduce(
        (sum, value) => sum + value.activeGenerators,
        0,
      ),
      snapshotCount: store.size,
      ...(store.size
        ? {
            snapshotBytes: Buffer.byteLength(
              JSON.stringify(store.get("completed-run")),
            ),
            storage:
              "Request-owned in-memory snapshot saved after successful completion.",
          }
        : {}),
      tokenReportsAreSynthetic: true,
      inferenceIsScripted: true,
    };
    if (cancelled) {
      output = `Stream cancelled after ${deltas} text chunks.\nPartial text is unconsumed.\nSettlement — ${settled}\nResource cleanup — ${closed}`;
    } else if (failure) {
      output = `Stream failed — ${failure.name}\nPartial text is unconsumed.\nSettlement — ${settled}\nResource cleanup — ${closed}`;
    } else if (number === 50) {
      const rawCount = visible.filter(
        (entry) => entry.kind === "raw_model_stream_event",
      ).length;
      const types = [...new Set(visible.map((entry) => entry.event))];
      output = `Displayed events — ${visible.length}\nRaw model events — ${rawCount}\nHigher-level SDK events — ${visible.length - rawCount}\nEvent types — ${types.join(", ")}`;
    } else if (number === 51) {
      const transfers = record.filter(
        (entry) =>
          entry.event === "agent_changed" || entry.event.startsWith("handoff_"),
      );
      output =
        transfers.map((entry) => `${entry.event} — ${entry.agent}`).join("\n") +
        "\n" +
        finalOutput;
    } else if (number === 52) {
      output = record
        .filter((entry) => entry.kind === "lifecycle_hook")
        .map(
          (entry) =>
            `${entry.event} — ${entry.tool}${entry.status ? ` · ${entry.status}` : ""}`,
        )
        .join("\n");
    } else if (number === 53) {
      output = `${finalOutput}\nFinal usage read after completion.\nSaved state snapshots — ${store.size}`;
    } else {
      output = finalOutput;
    }
    events = [
      stage(
        "Start an actual SDK stream",
        `${agent.name} uses a controlled local Model adapter.`,
        "sdk",
      ),
      stage(
        "Consume incremental progress",
        `${deltas} text chunks and ${record.length} observed events.`,
        "model",
      ),
      stage(
        "Await stream settlement",
        cancelled
          ? "Cancellation settled."
          : failure
            ? `The stream rejected with ${failure.name}.`
            : "The stream completed successfully.",
        "sdk",
      ),
      stage(
        number === 53
          ? "Gate results and save state"
          : number === 54
            ? "Finish owned cleanup"
            : "Inspect the observed outcome",
        number === 53
          ? `Consumed: ${successful}. Saved snapshots: ${store.size}.`
          : number === 54
            ? lifecycle.join(" → ")
            : `Consumed: ${successful}. Resource closed: ${closed}.`,
      ),
    ];
    takeaway =
      number === 49
        ? "toTextStream yields text incrementally. The terminal command writes each chunk as it arrives."
        : number === 50
          ? "Consume raw deltas for text rendering and higher-level SDK events for agent, tool and item progress."
          : number === 51
            ? "Update active-agent ownership from SDK events while handoff events explain the transfer."
            : number === 52
              ? "Use supported lifecycle hooks for tool boundaries and an application wrapper for failure progress. A tool-end hook can also follow a failure."
              : number === 53
                ? "Await completion and check success before reading final results or storing completed state. Partial text can arrive before a later failure."
                : "Cancellation uses an AbortController signal. Await the stream and cooperative backend work before closing owned resources.";
  }
  // lesson:end
  return { label, output, evidence, events, takeaway };
}
