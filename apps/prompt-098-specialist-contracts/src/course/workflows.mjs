import {
  sdk,
  z,
  scriptedModel,
  functionCall,
  message,
  runAgent,
  courseResult,
  selectScenario,
  textOutput,
} from "./common.mjs";
import { randomUUID } from "node:crypto";

export async function executeWorkflow(number, input, { signal } = {}) {
  const scenario = input.scenario;
  const evidence = {};
  let output;
  if (number === 95) {
    const allowed =
      selectScenario(scenario, ["authorized", "disabled"]) === "authorized";
    let transfers = 0;
    const specialist = new sdk.Agent({
      name: "Account specialist",
      model: scriptedModel([message("Account specialist owns the request.")]),
    });
    const transfer = sdk.handoff(specialist, {
      toolNameOverride: "transfer_account",
      isEnabled: ({ runContext }) => runContext.context.allowed,
      onHandoff: (ctx) => {
        if (!ctx.context.allowed) throw new Error("Forbidden transfer");
        transfers++;
      },
    });
    const run = await runAgent(
      "Triage",
      [
        (request) => {
          evidence.exposedHandoffs = request.handoffs.map(
            (item) => item.toolName,
          );
          return allowed
            ? functionCall("transfer_account")
            : message(
                "Specialist transfer is unavailable for this authenticated fixture.",
              );
        },
      ],
      "Help with the account.",
      {
        agent: { handoffs: [transfer] },
        run: { context: { allowed }, signal },
      },
    );
    Object.assign(evidence, {
      allowed,
      transfers,
      owner: run.result.lastAgent.name,
    });
    output = run.result.finalOutput;
  }
  if (number === 96) {
    const continueSpecialist =
      selectScenario(scenario, ["last-specialist", "restart-triage"]) ===
      "last-specialist";
    const specialistModel = scriptedModel([
      message("Billing owns invoice INV-42."),
      message("Billing handles the follow-up for INV-42."),
    ]);
    const specialist = new sdk.Agent({
      name: "Billing",
      model: specialistModel,
    });
    const triage = new sdk.Agent({
      name: "Triage",
      model: scriptedModel([
        functionCall("transfer_billing"),
        message("Triage receives the follow-up again."),
      ]),
      handoffs: [
        sdk.handoff(specialist, { toolNameOverride: "transfer_billing" }),
      ],
    });
    const runner = new sdk.Runner({ tracingDisabled: true });
    const first = await runner.run(triage, "Invoice INV-42 was duplicated.", {
      signal,
    });
    const second = await runner.run(
      continueSpecialist ? first.lastAgent : triage,
      [
        ...first.history,
        { role: "user", content: "Who handles my follow-up?" },
      ],
      { signal },
    );
    Object.assign(evidence, {
      firstOwner: first.lastAgent.name,
      secondOwner: second.lastAgent.name,
      historyItems: second.history.length,
    });
    output = second.finalOutput;
  }
  if ([97, 98].includes(number)) {
    const structured = number === 98;
    const fail =
      selectScenario(
        scenario,
        structured ? ["valid", "invalid"] : ["combine", "one-specialist"],
      ) === "invalid";
    const specialists = ["Research", "Review"].map(
      (name) =>
        new sdk.Agent({
          name,
          model: scriptedModel([
            message(
              structured
                ? JSON.stringify({ finding: "Robotics", score: 9 })
                : `${name} evidence for Robotics.`,
            ),
          ]),
          ...(structured
            ? {
                outputType: z.object({
                  finding: z.string(),
                  score: z.number(),
                }),
              }
            : {}),
        }),
    );
    let extracted = 0;
    const tools = specialists.map((agent, index) =>
      agent.asTool({
        toolName: `ask_${index}`,
        toolDescription: `Get ${agent.name} evidence.`,
        ...(structured
          ? {
              parameters: z.object({ topic: z.string().min(1) }),
              inputBuilder: ({ topic }) => `Assess ${topic}`,
              customOutputExtractor: (result) => {
                extracted++;
                return `${result.finalOutput.finding}: ${result.finalOutput.score}`;
              },
            }
          : {}),
      }),
    );
    const calls = [
      functionCall(
        "ask_0",
        structured
          ? { topic: fail ? "" : "Robotics" }
          : { input: "Research Robotics." },
      ),
    ];
    if (number === 97 && scenario === "combine")
      calls.push(
        functionCall("ask_1", { input: "Review Robotics." }, "review-call"),
      );
    const run = await runAgent(
      "Manager",
      [
        calls,
        (request) =>
          message(
            `Manager synthesis — ${request.input
              .filter((item) => item.type === "function_call_result")
              .map((item) => textOutput({ input: [item] }))
              .join("\n")}`,
          ),
      ],
      "Prepare the workshop.",
      { agent: { tools }, run: { signal } },
    );
    Object.assign(evidence, {
      extracted,
      specialists: run.result.newItems.filter(
        (item) => item.type === "tool_call_output_item",
      ).length,
      owner: run.result.lastAgent.name,
    });
    output = run.result.finalOutput;
  }
  if (number === 99) {
    const valid =
      selectScenario(scenario, ["valid-contracts", "reject-invalid"]) ===
      "valid-contracts";
    const schema = z.object({
      topic: z.string(),
      sources: z.array(z.string()).min(1),
    });
    const research = await runAgent(
      "Research",
      [
        message(
          JSON.stringify({
            topic: "Robotics",
            sources: valid ? ["handbook-1"] : [],
          }),
        ),
      ],
      "Research.",
      { agent: { outputType: schema }, run: { signal } },
    ).catch((error) => ({ error }));
    if (research.error) {
      evidence.rejected = research.error.name;
      output = "Research contract rejected before drafting.";
    } else {
      const draft = await runAgent(
        "Draft",
        [
          message(
            `Draft about ${research.result.finalOutput.topic}, source ${research.result.finalOutput.sources[0]}.`,
          ),
        ],
        JSON.stringify(research.result.finalOutput),
        { run: { signal } },
      );
      const review = await runAgent(
        "Review",
        [message("Accepted — draft cites handbook-1.")],
        draft.result.finalOutput,
        { run: { signal } },
      );
      Object.assign(evidence, {
        research: research.result.finalOutput,
        draft: draft.result.finalOutput,
        review: review.result.finalOutput,
      });
      output = review.result.finalOutput;
    }
  }
  if (number === 100) {
    const partial =
      selectScenario(scenario, ["all-success", "partial-failure"]) ===
      "partial-failure";
    const results = await Promise.allSettled([
      runAgent("Research A", [message("Source A")], "Research.", {
        run: { signal },
      }),
      runAgent(
        "Research B",
        [
          () => {
            if (partial) throw new Error("Fixture specialist unavailable");
            return message("Source B");
          },
        ],
        "Research.",
        { run: { signal } },
      ),
    ]);
    evidence.results = results.map((value) =>
      value.status === "fulfilled"
        ? { status: value.status, output: value.value.result.finalOutput }
        : { status: value.status, error: value.reason.message },
    );
    output = `Successful specialists — ${results.filter((value) => value.status === "fulfilled").length}\n${JSON.stringify(evidence.results)}`;
  }
  if (number === 101) {
    const route = selectScenario(scenario, ["known-rule", "model-fallback"]);
    let selected = "billing";
    if (route === "model-fallback") {
      const decision = await runAgent(
        "Router",
        [message('{"route":"technical"}')],
        "The app crashes.",
        {
          agent: {
            outputType: z.object({ route: z.enum(["billing", "technical"]) }),
          },
          run: { signal },
        },
      );
      selected = decision.result.finalOutput.route;
    }
    const result = await runAgent(
      selected,
      [message(`${selected} specialist owns this request.`)],
      "Handle request.",
      { run: { signal } },
    );
    Object.assign(evidence, {
      routing: route,
      selected,
      modelRoutingCalls: route === "known-rule" ? 0 : 1,
    });
    output = result.result.finalOutput;
  }
  if (number === 102) {
    const invalid =
      selectScenario(scenario, ["execute-plan", "reject-plan"]) ===
      "reject-plan";
    const plan = z.object({
      tasks: z
        .array(
          z.object({
            id: z.string(),
            operation: z.enum(["read", "summarize"]),
          }),
        )
        .max(3),
    });
    try {
      const r = await runAgent(
        "Planner",
        [
          message(
            JSON.stringify({
              tasks: [{ id: "task-1", operation: invalid ? "delete" : "read" }],
            }),
          ),
        ],
        "Plan.",
        { agent: { outputType: plan }, run: { signal } },
      );
      evidence.plan = r.result.finalOutput;
      evidence.receipts = [];
      for (const task of r.result.finalOutput.tasks) {
        const worker = await runAgent(
          "Plan executor",
          [
            message(
              task.operation === "read"
                ? "Read handbook-1. Robotics starts at 16:00."
                : "Summary of handbook-1 — Robotics at 16:00.",
            ),
          ],
          `Execute ${task.operation} against handbook-1`,
          { run: { signal } },
        );
        evidence.receipts.push({
          id: task.id,
          operation: task.operation,
          receipt: randomUUID(),
          output: worker.result.finalOutput,
          modelRequests: worker.requests.length,
        });
      }
      output = JSON.stringify(evidence.receipts);
    } catch (error) {
      evidence.rejected = error.name;
      output = "Unsupported plan rejected before execution.";
    }
  }
  if (number === 103) {
    const converge =
      selectScenario(scenario, ["converge", "iteration-limit"]) === "converge";
    const iterations = [];
    let draft = "Draft without citation.";
    for (let i = 1; i <= 3; i++) {
      const accepted = converge && i === 2;
      const result = await runAgent(
        "Reviewer",
        [
          message(
            JSON.stringify({
              accepted,
              reason: accepted ? "Citation present" : "Citation required",
            }),
          ),
        ],
        draft,
        {
          agent: {
            outputType: z.object({ accepted: z.boolean(), reason: z.string() }),
          },
          run: { signal },
        },
      );
      iterations.push({ iteration: i, ...result.result.finalOutput });
      if (accepted) break;
      const revision = await runAgent(
        "Draft reviser",
        [message("Revised draft [handbook-1].")],
        `Revise the draft using this feedback ${result.result.finalOutput.reason}`,
        { run: { signal } },
      );
      draft = revision.result.finalOutput;
    }
    Object.assign(evidence, {
      iterations,
      bound: 3,
      accepted: iterations.at(-1).accepted,
    });
    output = `Iterations — ${iterations.length}\nAccepted — ${evidence.accepted}`;
  }
  if (number === 104) {
    const recover =
      selectScenario(scenario, ["complete", "recover"]) === "recover";
    const transitions = {
      created: ["running"],
      running: ["failed", "complete"],
      failed: ["running"],
      complete: [],
    };
    let state = "created";
    const path = [state];
    function move(next) {
      if (!transitions[state].includes(next))
        throw new Error("Invalid state transition");
      state = next;
      path.push(state);
    }
    move("running");
    if (recover) {
      move("failed");
      move("running");
    }
    await runAgent("Worker", [message("Work complete.")], "Execute.", {
      run: { signal },
    });
    move("complete");
    Object.assign(evidence, { state, path, validatedTransitions: true });
    output = path.join(" → ");
  }
  return courseResult(
    number,
    output,
    evidence,
    "Inspect actual SDK ownership, contract validation and application orchestration evidence. Classroom model decisions are scripted.",
  );
}
