import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

export function pythonExecutable(env = process.env) {
  const executable =
    env.CLASSROOM_PYTHON ||
    fileURLToPath(new URL("../.runtime/python/python.exe", import.meta.url));
  if (!existsSync(executable))
    throw new Error(
      "The Python runtime is missing. Run npm run setup:python in the apps folder, or set CLASSROOM_PYTHON to a Python environment with requirements-python.txt installed.",
    );
  return executable;
}

export function runJsonProcess(
  executable,
  args,
  { env = process.env, signal, timeout = Number(env.CLASSROOM_SUBPROCESS_TIMEOUT_MS ?? 55000) } = {},
) {
  if(!Number.isInteger(timeout)||timeout<1000||timeout>300000)throw new Error('Choose a subprocess timeout from 1000 through 300000 milliseconds.');
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      signal,
    });
    let output = "";
    let errors = "";
    let settled = false;
    const timer = setTimeout(() => child.kill(), timeout);
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.length > 262144) child.kill();
    });
    child.stderr.on("data", (chunk) => {
      if (errors.length < 16384) errors += chunk.toString();
    });
    child.on("error", (error) => {
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (settled) return;
      if (code !== 0)
        return reject(
          new Error(
            errors.trim() ||
              "The classroom subprocess stopped before completion.",
          ),
        );
      try {
        resolve(JSON.parse(output));
      } catch {
        reject(
          new Error("The classroom subprocess returned an invalid result."),
        );
      }
    });
  });
}

export function runPythonProduct(input, { env = process.env, signal } = {}) {
  return runJsonProcess(
    pythonExecutable(env),
    [
      fileURLToPath(
        new URL("./examples/structured/python_product.py", import.meta.url),
      ),
      input.schemaCase ?? "valid",
      input.mode === "live" ? "live" : "classroom",
    ],
    {
      env: {
        ...process.env,
        ...env,
        OPENAI_API_KEY: input.mode === "live" ? (env.OPENAI_API_KEY ?? "") : "",
        OPENAI_AGENTS_DONT_LOG_MODEL_DATA: "1",
        OPENAI_AGENTS_DONT_LOG_TOOL_DATA: "1",
      },
      signal,
    },
  );
}
