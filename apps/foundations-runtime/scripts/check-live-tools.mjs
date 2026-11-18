import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import { lessons } from "../catalog.mjs";
import { toolsControls } from "../public/tools-lessons.js";
import { executeTools } from "../tools-execution.mjs";

const apps = fileURLToPath(new URL("../../", import.meta.url));
const selected = lessons.filter(
  (lesson) => lesson.number >= 55 && lesson.number <= 64 && lesson.live,
);

async function readEnvironment(path) {
  try {
    return parseEnv(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

function combinations(controls) {
  return controls.reduce(
    (rows, control) =>
      rows.flatMap((row) =>
        control.options.map(([value]) => ({ ...row, [control.key]: value })),
      ),
    [{}],
  );
}

function decoded(output) {
  const value = output?.type === "text" ? output.text : output;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function inspect(number, input, evidence) {
  const checks = [];
  const check = (name, passed) =>
    checks.push({ name, passed: Boolean(passed) });
  check("Actual live inference path", evidence.inferenceIsScripted === false);
  if (number === 57) {
    check(
      "Expected calculator usage",
      evidence.toolExecutions ===
        (input.calculatorQuestion === "arithmetic" ? 1 : 0),
    );
    if (input.calculatorQuestion === "arithmetic")
      check(
        "Correct arithmetic",
        evidence.observedResults.some((value) => value.value === 37.5),
      );
  }
  if (number === 58) {
    check(
      "Executed arguments satisfy constraints",
      evidence.validatedArguments.every(
        (value) =>
          ["Madrid", "Paris"].includes(value.city) &&
          Number.isInteger(value.participants) &&
          value.participants >= 1 &&
          value.participants <= 20 &&
          /^\d{4}-\d{2}-\d{2}$/.test(value.date),
      ),
    );
    if (input.argumentCase === "valid")
      check("Valid proposal reaches the tool", evidence.callbackExecutions > 0);
  }
  if (number === 59 && input.descriptionQuality === "clear")
    check(
      "Existing shipment uses the read capability",
      evidence.selectedCorrectCapability,
    );
  if (number === 61) {
    check("SQLite remains query-only", evidence.queryOnly);
    check("Connection closes", evidence.resourceClosed);
    check(
      "Every query uses the authenticated tenant",
      evidence.queries.every(
        (query) => query.parameters[0] === evidence.context.tenantId,
      ),
    );
    check(
      "Requested record ID reaches the query",
      evidence.queries.length > 0 &&
        evidence.queries.every(
          (query) => query.parameters[1] === evidence.recordId,
        ),
    );
    check(
      "Record visibility matches the selected tenant",
      evidence.observedResults.length > 0 &&
        evidence.observedResults.every(
          (value) => value.found === (input.recordCase === "own"),
        ),
    );
  }
  if (number === 62) {
    check("Workshop tool executes", evidence.actualToolOutputs.length > 0);
    if (input.returnFormat === "structured")
      check(
        "Structured duration survives output validation",
        evidence.actualToolOutputs.some(
          (value) => decoded(value)?.durationMinutes === 30,
        ),
      );
  }
  return checks;
}

const shared = await readEnvironment(resolve(apps, ".env"));
const configurations = await Promise.all(
  selected.map(async (lesson) => {
    const local = await readEnvironment(resolve(apps, lesson.folder, ".env"));
    return {
      lesson,
      env: {
        ...shared,
        ...local,
        ...process.env,
        OPENAI_API_KEY:
          process.env.OPENAI_API_KEY?.trim() ||
          local.OPENAI_API_KEY?.trim() ||
          shared.OPENAI_API_KEY?.trim(),
        OPENAI_MODEL:
          process.env.OPENAI_MODEL?.trim() ||
          local.OPENAI_MODEL?.trim() ||
          shared.OPENAI_MODEL?.trim(),
      },
    };
  }),
);
const missing = configurations.filter(
  (configuration) => !configuration.env.OPENAI_API_KEY?.trim(),
);
if (missing.length) {
  console.error(
    `Missing OPENAI_API_KEY for prompts ${missing.map((configuration) => configuration.lesson.number).join(", ")}.`,
  );
  console.error(
    "Save the key locally in apps/.env, a selected app's .env, or the process environment, then rerun npm run test:live:tools.",
  );
  process.exitCode = 2;
} else {
  const started = new Date().toISOString();
  const report = {
    started,
    scope: "Live-enabled applications in prompts 55–64",
    modelCalls:
      "SDK request counts and token usage are not exposed by these lesson results.",
    scenarios: [],
  };
  let stop = false;
  for (const { lesson, env } of configurations) {
    if (stop) break;
    for (const input of combinations(toolsControls[lesson.number])) {
      const scenario = `${lesson.number} ${Object.entries(input)
        .map(([key, value]) => `${key}=${value}`)
        .join(" ")}`;
      console.log(`Running ${scenario}`);
      const before = performance.now();
      try {
        const result = await executeTools(
          lesson.number,
          { ...input, mode: "live" },
          { env, signal: AbortSignal.timeout(60000) },
        );
        const checks = inspect(lesson.number, input, result.evidence);
        const passed = checks.every((check) => check.passed);
        report.scenarios.push({
          prompt: lesson.number,
          input,
          model: env.OPENAI_MODEL || "gpt-6-astra",
          status: passed ? "passed" : "review",
          elapsedMs: Math.round(performance.now() - before),
          checks,
          result,
        });
        console.log(`${passed ? "PASS" : "REVIEW"} ${scenario}`);
      } catch (error) {
        const safeMessage = String(error.message)
          .replaceAll(env.OPENAI_API_KEY, "[redacted]")
          .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]");
        report.scenarios.push({
          prompt: lesson.number,
          input,
          model: env.OPENAI_MODEL || "gpt-6-astra",
          status: "error",
          elapsedMs: Math.round(performance.now() - before),
          error: {
            type: error.name,
            message: safeMessage,
            status: error.status,
            code: error.code,
          },
        });
        console.error(`ERROR ${scenario}: ${safeMessage}`);
        if (error.status === 401 || error.code === "insufficient_quota") {
          stop = true;
          break;
        }
      }
    }
  }
  report.finished = new Date().toISOString();
  report.expectedScenarios = configurations.reduce(
    (count, { lesson }) =>
      count + combinations(toolsControls[lesson.number]).length,
    0,
  );
  report.summary = {
    passed: report.scenarios.filter((row) => row.status === "passed").length,
    review: report.scenarios.filter((row) => row.status === "review").length,
    errors: report.scenarios.filter((row) => row.status === "error").length,
    remaining: report.expectedScenarios - report.scenarios.length,
  };
  const directory = resolve(apps, "test-results", "live-tools");
  await mkdir(directory, { recursive: true });
  const filename = resolve(directory, `${started.replace(/[:.]/g, "-")}.json`);
  await writeFile(filename, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report.summary));
  console.log(`Report saved to ${filename}`);
  if (
    report.summary.review ||
    report.summary.errors ||
    report.summary.remaining
  )
    process.exitCode = 1;
}
