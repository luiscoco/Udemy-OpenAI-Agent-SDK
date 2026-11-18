import * as sdk from "@openai/agents";
import { removeAllTools } from "@openai/agents-core/extensions";
import OpenAI from "openai";
import { z } from "zod";
import {
  selectScenario,
  createLessonRunner,
  lessonResult,
} from "./control-execution.mjs";
import {
  scriptedModel,
  functionCall,
  message,
} from "./examples/context/scripted-model.mjs";

const cases = {
  billing: {
    name: "Billing specialist",
    description:
      "Handle invoices, payment disputes and duplicate charges. Route login and application faults to their respective specialists.",
    question:
      "Invoice INV-42 was charged twice for EUR 18. Please help with billing.",
    answer:
      "Billing specialist received the duplicate-charge request for INV-42.",
  },
  technical: {
    name: "Technical specialist",
    description:
      "Handle crashes, errors and application behavior. Route invoices to billing and sign-in issues to account support.",
    question: "The classroom application crashes when opening a workshop.",
    answer: "Technical specialist received the application crash report.",
  },
  account: {
    name: "Account specialist",
    description:
      "Handle sign-in and account-access issues. Route crashes to technical support and invoice disputes to billing.",
    question: "I cannot sign in to my classroom account.",
    answer: "Account specialist received the sign-in request.",
  },
};
function toolText(request) {
  const output = request.input
    .filter((item) => item.type === "function_call_result")
    .at(-1)?.output;
  return typeof output === "string"
    ? output
    : output?.type === "text"
      ? output.text
      : JSON.stringify(output);
}

