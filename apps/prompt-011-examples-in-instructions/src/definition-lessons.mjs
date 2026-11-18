import { readFile } from "node:fs/promises";
import {
  choose,
  designInstructions,
  exampleInstructions,
  ticketCases,
  ticketExamples,
  dynamicContext,
  versionedInstructions,
  clarificationRequest,
} from "./public/definitions.js";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";
import { createPlanningAgent } from "../../foundations-runtime/examples/definitions/instruction-design.mjs";
import { createTicketAgents } from "./examples/definitions/example-instructions.mjs";
import {
  createDynamicAgent,
  resolveDynamicInstructions,
} from "../../foundations-runtime/examples/definitions/dynamic-instructions.mjs";
import { createVersionedAgent } from "../../foundations-runtime/examples/definitions/versioned-prompts.mjs";
import { createTutorVariant } from "../../foundations-runtime/examples/definitions/reusable-agents.mjs";
import { createClarifyingAgent } from "../../foundations-runtime/examples/definitions/clarification.mjs";
import {
  configurationExample,
  configurationCategories,
} from "../../foundations-runtime/examples/definitions/configuration.mjs";
import { installedConfiguration } from "../../foundations-runtime/configuration-inventory.mjs";

const step = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});
const agentEvidence = (agent, instructions) => ({
  name: agent.name,
  instructions: instructions ?? agent.instructions,
  model: agent.model,
});
const tutoringAnswer =
  "An AI agent uses a model to decide which action to take. Tools let it obtain information or perform application-defined actions.";

async function liveRunner(env, sdk, dependencies) {
  const config = loadConfig(env);
  const OpenAI = dependencies?.OpenAI ?? (await import("openai")).default;
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
  return new sdk.Runner({
    modelProvider: new sdk.OpenAIProvider({ openAIClient: client }),
    tracingDisabled: true,
  });
}

