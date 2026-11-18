import { versionedInstructions, choose } from "../../public/definitions.js";

export function createVersionedAgent({ Agent, model, input, env, live }) {
  const storage = choose(
    input.storage ?? "code",
    ["code", "hosted"],
    "prompt storage",
  );
  const prompt = versionedInstructions(input);
  if (storage === "code") {
    return new Agent({
      name: "Versioned support",
      model,
      instructions: prompt.instructions,
    });
  }
  const promptId = live
    ? env.STORED_PROMPT_ID?.trim()
    : "pmpt_CLASSROOM_FIXTURE";
  if (!promptId)
    throw new Error(
      "Set STORED_PROMPT_ID to an existing hosted prompt with a language variable. The hosted prompt service is deprecated.",
    );
  // @openai/agents 0.21.0 uses promptId. The OpenAI provider maps it to API id.
  return new Agent({
    name: "Legacy stored-prompt support",
    model,
    prompt: { promptId, version: prompt.version, variables: prompt.variables },
  });
}
