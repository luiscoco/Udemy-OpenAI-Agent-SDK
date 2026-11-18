import { handoffLessons } from "./handoff-catalog.mjs";
import { hostedLessons } from "./hosted-catalog.mjs";
import { controlLessons } from "./control-catalog.mjs";
import { toolsLessons } from "./tools-catalog.mjs";
import { streamingLessons } from "./streaming-catalog.mjs";
import { runtimeLessons } from "./runtime-catalog.mjs";
export const lessons = [
  {
    number: 2,
    slug: "language-support",
    title: "Language support",
    headline: "Two languages. One agent concept.",
    summary:
      "Compare Python and TypeScript, follow the same task, and inspect their idiomatic APIs.",
    prompt:
      "Compare the current Python and TypeScript Agents SDKs, identifying shared capabilities and important differences.",
    question: "Which Python field contains the final answer?",
    answers: ["finalOutput", "final_output", "output_text"],
    correct: 1,
    explanation:
      "Python uses result.final_output. TypeScript uses result.finalOutput.",
    live: true,
  },
  {
    number: 3,
    slug: "project-bootstrap",
    title: "Project bootstrap",
    headline: "From an empty folder to a pinned project.",
    summary:
      "Inspect a minimal project, verify package releases, and download a runnable starter.",
    prompt:
      "Create a minimal Agents SDK project, verify the current stable release, and pin its dependencies.",
    question:
      "Which command installs the exact TypeScript dependency tree from a lockfile?",
    answers: ["npm update", "npm ci", "npm install @openai/agents@latest"],
    correct: 1,
    explanation:
      "npm ci installs the versions recorded in package-lock.json and checks it against package.json.",
  },
  {
    number: 4,
    slug: "authentication",
    title: "Authentication",
    headline: "Make configuration failures understandable.",
    summary:
      "Reproduce credential errors, inspect the recovery steps, and probe your server configuration.",
    prompt:
      "Configure API credentials through environment variables and produce clear errors for missing or invalid credentials.",
    question: "Where does this application read OPENAI_API_KEY?",
    answers: [
      "Browser local storage",
      "The Node server environment",
      "A query parameter",
    ],
    correct: 1,
    explanation:
      "The server reads its environment. The UI receives only a configured flag and sanitized results.",
    live: true,
  },
  {
    number: 5,
    slug: "first-agent",
    title: "First agent",
    headline: "Ask one question. Inspect the answer.",
    summary:
      "Define a tutor, send a question, and follow the result through to the console.",
    prompt:
      "Create an agent that answers one question and prints its final response.",
    question: "Which call executes a TypeScript agent?",
    answers: [
      "new Agent(...) alone",
      "await run(agent, question)",
      "console.log(agent)",
    ],
    correct: 1,
    explanation:
      "Creating an Agent defines its behavior. run executes it and returns a result.",
    live: true,
  },
  {
    number: 6,
    slug: "agent-loop",
    title: "Agent loop",
    headline: "Watch the model and tool take turns.",
    summary:
      "Look up a club activity using a real local function, then inspect each stage of the loop.",
    prompt:
      "Demonstrate the agent loop with one tool call, explaining model execution, tool execution, and completion.",
    question: "What happens after a function tool returns its data?",
    answers: [
      "The tool writes the final model answer",
      "Its result returns to the model",
      "The agent definition is deleted",
    ],
    correct: 1,
    explanation:
      "The runner supplies the tool output to the model, which can finish or request more work.",
    live: true,
  },
  {
    number: 7,
    slug: "project-organization",
    title: "Project organization",
    headline: "Follow a request across your project.",
    summary:
      "Explore working modules for configuration, agents, tools, application services, and tests.",
    prompt:
      "Organize the project into agents, tools, configuration, application services, and tests.",
    question:
      "Which layer coordinates configuration, the agent, and execution?",
    answers: ["The tool schema", "The application service", "The CSS file"],
    correct: 1,
    explanation:
      "The application service composes the other modules and returns a result to its caller.",
    live: true,
  },
  {
    number: 8,
    slug: "troubleshooting",
    title: "Troubleshooting",
    headline: "Reproduce the error. Follow the fix.",
    summary:
      "Diagnose installation, import, model, authentication, and configuration failures.",
    prompt:
      "Create a troubleshooting guide for installation errors, incorrect imports, unavailable models, authentication failures, and missing configuration.",
    question: "A model request returns 404. What should you inspect?",
    answers: [
      "Only the browser theme",
      "The model ID and project access",
      "The finalOutput spelling",
    ],
    correct: 1,
    explanation:
      "A 404 model error can indicate an unknown model or unavailable access. Check both before retrying.",
  },
  {
    number: 9,
    slug: "agent-identity",
    title: "Agent identity",
    category: "Agent definitions",
    headline: "Give your specialist a clear identity.",
    summary:
      "Define a tutor's name, responsibility, boundaries, and response style, then test relevant and unrelated requests.",
    prompt:
      "Create a specialist agent with a clear name, responsibility, boundaries, and expected response style.",
    question:
      "What defines the specialist's responsibility and response style?",
    answers: [
      "Only its display name",
      "Its instructions",
      "The server's port number",
    ],
    correct: 1,
    explanation:
      "The name identifies the agent. Its instructions describe the task, boundaries, and response style. Application code enforces resource permissions.",
    live: true,
  },
  {
    number: 10,
    slug: "instruction-design",
    title: "Instruction design",
    category: "Agent definitions",
    headline: "Give the agent a complete task contract.",
    summary:
      "Build instructions around a goal, available facts, permitted actions, and completion criteria.",
    prompt:
      "Write agent instructions specifying its goal, available information, permitted actions, and completion criteria.",
    question: "Which section tells the agent when its task is complete?",
    answers: ["Its display name", "Completion criteria", "The HTTP port"],
    correct: 1,
    explanation:
      "Completion criteria describe the expected finished result and what to do when required information is missing.",
    live: true,
  },
  {
    number: 11,
    slug: "examples-in-instructions",
    title: "Examples in instructions",
    category: "Agent definitions",
    headline: "Compare instructions before and after examples.",
    summary:
      "Inspect three labeled examples and compare two agents on the same support ticket.",
    prompt:
      "Improve an agent’s instructions using three examples, then compare its behavior before and after.",
    question: "How should you compare an instruction change?",
    answers: [
      "Use different tickets for each agent",
      "Use the same representative inputs",
      "Assume every added example improves quality",
    ],
    correct: 1,
    explanation:
      "Use the same representative inputs and inspect the actual outputs. Examples illustrate intended behavior.",
    live: true,
  },
  {
    number: 12,
    slug: "dynamic-instructions",
    title: "Dynamic instructions",
    category: "Agent definitions",
    headline: "Adapt instructions to the current context.",
    summary:
      "Resolve an actual SDK callback using a sample user, language, and application context.",
    prompt:
      "Generate agent instructions dynamically from the current user, language, and application context.",
    question:
      "How does a context value become visible in this lesson's model instructions?",
    answers: [
      "Every context field is sent automatically",
      "The instructions callback includes selected values",
      "The user's ID changes the SDK",
    ],
    correct: 1,
    explanation:
      "The callback explicitly includes the display name, language, and application. The sample user ID stays in local context.",
    live: true,
  },
  {
    number: 13,
    slug: "stored-prompts",
    title: "Prompt versioning",
    category: "Agent definitions",
    headline: "Version prompts in application code.",
    summary:
      "Compare versioned prompt builders with the installed SDK's legacy hosted-prompt reference.",
    prompt:
      "Configure an agent using a stored prompt with a version and variables, where supported.",
    question:
      "Which field names the hosted prompt in the installed Agents SDK?",
    answers: ["prompt.id", "prompt.promptId", "agent.promptName"],
    correct: 1,
    explanation:
      "The installed Agents SDK 0.21.0 uses promptId. Its OpenAI provider maps that field to the API request's id.",
    live: true,
  },
  {
    number: 14,
    slug: "reusable-definitions",
    title: "Reusable definitions",
    category: "Agent definitions",
    headline: "Create a specialist from a reusable base.",
    summary:
      "Use the actual SDK clone method and inspect the base and customized definitions.",
    prompt:
      "Create reusable agent definitions and demonstrate the SDK’s supported cloning or customization mechanism.",
    question: "What does base.clone(overrides) return?",
    answers: [
      "The same Agent object",
      "A new Agent using copied configuration and overrides",
      "A completed model answer",
    ],
    correct: 1,
    explanation:
      "clone returns a new Agent. Review mutable collections when customizing reused definitions.",
    live: true,
  },
  {
    number: 15,
    slug: "clarification-behavior",
    title: "Clarification behavior",
    category: "Agent definitions",
    headline: "Ask for the details the task needs.",
    summary:
      "Test a workshop planner with incomplete and complete audience and duration requirements.",
    prompt:
      "Configure an agent to ask for missing information before attempting a task with incomplete requirements.",
    question: "What should the planner do when duration is missing?",
    answers: [
      "Guess a duration",
      "Ask for the missing duration",
      "Report that the workshop is complete",
    ],
    correct: 1,
    explanation:
      "The instructions require both audience and duration before proposing a plan.",
    live: true,
  },
  {
    number: 16,
    slug: "configuration-reference",
    title: "Configuration reference",
    category: "Agent definitions",
    headline: "Explore the SDK installed on your machine.",
    summary:
      "Inspect public Agent fields, construct examples, and distinguish run-level settings.",
    prompt:
      "Explain the public agent configuration options available in my installed SDK, with a small example for each category.",
    question: "Where does maxTurns belong?",
    answers: [
      "The Agent constructor",
      "The runner.run options",
      "The agent name",
    ],
    correct: 1,
    explanation: "maxTurns controls execution through runner.run options.",
    live: false,
  },
  {
    number: 17,
    slug: "typed-context",
    title: "Typed context",
    category: "Context and dependencies",
    headline: "Give application context a validated shape.",
    summary:
      "Validate user, tenant, preferences, and request metadata before using typed SDK context.",
    prompt:
      "Define typed application context containing user identity, tenant identity, preferences, and request metadata.",
    question: "What checks the actual context values at runtime?",
    answers: [
      "A TypeScript type alone",
      "The runtime Zod schema",
      "The agent's name",
    ],
    correct: 1,
    explanation:
      "TypeScript describes the shape. Zod checks the values that the application actually receives.",
    live: false,
  },
  {
    number: 18,
    slug: "dependencies",
    title: "Dependencies",
    category: "Context and dependencies",
    headline: "Reuse application clients inside a tool.",
    summary:
      "Pass local database, API, and logging adapters through SDK context and inspect their use.",
    prompt:
      "Pass database, API, and logging clients through context so tools can reuse application services.",
    question: "Where does the tool obtain its application clients?",
    answers: [
      "From model-supplied connection strings",
      "From runContext.context.services",
      "From the generated answer",
    ],
    correct: 1,
    explanation:
      "The application initializes clients and passes them through context. The tool uses those instances.",
    live: true,
  },
  {
    number: 19,
    slug: "context-visibility",
    title: "Context visibility",
    category: "Context and dependencies",
    headline: "See the context that reaches the model.",
    summary:
      "Capture actual requests to a local model adapter and inspect explicit visibility channels.",
    prompt:
      "Demonstrate which context values remain local and which become model-visible through instructions or tool results.",
    question: "What makes a local context value visible to the model?",
    answers: [
      "Adding it to any context object",
      "Explicit inclusion in instructions or a tool result",
      "Its property name",
    ],
    correct: 1,
    explanation:
      "The SDK keeps application context local. Instructions and tool results explicitly expose selected information.",
    live: false,
  },
  {
    number: 20,
    slug: "authorization",
    title: "Authorization",
    category: "Context and dependencies",
    headline: "Check access inside the resource tool.",
    summary:
      "Use tenant-scoped lookups to allow or deny a requested document in the classroom dataset.",
    prompt:
      "Enforce resource authorization inside a tool using authenticated context, regardless of identifiers suggested by the model.",
    question: "Which tenant should the data lookup trust?",
    answers: [
      "A tenant ID supplied by the model",
      "The authenticated application context",
      "A prefix in the document ID",
    ],
    correct: 1,
    explanation:
      "The tool uses authenticated context and scopes the actual resource query to that tenant.",
    live: true,
  },
  {
    number: 21,
    slug: "personalization",
    title: "Personalization",
    category: "Context and dependencies",
    headline: "Personalize the reply with selected preferences.",
    summary:
      "Convert a workshop time and adapt language and detail using focused instructions.",
    prompt:
      "Use context to personalize language, timezone, and response detail without exposing unnecessary user data.",
    question: "Which values should personalization expose to the model?",
    answers: [
      "Every internal account field",
      "Only the preferences needed for the response",
      "The application's API key",
    ],
    correct: 1,
    explanation:
      "This example exposes language, timezone, detail, and the converted workshop time while retaining internal identifiers locally.",
    live: true,
  },
  {
    number: 22,
    slug: "shared-context",
    title: "Shared context",
    category: "Context and dependencies",
    headline: "Follow mutable state across agent calls.",
    summary:
      "Compare real SDK handoffs, nested shared context, and nested copied context.",
    prompt:
      "Demonstrate how context behaves across handoffs and nested agent calls, including shared mutable state.",
    question: "What happens when a nested call receives a copied context?",
    answers: [
      "Every mutation updates the parent's object",
      "The child can mutate its own separate copy",
      "The child receives no context",
    ],
    correct: 1,
    explanation:
      "A copied object has separate mutable state. Passing the original object shares its notes array.",
    live: true,
  },
  {
    number: 23,
    slug: "tool-call-context",
    title: "Tool-call context",
    category: "Context and dependencies",
    headline: "Inspect call metadata while limiting logs.",
    summary:
      "Read the installed SDK's ToolCallDetails and log a small allowlist of metadata.",
    prompt:
      "Inspect the supported tool-call context fields, including call identity and arguments, without logging sensitive values.",
    question: "What does the safe application log contain?",
    answers: [
      "Every raw argument value",
      "Call identity and argument names",
      "The private note",
    ],
    correct: 1,
    explanation:
      "The logger records call ID, tool name, argument names, and request ID. Sensitive argument values are omitted.",
    live: true,
  },
  {
    number: 24,
    slug: "dependency-lifecycle",
    title: "Dependency lifecycle",
    category: "Context and dependencies",
    headline: "Close resources when the run ends.",
    summary:
      "Inspect initialization, successful execution, failure, cancellation, and finally cleanup.",
    prompt:
      "Manage application-client initialization and cleanup around agent runs, including cancellation and failure.",
    question: "Where should owned resource cleanup run?",
    answers: [
      "Only after a successful final answer",
      "In finally after awaited work settles",
      "In the model's response",
    ],
    correct: 1,
    explanation:
      "finally runs after success and failure. Await operations and close every initialized or partially initialized owned client.",
    live: false,
  },
  {
    number: 25,
    slug: "python-structured-output",
    title: "Python structured output",
    category: "Structured outputs",
    headline: "Return a validated Python object.",
    summary:
      "The SDK validates the final object with strict Pydantic validation and rejects numeric strings.",
    prompt:
      "Create a Python agent that returns a validated Pydantic object instead of unrestricted text.",
    question: "Which Python value should the application consume?",
    answers: [
      "Any plausible-looking response",
      "The completed, validated Product object",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "The SDK validates the final object with strict Pydantic validation and rejects numeric strings.",
    live: true,
  },
  {
    number: 26,
    slug: "typescript-structured-output",
    title: "TypeScript structured output",
    category: "Structured outputs",
    headline: "Validate output with Zod.",
    summary:
      "z.number() requires a number. This lesson does not enable coercion.",
    prompt:
      "Create a TypeScript agent that returns a validated object defined with Zod.",
    question: "What happens to a numeric string with this Zod schema?",
    answers: [
      "Any plausible-looking response",
      "It fails the numeric field validation",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "z.number() requires a number. This lesson does not enable coercion.",
    live: true,
  },
  {
    number: 27,
    slug: "complex-output-schemas",
    title: "Complex output schemas",
    category: "Structured outputs",
    headline: "Describe nested data precisely.",
    summary:
      "Nullable permits null. The field still needs to be present in this schema.",
    prompt:
      "Return nested objects, arrays, enums, and nullable fields using a schema supported by the selected model.",
    question: "What does a nullable required field permit?",
    answers: [
      "Any plausible-looking response",
      "A value of its type or explicit null",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "Nullable permits null. The field still needs to be present in this schema.",
    live: true,
  },
  {
    number: 28,
    slug: "business-validation",
    title: "Business validation",
    category: "Structured outputs",
    headline: "Check what the data means.",
    summary:
      "A structurally valid string can still contain an impossible date or an unverified evidence ID.",
    prompt:
      "Validate business rules after schema validation, including inconsistent dates, impossible quantities, and missing supporting evidence.",
    question: "When should business rules run?",
    answers: [
      "Any plausible-looking response",
      "After structural validation and before consumption",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "A structurally valid string can still contain an impossible date or an unverified evidence ID.",
    live: true,
  },
  {
    number: 29,
    slug: "incomplete-results",
    title: "Incomplete results",
    category: "Structured outputs",
    headline: "Consume only completed results.",
    summary:
      "Check interruptions, refusals, provider completion, and schema validation before consumption.",
    prompt:
      "Handle refusals, interrupted generation, and incomplete structured results without treating them as successful output.",
    question: "Can a schema-valid partial result be consumed as success?",
    answers: [
      "Any plausible-looking response",
      "Only after completion and permission checks pass",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "Check interruptions, refusals, provider completion, and schema validation before consumption.",
    live: false,
  },
  {
    number: 30,
    slug: "image-understanding",
    title: "Image understanding",
    category: "Structured outputs",
    headline: "Attach the image you want understood.",
    summary:
      "Classroom responses are scripted. The actual PNG is attached through the SDK in both modes.",
    prompt:
      "Give an agent an image and ask it to extract observations using a compatible model.",
    question: "What performs actual visual inference in this app?",
    answers: [
      "Any plausible-looking response",
      "Live API with a compatible model",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "Classroom responses are scripted. The actual PNG is attached through the SDK in both modes.",
    live: true,
  },
  {
    number: 31,
    slug: "document-inputs",
    title: "Document inputs",
    category: "Structured outputs",
    headline: "Ask questions about a real PDF.",
    summary:
      "PDF processing includes text and page images. Endpoint size and model context limits still apply.",
    prompt:
      "Pass a PDF or supported document to an agent and explain input formats, processing behavior, and relevant limits.",
    question: "How are PDFs processed by compatible models?",
    answers: [
      "Any plausible-looking response",
      "Using extracted text and page images",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "PDF processing includes text and page images. Endpoint size and model context limits still apply.",
    live: true,
  },
  {
    number: 32,
    slug: "multimodal-tool-results",
    title: "Multimodal tool results",
    category: "Structured outputs",
    headline: "Let tools return richer content.",
    summary:
      "The actual SDK tool returns the selected modality and the adapter captures its forwarding.",
    prompt:
      "Return supported text, image, or file content from a tool and demonstrate how the agent uses it.",
    question: "Where can you inspect the returned content?",
    answers: [
      "Any plausible-looking response",
      "In the tool observation and following model request",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "The actual SDK tool returns the selected modality and the adapter captures its forwarding.",
    live: true,
  },
  {
    number: 33,
    slug: "model-selection",
    title: "Model selection",
    category: "Model configuration",
    headline: "See which model setting wins.",
    summary:
      "The isolated run captures the resolved model in the actual provider request.",
    prompt:
      "Configure explicit models at agent, workflow, and process levels, and demonstrate which configuration takes precedence.",
    question: "Which setting wins in this installed SDK?",
    answers: [
      "Any plausible-looking response",
      "Explicit agent model before workflow and process defaults",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "The isolated run captures the resolved model in the actual provider request.",
    live: false,
  },
  {
    number: 34,
    slug: "generation-settings",
    title: "Generation settings",
    category: "Model configuration",
    headline: "Match settings to the model.",
    summary:
      "The compatibility profile checks the requested combination before transmission.",
    prompt:
      "Configure supported generation settings and explain which settings the selected model accepts.",
    question: "What should happen to an unsupported setting?",
    answers: [
      "Any plausible-looking response",
      "Reject it before making the model request",
      "Skip the application checks",
    ],
    correct: 1,
    explanation:
      "The compatibility profile checks the requested combination before transmission.",
    live: true,
  },
  ...runtimeLessons,
  ...streamingLessons,
  ...toolsLessons,
  ...controlLessons,
  ...hostedLessons,
  ...handoffLessons,
  ...remainingLessons,
].map((lesson) => ({
  ...lesson,
  folder: `prompt-${String(lesson.number).padStart(3, "0")}-${lesson.slug}`,
  port: 3100 + lesson.number,
}));

export function getLesson(number) {
  const lesson = lessons.find((entry) => entry.number === Number(number));
  if (!lesson) throw new Error("Choose a prompt from 2 through 200.");
  return lesson;
}
import { remainingLessons } from "./remaining-catalog.mjs";
