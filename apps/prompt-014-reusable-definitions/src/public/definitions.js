import { handoffControls, handoffPreview } from "./handoff-lessons.js";
import { hostedControls, hostedPreview } from "./hosted-lessons.js";
import { controlControls, controlPreview } from "./control-lessons.js";
import { toolsControls, toolsPreview } from "./tools-lessons.js";
import { streamingControls, streamingPreview } from "./streaming-lessons.js";
import { runtimeControls, runtimePreview } from "./runtime-lessons.js";
import { structuredControls, structuredPreview } from "./structured-lessons.js";
import { contextControls, contextPreview } from "./context-lessons.js";

export const ticketExamples = [
  { input: "I was charged twice for my subscription.", output: "billing" },
  { input: "I need to reset my password.", output: "access" },
  { input: "The app crashes when I upload a file.", output: "technical" },
];

export const ticketCases = {
  login: {
    question: "I cannot log in after changing my password.",
    before: "Account trouble",
    after: "access",
  },
  payment: {
    question: "My card was charged for two monthly renewals.",
    before: "Payment problem",
    after: "billing",
  },
  crash: {
    question: "The application closes when I open an attachment.",
    before: "Application issue",
    after: "technical",
  },
};

export function choose(value, allowed, label) {
  if (!allowed.includes(value)) throw new Error(`Choose a listed ${label}.`);
  return value;
}

export function designInstructions(input = {}) {
  const sections = {
    goal: "Goal: propose a beginner robotics workshop for a school club.",
    information:
      "Available information: the school has a classroom, reusable robotics kits, and a projector. Use the audience and duration supplied in the request.",
    actions:
      "Permitted actions: suggest activities and materials. Ask for missing audience or duration. Return recommendations for a teacher to review.",
    completion:
      "Completion criteria: once audience and duration are known, return a title, timed activities, and materials. Otherwise ask for the missing requirements before proposing the plan.",
  };
  const selection = input.instructionSet ?? "complete";
  choose(selection, ["complete", "goal-only"], "instruction set");
  return {
    sections,
    instructions:
      selection === "complete"
        ? Object.values(sections).join("\n")
        : sections.goal,
  };
}

export function exampleInstructions(withExamples) {
  const base = "Classify the support ticket. Use a short category label.";
  if (!withExamples) return base;
  return [
    base,
    "Return exactly one label: billing, access, or technical.",
    ...ticketExamples.map(
      (example) => `Input: ${example.input}\nOutput: ${example.output}`,
    ),
  ].join("\n\n");
}

export function dynamicContext(input = {}) {
  const user = input.user ?? "ada";
  const language = choose(
    input.responseLanguage ?? "English",
    ["English", "Spanish"],
    "language",
  );
  const application = choose(
    input.application ?? "homework",
    ["homework", "workshop"],
    "application context",
  );
  choose(user, ["ada", "luis"], "sample user");
  return {
    userId: user === "ada" ? "sample-user-101" : "sample-user-202",
    displayName: user === "ada" ? "Ada" : "Luis",
    language,
    application,
  };
}

export function dynamicInstructions(runContext) {
  const { displayName, language, application } = runContext.context;
  return `Teach ${displayName} in ${language}. Explain an AI agent in two short sentences for ${application === "homework" ? "a homework exercise" : "a teacher-led workshop"}.`;
}

export function versionedInstructions(input = {}) {
  const version = choose(input.version ?? "1", ["1", "2"], "prompt version");
  const language = choose(
    input.responseLanguage ?? "English",
    ["English", "Spanish"],
    "language variable",
  );
  const instructions =
    version === "1"
      ? `Explain delivery options in ${language} using two short sentences.`
      : `Explain delivery options in ${language}. Use a heading and three concise bullet points. Ask which option the customer prefers.`;
  return { version, variables: { language }, instructions };
}

export function clarificationRequest(input = {}) {
  const audience = choose(
    input.audience ?? "",
    ["", "beginners", "experienced students"],
    "audience",
  );
  const duration = choose(input.duration ?? "", ["", "30", "60"], "duration");
  const missing = [];
  if (!audience) missing.push("audience");
  if (!duration) missing.push("duration");
  return {
    audience,
    duration,
    missing,
    question: `Plan a robotics workshop. Audience: ${audience || "unspecified"}. Duration: ${duration ? `${duration} minutes` : "unspecified"}.`,
  };
}