export async function executeDefinition(
  number,
  input,
  { env = {}, signal, dependencies } = {},
) {
  const live = input.mode === "live";
  if (live && number === 16)
    throw new Error("Configuration exploration uses local SDK construction.");
  if (live) loadConfig(env);
  const sdk = dependencies ?? (await import("@openai/agents"));
  const model = env.OPENAI_MODEL || "gpt-6-astra";
  const runner = live ? await liveRunner(env, sdk, dependencies) : undefined;
  const run = async (agent, question, context) => {
    const result = await runner.run(agent, question, {
      signal,
      maxTurns: 3,
      ...(context ? { context } : {}),
    });
    if (
      typeof result.finalOutput !== "string" ||
      !result.finalOutput.trim() ||
      result.interruptions?.length
    )
      throw new Error("The run returned no completed text result.");
    return result.finalOutput;
  };
  let output;
  let evidence;
  let events;
  let takeaway;
  let label = live
    ? "Actual Agents SDK model run"
    : "Actual SDK construction + scripted model output";

  if (number === 10) {
    const request = choose(
      input.request ?? "complete",
      ["complete", "missing"],
      "request",
    );
    const agent = createPlanningAgent({ ...sdk, input, model });
    const question =
      request === "complete"
        ? "Plan a robotics workshop for beginners lasting 30 minutes."
        : "Plan a robotics workshop.";
    const sections = designInstructions(input);
    output = live
      ? await run(agent, question)
      : request === "missing" && input.instructionSet !== "goal-only"
        ? "Who is the intended audience, and how long should the workshop last?"
        : input.instructionSet === "goal-only"
          ? "Try a robotics workshop with an introduction, a building activity, and a demonstration. Adapt the timing and materials to your class."
          : "Beginner robotics workshop · 30 minutes\n5 min — introduce the robot and its controls\n20 min — build and test a simple route\n5 min — demonstrate and discuss\nMaterials — robotics kits and projector";
    evidence = {
      agent: agentEvidence(agent),
      question,
      includedSections:
        input.instructionSet === "goal-only"
          ? ["goal"]
          : Object.keys(sections.sections),
      modelOutputIsScripted: !live,
    };
    events = [
      step("State the goal", sections.sections.goal),
      step("Inspect the included instructions", sections.instructions, "sdk"),
      step(
        "Check completion criteria",
        input.instructionSet === "goal-only"
          ? "This instruction set omits completion criteria."
          : sections.sections.completion,
        "sdk",
      ),
      step("Test the request", question, "model"),
    ];
    takeaway =
      "Check the instructions for goal, available information, permitted actions, and completion criteria. Classroom outputs illustrate the selected instruction set.";
  }
  if (number === 11) {
    const key = choose(
      input.ticket ?? "login",
      Object.keys(ticketCases),
      "ticket",
    );
    const ticket = ticketCases[key];
    const agents = createTicketAgents({ ...sdk, model });
    let before = ticket.before;
    let after = ticket.after;
    if (live) {
      before = await run(agents.before, ticket.question);
      try {
        after = await run(agents.after, ticket.question);
      } catch (error) {
        error.message = `The after-example run failed after the first run completed. ${error.message}`;
        throw error;
      }
    }
    output = `Before examples\n${before}\n\nAfter three examples\n${after}`;
    evidence = {
      question: ticket.question,
      examples: ticketExamples,
      before: { instructions: exampleInstructions(false), output: before },
      after: { instructions: exampleInstructions(true), output: after },
      modelOutputIsScripted: !live,
      comparison:
        "Compare these outputs manually. No quality score is inferred.",
    };
    events = [
      step(
        "Start with baseline instructions",
        agents.before.instructions,
        "sdk",
      ),
      step(
        "Add three input/output examples",
        ticketExamples
          .map((example) => `${example.input} → ${example.output}`)
          .join("\n"),
        "sdk",
      ),
      step("Use the same test ticket", ticket.question, "model"),
      step(
        "Compare both outputs",
        "Live mode performs two independent model runs. Classroom mode replays illustrative fixtures.",
      ),
    ];
    takeaway =
      "Examples specify the intended categories and output format. Check representative tickets when evaluating an instruction change.";
  }
  if (number === 12) {
    const context = dynamicContext(input);
    const agent = createDynamicAgent({ ...sdk, model });
    const resolved = await resolveDynamicInstructions({ sdk, agent, context });
    output = live
      ? await run(agent, "Explain an AI agent.", context)
      : context.language === "Spanish"
        ? `${context.displayName}, un agente de IA utiliza un modelo para decidir su siguiente acción. En ${context.application === "homework" ? "tu tarea" : "el taller"}, una herramienta puede aportar información para completar esa acción.`
        : `${context.displayName}, an AI agent uses a model to decide its next action in ${context.application === "homework" ? "your homework exercise" : "a classroom workshop"}. Tools provide information or perform application-defined actions.`;
    evidence = {
      localContext: context,
      resolvedInstructions: resolved,
      localOnlyFieldsInThisExample: ["userId"],
      modelVisibleFieldsInInstructions: [
        "displayName",
        "language",
        "application",
      ],
      modelOutputIsScripted: !live,
    };
    events = [
      step("Prepare per-run context", JSON.stringify(context)),
      step(
        "Call the instructions callback",
        "The installed SDK's getSystemPrompt invokes dynamicInstructions with RunContext.",
        "sdk",
      ),
      step("Inspect model-visible instructions", resolved, "sdk"),
      step(
        "Run with the same context",
        "The live runner receives this context object for the turn.",
        "model",
      ),
    ];
    takeaway =
      "Context stays in your application until instructions or tool results explicitly expose selected values to the model.";
  }
  if (number === 13) {
    const prompt = versionedInstructions(input);
    const agent = createVersionedAgent({ ...sdk, model, input, env, live });
    const stored = (input.storage ?? "code") === "hosted";
    const reference = stored
      ? await agent.getPrompt(new sdk.RunContext())
      : undefined;
    const spanish = prompt.variables.language === "Spanish";
    output = live
      ? await run(
          agent,
          "Explain delivery options using these classroom facts: standard delivery takes 3–5 days, express takes 1–2 days, collection is available at the school office.",
        )
      : prompt.version === "1"
        ? spanish
          ? "El envío estándar tarda de 3 a 5 días y el exprés de 1 a 2 días. También puedes recoger el pedido en la oficina del colegio."
          : "Standard delivery takes 3–5 days, and express takes 1–2 days. Collection is available at the school office."
        : spanish
          ? "Opciones de entrega\n• Estándar — 3 a 5 días\n• Exprés — 1 a 2 días\n• Recogida — oficina del colegio\n¿Qué opción prefieres?"
          : "Delivery options\n• Standard — 3–5 days\n• Express — 1–2 days\n• Collection — school office\nWhich option do you prefer?";
    evidence = {
      storage: stored
        ? "legacy hosted prompt reference"
        : "versioned application code",
      version: prompt.version,
      variables: prompt.variables,
      ...(stored
        ? { reference, classroomReferenceIsPlaceholder: !live }
        : { instructions: agent.instructions }),
      modelOutputIsScripted: !live,
      notice:
        "Hosted reusable prompt objects are scheduled to shut down November 30, 2026. Code-managed prompt versions support the current migration path.",
    };
    events = [
      step(
        "Select a version",
        `Version ${prompt.version} · language=${prompt.variables.language}`,
      ),
      step(
        "Build the SDK configuration",
        stored
          ? "The installed SDK uses prompt.promptId, version, and variables. Classroom mode inspects a placeholder reference locally."
          : "Read the selected version from the application's prompt builder.",
        "sdk",
      ),
      step(
        "Inspect the resolved configuration",
        JSON.stringify(reference ?? { instructions: agent.instructions }),
        "sdk",
      ),
      step(
        "Run the delivery question",
        live
          ? "Using actual account access and configured resources."
          : "Scripted model output uses the local teaching fixture.",
        "model",
      ),
    ];
    takeaway =
      "Keep prompt versions and variable values visible when comparing runs. The legacy hosted reference requires an existing resource and service availability.";
  }
  if (number === 14) {
    const variant = choose(
      input.variant ?? "concise",
      ["concise", "guided"],
      "tutor variant",
    );
    const { base, specialized } = createTutorVariant({
      ...sdk,
      model,
      variant,
    });
    output = live
      ? await run(specialized, "What is an AI agent?")
      : variant === "concise"
        ? tutoringAnswer
        : "1. Give the agent a goal and instructions.\n2. The model decides what response or tool action to request.\n3. Your application runs tools and returns their results.\n\nWhich part supplies a tool's actual behavior?";
    evidence = {
      base: agentEvidence(base),
      clone: agentEvidence(specialized),
      distinctAgentObjects: base !== specialized,
      baseInstructionsAfterClone: base.instructions,
      modelOutputIsScripted: !live,
      reuseNote:
        "clone copies configuration into a new Agent. Pass separate mutable collections when customization needs independent values.",
    };
    events = [
      step("Define the base tutor", base.instructions, "sdk"),
      step(
        "Call base.clone",
        `Override name and instructions for ${variant} teaching.`,
        "sdk",
      ),
      step(
        "Inspect both objects",
        `Base: ${base.name}\nClone: ${specialized.name}\nDistinct objects: ${base !== specialized}`,
      ),
      step(
        "Run the selected clone",
        "The live model receives the specialized instructions.",
        "model",
      ),
    ];
    takeaway =
      "Reuse a base definition with clone and explicit overrides. Inspect mutable configuration when creating variants.";
  }
  if (number === 15) {
    const request = clarificationRequest(input);
    const agent = createClarifyingAgent({ ...sdk, model });
    const minutes = Number(request.duration);
    const opening = minutes === 60 ? 10 : 5;
    output = live
      ? await run(agent, request.question)
      : request.missing.length
        ? `Please provide ${request.missing.join(" and ")} for the robotics workshop.`
        : `Robotics workshop for ${request.audience} · ${minutes} minutes\n${opening} min — introduce the challenge\n${minutes - opening * 2} min — build and test a robot\n${opening} min — demonstrate and reflect\nMaterials — robotics kits, space to test, and a projector`;
    evidence = {
      agent: agentEvidence(agent),
      request,
      expectedBehavior: request.missing.length
        ? "Ask for missing details before proposing a plan."
        : "Propose activities that fit the supplied duration.",
      modelOutputIsScripted: !live,
    };
    events = [
      step("Inspect current requirements", request.question),
      step("Apply clarification instructions", agent.instructions, "sdk"),
      step(
        "Identify the expected next response",
        request.missing.length
          ? `Missing ${request.missing.join(" and ")}.`
          : "Audience and duration are available.",
      ),
      step(
        "Inspect the response",
        "Classroom decisions are scripted. Live mode relies on the agent's instructions.",
        "model",
      ),
    ];
    takeaway =
      "Ask for the specific missing requirements. Supply the completed details and run again to inspect the proposed plan.";
  }
  if (number === 16) {
    const category = choose(
      input.configCategory ?? "identity",
      Object.keys(configurationCategories),
      "configuration category",
    );
    const { z } = dependencies ?? (await import("zod"));
    const constructed = configurationExample({ sdk, z, model, category });
    const agent = category === "run" ? constructed.agent : constructed;
    const inventory = await installedConfiguration();
    const source = await readFile(
      new URL("../../foundations-runtime/examples/definitions/configuration.mjs", import.meta.url),
      "utf8",
    );
    const excerpt = source
      .split(`// example:${category}\n`)[1]
      ?.split("// end-example")[0]
      ?.trim();
    if (!excerpt)
      throw new Error(
        "Cannot locate this configuration example in its executable source.",
      );
    const info = configurationCategories[category];
    let inspected = {
      name: agent.name,
      model: agent.model,
      tools: agent.tools.map((tool) => tool.name),
      handoffs: agent.handoffs.map((entry) => entry.name),
    };
    if (category === "context")
      inspected.resolvedInstructions = await agent.getSystemPrompt(
        new sdk.RunContext(dynamicContext()),
      );
    if (category === "prompt")
      inspected.prompt = await agent.getPrompt(new sdk.RunContext());
    if (category === "validation")
      inspected.parsedFixture = agent.processFinalOutput(
        '{"category":"billing"}',
      );
    if (category === "run") inspected.runOptions = constructed.runOptions;
    output = `${info.explanation}\n\nFocused factory excerpt\n${excerpt}`;
    evidence = {
      installedSDK: inventory,
      selectedAgentFields: info.fields,
      constructed: inspected,
      constructionOnly: true,
      excerptPrerequisites:
        "sdk and z imports, explicit model, base option object, and dynamicInstructions from this module's imports",
      coveredFields: [
        ...new Set(
          Object.values(configurationCategories).flatMap(
            (entry) => entry.fields,
          ),
        ),
      ],
    };
    events = [
      step(
        "Read installed SDK declarations",
        `${inventory.package} ${inventory.version}`,
      ),
      step(
        "Select public options",
        info.fields.join(", ") || "Run options passed to runner.run",
      ),
      step(
        "Construct the example",
        "The actual installed SDK creates the Agent locally.",
        "sdk",
      ),
      step("Inspect its configuration", info.explanation, "sdk"),
    ];
    label = "Actual installed SDK inspection · zero model requests";
    takeaway =
      "Agent fields define behavior. Run options control execution. This example reads the installed declaration file to show its public option names.";
  }
  return { label, events, output, evidence, takeaway };
}
