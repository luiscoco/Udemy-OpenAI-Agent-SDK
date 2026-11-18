export function generationSettings(input = {}) {
  const preset = input.modelPreset ?? "astra";
  const setting = input.settingsCase ?? "verbosity";
  if (
    !["astra", "luna"].includes(preset) ||
    !["verbosity", "temperature", "top-p"].includes(setting)
  )
    throw new Error("Choose a listed model and generation setting.");
  const model = preset === "astra" ? "gpt-6-astra" : "gpt-6-luna";
  const modelSettings = {
    maxTokens: 512,
    reasoning: { effort: preset === "astra" ? "low" : "none" },
  };
  if (setting === "verbosity") modelSettings.text = { verbosity: "low" };
  if (setting === "temperature") modelSettings.temperature = 0.2;
  if (setting === "top-p") modelSettings.topP = 0.8;
  const compatible = preset !== "astra" || setting === "verbosity";
  return {
    model,
    modelSettings,
    compatible,
    reason: compatible
      ? "This combination follows the documented model compatibility profile."
      : "GPT-6 Astra does not support custom temperature or top_p. Choose a supported setting before sending the request.",
  };
}
