import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";
import { createApp } from "../server.mjs";
import { getLesson, lessons } from "../catalog.mjs";
import { browserOptions } from "./browser-options.mjs";
import { courseScenarios } from "../course/index.mjs";

const definitionWalkthroughs = {
  ...Object.fromEntries(Object.entries(courseScenarios).map(([number, examples])=>[number,{control:"#scenario",examples}])),
  85: { control: "#mcpFilterPolicy", examples: ["static", "context"] },
  86: {
    control: "#cachePolicy",
    examples: ["cached", "invalidate", "uncached"],
  },
  87: { control: "#mcpFailure", examples: ["refused", "timeout", "restart"] },
  88: { control: "#resourcePolicy", examples: ["inspect", "include"] },
  89: {
    control: "#supportIssue",
    examples: ["billing", "technical", "account"],
  },
  90: { control: "#ownershipPattern", examples: ["handoff", "agent-tool"] },
  91: { control: "#routingDescriptions", examples: ["clear", "vague"] },
  92: { control: "#metadataCase", examples: ["valid", "invalid"] },
  93: { control: "#callbackRoute", examples: ["billing", "technical"] },
  94: { control: "#historyPolicy", examples: ["full", "focused"] },

  75: {
    control: "#retrievalDepartment",
    examples: ["robotics", "robotics", "astronomy"],
  },
  76: {
    control: "#ragQuestion",
    examples: ["robotics", "unknown", "robotics"],
  },
  77: { control: "#analysisCase", examples: ["correct", "incorrect"] },
  78: { control: "#imageTask", examples: ["poster", "icon"] },
  79: { control: "#containerPolicy", examples: ["reuse", "reuse", "fresh"] },
  80: { control: "#computerActions", examples: ["1", "2"] },
  81: { control: "#mcpTopic", examples: ["robotics", "astronomy"] },
  82: { control: "#mcpTopic", examples: ["robotics", "astronomy"] },
  83: { control: "#mcpPath", examples: ["sdk", "hosted"] },
  84: { control: "#mcpCredential", examples: ["valid", "invalid", "missing"] },

  65: {
    control: "#toolChoice",
    examples: ["auto", "required", "read_capacity"],
  },
  66: {
    control: "#stopPolicy",
    examples: ["stop_on_first_tool", "run_llm_again", "named"],
  },
  67: { control: "#completionCase", examples: ["complete", "needs-context"] },
  68: {
    control: "#availabilityProfile",
    examples: ["editor", "viewer", "revoked"],
  },
  69: {
    control: "#parallelPattern",
    examples: ["parallel", "parallel", "sequential"],
  },
  70: { control: "#resetPolicy", examples: ["reset", "bounded-loop"] },
  71: { control: "#discoveryMode", examples: ["deferred", "eager"] },
  72: {
    control: "#callerPolicy",
    examples: ["programmatic-only", "direct-and-programmatic"],
  },
  73: { control: "#searchScope", examples: ["official", "open"] },
  74: { control: "#documentQuestion", examples: ["schedule", "materials"] },

  55: {
    control: "#approvalDecision",
    examples: ["pause", "approve", "reject"],
  },
  56: { control: "#sseClient", examples: ["complete", "disconnect"] },
  57: { control: "#calculatorQuestion", examples: ["arithmetic", "concept"] },
  58: {
    control: "#argumentCase",
    examples: ["valid", "wrong-type", "unknown-city"],
  },
  59: { control: "#descriptionQuality", examples: ["clear", "vague"] },
  60: {
    control: "#apiScenario",
    examples: ["success", "unauthorized", "timeout", "server-error"],
  },
  61: {
    control: "#recordCase",
    examples: ["own", "cross", "injection", "own"],
  },
  62: { control: "#returnFormat", examples: ["structured", "text"] },
  63: { control: "#toolErrorPolicy", examples: ["safe-result", "propagate"] },
  64: { control: "#timeoutPolicy", examples: ["as-result", "raise", "retry"] },
  45: { control: "#itemView", examples: ["all", "tools", "handoffs"] },
  46: { control: "#usageScope", examples: ["nested", "single"] },
  47: {
    control: "#exceptionCase",
    examples: ["configuration", "model", "timeout", "turn-limit"],
  },
  48: { control: "#historyPolicy", examples: ["carry", "omit"] },
  49: { control: "#streamSpeed", examples: ["normal", "slow"] },
  50: { control: "#eventView", examples: ["both", "raw", "sdk"] },
  51: { control: "#streamSpecialist", examples: ["robotics", "astronomy"] },
  52: { control: "#toolOutcome", examples: ["success", "failure"] },
  53: { control: "#completionCase", examples: ["success", "failure"] },
  54: { control: "#cancelPoint", examples: ["first", "third", "finish"] },
  35: { control: "#reasoningComparison", examples: ["effort", "verbosity"] },
  36: { control: "#routingTask", examples: ["easy", "hard", "hard"] },
  37: { control: "#apiFeature", examples: ["text", "tool", "hosted"] },
  38: {
    control: "#providerFeature",
    examples: ["tools", "structured", "streaming", "missing-usage"],
  },
  39: { control: "#adapterScenario", examples: ["text", "stream", "invalid"] },
  40: { control: "#connectionPolicy", examples: ["reuse", "fresh"] },
  41: {
    control: "#executionMethod",
    examples: ["async-ts", "async-python", "sync-python"],
  },
  42: { control: "#turnBudget", examples: ["3", "1", "2"] },
  43: { control: "#workflowConfig", examples: ["override", "agent-only"] },
  44: {
    control: "#resultScenario",
    examples: ["handoff", "continuation", "approval"],
  },
  25: {
    control: "#schemaCase",
    examples: ["valid", "wrong-type", "numeric-string"],
  },
  26: { control: "#schemaCase", examples: ["valid", "numeric-string"] },
  27: { control: "#nestedCase", examples: ["null-note", "invalid-enum"] },
  28: {
    control: "#businessCase",
    examples: ["valid", "invalid-date", "missing-evidence"],
  },
  29: {
    control: "#resultCase",
    examples: ["complete", "refusal", "incomplete", "approval"],
  },
  30: { control: "#visionTask", examples: ["describe", "count"] },
  31: { control: "#documentFormat", examples: ["pdf", "text"] },
  32: { control: "#toolModality", examples: ["text", "image", "file"] },
  33: { control: "#modelScope", examples: ["all", "workflow", "process"] },
  34: {
    control: "#settingsCase",
    examples: ["verbosity", "temperature", "temperature"],
  },
  17: {
    control: "#contextCase",
    examples: ["valid", "missing-tenant", "invalid-language"],
  },
  18: { control: "#profile", examples: ["ada", "luis"] },
  19: { control: "#visibility", examples: ["local", "instructions", "tool"] },
  20: { control: "#documentId", examples: ["doc-a", "doc-b", "missing"] },
  21: { control: "#contextLanguage", examples: ["English", "Spanish"] },
  22: {
    control: "#contextPattern",
    examples: ["handoff", "nested-shared", "nested-copy"],
  },
  23: { control: "#recordId", examples: ["record-a", "record-b"] },
  24: {
    control: "#lifecycleOutcome",
    examples: ["success", "failure", "cancel", "init-failure"],
  },
  10: { control: "#instructionSet", examples: ["complete", "goal-only"] },
  11: { control: "#ticket", examples: ["login", "payment", "crash"] },
  12: { control: "#responseLanguage", examples: ["English", "Spanish"] },
  13: { control: "#version", examples: ["1", "2"] },
  14: { control: "#variant", examples: ["concise", "guided"] },
  15: { control: "#audience", examples: ["", "beginners", "beginners"] },
  16: {
    control: "#configCategory",
    examples: ["identity", "model", "validation", "run"],
  },
};

