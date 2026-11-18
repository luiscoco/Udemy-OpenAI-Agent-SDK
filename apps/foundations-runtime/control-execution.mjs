import * as sdk from "@openai/agents";
import OpenAI from "openai";
import { z } from "zod";
import { setTimeout as pause } from "node:timers/promises";
import {
  scriptedModel,
  message,
  functionCall,
} from "./examples/context/scripted-model.mjs";
import { loadConfig } from "./examples/organized/config.mjs";

export function selectScenario(value, options) {
  const selected = value ?? options[0];
  if (!options.includes(selected))
    throw new Error("Choose a listed lesson scenario.");
  return selected;
}

export function createLessonRunner(live, env, client) {
  if (live) loadConfig(env);
  return new sdk.Runner({
    tracingDisabled: true,
    ...(live || client
      ? {
          modelProvider: new sdk.OpenAIProvider({
            openAIClient:
              client ??
              new OpenAI({
                apiKey: env.OPENAI_API_KEY,
                timeout: 45000,
                maxRetries: 0,
              }),
          }),
        }
      : {}),
  });
}

export function lessonResult(live, output, evidence, stages, takeaway) {
  if (typeof output !== "string" || !output.trim())
    throw new Error("The SDK run has no completed text output to display.");
  return {
    label: live
      ? "Actual SDK execution · live model"
      : "Actual SDK execution · scripted classroom fixture",
    output,
    evidence: { inferenceIsScripted: !live, ...evidence },
    events: stages.map(([title, detail, actor = "application"]) => ({
      title,
      detail,
      actor,
    })),
    takeaway,
  };
}

function readToolOutput(request) {
  const value = request.input
    .filter((item) => item.type === "function_call_result")
    .at(-1)?.output;
  return typeof value === "object" && value?.type === "text"
    ? value.text
    : JSON.stringify(value);
}

