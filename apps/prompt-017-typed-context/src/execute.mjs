import { readFile } from "node:fs/promises";
import { courseModule, executeCourse } from "../../foundations-runtime/course/index.mjs";
import {
  starterFiles,
  starterArchive,
  releases,
  verifyReleases,
} from "../../foundations-runtime/bootstrap.mjs";
import { lookupActivity } from "../../foundations-runtime/examples/organized/tools/club.mjs";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";
import { askClub } from "../../foundations-runtime/examples/organized/services/club-service.mjs";
import { faults, diagnose } from "../../foundations-runtime/diagnostics.mjs";
import { executeIdentity } from "../../foundations-runtime/identity-lesson.mjs";
import { executeDefinition } from "../../foundations-runtime/definition-lessons.mjs";

const event = (title, detail, actor = "application", data) => ({
  title,
  detail,
  actor,
  data,
});
const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
export const capabilities = {
  basics: {
    title: "Agents and results",
    shared:
      "Both SDKs define agents, run model turns, and return final output plus run information.",
    python: "Agent(...) · await Runner.run(...) · result.final_output",
    typescript: "new Agent({...}) · await run(...) · result.finalOutput",
    difference:
      "Python uses keyword arguments and asyncio. TypeScript uses option objects and promises.",
  },
  tools: {
    title: "Function tools",
    shared:
      "Both SDKs validate tool arguments and return function results to the model.",
    python: "@function_tool with Python type annotations",
    typescript: "tool({...}) with a Zod parameter schema",
    difference:
      "The registration syntax and schema integrations differ. Your function still implements the action.",
  },
  structured: {
    title: "Structured output",
    shared: "Both SDKs support schema-constrained final output.",
    python: "output_type=YourPydanticModel",
    typescript: "outputType: yourZodSchema",
    difference:
      "Python commonly uses Pydantic. TypeScript uses Zod. Business validation remains an application responsibility.",
  },
  orchestration: {
    title: "Handoffs, guardrails, and tracing",
    shared:
      "Both SDKs offer handoffs, guardrails, and tracing for agent workflows.",
    python: "Python callbacks and snake_case configuration",
    typescript: "TypeScript callbacks and camelCase configuration",
    difference:
      "Check each installed SDK's types and language-specific integrations before porting configuration.",
  },
  sessions: {
    title: "History and sessions",
    shared:
      "Both SDKs support carrying history between turns and session-based state.",
    python: "result.to_input_list() · SQLiteSession in the documented example",
    typescript: "result.history · MemorySession in the documented example",
    difference:
      "Storage adapters differ by language and package. MemorySession is process-local. SQLiteSession uses a database file.",
  },
};

const classroomAnswers = {
  "What is an AI agent?":
    "An AI agent uses a model to choose its next action and can call tools to complete a task. An application defines the agent's instructions and available tools.",
  "What is a function tool?":
    "A function tool is application code that a model can request with structured arguments. The SDK validates those arguments, runs your function, and sends its result back to the model.",
  "Why pin dependencies?":
    "Pinned dependencies identify the versions a project expects. A lockfile also records the resolved dependency tree so students can reproduce the same installation.",
};