const selection =
  process.argv[2] === "--remaining"
    ? lessons.filter(lesson=>lesson.number>=95)
    : process.argv[2] === "--all"
    ? lessons
    : process.argv[2] === "--handoffs"
      ? lessons.filter((lesson) => lesson.number >= 85 && lesson.number <= 94)
      : process.argv[2] === "--hosted"
        ? lessons.filter((lesson) => lesson.number >= 75 && lesson.number <= 84)
        : process.argv[2] === "--control"
          ? lessons.filter(
              (lesson) => lesson.number >= 65 && lesson.number <= 74,
            )
          : process.argv[2] === "--tools"
            ? lessons.filter(
                (lesson) => lesson.number >= 55 && lesson.number <= 64,
              )
            : process.argv[2] === "--streaming"
              ? lessons.filter(
                  (lesson) => lesson.number >= 45 && lesson.number <= 54,
                )
              : process.argv[2] === "--runtime"
                ? lessons.filter(
                    (lesson) => lesson.number >= 35 && lesson.number <= 44,
                  )
                : process.argv[2] === "--structured"
                  ? lessons.filter(
                      (lesson) => lesson.number >= 25 && lesson.number <= 34,
                    )
                  : process.argv[2] === "--context"
                    ? lessons.filter(
                        (lesson) => lesson.number >= 17 && lesson.number <= 24,
                      )
                    : process.argv[2] === "--definitions"
                      ? lessons.filter(
                          (lesson) =>
                            lesson.number >= 10 && lesson.number <= 16,
                        )
                      : [getLesson(process.argv[2] ?? 2)];
