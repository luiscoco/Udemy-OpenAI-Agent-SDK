import * as sdk from "@openai/agents";
import OpenAI from "openai";
import { z } from "zod";
import { createProductAgent } from "./examples/structured/product-agent.ts";
import { fileURLToPath } from "node:url";
import { productCases, orderFixture } from "./public/structured-lessons.js";
import {
  createStructuredAgent,
  productSchema,
  nestedSchema,
  nestedFixture,
  orderSchema,
} from "./examples/structured/schemas.mjs";
import { validateBusinessRules } from "./examples/structured/business-validation.mjs";
import { classifyStructuredResult } from "./examples/structured/result-classification.mjs";
import { generationSettings } from "./examples/structured/generation-settings.mjs";
import {
  capturedTransport,
  apiMessage,
} from "./examples/structured/captured-transport.mjs";
import {
  mediaFixtures,
  imageQuestion,
  documentQuestion,
  summarizePayload,
  createMediaTool,
} from "./examples/structured/media-inputs.mjs";
import {
  scriptedModel,
  message,
  functionCall,
} from "./examples/context/scripted-model.mjs";
import { runPythonProduct, runJsonProcess } from "./python-runtime.mjs";
import { loadConfig } from "./examples/organized/config.mjs";

const stage = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});
const select = (value, choices, label) => {
  if (!choices.includes(value)) throw new Error(`Choose a listed ${label}.`);
  return value;
};
const apiResponseText =
  "An AI agent uses a model to decide its next action and can call application-defined tools.";

