import { randomUUID } from "node:crypto";
import {
  sdk,
  z,
  runAgent,
  scriptedModel,
  message,
  functionCall,
  courseResult,
  selectScenario,
  textOutput,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import { executeApproval } from "../../../foundations-runtime/course/approvals.mjs";
import { executeRealtime } from "../../../foundations-runtime/course/realtime.mjs";
import { executeSandbox } from "../../../foundations-runtime/course/sandboxes.mjs";
import { durableExercise, withService } from "../../../foundations-runtime/course/reliability.mjs";
import { classify, evaluationDataset } from "../../../foundations-runtime/course/evaluation.mjs";
import { saveArtifact } from "../../../foundations-runtime/artifacts.mjs";
import { parseCsv, barChart } from "../../../foundations-runtime/course/chart.mjs";
import { createRetrievalDatabase } from "../../../foundations-runtime/examples/hosted/retrieval-database.mjs";
import { runJsonProcess } from "../../../foundations-runtime/python-runtime.mjs";
import { fileURLToPath } from "node:url";

export const projectScenarios = {
  193: ["order", "refund", "reject-refund"],
  194: ["grounded", "no-evidence", "forbidden"],
  195: ["complete", "partial-failure"],
  196: ["approve", "reject", "duplicate"],
  197: ["analyze", "invalid-data"],
  198: ["fix", "failing-tests"],
  199: ["interrupt", "tool-failure"],
  200: ["healthy", "recover", "regression"],
};
export async function executeProject(
  number,
  input,
  { signal, captureTrace = false } = {},
) {
  const scenario = selectScenario(input.scenario, projectScenarios[number]);
  const evidence = { scenario };
  let output,
    artifacts = [],
    citations = [];
  if (number === 193) {
    if (!captureTrace)
      return runJsonProcess(
        process.execPath,
        [
          fileURLToPath(new URL("./support-worker.mjs", import.meta.url)),
          scenario,
        ],
        { signal },
      );
    const store = openStore();
    try {
      const session = store.session(randomUUID(), "support");
      const order = sdk.tool({
        name: "lookup_order",
        parameters: z.object({ id: z.literal("ORD-42") }),
        execute: () => ({ id: "ORD-42", status: "shipped", amount: 18 }),
      });
      const billing = new sdk.Agent({
        name: "Billing specialist",
        model: scriptedModel([
          functionCall("lookup_order", { id: "ORD-42" }),
          (request) => message(`Order evidence ${textOutput(request)}`),
        ]),
        tools: [order],
      });
      const triage = new sdk.Agent({
        name: "Support triage",
        model: scriptedModel([functionCall("transfer_billing")]),
        handoffs: [
          sdk.handoff(billing, { toolNameOverride: "transfer_billing" }),
        ],
      });
      const runner = new sdk.Runner({
        tracingDisabled: !captureTrace,
        workflowName: "Customer support",
      });
      const result = await runner.run(triage, "Check order ORD-42.", {
        session,
        signal,
      });
      evidence.owner = result.lastAgent.name;
      evidence.historyItems = (await session.getItems()).length;
      output = result.finalOutput;
      if (scenario !== "order") {
        const reviewed = await executeApproval(
          123,
          { scenario: scenario === "reject-refund" ? "reject" : "approve" },
          { signal },
        );
        evidence.refund = reviewed.evidence;
        output += `\n${reviewed.output}`;
      }
      evidence.audit = result.newItems.map((item) => item.type);
    } finally {
      store.close();
    }
  }
  if (number === 194) {
    const documents = [
      {
        id: "handbook-1",
        tenant: "school-a",
        text: "Robotics workshop runs every Wednesday at 16:00 in Lab 2.",
      },
    ];
    const tenant = scenario === "forbidden" ? "school-b" : "school-a";
    let selected =
      scenario === "no-evidence"
        ? []
        : documents.filter((doc) => doc.tenant === tenant);
    const database = await createRetrievalDatabase();
    try {
      const retrieved = database.search(
        {
          tenantId: tenant === "school-a" ? "tenant-a" : "tenant-b",
          userId: "teacher-fixture",
        },
        scenario === "no-evidence" ? "unknown" : "robotics",
      );
      selected = retrieved.documents
        .filter((doc) => doc.sourceId === "doc-a")
        .map((doc) => ({ id: doc.sourceId, text: doc.text }));
      evidence.retrievalQueries = database.queries;
    } finally {
      database.close();
    }
    const schema = z.object({
      answer: z.string(),
      sources: z.array(z.string()),
      grounded: z.boolean(),
    });
    const result = await runAgent(
      "Knowledge assistant",
      [
        message(
          JSON.stringify({
            answer: selected.length
              ? selected[0].text
              : "No authorized evidence answers this question.",
            sources: selected.map((doc) => doc.id),
            grounded: selected.length > 0,
          }),
        ),
      ],
      `Answer from these authorized sources ${JSON.stringify(selected)}`,
      { agent: { outputType: schema }, run: { signal } },
    );
    evidence.structured = result.result.finalOutput;
    evidence.authorizedDocuments = selected.length;
    output = JSON.stringify(evidence.structured, null, 2);
    citations = selected.map((doc) => ({
      filename: doc.id + " (local classroom handbook)",
      file_id: doc.id,
      type: "file_citation",
      text: doc.text,
    }));
    evidence.citationSource = "Local classroom handbook fixture";
  }
  if (number === 195) {
    const results = await withService(
      (request, response) => {
        if (scenario === "partial-failure" && request.url === "/materials") {
          response.writeHead(503);
          return response.end("Materials unavailable");
        }
        response.setHeader("Content-Type", "application/json");
        response.end(
          JSON.stringify(
            request.url === "/schedule"
              ? { id: "handbook-1", text: "Robotics starts Wednesday at 16:00" }
              : {
                  id: "materials-1",
                  text: "Bring reusable kits and a projector",
                },
          ),
        );
      },
      async (base) => {
        const research = async (name, path) => {
          const search = sdk.tool({
            name: "search_source",
            parameters: z.object({ query: z.string() }),
            errorFunction: null,
            execute: async () => {
              const response = await fetch(base + path, { signal });
              if (!response.ok)
                throw new Error(`Source returned HTTP ${response.status}`);
              return response.json();
            },
          });
          return runAgent(
            name,
            [
              functionCall("search_source", { query: name }),
              (request) => message(`Source evidence ${textOutput(request)}`),
            ],
            `Research ${name}`,
            { agent: { tools: [search] }, run: { signal } },
          );
        };
        return Promise.allSettled([
          research("Workshop schedule", "/schedule"),
          research("Classroom materials", "/materials"),
        ]);
      },
    );
    const findings = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value.result.finalOutput);
    const report = await runAgent(
      "Report editor",
      [
        message(
          `# Classroom research\n\n${findings.join("\n\n")}\n\n${results.some((result) => result.status === "rejected") ? "Materials evidence remains unavailable." : "Both sources were retrieved."}`,
        ),
      ],
      findings.join("\n"),
      { run: { signal } },
    );
    evidence.sources = results.map((result) =>
      result.status === "fulfilled"
        ? { status: "fulfilled", text: result.value.result.finalOutput }
        : { status: "rejected", error: result.reason.message },
    );
    output = report.result.finalOutput;
    artifacts = [await saveArtifact(output, "txt", "Cited research report")];
  }
  if (number === 196) {
    const reviewed = await executeApproval(
      scenario === "duplicate" ? 128 : 123,
      { scenario: scenario === "duplicate" ? "duplicate-resume" : scenario },
      { signal },
    );
    evidence.approval = reviewed.evidence;
    output = reviewed.output;
    artifacts = [
      await saveArtifact(
        JSON.stringify(
          { review: reviewed.reviewRecords, evidence: reviewed.evidence },
          null,
          2,
        ),
        "json",
        "Business action audit",
      ),
    ];
  }
  if (number === 197) {
    try {
      const csv =
        scenario === "invalid-data"
          ? "name,value\nRobotics,not-a-number"
          : String(
              input.csv ?? "name,value\nRobotics,18\nAstronomy,12\nDrama,9",
            );
      const rows = parseCsv(csv);
      const sum = rows.reduce((total, row) => total + row.value, 0);
      evidence.rows = rows;
      evidence.statistics = {
        sum,
        mean: sum / rows.length,
        count: rows.length,
      };
      const analyzed = await runAgent(
        "Data analyst",
        [
          message(
            `Analyzed ${rows.length} rows. Total ${sum}. Mean ${(sum / rows.length).toFixed(2)}.`,
          ),
        ],
        JSON.stringify(evidence.statistics),
        { run: { signal } },
      );
      output = analyzed.result.finalOutput;
      artifacts = [
        await saveArtifact(csv, "csv", "Validated input data"),
        await saveArtifact(
          JSON.stringify(evidence.statistics, null, 2),
          "json",
          "Summary statistics",
        ),
        await saveArtifact(
          barChart(rows.map((row) => row.value)),
          "png",
          "Bar chart, row order follows the input CSV",
        ),
      ];
    } catch (error) {
      evidence.validationError = error.message;
      output = "Data validation stopped analysis. " + error.message;
    }
  }
  if (number === 198) {
    const workspace = await executeSandbox(
      138,
      { scenario: "patch", regression: scenario === "failing-tests" },
      { signal },
    );
    evidence.patch = workspace.evidence;
    evidence.testResult = workspace.output;
    evidence.reviewAccepted = workspace.evidence.testPassed;
    output = `${evidence.testResult}\nReview accepted ${evidence.reviewAccepted}`;
    artifacts = [
      await saveArtifact(
        JSON.stringify(evidence.patch.diff, null, 2),
        "json",
        "Reviewable code change",
      ),
    ];
  }
  if (number === 199) {
    const voice = await executeRealtime(199, { scenario }, { signal });
    evidence.voice = voice.evidence;
    evidence.transcript = "Where is order ORD-42?";
    output = voice.output;
  }
  if (number === 200) {
    const store = openStore();
    try {
      const evaluations = evaluationDataset.map((row) => ({
        ...row,
        actual: classify(row.text, scenario === "regression" ? "v1" : "v2"),
      }));
      evidence.evaluation = {
        cases: evaluations,
        accuracy:
          evaluations.filter((row) => row.expected === row.actual).length /
          evaluations.length,
      };
      evidence.recovery = await durableExercise(store, randomUUID(), {
        crash: scenario === "recover",
        signal,
      });
      evidence.readiness = {
        evaluationPassed: evidence.evaluation.accuracy === 1,
        jobRecovered: evidence.recovery.state === "complete",
        oneEffect: evidence.recovery.effects === 1,
        liveProviderVerified: false,
      };
      evidence.limitations = [
        "Live voice and hosted sandbox providers require configured accounts",
        "Deployment is a local container specification",
        "Classroom model decisions are scripted",
      ];
      output = `Evaluation accuracy ${(evidence.evaluation.accuracy * 100).toFixed(0)}%. Job ${evidence.recovery.state}. Unique effects ${evidence.recovery.effects}.`;
      artifacts = [
        await saveArtifact(
          JSON.stringify(evidence, null, 2),
          "json",
          "Capstone readiness report",
        ),
      ];
    } finally {
      store.close();
    }
  }
  return courseResult(
    number,
    output,
    evidence,
    "Combined applications execute SDK runs, validate data and preserve reviewable evidence. Inspect the report for fixture and deployment boundaries.",
    { artifacts, citations },
  );
}