const appsDirectory = fileURLToPath(new URL("../../", import.meta.url));
const fromIndex=process.argv.indexOf("--from");
const minimumNumber=fromIndex<0?2:Number(process.argv[fromIndex+1]);
if(!Number.isInteger(minimumNumber)||minimumNumber<2||minimumNumber>200)throw new Error("Choose --from followed by a prompt from 2 through 200.");
const browser = await chromium.launch({ ...browserOptions(), headless: true });
try {
  for (const lesson of selection.filter(lesson=>lesson.number>=minimumNumber)) {
    const directory = resolve(appsDirectory, lesson.folder, "recordings");
    await mkdir(directory, { recursive: true });
    const server = createApp({ number: lesson.number, env: {} });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    let context;
    try {
      context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: directory, size: { width: 1920, height: 1080 } },
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.locator('body[data-ready="true"]').waitFor();
      await pause(1400);
      await page.locator("#record-button").click();
      const examples =
        definitionWalkthroughs[lesson.number]?.examples ??
        (lesson.number === 9
          ? ["relevant", "unrelated", "clarification", "relevant"]
          : lesson.number === 2
            ? ["basics", "tools", "sessions"]
            : lesson.number === 4
              ? ["missing", "invalid", "configured"]
              : lesson.number === 8
                ? ["imports", "model", "missing"]
                : lesson.number === 5
                  ? ["What is an AI agent?", "What is a function tool?"]
                  : lesson.number === 3
                    ? ["typescript", "python"]
                    : ["robotics", "astronomy"]);
      const control =
        definitionWalkthroughs[lesson.number]?.control ??
        (lesson.number === 9
          ? "#scenario"
          : lesson.number === 2
            ? "#capability"
            : [4, 8].includes(lesson.number)
              ? "#fault"
              : lesson.number === 5
                ? "#question"
                : lesson.number === 3
                  ? "#language"
                  : "#activity");
      for (const [exampleIndex, example] of examples.entries()) {
        if (lesson.number === 85 && exampleIndex === 1)
          await page.locator("#filterRole").selectOption("finance");
        if (lesson.number === 75)
          await page
            .locator("#retrievalLimit")
            .selectOption(exampleIndex === 0 ? "1" : "3");
        if (lesson.number === 76 && exampleIndex === 2)
          await page.locator("#ragProfile").selectOption("ben");
        if (lesson.number === 79)
          await page
            .locator("#shellNetwork")
            .selectOption(exampleIndex === 1 ? "allowlist" : "disabled");
        if (lesson.number === 69)
          await page
            .locator("#concurrencyLimit")
            .selectOption(exampleIndex === 0 ? "1" : "2");
        if (lesson.number === 61 && exampleIndex === 3)
          await page.locator("#databaseProfile").selectOption("ben");
        if (lesson.number === 36 && exampleIndex === 2)
          await page.locator("#routingStrategy").selectOption("direct");
        if (lesson.number === 34 && exampleIndex === 2)
          await page.locator("#modelPreset").selectOption("luna");
        if (lesson.number === 21 && exampleIndex === 1) {
          await page.locator("#timezone").selectOption("America/New_York");
          await page.locator("#detail").selectOption("detailed");
        }
        if (lesson.number === 15 && exampleIndex === 2)
          await page.locator("#duration").selectOption("30");
        if (lesson.number === 12 && exampleIndex === 1) {
          await page.locator("#user").selectOption("luis");
          await page.locator("#application").selectOption("workshop");
        }
        if (lesson.number === 9 && exampleIndex === 3)
          await page.locator("#style").selectOption("guided");
        await page.locator(control).selectOption(example);
        await pause(800);
        for (let step = 0; step < 12; step++) {
          if (
            (await page.locator("body").getAttribute("data-complete")) ===
            "true"
          )
            break;
          await page.locator("#next-button").click();
          await page
            .locator("#run-button")
            .filter({ hasText: "Run exercise" })
            .waitFor();
          await pause(1200);
        }
        if (
          (await page.locator("body").getAttribute("data-complete")) !== "true"
        )
          throw new Error(`Prompt ${lesson.number} failed to complete.`);
        await page.locator("#result summary").click();
        await pause(1800);
        await page.locator("#result summary").click();
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      await page.screenshot({ path: resolve(directory, "final-frame.png") });
      const video = page.video();
      await context.close();
      context = undefined;
      const destination = resolve(
        directory,
        `prompt-${String(lesson.number).padStart(3, "0")}-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`,
      );
      await video.saveAs(destination);
      await video.delete();
      console.log(`Prompt ${lesson.number} video saved to ${destination}`);
    } finally {
      await context?.close();
      await new Promise((resolve) => server.close(resolve));
    }
  }
} finally {
  await browser.close();
}
