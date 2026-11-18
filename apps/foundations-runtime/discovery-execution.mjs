import * as sdk from "@openai/agents";
import { z } from "zod";
import { runInNewContext } from "node:vm";
import {
  capturedTransport,
  apiMessage,
} from "./examples/structured/captured-transport.mjs";
import {
  selectScenario,
  createLessonRunner,
  lessonResult,
} from "./control-execution.mjs";

const apiCall = (name, args, id, extra = {}) => ({
  type: "function_call",
  id: `fc_${id}`,
  call_id: id,
  name,
  arguments: JSON.stringify(args),
  status: "completed",
  ...extra,
});
const modelName = (env) => env.OPENAI_MODEL || "gpt-6-astra";

export function resultCitations(result) {
  const annotations = result.rawResponses
    .flatMap((response) => response.output)
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .flatMap(
      (content) =>
        content.providerData?.annotations ?? content.annotations ?? [],
    );
  return annotations.filter((annotation) =>
    ["url_citation", "file_citation"].includes(annotation.type),
  );
}

// This fixed classroom program aggregates already-returned fixture rows.
// Live generated JavaScript runs in OpenAI's hosted programmatic tool runtime.
export const aggregationCode =
  "JSON.stringify({kits: rows.length, totalAvailable: rows.reduce((total, row) => total + row.available, 0)})";
export const hostedProgram =
  'const rows = await Promise.all(["robot", "sensor", "motor"].map(kit => tools.read_stock({kit})));\ntext(JSON.stringify({kits: rows.length, totalAvailable: rows.reduce((sum, row) => sum + row.available, 0)}));';