export const clarificationInstructions = [
  "Help a teacher plan a robotics workshop.",
  "Before proposing a plan, require both the intended audience and the duration.",
  "If either detail is missing, ask a concise question requesting exactly the missing information. Wait for the teacher's answer.",
  "When both are available, propose three timed activities that fit the total duration and a short materials list.",
].join("\n");

export const definitionControls = {
  10: [
    {
      key: "instructionSet",
      label: "Instructions",
      options: [
        ["complete", "Goal, information, actions, completion"],
        ["goal-only", "Goal only"],
      ],
    },
    {
      key: "request",
      label: "Request",
      options: [
        ["complete", "Beginners · 30 minutes"],
        ["missing", "Audience and duration missing"],
      ],
    },
  ],
  11: [
    {
      key: "ticket",
      label: "Support ticket",
      options: [
        ["login", "Login problem"],
        ["payment", "Duplicate payment"],
        ["crash", "Application crash"],
      ],
    },
  ],
  12: [
    {
      key: "user",
      label: "Sample user",
      options: [
        ["ada", "Ada"],
        ["luis", "Luis"],
      ],
    },
    {
      key: "responseLanguage",
      label: "Response language",
      options: [
        ["English", "English"],
        ["Spanish", "Spanish"],
      ],
    },
    {
      key: "application",
      label: "Application context",
      options: [
        ["homework", "Homework"],
        ["workshop", "Workshop"],
      ],
    },
  ],
  13: [
    {
      key: "storage",
      label: "Prompt storage",
      options: [
        ["code", "Versioned application code"],
        ["hosted", "Legacy hosted prompt reference"],
      ],
    },
    {
      key: "version",
      label: "Prompt version",
      options: [
        ["1", "Version 1 · short answer"],
        ["2", "Version 2 · bullet points"],
      ],
    },
    {
      key: "responseLanguage",
      label: "Language variable",
      options: [
        ["English", "English"],
        ["Spanish", "Spanish"],
      ],
    },
  ],
  14: [
    {
      key: "variant",
      label: "Cloned specialist",
      options: [
        ["concise", "Concise tutor"],
        ["guided", "Guided tutor"],
      ],
    },
  ],
  15: [
    {
      key: "audience",
      label: "Audience",
      options: [
        ["", "Unspecified"],
        ["beginners", "Beginners"],
        ["experienced students", "Experienced students"],
      ],
    },
    {
      key: "duration",
      label: "Duration",
      options: [
        ["", "Unspecified"],
        ["30", "30 minutes"],
        ["60", "60 minutes"],
      ],
    },
  ],
  16: [
    {
      key: "configCategory",
      label: "Configuration category",
      options: [
        ["identity", "Identity and instructions"],
        ["model", "Model and model settings"],
        ["capabilities", "Tools and MCP"],
        ["routing", "Handoffs"],
        ["validation", "Output schemas and guardrails"],
        ["prompt", "Legacy stored prompt"],
        ["context", "Dynamic instructions and context"],
        ["behavior", "Tool behavior"],
        ["run", "Run-level options"],
      ],
    },
  ],
  ...contextControls,
  ...structuredControls,
  ...runtimeControls,
  ...streamingControls,
  ...toolsControls,
  ...controlControls,
  ...hostedControls,
  ...handoffControls,
  ...remainingControls,
};

export function definitionPreview(number, input) {
  if (number >= 95) return remainingPreview(number, input);
  if (number >= 85) return handoffPreview(number, input);
  if (number >= 75) return hostedPreview(number, input);
  if (number >= 65) return controlPreview(number, input);
  if (number >= 55) return toolsPreview(number, input);
  if (number >= 45) return streamingPreview(number, input);
  if (number >= 35) return runtimePreview(number, input);
  if (number >= 25) return structuredPreview(number, input);
  if (number >= 17) return contextPreview(number, input);
  if (number === 10) return designInstructions(input).instructions;
  if (number === 11)
    return ticketExamples
      .map((example) => `${example.input}\n→ ${example.output}`)
      .join("\n\n");
  if (number === 12)
    return dynamicInstructions({ context: dynamicContext(input) });
  if (number === 13) return versionedInstructions(input).instructions;
  if (number === 14)
    return "The base tutor teaches AI concepts. clone overrides the name and instructions for the selected response style. This example uses separate option values for each definition.";
  if (number === 15) return clarificationRequest(input).question;
  return "Inspect the configuration example and its installed SDK evidence. Run-level options are passed to runner.run.";
}
import { remainingControls, remainingPreview } from "./remaining-lessons.js";