export async function executeLesson(
  number,
  input,
  { env, signal, dependencies, onProgress } = {},
) {
  const mode = input.mode ?? "classroom";
  if (!["classroom", "live"].includes(mode))
    throw new Error("Choose classroom or live mode.");
  if (number === 9)
    return executeIdentity(input, { env, signal, dependencies });
  if (number >= 10 && number <= 16)
    return executeDefinition(number, input, { env, signal, dependencies });
  if (number >= 17 && number <= 24)
    return (await import("./context-execution.mjs")).executeContext(
      number,
      input,
      { env, signal, dependencies },
    );
  if (number >= 25 && number <= 34)
    return (await import("../../foundations-runtime/structured-execution.mjs")).executeStructured(
      number,
      input,
      { env, signal, dependencies },
    );
  if (number >= 35 && number <= 44)
    return (await import("../../foundations-runtime/runtime-execution.mjs")).executeRuntime(
      number,
      input,
      { env, signal },
    );
  if (number >= 45 && number <= 54)
    return (await import("../../foundations-runtime/streaming-execution.mjs")).executeStreaming(
      number,
      input,
      { signal, onProgress },
    );
  if (number >= 55 && number <= 64)
    return (await import("../../foundations-runtime/tools-execution.mjs")).executeTools(number, input, {
      env,
      signal,
      onProgress,
    });
  if (number >= 65 && number <= 70)
    return (await import("../../foundations-runtime/control-execution.mjs")).executeControl(
      number,
      input,
      { env, signal },
    );
  if (number >= 71 && number <= 74)
    return (await import("../../foundations-runtime/discovery-execution.mjs")).executeDiscovery(
      number,
      input,
      { env, signal },
    );
  if (number >= 75 && number <= 80)
    return (await import("../../foundations-runtime/hosted-execution.mjs")).executeHosted(
      number,
      input,
      { env, signal },
    );
  if (number >= 81 && number <= 84)
    return (await import("../../foundations-runtime/mcp-execution.mjs")).executeMcp(number, input, {
      env,
      signal,
    });
  if (number >= 85 && number <= 88)
    return (await import("../../foundations-runtime/mcp-control-execution.mjs")).executeMcpControl(
      number,
      input,
      { env, signal },
    );
  if (number >= 95) return executeCourse(number, input, { env, signal, onProgress });
  if (number >= 89 && number <= 94)
    return (await import("../../foundations-runtime/handoff-execution.mjs")).executeHandoff(
      number,
      input,
      { env, signal },
    );
  const activity = input.activity ?? "robotics";
  if ([6, 7].includes(number)) lookupActivity(activity);
  if (mode === "live")
    return executeLive(number, input, { env, signal, dependencies });

  if (number === 2) {
    const key = input.capability ?? "basics";
    if (!Object.hasOwn(capabilities, key))
      throw new Error("Choose a listed capability.");
    const capability = capabilities[key];
    const language = input.language === "python" ? "Python" : "TypeScript";
    return {
      label: "Comparison + scripted model answer",
      events: [
        event(
          "Choose the language",
          `${language} uses the same agent concepts with its own public API.`,
        ),
        event(capability.title, capability.shared),
        event(
          "Compare the APIs",
          `Python: ${capability.python}\nTypeScript: ${capability.typescript}`,
          "sdk",
        ),
        event(
          "Read the final output",
          "The model answer below is scripted for repeatable teaching.",
          "model",
        ),
      ],
      output: classroomAnswers["What is an AI agent?"],
      evidence: capability,
      takeaway: capability.difference,
    };
  }
  if (number === 3) {
    if (input.action === "verify") {
      const verified = await verifyReleases(signal);
      return {
        label: "Live package-registry verification",
        events: [
          event(
            "Read npm stable metadata",
            "Fetched the current @openai/agents latest dist-tag.",
          ),
          event(
            "Read PyPI stable metadata",
            "Fetched the current openai-agents release.",
          ),
          event(
            "Compare with the starter",
            "The downloadable starter keeps its checked-in versions for reproducibility.",
          ),
        ],
        output: `Current TypeScript SDK ${verified.typescript}\nCurrent Python SDK ${verified.python}\nStarter pins ${verified.pinnedTypescript} / ${verified.pinnedPython}`,
        evidence: verified,
        takeaway:
          "Review an upgrade and regenerate its lockfile when the current release differs from the starter.",
      };
    }
    const language = input.language === "python" ? "python" : "typescript";
    const files = await starterFiles(language);
    const archive = await starterArchive(language);
    return {
      label: "Generated starter archive · local operation",
      events: [
        event(
          "Read verified release pins",
          `Bundled registry snapshot checked ${releases.checkedAt}.`,
        ),
        event("Build the project files", Object.keys(files).join("\n")),
        event(
          "Package the starter",
          `Created ${archive.length.toLocaleString()} bytes of ZIP data in memory.`,
        ),
        event(
          "Run it in your terminal",
          language === "python"
            ? "Create a virtual environment, install requirements.txt, set OPENAI_API_KEY, and run main.py."
            : "Extract the ZIP, run npm ci, configure .env, and run npm start.",
        ),
      ],
      output: `Your ${language} starter contains ${Object.keys(files).length} files. Use Download starter to save the ZIP.`,
      evidence: {
        files: Object.keys(files),
        bytes: archive.length,
        pins: releases[language],
        transitiveLock:
          language === "typescript"
            ? "package-lock.json included"
            : "Use pip freeze after installation to record the resolved environment",
      },
      takeaway:
        "A pinned direct dependency fixes the SDK version. A lockfile captures the transitive dependency tree.",
    };
  }
  if (number === 4 || number === 8) {
    const fault = input.fault ?? (number === 4 ? "missing" : "imports");
    if (fault === "configured" && number === 4)
      return {
        label: "Classroom credential fixture",
        events: [
          event(
            "Load environment",
            "A placeholder credential is present in this isolated fixture.",
          ),
          event(
            "Pass local validation",
            "Presence validation succeeds. A real request is required to verify acceptance by the API.",
            "sdk",
          ),
        ],
        output:
          "Configuration loaded. Credential validity is still unverified.",
        evidence: { configured: true, acceptedByAPI: "not tested" },
        takeaway:
          "Checking that a value exists and authenticating with the API are separate operations.",
      };
    if (!Object.hasOwn(faults, fault))
      throw new Error("Choose a listed failure scenario.");
    const fixture = faults[fault];
    let actual = { ...fixture };
    let label = "Injected error fixture · local diagnosis";
    if (fault === "missing") {
      try {
        loadConfig({});
      } catch (error) {
        actual = { code: error.code, message: error.message };
      }
      label = "Actual local configuration failure";
    }
    if (fault === "imports") {
      try {
        await import("@openai/agents-incorrect");
      } catch (error) {
        actual = { code: error.code, message: error.message };
      }
      label = "Actual local import failure";
    }
    const diagnosis = diagnose(actual);
    return {
      label,
      events: [
        event("Reproduce the failure", actual.message),
        event(
          "Inspect the error code",
          `code=${actual.code ?? "unknown"} · status=${actual.status ?? "local"}`,
        ),
        event("Select a recovery path", diagnosis.explanation, "sdk"),
        event("Prepare the retry", diagnosis.command),
      ],
      output: diagnosis.title,
      evidence: { error: actual, diagnosis },
      takeaway: diagnosis.explanation,
    };
  }
  if (number === 5) {
    const question = input.question ?? "What is an AI agent?";
    if (!Object.hasOwn(classroomAnswers, question))
      throw new Error(
        "Choose a listed classroom question, or use Live API for your own question.",
      );
    const answer = classroomAnswers[question];
    return {
      label: "Scripted classroom model answer",
      events: [
        event(
          "Define the agent",
          "Classroom tutor has a name, model, and concise teaching instructions.",
        ),
        event("Run one question", question, "model"),
        event(
          "Read the result",
          "TypeScript reads result.finalOutput. Python reads result.final_output.",
          "sdk",
        ),
        event(
          "Print the final response",
          "The CLI examples send the result to console.log or print.",
        ),
      ],
      output: answer,
      evidence: {
        question,
        resultField:
          input.language === "python"
            ? "result.final_output"
            : "result.finalOutput",
        console: answer,
      },
      takeaway:
        "The runner returns the result. Your application decides how to display or print it.",
    };
  }
  const data = lookupActivity(activity);
  const answer = `${data.activity} club meets on ${data.day} at ${data.time} in ${data.room}.`;
  const events =
    number === 7
      ? [
          event(
            "config.mjs",
            "Configuration has a dedicated module. Classroom mode uses the local dataset.",
          ),
          event(
            "agents/club-agent.mjs",
            "The agent definition registers the timetable tool.",
            "sdk",
          ),
          event(
            "services/club-service.mjs",
            "The application service composes configuration, agent, and execution.",
          ),
          event(
            "tools/club.mjs",
            "Executed the real local lookupActivity function.",
            "tool",
            data,
          ),
          event(
            "tests/club.test.mjs",
            "The focused tests verify the tool contract and rejection of unknown clubs. Run npm test to execute them.",
          ),
        ]
      : [
          event(
            "Model requests a function",
            `Scripted decision: lookup_activity({ activity: "${activity}" }).`,
            "model",
          ),
          event(
            "Execute the local tool",
            "lookupActivity reads the bundled timetable. This function really runs on the server.",
            "tool",
            data,
          ),
          event("Return tool data to the model", JSON.stringify(data), "sdk"),
          event(
            "Model completes the answer",
            "The final sentence is assembled from the actual lookup result for the classroom simulation.",
            "model",
          ),
        ];
  return {
    label: "Scripted model decisions + actual local tool",
    events,
    output: answer,
    evidence: {
      toolName: "lookup_activity",
      arguments: { activity },
      toolResult: data,
      simulatedModelCalls: 2,
      actualLocalToolCalls: 1,
    },
    takeaway:
      number === 7
        ? "Each module owns a distinct responsibility. The service connects the modules."
        : "A tool call completes one action. The model receives its output before deciding whether the run is finished.",
  };
}