export async function executeControl(number, input, { env = {}, signal } = {}) {
  const live = input.mode === "live";
  if (live && number === 70)
    throw new Error(
      "Prompt 70 uses a controlled model to reproduce forced-call repetition.",
    );
  const runner = createLessonRunner(live, env);
  const modelFor = (model) =>
    live ? env.OPENAI_MODEL || "gpt-6-astra" : model;
  const calls = [];
  const read = sdk.tool({
    name: "read_workshop",
    description: "Read the local Robotics workshop timetable.",
    parameters: z.object({}),
    execute: async () => {
      calls.push("read_workshop");
      return "Robotics begins at 16:00.";
    },
  });
  const capacity = sdk.tool({
    name: "read_capacity",
    description: "Read available seats in the local workshop.",
    parameters: z.object({}),
    execute: async () => {
      calls.push("read_capacity");
      return "8 seats available.";
    },
  });
  const observedRequests = [];
  function controlled(plan) {
    return scriptedModel(
      plan.map((entry) => (request) => {
        observedRequests.push({
          toolChoice: request.modelSettings.toolChoice,
          parallelToolCalls: request.modelSettings.parallelToolCalls,
          tools: request.tools.map((tool) => tool.name),
        });
        return typeof entry === "function" ? entry(request) : entry;
      }),
    );
  }
  const options = { signal, maxTurns: 4 };

  // lesson:65
  if (number === 65) {
    const choice = selectScenario(input.toolChoice, [
      "auto",
      "required",
      "read_capacity",
    ]);
    const name = choice === "read_capacity" ? choice : "read_workshop";
    const model = controlled([
      choice === "auto"
        ? message("A tool gives an agent access to application code.")
        : functionCall(name),
      (request) => message(readToolOutput(request)),
    ]);
    const agent = new sdk.Agent({
      name: "Tool choice tutor",
      model: modelFor(model),
      tools: [read, capacity],
      instructions:
        "Explain what a tool does. If required to use a tool, use the selected read-only capability and report its result.",
      modelSettings: { toolChoice: choice },
      resetToolChoice: true,
    });
    const result = await runner.run(
      agent,
      "Explain what a tool does. Follow the configured tool selection policy.",
      options,
    );
    return lessonResult(
      live,
      result.finalOutput,
      {
        choice,
        calls,
        observedRequests,
        modelResponses: result.rawResponses.length,
      },
      [
        ["Configure tool choice", `modelSettings.toolChoice = ${choice}`],
        [
          "Execute the SDK run",
          `${calls.length} observed callback executions.`,
          "sdk",
        ],
        ["Inspect the result", String(result.finalOutput), "model"],
      ],
      "Tool choice guides the provider. Classroom decisions are controlled fixtures, and live decisions are observed from actual callbacks.",
    );
  }

  // lesson:66
  if (number === 66) {
    const behavior = selectScenario(input.stopPolicy, [
      "stop_on_first_tool",
      "run_llm_again",
      "named",
    ]);
    const toolUseBehavior =
      behavior === "named" ? { stopAtToolNames: ["read_workshop"] } : behavior;
    const model = controlled([
      functionCall("read_workshop"),
      (request) => message(`Tutor summary — ${readToolOutput(request)}`),
    ]);
    const agent = new sdk.Agent({
      name: "Stop after tools",
      model: modelFor(model),
      tools: [read],
      toolUseBehavior,
      instructions:
        "Call read_workshop once. If given its result, summarize it.",
      modelSettings: { toolChoice: "read_workshop" },
    });
    const result = await runner.run(
      agent,
      "Read the workshop timetable.",
      options,
    );
    return lessonResult(
      live,
      result.finalOutput,
      {
        behavior,
        toolUseBehavior,
        calls,
        modelResponses: result.rawResponses.length,
      },
      [
        ["Choose completion behavior", JSON.stringify(toolUseBehavior)],
        [
          "Execute the read tool",
          `${calls.length} callback executions.`,
          "tool",
        ],
        [
          "Observe model turns",
          `${result.rawResponses.length} model responses before completion.`,
          "sdk",
        ],
      ],
      "Function-tool completion behavior controls whether the runner returns the tool output directly or requests another model response.",
    );
  }

  // lesson:67
  if (number === 67) {
    const status = selectScenario(input.completionCase, [
      "complete",
      "needs-context",
    ]);
    const decisions = [];
    const check = sdk.tool({
      name: "check_workshop",
      description: "Read a workshop completion report.",
      parameters: z.object({}),
      execute: async () => {
        calls.push("check_workshop");
        return {
          complete: status === "complete",
          detail:
            status === "complete"
              ? "Workshop checklist complete."
              : "The audience is missing.",
        };
      },
    });
    const policy = (_context, results) => {
      const report = results.find(
        (result) => result.tool.name === "check_workshop",
      )?.output;
      const isFinalOutput = report?.complete === true;
      decisions.push({ report, isFinalOutput });
      return isFinalOutput
        ? { isFinalOutput: true, finalOutput: report.detail }
        : { isFinalOutput: false };
    };
    const model = controlled([
      functionCall("check_workshop"),
      message("Which audience should the workshop serve?"),
    ]);
    const agent = new sdk.Agent({
      name: "Completion policy",
      tools: [check],
      model: modelFor(model),
      toolUseBehavior: policy,
      instructions:
        "Call check_workshop once. If incomplete, ask for the missing audience.",
      modelSettings: { toolChoice: "check_workshop" },
    });
    const result = await runner.run(
      agent,
      "Check whether the workshop plan is complete.",
      options,
    );
    return lessonResult(
      live,
      result.finalOutput,
      { status, calls, decisions, modelResponses: result.rawResponses.length },
      [
        ["Read the structured report", status, "tool"],
        [
          "Apply the custom completion callback",
          JSON.stringify(decisions),
          "sdk",
        ],
        ["Observe completion", String(result.finalOutput), "model"],
      ],
      "A supported toolUseBehavior callback examines actual tool results and returns isFinalOutput to finish or continue the model loop.",
    );
  }

  // lesson:68
  if (number === 68) {
    const profile = selectScenario(input.availabilityProfile, [
      "editor",
      "viewer",
      "revoked",
    ]);
    const context = {
      userId: "fixture-user",
      canEdit: profile === "editor",
      showEditor: profile !== "viewer",
    };
    const checks = [];
    let updates = 0;
    const workshop = { title: "Robotics workshop" };
    const edit = sdk.tool({
      name: "edit_workshop",
      description: "Update the local fixture workshop title when authorized.",
      parameters: z.object({ title: z.string().min(1).max(80) }),
      isEnabled: ({ runContext }) => runContext.context.showEditor,
      execute: async ({ title }, runContext) => {
        const allowed = runContext.context.canEdit;
        checks.push({ userId: runContext.context.userId, allowed });
        if (!allowed) return { code: "FORBIDDEN" };
        workshop.title = title;
        updates++;
        return { title, updated: true };
      },
    });
    const model = controlled([
      profile === "viewer"
        ? message("Editing is unavailable for this profile.")
        : functionCall("edit_workshop", { title: "Robotics lab" }),
      (request) => message(readToolOutput(request)),
    ]);
    const agent = new sdk.Agent({
      name: "Context enabled tools",
      tools: [edit],
      model: modelFor(model),
      instructions:
        "If edit_workshop is available, call it once with title Robotics lab. Otherwise explain that editing is unavailable. Report the actual result.",
    });
    const result = await runner.run(agent, "Update the workshop title.", {
      ...options,
      context,
    });
    return lessonResult(
      live,
      result.finalOutput,
      {
        profile,
        context,
        observedRequests,
        authorizationChecks: checks,
        updates,
        workshop,
      },
      [
        [
          "Resolve availability from context",
          `Editor exposed — ${context.showEditor}`,
        ],
        [
          "Check permissions inside the callback",
          JSON.stringify(checks),
          "tool",
        ],
        ["Inspect local changes", `${updates} fixture updates.`],
      ],
      "isEnabled controls exposure to the model. The implementation checks current application permissions before changing a resource.",
    );
  }

  // lesson:69
  if (number === 69) {
    const pattern = selectScenario(input.parallelPattern, [
      "parallel",
      "sequential",
    ]);
    const limit = Number(selectScenario(input.concurrencyLimit, ["1", "2"]));
    let active = 0,
      peak = 0;
    const trace = [];
    const lookup = sdk.tool({
      name: "read_stock",
      description: "Read synthetic stock for one classroom kit.",
      parameters: z.object({ kit: z.enum(["robot", "sensor", "motor"]) }),
      execute: async ({ kit }, _context, details) => {
        active++;
        peak = Math.max(peak, active);
        trace.push({ event: "start", kit, active });
        try {
          await pause(35, undefined, { signal: details?.signal ?? signal });
          return { kit, available: 4 };
        } finally {
          active--;
          trace.push({ event: "finish", kit, active });
        }
      },
    });
    const toolCalls = ["robot", "sensor", "motor"].map((kit, index) =>
      functionCall("read_stock", { kit }, `stock-${index}`),
    );
    const model = controlled(
      pattern === "parallel"
        ? [toolCalls, message("All three kits have 4 units available.")]
        : [...toolCalls, message("All three kits have 4 units available.")],
    );
    const agent = new sdk.Agent({
      name: "Concurrency lesson",
      model: modelFor(model),
      tools: [lookup],
      modelSettings: { parallelToolCalls: pattern === "parallel" },
      instructions: `Read stock for robot, sensor and motor exactly once each. ${pattern === "parallel" ? "Request independent reads in one response when supported." : "Request one read per response."} Then summarize.`,
    });
    const result = await runner.run(agent, "Check the three classroom kits.", {
      ...options,
      maxTurns: 5,
      toolExecution: { maxFunctionToolConcurrency: limit },
    });
    return lessonResult(
      live,
      result.finalOutput,
      {
        pattern,
        configuredLimit: limit,
        observedRequests,
        trace,
        peakConcurrency: peak,
        activeAfterRun: active,
        modelResponses: result.rawResponses.length,
      },
      [
        [
          "Configure provider and executor",
          `parallelToolCalls=${pattern === "parallel"}, maxFunctionToolConcurrency=${limit}`,
        ],
        [
          "Execute read callbacks",
          `Peak observed concurrency — ${peak}`,
          "tool",
        ],
        [
          "Await every callback",
          `Active work after completion — ${active}`,
          "sdk",
        ],
      ],
      "parallelToolCalls guides model-side call generation. maxFunctionToolConcurrency independently bounds local callback execution.",
    );
  }

  // lesson:70
  if (number === 70) {
    const resetToolChoice =
      selectScenario(input.resetPolicy, ["reset", "bounded-loop"]) === "reset";
    const model = {
      calls: 0,
      async getResponse(request) {
        this.calls++;
        observedRequests.push({
          turn: this.calls,
          toolChoice: request.modelSettings.toolChoice,
        });
        return {
          output: [
            request.modelSettings.toolChoice === "read_workshop"
              ? functionCall("read_workshop", {}, `repeat-${this.calls}`)
              : message("Timetable read once. Run complete."),
          ],
          usage: new sdk.Usage(),
          responseId: `reset-${this.calls}`,
        };
      },
    };
    const agent = new sdk.Agent({
      name: "Forced tool reset",
      model,
      tools: [read],
      resetToolChoice,
      modelSettings: { toolChoice: "read_workshop" },
    });
    let result, errorType;
    try {
      result = await runner.run(agent, "Read the workshop once.", {
        signal,
        maxTurns: 3,
      });
    } catch (error) {
      if (!(error instanceof sdk.MaxTurnsExceededError)) throw error;
      errorType = error.name;
    }
    return lessonResult(
      false,
      result?.finalOutput ??
        `Stopped at the configured turn limit — ${errorType}`,
      {
        resetToolChoice,
        observedRequests,
        calls,
        errorType,
        maxTurns: 3,
        modelResponses: model.calls,
      },
      [
        ["Force the first read", "toolChoice=read_workshop"],
        [
          "Observe subsequent settings",
          JSON.stringify(observedRequests),
          "sdk",
        ],
        [
          "Inspect termination",
          `${calls.length} tool executions. ${errorType ?? "Completed"}`,
        ],
      ],
      "Resetting tool choice permits completion after a forced call. A finite maxTurns budget also bounds a misconfigured repeated-call loop.",
    );
  }
  throw new Error("Choose a tool-control lesson from 65 through 70.");
}
