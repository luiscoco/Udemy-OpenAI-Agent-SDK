import {
  sdk,
  z,
  scriptedModel,
  message,
  functionCall,
  courseResult,
  selectScenario,
  inputText,
  textOutput,
} from "./common.mjs";
import { setTimeout as pause } from "node:timers/promises";
import { ClassroomStreamModel } from "../../../foundations-runtime/examples/streaming/classroom-model.ts";

export async function executeGuardrail(
  number,
  input,
  { signal, onProgress = () => {} } = {},
) {
  const evidence = { checks: [], toolExecutions: 0 };
  const trace = [];
  let output, result, model;
  const runner = new sdk.Runner({ tracingDisabled: true });
  const fail =
    selectScenario(
      input.scenario,
      number === 118
        ? ["parallel-blocked", "blocking-blocked"]
        : number === 119
          ? ["handoff", "nested-tool"]
          : ["accepted", "rejected"],
    ) === "rejected";
  const check = (name, tripwireTriggered) => {
    evidence.checks.push({ name, tripwireTriggered });
    return { tripwireTriggered, outputInfo: { policy: name } };
  };
  try {
    if ([113, 114, 117, 118].includes(number)) {
      const parallel = number === 118 && input.scenario === "parallel-blocked";
      const inputGuard = {
        name: "Supported workshop scope",
        runInParallel: parallel,
        execute: async ({ input: request }) => {
          trace.push("guard.start");
          if (number === 118) await pause(30);
          let denied =
            number === 118 || !inputText(request).includes("workshop");
          if (number === 117) {
            const classifier = new sdk.Agent({
              name: "Scope classifier",
              model: scriptedModel([
                message(JSON.stringify({ allowed: !denied })),
              ]),
              outputType: z.object({ allowed: z.boolean() }),
            });
            const decision = await new sdk.Runner({
              tracingDisabled: true,
            }).run(classifier, inputText(request), { signal });
            evidence.classifierDecision = decision.finalOutput;
            denied = !decision.finalOutput.allowed;
          }
          trace.push("guard.end");
          return check("input", denied);
        },
      };
      model = scriptedModel([
        async () => {
          trace.push("model.start");
          return message(
            fail && number === 114
              ? "An uncited answer."
              : "Workshop answer [handbook-1].",
          );
        },
      ]);
      const agent = new sdk.Agent({
        name: "Guarded tutor",
        model,
        ...(number === 114
          ? {
              outputGuardrails: [
                {
                  name: "Citation required",
                  execute: async ({ agentOutput }) =>
                    check("output", !agentOutput.includes("[handbook-1]")),
                },
              ],
            }
          : { inputGuardrails: [inputGuard] }),
      });
      result = await runner.run(
        agent,
        fail ? "Unrelated unsupported request" : "Help with the workshop.",
        { signal },
      );
      output = result.finalOutput;
    }
    if ([115, 116].includes(number)) {
      const tool = sdk.tool({
        name: "prepare_report",
        parameters: z.object({ amount: z.number().positive() }),
        ...(number === 115
          ? {
              inputGuardrails: [
                sdk.defineToolInputGuardrail({
                  name: "Amount policy",
                  run: async ({ toolCall }) =>
                    JSON.parse(toolCall.arguments).amount > 100
                      ? {
                          behavior: {
                            type: "rejectContent",
                            message: "AMOUNT_LIMIT",
                          },
                        }
                      : { behavior: { type: "allow" } },
                }),
              ],
            }
          : {}),
        ...(number === 116
          ? {
              outputGuardrails: [
                sdk.defineToolOutputGuardrail({
                  name: "Public report schema",
                  run: async ({ output }) => {
                    const rejected = Boolean(output.internal_note);
                    evidence.checks.push({ name: "tool-output", rejected });
                    return {
                      behavior: rejected
                        ? { type: "rejectContent", message: "REPORT_REJECTED" }
                        : { type: "allow" },
                    };
                  },
                }),
              ],
            }
          : {}),
        execute: () => {
          evidence.toolExecutions++;
          return fail && number === 116
            ? { status: "ready", internal_note: "SYNTHETIC_INTERNAL_NOTE" }
            : { status: "ready" };
        },
      });
      model = scriptedModel([
        functionCall("prepare_report", {
          amount: fail && number === 115 ? 200 : 50,
        }),
        (request) => {
          evidence.downstreamInput = request.input;
          return message(textOutput(request));
        },
      ]);
      result = await runner.run(
        new sdk.Agent({ name: "Tool policy tutor", model, tools: [tool] }),
        "Prepare the report.",
        { signal },
      );
      output = result.finalOutput;
    }
    if (number === 119) {
      const hook = (name) => ({
        name,
        execute: async () => {
          trace.push(name);
          return { tripwireTriggered: false, outputInfo: {} };
        },
      });
      const child = new sdk.Agent({
        name: "Specialist",
        model: scriptedModel([message("Specialist answer.")]),
        inputGuardrails: [hook("specialist.input")],
        outputGuardrails: [hook("specialist.output")],
      });
      const nested = input.scenario === "nested-tool";
      const transfer = sdk.handoff(child, {
        toolNameOverride: "transfer_child",
      });
      model = scriptedModel(
        nested
          ? [
              functionCall("ask_child", { input: "Answer." }),
              message("Manager answer."),
            ]
          : [functionCall("transfer_child")],
      );
      const parent = new sdk.Agent({
        name: "Manager",
        model,
        inputGuardrails: [hook("manager.input")],
        outputGuardrails: [hook("manager.output")],
        ...(nested
          ? {
              tools: [
                child.asTool({
                  toolName: "ask_child",
                  toolDescription: "Ask specialist.",
                }),
              ],
            }
          : { handoffs: [transfer] }),
      });
      result = await runner.run(parent, "Answer the classroom question.", {
        signal,
      });
      output = result.finalOutput;
      evidence.owner = result.lastAgent.name;
    }
    if (number === 120) {
      model = new ClassroomStreamModel("buffered-validation", () => [
        message(
          fail ? "Uncited streaming answer." : "Workshop answer [handbook-1].",
        ),
      ]);
      const agent = new sdk.Agent({
        name: "Buffered tutor",
        model,
        outputGuardrails: [
          {
            name: "Citation",
            execute: async ({ agentOutput }) =>
              check("citation", !agentOutput.includes("[handbook-1]")),
          },
        ],
      });
      const stream = await runner.run(agent, "Answer with a source.", {
        stream: true,
        signal,
      });
      const settled = stream.completed;
      settled.catch(() => {});
      let buffer = "";
      try {
        for await (const chunk of stream.toTextStream()) {
          buffer += chunk;
          onProgress({
            event: "buffered",
            detail: "Unvalidated output is buffered.",
          });
        }
        await settled;
        output = stream.finalOutput;
        evidence.releasedText = buffer;
        onProgress({ event: "text_delta", text: buffer });
      } finally {
        evidence.bufferedCharacters = buffer.length;
        await settled.catch(() => {});
        await model.whenIdle();
        evidence.streamSettled = true;
      }
    }
  } catch (error) {
    const expected = [
      "InputGuardrailTripwireTriggered",
      "OutputGuardrailTripwireTriggered",
      "ToolInputGuardrailTripwireTriggered",
      "ToolOutputGuardrailTripwireTriggered",
    ];
    if (!expected.includes(error.name)) throw error;
    evidence.blocked = { type: error.name };
    output = `Validation blocked the result — ${error.name}`;
    if (number === 120) evidence.releasedText = "";
  }
  Object.assign(evidence, { trace, modelCalls: model?.calls ?? null });
  return courseResult(
    number,
    output,
    evidence,
    "The installed SDK executes these guardrails. Input, final-output and tool boundaries have different scopes. Streaming text is released only after final validation succeeds.",
  );
}
