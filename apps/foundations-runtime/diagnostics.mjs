export const faults = {
  missing: {
    label: "Missing API key",
    code: "MISSING_API_KEY",
    message: "OPENAI_API_KEY is missing from the server environment.",
  },
  invalid: {
    label: "Invalid credentials",
    status: 401,
    code: "invalid_api_key",
    message: "The API rejected the credential.",
  },
  installation: {
    label: "Package installation",
    code: "ENOTFOUND",
    message: "getaddrinfo ENOTFOUND registry.npmjs.org",
  },
  imports: {
    label: "Incorrect import",
    code: "ERR_MODULE_NOT_FOUND",
    message: "Cannot find package '@openai/agents-incorrect'",
  },
  model: {
    label: "Unavailable model",
    status: 404,
    code: "model_not_found",
    message: "The requested model does not exist or this project lacks access.",
  },
  rate: {
    label: "Rate limit",
    status: 429,
    code: "rate_limit_exceeded",
    message: "The project request limit was reached.",
  },
};

export function diagnose(error) {
  if (error.code === "MISSING_API_KEY")
    return {
      title: "Configure the server environment",
      explanation:
        "Set OPENAI_API_KEY in a local .env file, then restart the server so the process reads it.",
      command: "Copy-Item .env.example .env\nnotepad .env\nnpm start",
    };
  if (error.status === 401)
    return {
      title: "Replace the rejected credential",
      explanation:
        "Check the API key in the server environment and its project permissions. Restart after replacing it.",
      command: "notepad .env\nnpm start",
    };
  if (error.code === "ENOTFOUND")
    return {
      title: "Check registry connectivity",
      explanation:
        "Inspect DNS, proxy configuration, and the configured npm registry. Retry installation after connectivity works.",
      command: "npm config get registry\nnpm ping\nnpm ci",
    };
  if (error.code === "ERR_MODULE_NOT_FOUND")
    return {
      title: "Check the installed package and import",
      explanation:
        "Import Agent and run from @openai/agents. Install the dependencies in the application folder. Python imports Agent and Runner from agents.",
      command:
        "npm ls @openai/agents\nnode --input-type=module -e \"import('@openai/agents').then(() => console.log('Import OK'))\"",
    };
  if (error.status === 404)
    return {
      title: "Check model name and access",
      explanation:
        "Verify OPENAI_MODEL against the models available to your project. A 404 can indicate an unknown model or missing model access.",
      command: "notepad .env\nnpm start",
    };
  if (error.status === 429)
    return {
      title: "Inspect the limit before retrying",
      explanation:
        "Check project rate limits and quota. Apply bounded backoff for a rate limit. A depleted quota needs billing or quota resolution.",
      command: "# Inspect project usage and limits in the OpenAI dashboard.",
    };
  return {
    title: "Inspect the original failure",
    explanation:
      "Preserve the error code and check the operation that failed. Network and service errors can have different recovery steps.",
    command: "npm ls\nnode --version",
  };
}

export function redact(message, env) {
  let text = String(message);
  if (env.OPENAI_API_KEY)
    text = text.split(env.OPENAI_API_KEY).join("[redacted]");
  return text.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]");
}
