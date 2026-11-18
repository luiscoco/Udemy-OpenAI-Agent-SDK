import * as sdk from "@openai/agents";
import { z } from "zod";
import {
  scriptedModel,
  functionCall,
  message,
} from "../../../foundations-runtime/examples/context/scripted-model.mjs";
import {
  createLessonRunner,
  selectScenario,
  lessonResult,
} from "../../../foundations-runtime/control-execution.mjs";

export { sdk, z, scriptedModel, functionCall, message, selectScenario };
import { remainingLessons } from "../../../foundations-runtime/remaining-catalog.mjs";
export function courseResult(number, output, evidence, takeaway, extra = {}) {
  const lesson = remainingLessons.find((lesson) => lesson.number === number);
  const observations = Object.entries(evidence)
    .filter(
      ([key, value]) =>
        ![
          "scenario",
          "tenant",
          "sessionId",
          "adapter",
          "isolation",
          "records",
          "requests",
          "items",
          "operations",
        ].includes(key) && value !== undefined,
    )
    .slice(0, 3)
    .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
    .join("\n")
    .slice(0, 700);
  return {
    ...lessonResult(
      false,
      typeof output === "string" ? output : JSON.stringify(output, null, 2),
      evidence,
      [
        {
          title: lesson?.title || `Prompt ${number}`,
          detail: lesson?.prompt || `Prompt ${number}`,
        },
        {
          title: "Observe the completed operations",
          detail:
            observations ||
            "SDK calls and application operations have settled.",
          actor: "sdk",
        },
        {
          title: "Read the scenario outcome",
          detail:
            typeof output === "string"
              ? output.slice(0, 500)
              : JSON.stringify(output).slice(0, 500),
        },
      ].map((item) => [item.title, item.detail, item.actor]),
      takeaway,
    ),
    ...extra,
  };
}
export async function runAgent(
  name,
  plan,
  input = "Run the classroom task.",
  options = {},
) {
  const model = scriptedModel(plan, { captureRequests: true });
  const agent = new sdk.Agent({ name, model, ...options.agent });
  const runner = createLessonRunner(false, {});
  const result = await runner.run(agent, input, {
    maxTurns: 6,
    ...options.run,
  });
  return { result, agent, model, requests: model.requests };
}
export function inputText(input) {
  return typeof input === "string" ? input : JSON.stringify(input);
}
export function textOutput(request) {
  const output = request.input
    .filter((item) => item.type === "function_call_result")
    .at(-1)?.output;
  if (typeof output === "string") return output;
  if (output?.type === "text") return output.text;
  if (Array.isArray(output))
    return output.map((item) => item.text ?? "").join("\n");
  return JSON.stringify(output);
}
