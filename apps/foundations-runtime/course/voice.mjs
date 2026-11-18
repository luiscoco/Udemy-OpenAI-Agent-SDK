import { courseResult, selectScenario } from "./common.mjs";
import { pythonExecutable, runJsonProcess } from "../python-runtime.mjs";
import { fileURLToPath } from "node:url";
import { saveArtifact } from "../artifacts.mjs";
export const voiceScenarios = {
  161: ["complete", "failure"],
  162: ["chunks", "complete"],
  163: ["english", "spanish"],
  164: ["normal", "fast"],
  165: ["support", "billing"],
};
export async function executeVoice(
  number,
  input,
  { signal, env = process.env } = {},
) {
  const scenario = selectScenario(input.scenario, voiceScenarios[number]);
  const evidence = await runJsonProcess(
    pythonExecutable(env),
    [
      fileURLToPath(new URL("./voice_pipeline.py", import.meta.url)),
      String(number),
      scenario,
    ],
    { signal, env: { ...process.env, ...env, OPENAI_API_KEY: "" } },
  );
  const audio = Buffer.from(evidence.audioBase64, "base64");
  delete evidence.audioBase64;
  const artifacts = [
    await saveArtifact(audio, "wav", "Pipeline PCM tone fixture"),
  ];
  return courseResult(
    number,
    evidence.output,
    evidence,
    "The Python SDK owns pipeline orchestration. Deterministic transcript and PCM tone fixtures make classroom runs reproducible.",
    { artifacts },
  );
}