export async function executeHandoff(number, input, { env = {}, signal } = {}) {
  const live = input.mode === "live";
  const requests = [];
  const starts = [];
  const evidence = {};
  const context = {
    requestId: `fixture-request-${number}`,
    routing: [],
    metadata: null,
  };
  let output, result, takeaway;
  const audit = [];
  const client =
    live && number === 94
      ? new OpenAI({
          apiKey: env.OPENAI_API_KEY,
          timeout: 45000,
          maxRetries: 0,
          fetch: async (url, options) => {
            const body = JSON.parse(options.body);
            audit.push({ instructions: body.instructions, input: body.input });
            return fetch(url, options);
          },
        })
      : undefined;
  const runner = createLessonRunner(live, env, client);
  runner.on("agent_start", (_context, agent) =>
    starts.push({ event: "agent_start", agent: agent.name }),
  );
  runner.on("agent_handoff", (_context, from, to) =>
    starts.push({ event: "agent_handoff", from: from.name, to: to.name }),
  );
  const local = (name, plan) =>
    scriptedModel(
      plan.map((step) => (request) => {
        requests.push({
          agent: name,
          systemInstructions: request.systemInstructions,
          input: structuredClone(request.input),
          tools: request.tools.map((tool) => tool.name),
        });
        return typeof step === "function" ? step(request) : step;
      }),
    );
  const modelFor = (model) =>
    live ? env.OPENAI_MODEL || "gpt-6-astra" : model;
  const run = (agent, question) =>
    runner.run(agent, question, { context, signal, maxTurns: 5 });

  // lesson:89
  if (number === 89 || number === 91) {
    const issue = selectScenario(input.supportIssue, [
      "billing",
      "technical",
      "account",
    ]);
    const quality =
      number === 91
        ? selectScenario(input.routingDescriptions, ["clear", "vague"])
        : "clear";
    const specialists = Object.fromEntries(
      Object.entries(cases).map(([key, value], index) => {
        const name =
          quality === "clear"
            ? value.name
            : `Specialist ${String.fromCharCode(65 + index)}`;
        return [
          key,
          new sdk.Agent({
            name,
            instructions: `You handle ${key} requests. Confirm the received issue briefly. This is a synthetic classroom support case.`,
            handoffDescription:
              quality === "clear"
                ? value.description
                : "Handle a support request.",
            model: modelFor(local(name, [message(value.answer)])),
          }),
        ];
      }),
    );
    const transfers = Object.entries(specialists).map(([key, agent], index) =>
      sdk.handoff(agent, {
        toolNameOverride:
          quality === "clear" ? `transfer_${key}` : `transfer_${index + 1}`,
        toolDescriptionOverride:
          quality === "clear"
            ? cases[key].description
            : "Handle a support request.",
        onHandoff: () => {
          evidence.selectedCategory = key;
        },
      }),
    );
    const selected =
      quality === "clear" ? issue : issue === "billing" ? "account" : "billing";
    const selectedTransfer = transfers[Object.keys(cases).indexOf(selected)];
    const triage = new sdk.Agent({
      name: "Triage",
      instructions:
        "Read the support request and transfer it once to the best specialist using the handoff definitions. Let that specialist answer.",
      handoffs: transfers,
      model: modelFor(
        local("Triage", [functionCall(selectedTransfer.toolName)]),
      ),
    });
    result = await run(triage, cases[issue].question);
    Object.assign(evidence, {
      issue,
      descriptionQuality: quality,
      handoffDefinitions: transfers.map((transfer) =>
        transfer.getHandoffAsFunctionTool(),
      ),
      expectedCategory: issue,
      correctlyRouted: evidence.selectedCategory === issue,
    });
    output = `Final answer owner — ${result.lastAgent.name}\n${result.finalOutput}`;
    takeaway =
      number === 89
        ? "A handoff transfers the conversation to the selected specialist. Inspect the actual handoff items and lastAgent to identify who owns the final answer."
        : "Precise descriptions distinguish specialist responsibilities. Classroom vague routing is a controlled ambiguity example. Live model choices are observed and can vary.";
  }

  // lesson:90
  if (number === 90) {
    const pattern = selectScenario(input.ownershipPattern, [
      "handoff",
      "agent-tool",
    ]);
    const specialist = new sdk.Agent({
      name: "Billing specialist",
      model: modelFor(
        local("Billing specialist", [message(cases.billing.answer)]),
      ),
      instructions:
        "Handle the synthetic duplicate-charge request and confirm its invoice ID briefly.",
    });
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_billing",
    });
    const managerModel = local(
      "Manager",
      pattern === "handoff"
        ? [functionCall("transfer_billing")]
        : [
            functionCall("ask_billing", { input: cases.billing.question }),
            (request) => message(`Manager reply — ${toolText(request)}`),
          ],
    );
    const manager = new sdk.Agent({
      name: "Manager",
      model: modelFor(managerModel),
      instructions:
        pattern === "handoff"
          ? "Transfer the billing request to transfer_billing and let the specialist own the answer."
          : "Call ask_billing exactly once. Use its reply to compose your own final answer.",
      handoffs: pattern === "handoff" ? [transfer] : [],
      tools:
        pattern === "agent-tool"
          ? [
              specialist.asTool({
                toolName: "ask_billing",
                toolDescription:
                  "Ask the billing specialist for help with a duplicate invoice charge.",
                runOptions: { maxTurns: 2 },
              }),
            ]
          : [],
    });
    result = await run(manager, cases.billing.question);
    evidence.pattern = pattern;
    output = `Final answer owner — ${result.lastAgent.name}\n${result.finalOutput}`;
    takeaway =
      "A handoff gives the specialist ownership. agent.asTool returns a bounded specialist result to the manager, which continues to its own final answer.";
  }

  // lesson:92
  if (number === 92) {
    const scenario = selectScenario(input.metadataCase, ["valid", "invalid"]);
    if (live && scenario === "invalid")
      throw new Error(
        "Invalid handoff metadata is a classroom fault-injection scenario. Choose valid metadata for live execution.",
      );
    const schema = z.object({
      reason: z.enum(["duplicate_charge"]),
      priority: z.enum(["normal", "high"]),
      invoiceId: z.string().regex(/^INV-\d+$/),
    });
    const candidate = {
      reason: "duplicate_charge",
      priority: scenario === "valid" ? "high" : "urgent",
      invoiceId: "INV-42",
    };
    const specialist = new sdk.Agent({
      name: "Billing specialist",
      model: modelFor(
        local("Billing specialist", [
          message("Billing received validated metadata for INV-42."),
        ]),
      ),
      instructions: (runContext) =>
        `Confirm the billing case using this explicitly included validated metadata: ${JSON.stringify(runContext.context.metadata)}.`,
    });
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_billing",
      inputType: schema,
      onHandoff: (runContext, metadata) => {
        evidence.callbackExecutions = (evidence.callbackExecutions ?? 0) + 1;
        runContext.context.metadata = metadata;
      },
    });
    const triage = new sdk.Agent({
      name: "Metadata triage",
      model: modelFor(
        local("Metadata triage", [functionCall("transfer_billing", candidate)]),
      ),
      instructions:
        "Hand off the duplicate-charge case to billing with reason duplicate_charge, priority high and invoiceId INV-42.",
      handoffs: [transfer],
    });
    try {
      result = await run(triage, cases.billing.question);
      output = result.finalOutput;
    } catch (error) {
      if (scenario !== "invalid" || !(error instanceof sdk.ModelBehaviorError))
        throw error;
      evidence.validationError = { type: error.name, message: error.message };
      output = `Handoff metadata rejected — ${error.name}. The specialist did not run.`;
    }
    Object.assign(evidence, {
      scenario,
      candidate,
      validatedMetadata: context.metadata,
      callbackExecutions: evidence.callbackExecutions ?? 0,
      handoffSchema: transfer.inputJsonSchema,
    });
    takeaway =
      "inputType validates the handoff arguments before onHandoff runs. Model-generated metadata is separate from trusted application context and does not change the configured destination.";
  }

  // lesson:93
  if (number === 93) {
    const issue = selectScenario(input.callbackRoute, ["billing", "technical"]);
    const specialist = new sdk.Agent({
      name: cases[issue].name,
      model: modelFor(local(cases[issue].name, [message(cases[issue].answer)])),
      instructions: `Acknowledge this synthetic ${issue} support case.`,
    });
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_support",
      onHandoff: (runContext) => {
        const event = {
          requestId: runContext.context.requestId,
          from: "Callback triage",
          to: specialist.name,
          sequence: runContext.context.routing.length + 1,
        };
        runContext.context.routing.push(event);
        starts.push({ event: "onHandoff", to: specialist.name });
      },
    });
    const triage = new sdk.Agent({
      name: "Callback triage",
      model: modelFor(
        local("Callback triage", [functionCall("transfer_support")]),
      ),
      instructions:
        "Transfer this support case with transfer_support exactly once.",
      handoffs: [transfer],
    });
    result = await run(triage, cases[issue].question);
    evidence.routingLog = context.routing;
    output = `Application routing records — ${context.routing.length}\nFinal answer owner — ${result.lastAgent.name}\n${result.finalOutput}`;
    takeaway =
      "onHandoff records an application event when the transfer actually occurs. The trace shows the callback before the receiving specialist starts.";
  }

  // lesson:94
  if (number === 94) {
    const policy = selectScenario(input.historyPolicy, ["full", "focused"]);
    const history = [
      {
        role: "user",
        content: "SYNTHETIC_UNRELATED_NOTE — an old astronomy preference.",
      },
      { role: "assistant", content: "The older preference was recorded." },
      { role: "user", content: cases.billing.question },
    ];
    const specialist = new sdk.Agent({
      name: "Billing specialist",
      model: modelFor(
        local("Billing specialist", [
          (request) =>
            message(
              JSON.stringify(request.input).includes("INV-42")
                ? "Billing can review the duplicate EUR 18 charge for INV-42."
                : "Which invoice and amount need review?",
            ),
        ]),
      ),
      instructions:
        "Respond to the billing request using the invoice ID and amount in the supplied history.",
    });
    const filter = (data) => {
      const filtered = removeAllTools(data);
      const relevant = Array.isArray(filtered.inputHistory)
        ? filtered.inputHistory.filter((item) =>
            JSON.stringify(item).includes("INV-42"),
          )
        : filtered.inputHistory;
      evidence.filterApplied = true;
      return { ...filtered, inputHistory: relevant };
    };
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_billing",
      ...(policy === "focused" ? { inputFilter: filter } : {}),
    });
    const triage = new sdk.Agent({
      name: "History triage",
      model: modelFor(
        local("History triage", [functionCall("transfer_billing")]),
      ),
      instructions: "Transfer the latest duplicate-charge request to billing.",
      handoffs: [transfer],
    });
    result = await run(triage, history);
    const received = live
      ? audit.at(-1)?.input
      : requests.find((request) => request.agent === "Billing specialist")
          ?.input;
    Object.assign(evidence, {
      policy,
      specialistInput: received,
      unrelatedHistoryReceived: JSON.stringify(received).includes(
        "SYNTHETIC_UNRELATED_NOTE",
      ),
      invoicePreserved: JSON.stringify(received).includes("INV-42"),
      amountPreserved: JSON.stringify(received).includes("18"),
      filterApplied: evidence.filterApplied ?? false,
    });
    output = `Unrelated history received — ${evidence.unrelatedHistoryReceived}\nInvoice preserved — ${evidence.invoicePreserved}\n${result.finalOutput}`;
    takeaway =
      "inputFilter controls the history sent to the receiving specialist. This filter removes tool-history pairs with the supported helper and retains the invoice request needed to finish the task.";
  }
  if (!output) throw new Error("Choose a handoff lesson from 89 through 94.");
  if (result) {
    const delegated =
      number === 90 && evidence.pattern === "agent-tool"
        ? result.newItems.some((item) => item.type === "tool_call_output_item")
        : starts.some((event) => event.event === "agent_handoff");
    if (!delegated)
      throw new Error(
        "The run completed without executing the expected specialist delegation.",
      );
  }
  Object.assign(evidence, {
    finalOwner: result?.lastAgent?.name ?? null,
    lifecycle: starts,
    modelRequests: requests,
    sdkItemTypes: result?.newItems.map((item) => item.type) ?? [],
    modelResponses: result?.rawResponses.length ?? 0,
  });
  return lessonResult(
    live,
    output,
    evidence,
    [
      ["Define the routing contract", `Prompt ${number}`],
      [
        "Execute the SDK ownership transition",
        evidence.finalOwner
          ? `Final owner — ${evidence.finalOwner}`
          : "The transfer was rejected before specialist execution.",
        "sdk",
      ],
      ["Inspect application and model evidence", output, "model"],
    ],
    takeaway,
  );
}
