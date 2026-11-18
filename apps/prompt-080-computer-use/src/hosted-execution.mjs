import * as sdk from "@openai/agents";
import OpenAI, { toFile } from "openai";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import {
  capturedTransport,
  apiMessage,
} from "../../foundations-runtime/examples/structured/captured-transport.mjs";
import {
  scriptedModel,
  functionCall,
  message,
} from "../../foundations-runtime/examples/context/scripted-model.mjs";
import {
  selectScenario,
  createLessonRunner,
  lessonResult,
} from "../../foundations-runtime/control-execution.mjs";
import { resultCitations } from "../../foundations-runtime/discovery-execution.mjs";
import { saveArtifact, decodeGeneratedImage } from "../../foundations-runtime/artifacts.mjs";
import { createRetrievalDatabase } from "../../foundations-runtime/examples/hosted/retrieval-database.mjs";
import { createBrowserComputer } from "./examples/hosted/browser-computer.mjs";
import { loadConfig } from "../../foundations-runtime/examples/organized/config.mjs";

export const classroomCsv =
  "workshop,attendance\nRobotics,30\nAstronomy,40\nArt,50\n";
export function csvStatistics(csv) {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.shift() !== "workshop,attendance")
    throw new Error("Unexpected CSV columns.");
  const values = lines.map((line) => {
    const [workshop, count, extra] = line.split(",");
    if (!workshop || !count || extra !== undefined || !/^\d+$/.test(count))
      throw new Error("Invalid attendance row.");
    return Number(count);
  });
  if (!values.length || values.some((value) => !Number.isSafeInteger(value)))
    throw new Error("Attendance values are invalid.");
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(total))
    throw new Error("Attendance total exceeds the supported integer range.");
  return { total, mean: total / values.length };
}

function annotations(result) {
  return result.rawResponses
    .flatMap((response) => response.output)
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .flatMap((content) => content.providerData?.annotations ?? []);
}