export async function executeDiscovery(
  number,
  input,
  { env = {}, signal } = {},
) {
  const live = input.mode === "live";
  const callbacks = [];
  let agent, transport, request, summary, takeaway;
  const details = {};

  // lesson:71
  if (number === 71) {
    const loading = selectScenario(input.discoveryMode, ["deferred", "eager"]);
    const deferred = loading === "deferred";
    const workshop = sdk.tool({
      name: "read_workshop",
      description: "Read the Robotics workshop timetable.",
      deferLoading: deferred,
      parameters: z.object({}),
      execute: async () => {
        callbacks.push("read_workshop");
        return { startsAt: "16:00", room: "Lab 2" };
      },
    });
    const stock = sdk.tool({
      name: "read_stock",
      description: "Read the local kit inventory.",
      deferLoading: deferred,
      parameters: z.object({}),
      execute: async () => {
        callbacks.push("read_stock");
        return { kits: 8 };
      },
    });
    const namespaced = sdk.toolNamespace({
      name: "classroom",
      description: "Read workshop schedules and classroom stock.",
      tools: [workshop, stock],
    });
    const discovery = deferred
      ? [
          {
            type: "tool_search_call",
            id: "ts_fixture",
            call_id: "search-1",
            execution: "server",
            status: "completed",
            arguments: { query: "classroom workshop timetable" },
          },
          {
            type: "tool_search_output",
            id: "tso_fixture",
            call_id: "search-1",
            execution: "server",
            status: "completed",
            tools: [
              {
                type: "tool_reference",
                function_name: "read_workshop",
                namespace: "classroom",
              },
            ],
          },
        ]
      : [];
    transport = capturedTransport([
      [
        ...discovery,
        apiCall("read_workshop", {}, "workshop-1", { namespace: "classroom" }),
      ],
      apiMessage("Robotics starts at 16:00 in Lab 2."),
    ]);
    agent = new sdk.Agent({
      name: "Deferred discovery",
      model: modelName(env),
      tools: [...(deferred ? [sdk.toolSearchTool()] : []), ...namespaced],
      instructions:
        "Find and use the classroom timetable tool. Discover its definition with tool search when deferred. Report only its returned timetable.",
    });
    request = "What time and room is the Robotics workshop?";
    details.loading = loading;
    details.support = {
      toolSearchTool: typeof sdk.toolSearchTool === "function",
      toolNamespace: typeof sdk.toolNamespace === "function",
    };
    summary = "Discover the namespaced timetable capability";
    takeaway =
      "Deferred tools and namespaces are serialized by the installed SDK. Classroom search results are injected provider fixtures. Live API performs hosted tool search with a compatible model.";
  }

  // lesson:72
  if (number === 72) {
    const eligibility = selectScenario(input.callerPolicy, [
      "programmatic-only",
      "direct-and-programmatic",
    ]);
    const allowedCallers =
      eligibility === "programmatic-only"
        ? ["programmatic"]
        : ["direct", "programmatic"];
    const rows = [];
    const read = sdk.tool({
      name: "read_stock",
      description:
        "Read synthetic stock for a classroom kit. Returns an object with kit and available fields.",
      allowedCallers,
      parameters: z.object({ kit: z.enum(["robot", "sensor", "motor"]) }),
      outputSchema: z.object({
        kit: z.enum(["robot", "sensor", "motor"]),
        available: z.number().int().nonnegative(),
      }),
      execute: async ({ kit }, _context, call) => {
        const row = { kit, available: { robot: 4, sensor: 6, motor: 8 }[kit] };
        callbacks.push({ kit, caller: call?.toolCall?.caller });
        rows.push(row);
        return row;
      },
    });
    const write = sdk.tool({
      name: "update_inventory",
      description: "A teaching write capability restricted to direct calls.",
      allowedCallers: ["direct"],
      parameters: z.object({}),
      execute: async () => {
        callbacks.push("update_inventory");
        return { code: "READ_ONLY_EXERCISE" };
      },
    });
    transport = capturedTransport([
      [
        {
          type: "program",
          id: "pg_fixture",
          call_id: "program-1",
          code: hostedProgram,
          fingerprint: "classroom-fixed-program",
        },
        ...["robot", "sensor", "motor"].map((kit, index) =>
          apiCall("read_stock", { kit }, `stock-${index}`, {
            caller: { type: "program", caller_id: "program-1" },
          }),
        ),
      ],
      () => {
        const aggregate = runInNewContext(
          aggregationCode,
          { rows: structuredClone(rows) },
          { timeout: 100 },
        );
        details.classroomAggregate = JSON.parse(aggregate);
        return [
          {
            type: "program_output",
            id: "po_fixture",
            call_id: "program-1",
            result: aggregate,
            status: "completed",
          },
          apiMessage(
            `Three kit types have ${JSON.parse(aggregate).totalAvailable} units available in total.`,
          ),
        ];
      },
    ]);
    agent = new sdk.Agent({
      name: "Read-only programmatic aggregation",
      model: modelName(env),
      tools: [sdk.programmaticToolCallingTool(), read, write],
      modelSettings: { toolChoice: "programmatic_tool_calling" },
      instructions:
        "Use programmatic tool calling to generate JavaScript. Call read_stock for robot, sensor and motor, combine the results and report their totalAvailable. Use Promise.all for independent reads. Only read_stock is eligible for programmatic calls. Do not invoke update_inventory.",
    });
    request =
      "Aggregate the available stock of the three kits using JavaScript.";
    details.eligibility = eligibility;
    details.allowedCallers = {
      read_stock: allowedCallers,
      update_inventory: ["direct"],
    };
    details.classroomProgram = live ? undefined : hostedProgram;
    details.classroomExecution = live
      ? undefined
      : "Provider program and child-call items are injected. A fixed local JavaScript expression aggregates actual callback rows.";
    summary = "Aggregate read-only tool results in JavaScript";
    takeaway =
      "programmaticToolCallingTool enables the hosted runtime. allowedCallers restricts eligible capabilities, and SDK child calls retain their program caller relationship. Classroom JavaScript is a fixed fixture.";
  }

  // lesson:73
  if (number === 73) {
    const restriction = selectScenario(input.searchScope, ["official", "open"]);
    const tools = [
      sdk.webSearchTool({
        searchContextSize: "low",
        ...(restriction === "official"
          ? { filters: { allowedDomains: ["developers.openai.com"] } }
          : {}),
      }),
    ];
    const answer =
      "OpenAI web search can return source citations with its answer.";
    const citation = {
      type: "url_citation",
      url: "https://developers.openai.com/api/docs/guides/tools-web-search",
      title: "OpenAI web search guide",
      start_index: 0,
      end_index: answer.length,
    };
    const message = apiMessage(answer);
    message.content[0].annotations = [citation];
    transport = capturedTransport([
      [
        {
          type: "web_search_call",
          id: "ws_fixture",
          status: "completed",
          action: {
            type: "search",
            query: "OpenAI web search citations",
            sources: [{ type: "url", url: citation.url }],
          },
        },
        message,
      ],
    ]);
    agent = new sdk.Agent({
      name: "Cited web research",
      model: modelName(env),
      tools,
      instructions:
        "Use web search to explain how OpenAI web-search citations work. Cite retrieved sources. Keep the answer brief.",
    });
    request =
      "Search for the official web-search citation guidance and explain it.";
    details.restriction = restriction;
    details.allowedDomains =
      restriction === "official" ? ["developers.openai.com"] : [];
    summary = "Search and preserve source annotations";
    takeaway =
      "Web search runs at the provider. Preserve returned URL citation annotations and render clickable source links. Classroom search and citations are labeled fixtures.";
  }

  // lesson:74
  if (number === 74) {
    const collection = selectScenario(input.documentQuestion, [
      "schedule",
      "materials",
    ]);
    const vectorStoreId = live
      ? env.VECTOR_STORE_ID?.trim()
      : "vs_classroom_fixture";
    if (!vectorStoreId)
      throw new Error(
        "Set VECTOR_STORE_ID in the app's .env after running npm run setup:documents. Restart the application.",
      );
    const text =
      collection === "schedule"
        ? "The Robotics workshop starts at 16:00 in Lab 2."
        : "Bring robotics kits and a projector.";
    const message = apiMessage(text);
    message.content[0].annotations = [
      {
        type: "file_citation",
        file_id: "file_classroom_fixture",
        filename: "workshop-handbook.txt",
        index: 0,
      },
    ];
    transport = capturedTransport([
      [
        {
          type: "file_search_call",
          id: "fs_fixture",
          status: "completed",
          queries: [collection],
          results: [
            {
              file_id: "file_classroom_fixture",
              filename: "workshop-handbook.txt",
              score: 0.94,
              text,
            },
          ],
        },
        message,
      ],
    ]);
    agent = new sdk.Agent({
      name: "Workshop document assistant",
      model: modelName(env),
      tools: [
        sdk.fileSearchTool(vectorStoreId, {
          maxNumResults: 3,
          includeSearchResults: true,
        }),
      ],
      instructions:
        "Search the configured document collection. Answer only using retrieved workshop facts, cite the file, and state when the collection lacks an answer.",
    });
    request =
      collection === "schedule"
        ? "When and where is the Robotics workshop?"
        : "What materials should I bring to Robotics?";
    details.vectorStoreId = vectorStoreId;
    details.collection = collection;
    details.hosting = live
      ? "OpenAI-hosted vector store"
      : "Injected provider fixture. No hosted collection was created.";
    summary = "Retrieve from a document collection";
    takeaway =
      "fileSearchTool connects an existing OpenAI-hosted vector store. The setup command uploads the bundled handbook and waits for indexing. Classroom retrieval uses injected search results.";
  }
  if (!agent) throw new Error("Choose a discovery lesson from 71 through 74.");
  const runner = createLessonRunner(
    live,
    env,
    live ? undefined : transport.client,
  );
  const result = await runner.run(agent, request, {
    signal,
    maxTurns: 5,
    toolExecution: { maxFunctionToolConcurrency: 2 },
  });
  const citations = resultCitations(result);
  const items = result.rawResponses.flatMap((response) => response.output);
  return {
    ...lessonResult(
      live,
      result.finalOutput,
      {
        ...details,
        callbacks,
        sdkSupport: "@openai/agents 0.21.0",
        actualRequestPayloads: live ? undefined : transport.requests,
        responseItems: items,
        citations,
        modelResponses: result.rawResponses.length,
      },
      [
        ["Configure the supported SDK tools", summary],
        [
          live
            ? "Execute hosted model operations"
            : "Replay the provider fixture through the SDK",
          `${result.rawResponses.length} observed responses.`,
          "sdk",
        ],
        [
          "Inspect callbacks and source annotations",
          `${callbacks.length} local callbacks and ${citations.length} citations.`,
          "tool",
        ],
        ["Read the grounded result", String(result.finalOutput), "model"],
      ],
      takeaway,
    ),
    citations,
  };
}
