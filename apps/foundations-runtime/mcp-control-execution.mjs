import * as sdk from "@openai/agents";
import { randomUUID } from "node:crypto";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
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
import { createMcpHttpFixture } from "./examples/mcp/http-server.mjs";
import { createAdvancedProtocol } from "./examples/mcp/advanced-protocol.mjs";

const logger = {
  namespace: "classroom:mcp-control",
  dontLogModelData: true,
  dontLogToolData: true,
  debug() {},
  warn() {},
  error() {},
};
const toolText = (request) => {
  const output = request.input
    .filter((item) => item.type === "function_call_result")
    .at(-1)?.output;
  return Array.isArray(output)
    ? output.map((item) => item.text ?? "").join("\n")
    : String(output);
};

export async function executeMcpControl(
  number,
  input,
  { env = {}, signal } = {},
) {
  const live = input.mode === "live";
  if (live && [86, 87].includes(number))
    throw new Error(
      "This lesson demonstrates local MCP lifecycle operations without model inference.",
    );
  const evidence = {};
  let fixture, connection, promptClient, output, takeaway;
  const closed = [];
  const requests = [];
  const connections = [];
  const fixtures = [];
  let primaryError;
  async function start(protocol, port = 0) {
    fixture = await createMcpHttpFixture({
      handle: protocol.handle,
      port,
      ...(number === 86 ? { sessionId: randomUUID() } : {}),
    });
    fixtures.push(fixture);
    return fixture;
  }
  function connectAt(url, options = {}) {
    connection = new sdk.MCPServerStreamableHttp({
      name: `Prompt ${number} classroom MCP`,
      url,
      logger,
      clientSessionTimeoutSeconds: 2,
      reconnectionOptions: { maxRetries: 0 },
      ...options,
    });
    connections.push(connection);
    return connection;
  }
  try {
    signal?.throwIfAborted();
    // lesson:85
    if (number === 85) {
      const policy = selectScenario(input.mcpFilterPolicy, [
        "static",
        "context",
      ]);
      const role = selectScenario(input.filterRole, ["instructor", "finance"]);
      const protocol = createAdvancedProtocol({ role });
      await start(protocol);
      const filter =
        policy === "static"
          ? { allowedToolNames: ["read_timetable"] }
          : async ({ runContext }, tool) =>
              tool.name === "read_timetable" ||
              (runContext.context.role === "finance" &&
                tool.name === "read_budget");
      connectAt(fixture.url, { toolFilter: filter });
      await connection.connect();
      const selected =
        policy === "context" && role === "finance"
          ? "read_budget"
          : "read_timetable";
      const local = scriptedModel([
        (request) => {
          requests.push({ tools: request.tools.map((tool) => tool.name) });
          return functionCall(
            selected,
            selected === "read_timetable" ? { topic: "robotics" } : {},
          );
        },
        (request) => message(toolText(request)),
      ]);
      const agent = new sdk.Agent({
        name: "Filtered MCP tutor",
        model: live ? env.OPENAI_MODEL || "gpt-6-astra" : local,
        mcpServers: [connection],
        instructions: `Call ${selected} once, using topic robotics for the timetable. Report its actual result.`,
      });
      const result = await createLessonRunner(live, env).run(
        agent,
        "Read the approved classroom capability.",
        { signal, context: { role }, maxTurns: 3 },
      );
      output = result.finalOutput;
      Object.assign(evidence, {
        policy,
        role,
        modelRequests: requests,
        callCount: result.newItems.filter(
          (item) => item.type === "tool_call_output_item",
        ).length,
      });
      if (!evidence.callCount)
        throw new Error(
          "The agent completed without calling an approved MCP tool.",
        );
      takeaway =
        "Static and context-dependent MCP filters control which definitions reach the model. The fixture also checks finance permission inside its budget implementation.";
    }

    // lesson:86
    if (number === 86) {
      const policy = selectScenario(input.cachePolicy, [
        "cached",
        "invalidate",
        "uncached",
      ]);
      const protocol = createAdvancedProtocol();
      await start(protocol);
      connectAt(fixture.url, { cacheToolsList: policy !== "uncached" });
      await connection.connect();
      const before = await connection.listTools();
      protocol.state.version = 2;
      if (policy === "invalidate") await connection.invalidateToolsCache();
      const after = await connection.listTools();
      Object.assign(evidence, {
        policy,
        before: before.map((tool) => ({
          name: tool.name,
          description: tool.description,
        })),
        after: after.map((tool) => ({
          name: tool.name,
          description: tool.description,
        })),
        toolListRequests: fixture.trace.filter(
          (entry) => entry.method === "tools/list",
        ).length,
        definitionFresh: after[0].description.includes("version 2"),
      });
      output = `Server definition version — 2\nClient sees current definition — ${evidence.definitionFresh}\nActual tools/list requests — ${evidence.toolListRequests}`;
      takeaway =
        "Tool-list caching avoids repeated discovery requests. Invalidate cached definitions when the server changes its catalog, or use uncached discovery for this controlled comparison.";
    }

    // lesson:87
    if (number === 87) {
      const failure = selectScenario(input.mcpFailure, [
        "refused",
        "timeout",
        "restart",
      ]);
      const protocol = createAdvancedProtocol({
        delayMs: failure === "timeout" ? 250 : 0,
      });
      await start(protocol);
      const address = fixture.url;
      const port = Number(new URL(address).port);
      connectAt(address, {
        clientSessionTimeoutSeconds: failure === "timeout" ? 0.08 : 2,
      });
      const errors = [];
      if (failure === "refused") {
        await fixture.close();
        closed.push(fixture);
      }
      try {
        await connection.connect();
        if (failure === "restart") {
          await fixture.close();
          closed.push(fixture);
        }
        await connection.listTools();
      } catch (error) {
        const causes = [];
        let cause = error.cause;
        for (let depth = 0; cause && depth < 5; depth++) {
          causes.push({
            type: cause.name,
            code: cause.code,
            message: cause.message,
          });
          cause = cause.cause;
        }
        errors.push({
          type: error.name,
          code: error.code,
          message: error.message,
          causes,
        });
      }
      await connection.close();
      closed.push(connection);
      let recovered = false;
      if (failure === "restart") {
        if (!closed.includes(fixture)) {
          await fixture.close();
          closed.push(fixture);
        }
        await start(createAdvancedProtocol(), port);
        connectAt(fixture.url);
        await connection.connect();
        const tools = await connection.listTools();
        recovered = tools.some((tool) => tool.name === "read_timetable");
      }
      if (!errors.length)
        throw new Error("The selected MCP failure was not observed.");
      Object.assign(evidence, { failure, errors, recovered });
      output = `${errors[0].type} — ${errors[0].message}\nRecovered after an explicit reconnect — ${recovered}`;
      takeaway =
        "These are real loopback connection failures and request deadlines. Preserve the underlying diagnostic, close failed clients, and explicitly reconnect after a server restart.";
    }

    // lesson:88
    if (number === 88) {
      const inclusion = selectScenario(input.resourcePolicy, [
        "inspect",
        "include",
      ]);
      await start(createAdvancedProtocol());
      connectAt(fixture.url, {
        toolFilter: { allowedToolNames: ["read_timetable"] },
      });
      await connection.connect();
      const resources = await connection.listResources();
      const resource = await connection.readResource("classroom://handbook");
      // The Agents SDK exposes resource methods. The MCP client supplies prompt methods.
      promptClient = new Client({
        name: "Prompt lesson client",
        version: "1.0.0",
      });
      await promptClient.connect(
        new StreamableHTTPClientTransport(new URL(fixture.url)),
      );
      const prompts = await promptClient.listPrompts();
      const template = await promptClient.getPrompt({
        name: "summarize_handbook",
      });
      const resourceText = resource.contents
        .map((item) => item.text ?? "")
        .join("\n");
      const modelInput =
        inclusion === "include"
          ? `${template.messages[0].content.text}\nExplicit resource content\n${resourceText}`
          : "Explain which tool capabilities are exposed. No resource text has been included in this model request.";
      const local = scriptedModel([
        (request) => {
          requests.push({
            tools: request.tools.map((tool) => tool.name),
            input: request.input,
          });
          return message(
            inclusion === "include"
              ? resourceText
              : "The timetable tool is exposed. Resources and prompt templates are retrieved explicitly by the application.",
          );
        },
      ]);
      const agent = new sdk.Agent({
        name: "MCP resource tutor",
        mcpServers: [connection],
        model: live ? env.OPENAI_MODEL || "gpt-6-astra" : local,
        instructions:
          "Explain the supplied MCP information. Summarize a handbook only when its resource content is explicitly supplied.",
      });
      const result = await createLessonRunner(live, env).run(
        agent,
        modelInput,
        { signal, maxTurns: 3 },
      );
      Object.assign(evidence, {
        inclusion,
        resourceNames: resources.resources.map((item) => item.name),
        promptNames: prompts.prompts.map((item) => item.name),
        resourceText,
        template,
        modelRequests: requests,
        promptApi: "@modelcontextprotocol/client",
        resourceApi: "@openai/agents MCPServerStreamableHttp",
      });
      output = result.finalOutput;
      takeaway =
        "Resources provide application data and prompts provide reusable message templates. The application retrieves and includes them explicitly. Agent tool discovery registers the MCP tool capabilities.";
    }
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    const clients = [
      ...connections,
      ...(promptClient ? [promptClient] : []),
    ].filter((client) => !closed.includes(client));
    const clientCleanup = await Promise.allSettled(
      clients.map(async (client) => client.close()),
    );
    const serverCleanup = await Promise.allSettled(
      fixtures
        .filter((server) => !closed.includes(server))
        .map(async (server) => server.close()),
    );
    evidence.connectionsClosed = clientCleanup.every(
      (result) => result.status === "fulfilled",
    );
    evidence.serversClosed = serverCleanup.every(
      (result) => result.status === "fulfilled",
    );
    evidence.protocolTrace = fixtures.flatMap((server) => server.trace);
    evidence.pendingRequestsAfterCleanup = fixtures.reduce(
      (count, server) => count + server.pendingRequests,
      0,
    );
    const errors = [...clientCleanup, ...serverCleanup].filter(
      (result) => result.status === "rejected",
    );
    if (!primaryError && errors.length)
      throw new AggregateError(
        errors.map((result) => result.reason),
        "MCP resource cleanup failed.",
      );
  }
  const lesson = lessonResult(
    live,
    output,
    evidence,
    [
      ["Configure MCP behavior", `Prompt ${number}`],
      [
        "Observe discovery and requests",
        `${evidence.protocolTrace.length} recorded protocol events.`,
        "sdk",
      ],
      ["Inspect the outcome", output, "tool"],
      ["Close owned resources", "MCP clients and fixture servers closed."],
    ],
    takeaway,
  );
  if ([86, 87].includes(number)) {
    lesson.label = "Actual MCP transport operations · no model inference";
    lesson.evidence.modelInferenceUsed = false;
  }
  return lesson;
}