export async function executeHosted(number, input, { env = {}, signal } = {}) {
  const live = input.mode === "live";
  const modelName = env.OPENAI_MODEL || "gpt-6-astra";
  if (live) loadConfig(env);
  const client = live
    ? new OpenAI({ apiKey: env.OPENAI_API_KEY, timeout: 45000, maxRetries: 0 })
    : undefined;
  const evidence = {};
  const artifacts = [];
  const owned = [];
  let result,
    output,
    citations = [],
    takeaway;
  const stages = [];
  async function execute(agentOptions, prompt, plan, runOptions = {}) {
    const transport = live ? undefined : capturedTransport(plan);
    const runner = createLessonRunner(live, env, transport?.client);
    const agent = new sdk.Agent({ ...agentOptions, model: modelName });
    const response = await runner.run(agent, prompt, {
      signal,
      maxTurns: 5,
      ...runOptions,
    });
    if (!live) evidence.actualRequestPayloads = transport.requests;
    evidence.responseItemTypes = response.rawResponses
      .flatMap((item) => item.output)
      .map((item) => item.type);
    return response;
  }
  async function createContainer(fileId, policy = { type: "disabled" }) {
    const container = await client.containers.create(
      {
        name: `Prompt ${number} teaching container`,
        file_ids: [fileId],
        network_policy: policy,
        expires_after: { anchor: "last_active_at", minutes: 20 },
      },
      { signal },
    );
    owned.push({ kind: "container", id: container.id });
    return container.id;
  }
  async function uploadCsv() {
    const file = await client.files.create(
      {
        file: await toFile(Buffer.from(classroomCsv), "attendance.csv"),
        purpose: "assistants",
      },
      { signal },
    );
    owned.push({ kind: "file", id: file.id });
    return file.id;
  }
  try {
    // lesson:75
    if (number === 75) {
      const department = selectScenario(input.retrievalDepartment, [
        "robotics",
        "astronomy",
      ]);
      const limit = Number(selectScenario(input.retrievalLimit, ["1", "3"]));
      const vectorStoreId = live
        ? env.VECTOR_STORE_ID?.trim()
        : "vs_retrieval_fixture";
      if (!vectorStoreId)
        throw new Error(
          "Configure VECTOR_STORE_ID for a collection whose files have department attributes. See this application's README.",
        );
      const filters = { type: "eq", key: "department", value: department };
      const documents = [1, 2, 3].slice(0, limit).map((index) => ({
        file_id: `file_${department}_${index}`,
        filename: `${department}-${index}.txt`,
        score: 0.98 - index / 100,
        text: `${department} workshop evidence ${index}.`,
        attributes: { department },
      }));
      const answer = apiMessage(
        `Retrieved ${documents.length} ${department} teaching documents.`,
      );
      answer.content[0].annotations = documents.map((document, index) => ({
        type: "file_citation",
        file_id: document.file_id,
        filename: document.filename,
        index,
      }));
      result = await execute(
        {
          name: "Retrieval controls",
          tools: [
            sdk.fileSearchTool(vectorStoreId, {
              filters,
              maxNumResults: limit,
              includeSearchResults: true,
            }),
          ],
          instructions:
            "Use file search for the selected department. Cite retrieved documents and say when no evidence is available.",
        },
        `Search the ${department} collection.`,
        [
          [
            {
              type: "file_search_call",
              id: "fs_controls",
              status: "completed",
              queries: [department],
              results: documents,
            },
            answer,
          ],
        ],
      );
      const searchItems = result.rawResponses
        .flatMap((response) => response.output)
        .filter(
          (item) =>
            item.type === "hosted_tool_call" &&
            item.name === "file_search_call",
        );
      Object.assign(evidence, {
        department,
        limit,
        filters,
        retrievedEvidence: searchItems.flatMap(
          (item) => item.providerData?.results ?? [],
        ),
        providerRetrievalIsFixture: !live,
      });
      citations = resultCitations(result);
      output = result.finalOutput;
      takeaway =
        "The SDK transmits file attribute filters and result limits. Inspect returned search evidence and file citations. Classroom retrieval is injected at the provider boundary.";
    }

    // lesson:76
    if (number === 76) {
      const profile = selectScenario(input.ragProfile, ["alice", "ben"]);
      const topic = selectScenario(input.ragQuestion, ["robotics", "unknown"]);
      const context = {
        userId: profile,
        tenantId: profile === "alice" ? "tenant-a" : "tenant-b",
      };
      const database = await createRetrievalDatabase();
      const retrieved = [];
      try {
        const search = sdk.tool({
          name: "search_documents",
          description:
            "Retrieve authorized workshop evidence for a topic. Returns sufficient and source-tagged documents.",
          parameters: z.object({ topic: z.string().min(1).max(80) }),
          execute: async ({ topic }, runContext) => {
            const value = database.search(runContext.context, topic);
            retrieved.push(value);
            return value;
          },
        });
        const model = scriptedModel([
          functionCall("search_documents", { topic }),
          () => {
            const latest = retrieved.at(-1);
            return message(
              latest?.sufficient
                ? latest.documents
                    .map(
                      (document) => `[${document.sourceId}] ${document.text}`,
                    )
                    .join("\n")
                : "The authorized collection contains insufficient evidence to answer this question.",
            );
          },
        ]);
        const runner = createLessonRunner(live, env);
        const agent = new sdk.Agent({
          name: "Authorized custom RAG",
          tools: [search],
          model: live ? modelName : model,
          instructions:
            "Retrieve the requested topic exactly once. Answer only from returned authorized documents and include their sourceId. If sufficient is false, state that evidence is insufficient.",
        });
        result = await runner.run(
          agent,
          `Retrieve evidence for topic ${topic}.`,
          { context, signal, maxTurns: 3 },
        );
        Object.assign(evidence, {
          database: "Embedded SQLite with synthetic documents",
          context,
          queries: database.queries,
          retrieved,
        });
        output = result.finalOutput;
      } finally {
        database.close();
        evidence.connectionClosed = true;
      }
      takeaway =
        "This application uses embedded SQLite as the teaching database. The callback binds the authenticated tenant to every query and reports insufficient evidence when the authorized search is empty.";
    }

    // lesson:77
    if (number === 77) {
      const validation = selectScenario(input.analysisCase, [
        "correct",
        "incorrect",
      ]);
      if (live && validation === "incorrect")
        throw new Error(
          "The incorrect calculation is a classroom fault-injection scenario. Choose the correct analysis for live execution.",
        );
      const expected = csvStatistics(classroomCsv);
      const containerId = live
        ? await createContainer(await uploadCsv())
        : "cntr_analysis_fixture";
      const reported = {
        total: validation === "correct" ? expected.total : expected.total + 1,
        mean: expected.mean,
      };
      const answer = apiMessage(JSON.stringify(reported));
      answer.content[0].annotations = [
        {
          type: "container_file_citation",
          container_id: containerId,
          file_id: "cfile_summary_fixture",
          filename: "summary.csv",
          start_index: 0,
          end_index: 0,
        },
      ];
      result = await execute(
        {
          name: "Validated CSV analysis",
          tools: [
            sdk.codeInterpreterTool({
              container: containerId,
              includeOutputs: true,
            }),
          ],
          outputType: z.object({ total: z.number(), mean: z.number() }),
          instructions:
            "Use Code Interpreter to locate attendance.csv in the container. Calculate total attendance and arithmetic mean. Write summary.csv with the exact header total,mean and exactly one data row. Include a link to that generated file. Return the total and mean in the output schema.",
        },
        "Analyze attendance.csv and produce the summary file.",
        [
          [
            {
              type: "code_interpreter_call",
              id: "ci_fixture",
              container_id: containerId,
              status: "completed",
              code: "import csv\n# Classroom provider code is a fixture; the application validates the CSV independently.",
              outputs: [{ type: "logs", logs: JSON.stringify(reported) }],
            },
            answer,
          ],
        ],
      );
      const interpreterCalls = result.rawResponses
        .flatMap((response) => response.output)
        .filter(
          (item) =>
            item.type === "hosted_tool_call" &&
            item.name === "code_interpreter_call" &&
            item.status === "completed",
        );
      if (!interpreterCalls.length)
        throw new Error(
          "The model returned no completed Code Interpreter execution.",
        );
      evidence.completedInterpreterCalls = interpreterCalls.length;
      const actual = result.finalOutput;
      const accepted =
        actual?.total === expected.total && actual?.mean === expected.mean;
      Object.assign(evidence, {
        expected,
        reported: actual,
        accepted,
        providerAnalysisIsFixture: !live,
      });
      if (accepted) {
        if (live) {
          for (const citation of annotations(result).filter(
            (item) =>
              item.type === "container_file_citation" &&
              item.filename.endsWith(".csv"),
          )) {
            if (citation.container_id !== containerId)
              throw new Error(
                "Generated file references an unexpected container.",
              );
            const response = await client.containers.files.content.retrieve(
              citation.file_id,
              { container_id: containerId },
              { signal },
            );
            const csv = Buffer.from(await response.arrayBuffer());
            const rows = csv.toString("utf8").trim().split(/\r?\n/);
            const [total, mean] = (rows[1] ?? "").split(",").map(Number);
            if (
              rows[0] !== "total,mean" ||
              rows.length !== 2 ||
              total !== expected.total ||
              mean !== expected.mean
            )
              throw new Error("Generated CSV failed independent validation.");
            artifacts.push(
              await saveArtifact(csv, "csv", "Validated summary.csv"),
            );
          }
          if (!artifacts.length)
            throw new Error(
              "Code Interpreter returned no downloadable summary CSV citation.",
            );
        } else
          artifacts.push(
            await saveArtifact(
              `total,mean\n${expected.total},${expected.mean}\n`,
              "csv",
              "Classroom summary.csv",
            ),
          );
      }
      output = accepted
        ? `Validated total — ${actual.total}\nValidated mean — ${actual.mean}\nGenerated files — ${artifacts.length}`
        : `Calculation rejected — reported total ${actual.total}; independently computed total ${expected.total}.`;
      takeaway =
        "Code Interpreter generates analysis and files in a hosted container. Independent application calculations gate acceptance, and cited files are downloaded before owned containers are deleted. Classroom hosted output is injected.";
    }

    // lesson:78
    if (number === 78) {
      const task = selectScenario(input.imageTask, ["poster", "icon"]);
      const fixture = live
        ? undefined
        : await readFile(
            new URL("../../foundations-runtime/public/assets/classroom-shapes.png", import.meta.url),
          );
      result = await execute(
        {
          name: "Stored image generation",
          tools: [
            sdk.imageGenerationTool({
              model: env.IMAGE_MODEL || "gpt-image-2.5-flare",
              outputFormat: "png",
              quality: "low",
              size: "1024x1024",
            }),
          ],
          instructions:
            "Generate the requested classroom image and describe it in one sentence.",
        },
        `Generate a simple ${task} for a Robotics workshop.`,
        [
          [
            {
              type: "image_generation_call",
              id: "ig_fixture",
              status: "completed",
              result: fixture?.toString("base64"),
            },
            apiMessage("The classroom image is ready."),
          ],
        ],
      );
      const images = result.rawResponses
        .flatMap((response) => response.output)
        .filter(
          (item) =>
            item.type === "hosted_tool_call" &&
            item.name === "image_generation_call",
        );
      if (!images.length)
        throw new Error("The response contains no generated image result.");
      for (const image of images) {
        const decoded = decodeGeneratedImage(image.output);
        artifacts.push(
          await saveArtifact(
            decoded.bytes,
            decoded.extension,
            live ? `Generated ${task}` : "Bundled classroom image fixture",
          ),
        );
      }
      Object.assign(evidence, {
        task,
        providerImageIsFixture: !live,
        storedImages: artifacts.map(({ url, bytes, sha256 }) => ({
          url,
          bytes,
          sha256,
        })),
      });
      output = `${result.finalOutput}\nVerified and stored images — ${artifacts.length}`;
      takeaway =
        "Extract the base64 result from image-generation calls, verify its format, store its bytes and serve the stored image. Classroom mode uses a bundled PNG fixture.";
    }

    // lesson:79
    if (number === 79) {
      const reuse = selectScenario(input.containerPolicy, ["reuse", "fresh"]);
      const network = selectScenario(input.shellNetwork, [
        "disabled",
        "allowlist",
      ]);
      const policy =
        network === "disabled"
          ? { type: "disabled" }
          : { type: "allowlist", allowed_domains: ["developers.openai.com"] };
      const fileId = live ? await uploadCsv() : "file_csv_fixture";
      const containers = [];
      const payloads = [];
      evidence.shellResults = [];
      for (let index = 0; index < 2; index++) {
        signal?.throwIfAborted();
        const containerId =
          reuse === "reuse" && index === 1
            ? containers[0]
            : live
              ? await createContainer(fileId, policy)
              : `cntr_shell_fixture_${index}`;
        containers.push(containerId);
        const command =
          "python -c \"import csv,glob; p=glob.glob('/mnt/data/**/*attendance*',recursive=True)[0]; print(sum(int(r['attendance']) for r in csv.DictReader(open(p))))\"";
        result = await execute(
          {
            name: "Hosted shell CSV reader",
            tools: [
              sdk.shellTool({
                environment: { type: "container_reference", containerId },
              }),
            ],
            instructions:
              "Use the hosted shell to locate the uploaded attendance CSV under /mnt/data. Calculate its total using Python's csv module. Return the observed total. This task needs no network access.",
          },
          `Use the shell for attendance calculation ${index + 1}.`,
          [
            [
              {
                type: "shell_call",
                id: `sh_${index}`,
                call_id: `shell-${index}`,
                status: "completed",
                action: { commands: [command] },
                environment: {
                  type: "container_reference",
                  container_id: containerId,
                },
              },
              {
                type: "shell_call_output",
                call_id: `shell-${index}`,
                output: [
                  {
                    stdout: "120\n",
                    stderr: "",
                    outcome: { type: "exit", exit_code: 0 },
                  },
                ],
              },
              apiMessage("The shell reports total attendance of 120."),
            ],
          ],
        );
        const shellOutputs = result.rawResponses
          .flatMap((response) => response.output)
          .filter((item) => item.type === "shell_call_output");
        if (
          !shellOutputs.some((item) =>
            item.output?.some(
              (entry) =>
                entry.outcome?.type === "exit" && entry.outcome.exitCode === 0,
            ),
          )
        )
          throw new Error(
            "Hosted shell returned no successful execution output.",
          );
        evidence.shellResults.push(...shellOutputs);
        if (!live) payloads.push(...evidence.actualRequestPayloads);
      }
      Object.assign(evidence, {
        policy: reuse,
        networkPolicy: policy,
        inputFileId: fileId,
        observedContainerIds: containers,
        distinctContainers: new Set(containers).size,
        actualRequestPayloads: live ? undefined : payloads,
        providerShellIsFixture: !live,
      });
      output = `Shell calculations — 2\nDistinct containers — ${new Set(containers).size}\nNetwork policy — ${network}\n${result.finalOutput}`;
      takeaway =
        "Hosted shell runs inside provider containers. The application attaches its input file, configures network policy at creation, and either reuses or replaces its owned container. Classroom shell results are provider fixtures.";
    }

    // lesson:80
    if (number === 80) {
      const clicks = Number(selectScenario(input.computerActions, ["1", "2"]));
      const runtime = await createBrowserComputer({ signal });
      try {
        const initial = await runtime.computer.screenshot();
        const model = scriptedModel([
          ...Array.from({ length: clicks }, (_, index) => ({
            type: "computer_call",
            callId: `click-${index}`,
            status: "completed",
            action: { type: "click", x: 120, y: 130, button: "left" },
          })),
          message(`Observed the requested ${clicks} counter actions.`),
        ]);
        const agent = new sdk.Agent({
          name: "Isolated classroom computer",
          model: live ? modelName : model,
          tools: [
            sdk.computerTool({
              name: "computer",
              computer: runtime.computer,
              onSafetyCheck: () => false,
            }),
          ],
          instructions: `Use the computer tool to click Add one student exactly ${clicks} times. Inspect screenshots to verify the displayed counter. Finish when it equals ${clicks}.`,
        });
        result = await createLessonRunner(live, env).run(
          agent,
          [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Enroll ${clicks} students in the isolated counter.`,
                },
                {
                  type: "input_image",
                  image: `data:image/png;base64,${initial}`,
                },
              ],
            },
          ],
          { signal, maxTurns: 6 },
        );
        const observedCount = await runtime.count();
        await runtime.computer.screenshot();
        artifacts.push(runtime.screenshots[0], runtime.screenshots.at(-1));
        Object.assign(evidence, {
          expectedCount: clicks,
          observedCount,
          verified: observedCount === clicks,
          actualActions: runtime.actions,
          screenshots: runtime.screenshots.map(({ sha256, bytes }) => ({
            sha256,
            bytes,
          })),
          isolation:
            "Fresh browser context, bundled HTML, all network routes blocked",
        });
        output = `Requested enrollments — ${clicks}\nObserved counter — ${observedCount}\nScreenshot verification — ${observedCount === clicks ? "passed" : "requires review"}`;
      } finally {
        await runtime.close();
        evidence.browserClosed = true;
      }
      takeaway =
        "The SDK sends actions to an owned Playwright browser adapter. Real screenshots show the state before and after actions. Classroom decisions are scripted, and the browser context is closed after the run.";
    }
    if (!output)
      throw new Error("Choose a hosted-tools lesson from 75 through 80.");
  } finally {
    evidence.resourceCleanup = await Promise.all(
      owned.map(async (resource) => {
        try {
          if (resource.kind === "container")
            await client.containers.delete(resource.id);
          else await client.files.delete(resource.id);
          return { ...resource, closed: true };
        } catch {
          return { ...resource, closed: false };
        }
      }),
    );
  }
  stages.push(
    [
      "Configure the exercise",
      `Prompt ${number} — ${live ? "live model" : "scripted provider or model fixture"}`,
    ],
    ["Execute tools and inspect evidence", output, "tool"],
    [
      "Validate the outcome",
      JSON.stringify({
        accepted: evidence.accepted,
        verified: evidence.verified,
        citations: citations.length,
        artifacts: artifacts.length,
      }),
      "sdk",
    ],
    [
      "Release owned resources",
      evidence.browserClosed || evidence.connectionClosed
        ? "Local resources closed."
        : owned.length
          ? JSON.stringify(evidence.resourceCleanup)
          : "The exercise has settled.",
    ],
  );
  return {
    ...lessonResult(live, output, evidence, stages, takeaway),
    artifacts,
    citations,
  };
}
