export function loadConfig(env = process.env) {
  const apiKey = env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error(
      "Set OPENAI_API_KEY in the server environment, then restart the application.",
    );
    error.code = "MISSING_API_KEY";
    throw error;
  }
  return { apiKey, model: env.OPENAI_MODEL?.trim() || "gpt-6-astra" };
}