export async function executeStructured(
  number,
  input,
  { env = {}, signal, dependencies } = {},
) {
  const live = input.mode === "live";
  if (live && [29, 33].includes(number))
    throw new Error(
      "This lesson uses controlled local run outcomes or transport capture.",
    );
  if (live) loadConfig(env);
  const model = env.OPENAI_MODEL || "gpt-6-astra";
  let output;
  let evidence;
  let events;
  let takeaway;
  let label = live
    ? "Actual SDK run · account-backed model"
    : "Actual SDK run · scripted local model";
  const createRunner = (client) =>
    new (dependencies?.Runner ?? sdk.Runner)({
      tracingDisabled: true,
      ...(client
        ? { modelProvider: new sdk.OpenAIProvider({ openAIClient: client }) }
        : {}),
    });
  const liveClient = () =>
    new (dependencies?.OpenAI ?? OpenAI)({
      apiKey: env.OPENAI_API_KEY,
      timeout: 45000,
      maxRetries: 0,
    });
  const run = (agent, question, client) =>
    createRunner(client).run(agent, question, { signal, maxTurns: 4 });

  if (number === 25) {
    select(
      input.schemaCase ?? "valid",
      Object.keys(productCases),
      "product scenario",
    );
    const report = await runPythonProduct(input, { env, signal });
    output = report.accepted
      ? `Validated Python Product\n${JSON.stringify(report.value, null, 2)}`
      : `Python SDK rejected the candidate output.\n${JSON.stringify(report.issues, null, 2)}`;
    evidence = report;
    events = [
      stage(
        "Define the Pydantic output type",
        "Product has a required name and numeric price.",
      ),
      stage(
        "Execute the Python Agents SDK",
        live
          ? "Run the configured account-backed model."
          : "A local Python Model adapter supplies the selected candidate.",
        "model",
      ),
      stage(
        "Inspect result.final_output",
        report.accepted
          ? `Actual Python type: ${report.pythonType}.`
          : `SDK failure: ${report.errorType}.`,
        "sdk",
      ),
      stage(
        "Consume validated output",
        report.accepted
          ? "A validated Product can be used by the application."
          : "The rejected candidate is not consumed.",
      ),
    ];
    takeaway =
      "The SDK returns a validated Pydantic object. Its strict output validation rejects numeric strings, even though standalone Pydantic validation can allow coercion.";
    label = live
      ? "Actual Python Agents SDK run · live model"
      : "Actual Python Agents SDK + Pydantic · scripted model";
  }

  if ([26, 27, 28].includes(number)) {
    let schema;
    let candidate;
    if (number === 26) {
      const key = select(
        input.schemaCase ?? "valid",
        Object.keys(productCases),
        "product scenario",
      );
      candidate = productCases[key];
      schema = productSchema;
    }
    if (number === 27) {
      candidate = nestedFixture(input.nestedCase);
      schema = nestedSchema;
    }
    if (number === 28) {
      candidate = orderFixture(input.businessCase);
      schema = orderSchema;
    }
    const localModel = scriptedModel([message(JSON.stringify(candidate))]);
    const agent =
      number === 26
        ? createProductAgent(live ? model : localModel)
        : createStructuredAgent({
            ...sdk,
            model: live ? model : localModel,
            outputType: schema,
          });
    let value;
    let schemaError;
    try {
      const result = await run(
        agent,
        `Extract this classroom record faithfully: ${JSON.stringify(candidate)}`,
        live ? liveClient() : undefined,
      );
      if (result.interruptions?.length || result.finalOutput === undefined)
        throw new Error("The run did not return completed structured data.");
      value = schema.parse(result.finalOutput);
    } catch (error) {
      const validation = schema.safeParse(candidate);
      if (live || validation.success) throw error;
      schemaError = {
        type: error.name,
        issues: validation.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      };
    }
    const business =
      number === 28 && value ? validateBusinessRules(value) : undefined;
    const accepted = !schemaError && (business?.accepted ?? true);
    output = accepted
      ? `Validated result\n${JSON.stringify(value, null, 2)}`
      : `Rejected before consumption\n${JSON.stringify(schemaError?.issues ?? business.errors, null, 2)}`;
    evidence = {
      accepted,
      schemaPassed: !schemaError,
      candidate,
      ...(schemaError ? { schemaError } : { schemaValidatedValue: value }),
      ...(business ? { business } : {}),
      consumed: accepted,
      modelOutputIsScripted: !live,
    };
    events = [
      stage(
        "Define the output schema",
        number === 27
          ? "Nested objects, item arrays, enum priority, and a nullable note."
          : "Required fields have explicit runtime types.",
      ),
      stage(
        "Run the SDK extractor",
        live
          ? "Observe the actual model output."
          : "The local model emits the selected JSON fixture.",
        "model",
      ),
      stage(
        "Apply runtime schema validation",
        schemaError
          ? "The schema rejected the candidate."
          : "The output passed the structural schema.",
        "sdk",
      ),
      stage(
        number === 28 ? "Check business rules" : "Gate application consumption",
        number === 28
          ? JSON.stringify(business)
          : accepted
            ? "Consume the validated object."
            : "Keep rejected output out of application actions.",
      ),
    ];
    takeaway =
      number === 28
        ? "Schema validation checks structure. Application rules check dates, quantities, and authoritative evidence."
        : "Use the configured schema to obtain a typed object. Rejected output must be handled before application use.";
  }

  if (number === 29) {
    const scenario = select(
      input.resultCase ?? "complete",
      ["complete", "refusal", "incomplete", "approval"],
      "run outcome",
    );
    let result;
    let origin;
    let toolExecuted = false;
    if (["complete", "approval"].includes(scenario)) {
      const confirmation = sdk.tool({
        name: "classroom_confirmation",
        description: "A classroom action that requires approval.",
        parameters: z.object({}),
        needsApproval: true,
        execute: async () => {
          toolExecuted = true;
          return "Confirmed.";
        },
      });
      const localModel = scriptedModel([
        scenario === "complete"
          ? message(JSON.stringify(productCases.valid))
          : functionCall(confirmation.name),
      ]);
      const agent = new sdk.Agent({
        name: "Structured result inspector",
        model: localModel,
        outputType: productSchema,
        tools: scenario === "approval" ? [confirmation] : [],
      });
      result = await run(
        agent,
        "Return the product or request the classroom confirmation.",
      );
      origin = "Actual SDK RunResult";
    } else {
      result = {
        interruptions: [],
        finalOutput: scenario === "incomplete" ? productCases.valid : undefined,
        rawResponses: [
          {
            output: [
              {
                type: "message",
                role: "assistant",
                status: scenario === "incomplete" ? "incomplete" : "completed",
                content:
                  scenario === "refusal"
                    ? [
                        {
                          type: "refusal",
                          refusal: "Classroom refusal fixture.",
                        },
                      ]
                    : [
                        {
                          type: "output_text",
                          text: JSON.stringify(productCases.valid),
                        },
                      ],
              },
            ],
          },
        ],
      };
      origin = "Injected RunResult-shaped fixture";
    }
    const classified = classifyStructuredResult(result, productSchema);
    output = `Outcome — ${classified.status}\nConsumed — ${classified.consumed}\n${classified.value ? JSON.stringify(classified.value, null, 2) : "The application waits for a complete, permitted result."}`;
    evidence = {
      origin,
      classification: classified,
      interruptionCount: result.interruptions?.length ?? 0,
      approvalStateAvailable:
        scenario === "approval" ? Boolean(result.state) : false,
      toolExecuted,
    };
    events = [
      stage("Inspect the run outcome", origin),
      stage(
        "Check interruptions and refusals",
        `Interruptions: ${result.interruptions?.length ?? 0}.`,
        "sdk",
      ),
      stage(
        "Check provider completion",
        "A schema-valid partial object is still incomplete.",
      ),
      stage(
        "Gate consumption",
        `${classified.status} → consumed=${classified.consumed}`,
      ),
    ];
    takeaway =
      "Completion, approval, and refusal handling precede application consumption of structured results.";
    label = `${origin} · actual application result classification`;
  }

  if ([30, 31, 32].includes(number)) {
    const fixtures = await mediaFixtures();
    let question;
    let requestInput;
    let scriptedAnswer;
    let tools = [];
    const observed = [];
    if (number === 30) {
      const task = select(
        input.visionTask ?? "describe",
        ["describe", "count"],
        "image question",
      );
      question =
        task === "count"
          ? "Count the shapes in this image by color."
          : "Describe the visible shapes and their colors.";
      requestInput = imageQuestion(fixtures, question);
      scriptedAnswer =
        task === "count"
          ? "The fixture contains 3 shapes: 1 blue rectangle, 1 green circle, and 1 orange triangle."
          : "A blue rectangle is on the left, a green circle is in the middle, and an orange triangle is on the right.";
    }
    if (number === 31) {
      const format = select(
        input.documentFormat ?? "pdf",
        ["pdf", "text"],
        "document input format",
      );
      const task = select(
        input.documentQuestion ?? "summary",
        ["summary", "schedule"],
        "document question",
      );
      question =
        task === "schedule"
          ? "Extract the schedule and total duration from this document."
          : "Summarize this document's audience, activity, duration, and materials.";
      requestInput = documentQuestion(fixtures, format, question);
      scriptedAnswer =
        task === "schedule"
          ? "30 minutes total\n5 minutes — introduction\n20 minutes — building and testing\n5 minutes — demonstration and reflection"
          : "A 30-minute beginner robotics workshop uses robotics kits and a projector. Students learn the controls, build and test a route, then demonstrate and reflect.";
    }
    let modality;
    if (number === 32) {
      modality = select(
        input.toolModality ?? "text",
        ["text", "image", "file"],
        "tool result modality",
      );
      tools = [createMediaTool({ sdk, z, fixtures, modality, observed })];
      requestInput =
        "Use read_classroom_fixture and describe the actual returned classroom content.";
      scriptedAnswer =
        modality === "image"
          ? "The tool returned an image containing a blue rectangle, a green circle, and an orange triangle."
          : "The tool returned the beginner robotics workshop plan with a 5/20/5-minute schedule.";
    }
    const transport = capturedTransport(
      number === 32
        ? [
            {
              type: "function_call",
              id: "fc_classroom",
              call_id: "call_classroom_media",
              name: tools[0].name,
              arguments: "{}",
              status: "completed",
            },
            apiMessage(scriptedAnswer),
          ]
        : [apiMessage(scriptedAnswer)],
    );
    const agent = new sdk.Agent({
      name: "Multimodal classroom tutor",
      model,
      instructions:
        "Use the supplied content and describe observations accurately. Use the fixture tool when provided.",
      tools,
    });
    const result = await run(
      agent,
      requestInput,
      live ? liveClient() : transport.client,
    );
    if (
      typeof result.finalOutput !== "string" ||
      !result.finalOutput.trim() ||
      result.interruptions?.length
    )
      throw new Error("The multimodal run did not return a completed answer.");
    output = result.finalOutput;
    evidence = {
      classroomInferenceIsScripted: !live,
      imageBytes: fixtures.image.length,
      pdfBytes: fixtures.pdf.length,
      imageSHA256: fixtures.imageHash,
      pdfSHA256: fixtures.pdfHash,
      observedToolCalls: observed,
      ...(live
        ? { model }
        : {
            actualSDKRequests: summarizePayload(transport.requests),
            externalNetworkRequests: 0,
          }),
      ...(number === 31
        ? {
            checkedLimit:
              "Each file must be under 50 MB and combined request files must be at most 50 MB. PDF text and page images consume model context.",
            officialReference:
              "https://developers.openai.com/api/docs/guides/file-inputs",
            actualDocumentText: fixtures.text,
          }
        : {}),
    };
    events = [
      stage(
        "Load the actual teaching asset",
        number === 30
          ? "Bundled deterministic PNG."
          : "Bundled workshop PDF and extracted text.",
      ),
      stage(
        number === 32
          ? "Execute the multimodal tool"
          : "Build the content input",
        number === 32
          ? `Observed tool modalities: ${observed.join(", ") || "none"}.`
          : JSON.stringify(summarizePayload(requestInput)),
        number === 32 ? "tool" : "application",
      ),
      stage(
        "Inspect the SDK request",
        live
          ? "Sent through the configured account-backed model provider."
          : "Captured the actual provider request through a local transport.",
        "sdk",
      ),
      stage(
        "Read the response",
        live
          ? "Actual model observations."
          : "Scripted classroom observations. Live API performs real inference.",
        "model",
      ),
    ];
    takeaway =
      number === 30
        ? "Attach the actual image and use a vision-capable model. Compare live observations with the visible asset."
        : number === 31
          ? "PDF inputs include extracted text and page images on compatible models. File formats and size limits depend on the endpoint."
          : "Tool results can contain supported text, image, or file content. Inspect the following model request to see how the SDK forwards it.";
    label = live
      ? "Actual multimodal SDK run · live model"
      : "Actual SDK payload and tool execution · scripted local transport";
  }

  if (number === 33) {
    const scope = select(
      input.modelScope ?? "all",
      ["all", "workflow", "process"],
      "model configuration",
    );
    const report = await runJsonProcess(
      process.execPath,
      [
        fileURLToPath(
          new URL("./examples/structured/model-selection.mjs", import.meta.url),
        ),
        scope,
      ],
      {
        env: {
          ...process.env,
          OPENAI_DEFAULT_MODEL: "gpt-6-luna",
          OPENAI_API_KEY: "",
        },
        signal,
      },
    );
    output = `Resolved request model — ${report.resolvedModel}\nAgent — ${report.agentModel ?? "unset"}\nWorkflow — ${report.workflowModel ?? "unset"}\nProcess — ${report.processModel}`;
    evidence = report;
    events = [
      stage("Set an isolated process default", report.processModel),
      stage(
        "Apply workflow and agent options",
        JSON.stringify({
          agent: report.agentModel,
          workflow: report.workflowModel,
        }),
      ),
      stage(
        "Run the actual SDK resolution path",
        "The OpenAI provider builds a request through a local capture transport.",
        "sdk",
      ),
      stage("Inspect the selected model", report.resolvedModel),
    ];
    takeaway =
      "For this installed TypeScript SDK, an explicit agent model takes precedence, followed by the workflow default, then the provider's process fallback.";
    label = "Actual SDK model resolution · isolated local transport";
  }

  if (number === 34) {
    const configuration = generationSettings(input);
    if (!configuration.compatible) {
      output = `Configuration rejected before a request\n${configuration.reason}`;
      evidence = { ...configuration, accepted: false, requestsSent: 0 };
    } else {
      const transport = capturedTransport([apiMessage(apiResponseText)]);
      const agent = new sdk.Agent({
        name: "Generation settings tutor",
        model: configuration.model,
        modelSettings: configuration.modelSettings,
        instructions: "Explain an AI agent in two concise sentences.",
      });
      const result = await run(
        agent,
        "What is an AI agent?",
        live ? liveClient() : transport.client,
      );
      if (
        typeof result.finalOutput !== "string" ||
        !result.finalOutput.trim() ||
        result.interruptions?.length
      )
        throw new Error("No completed generation result was returned.");
      output = result.finalOutput;
      evidence = {
        ...configuration,
        accepted: true,
        ...(live
          ? { accountBacked: true }
          : {
              capturedRequest: transport.requests[0],
              externalNetworkRequests: 0,
            }),
      };
    }
    events = [
      stage("Select the model profile", configuration.model),
      stage(
        "Build SDK modelSettings",
        JSON.stringify(configuration.modelSettings),
      ),
      stage("Check model compatibility", configuration.reason),
      stage(
        "Inspect the request or rejection",
        configuration.compatible
          ? "Review how SDK fields map to the provider request."
          : "Unsupported settings are rejected before transmission.",
        "sdk",
      ),
    ];
    takeaway =
      "Model settings are model-specific. The installed SDK uses text.verbosity, maxTokens, temperature, topP, and reasoning options with provider mappings.";
    label =
      live && configuration.compatible
        ? "Actual SDK generation · live model"
        : "Actual SDK transport capture + model compatibility checks";
  }

  return { label, events, output, evidence, takeaway };
}