async function executeLive(number, input, { env, signal, dependencies }) {
  if (![2, 4, 5, 6, 7].includes(number))
    throw new Error("This lesson uses local operations.");
  if (input.language === "python" && [2, 5].includes(number))
    throw new Error(
      "The in-app live runner uses TypeScript. Download the Python example to run it with Python locally.",
    );
  const config = loadConfig(env);
  if ([6, 7].includes(number)) {
    const toolResults = [];
    const result = await askClub({
      activity: input.activity ?? "robotics",
      env,
      signal,
      onTool: (data) => toolResults.push(data),
      dependencies,
    });
    return {
      label: "Actual Agents SDK run",
      events: [
        event(
          "Create the club agent",
          "Loaded configuration and registered lookup_activity.",
          "sdk",
        ),
        ...toolResults.map((data) =>
          event(
            "Observed tool execution",
            "The registered function returned this timetable entry.",
            "tool",
            data,
          ),
        ),
        event(
          "Read the completed result",
          "The SDK returned finalOutput.",
          "model",
        ),
      ],
      output: result.finalOutput,
      evidence: {
        toolResults,
        actualToolCalls: toolResults.length,
        modelResponses: result.rawResponses?.length ?? null,
      },
      takeaway: toolResults.length
        ? "These results reflect the tool calls observed during this live run."
        : "The model returned an answer without calling the tool. Inspect the instructions and result before relying on a timetable claim.",
    };
  }
  const sdk = dependencies ?? (await import("@openai/agents"));
  const OpenAI = dependencies?.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
  if (number === 4) {
    const response = await client.responses.create(
      { model: config.model, input: "Reply with OK.", max_output_tokens: 32 },
      { signal },
    );
    if (response.status !== "completed")
      throw new Error(
        `Authentication probe ended with status ${response.status}.`,
      );
    return {
      label: "Actual Responses API credential probe",
      events: [
        event(
          "Read server environment",
          "Credential present. Its value stays on the server.",
        ),
        event(
          "Send a minimal model request",
          `Requested ${config.model}.`,
          "model",
        ),
        event(
          "Inspect the response",
          `API accepted this request. Status ${response.status}.`,
          "sdk",
        ),
      ],
      output: response.output_text || "The API accepted the request.",
      evidence: {
        requestAccepted: true,
        model: config.model,
        status: response.status,
      },
      takeaway:
        "This request tests both credentials and access to the selected model.",
    };
  }
  const question = String(input.question ?? "What is an AI agent?").trim();
  if (!question || question.length > 1000)
    throw new Error("Enter a question between 1 and 1,000 characters.");
  const agent = new sdk.Agent({
    name: "Classroom tutor",
    model: config.model,
    instructions:
      "Explain the requested concept to a beginner in two short sentences.",
  });
  const provider = new sdk.OpenAIProvider({ openAIClient: client });
  const runner = new sdk.Runner({
    modelProvider: provider,
    tracingDisabled: true,
  });
  const result = await runner.run(agent, question, { signal, maxTurns: 3 });
  if (result.finalOutput === undefined)
    throw new Error("The run returned no final answer.");
  console.log("[Classroom tutor]", result.finalOutput);
  return {
    label: "Actual TypeScript Agents SDK run",
    events: [
      event("Define the agent", `Using model ${config.model}.`, "sdk"),
      event("Run the question", question, "model"),
      event(
        "Return and print finalOutput",
        "Printed the actual final response to the server terminal.",
      ),
    ],
    output: result.finalOutput,
    evidence: {
      model: config.model,
      finalOutput: result.finalOutput,
      modelResponses: result.rawResponses?.length ?? null,
    },
    takeaway:
      "The browser and server console show the same completed response.",
  };
}
