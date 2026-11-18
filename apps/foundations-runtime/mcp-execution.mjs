import * as sdk from "@openai/agents";
import OpenAI from "openai";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createMcpHttpFixture } from "./examples/mcp/http-server.mjs";
import { timetableTool } from "./examples/mcp/fixture-protocol.mjs";
import {
  scriptedModel,
  functionCall,
  message,
} from "./examples/context/scripted-model.mjs";
import {
  capturedTransport,
  apiMessage,
} from "./examples/structured/captured-transport.mjs";
import {
  selectScenario,
  createLessonRunner,
  lessonResult,
} from "./control-execution.mjs";

export async function executeMcp(number, input, { env = {}, signal } = {}) {
  const live = input.mode === "live";
  const topic = selectScenario(input.mcpTopic, ["robotics", "astronomy"]);
  const prompt = `Read the ${topic} timetable with read_timetable and report its actual result.`;
  const evidence = { topic };
  let fixture, connection, output;
  const requests = [];
  const requestAudit = [];
  const token = number === 84 ? randomBytes(24).toString("hex") : undefined;
  const logger = {
    namespace: "classroom:mcp",
    dontLogModelData: true,
    dontLogToolData: true,
    debug() {},
    warn() {},
    error() {},
  };
  try {
    let path = "sdk";
    if (number === 83) path = selectScenario(input.mcpPath, ["sdk", "hosted"]);
    if (path === "hosted") {
      const serverUrl = live
        ? env.MCP_SERVER_URL?.trim()
        : "https://classroom.example/mcp";
      if (!serverUrl)
        throw new Error(
          "Set MCP_SERVER_URL to your publicly reachable MCP timetable server. The hosted service needs access to that URL.",
        );
      const hosted = sdk.hostedMcpTool({
        serverLabel: "classroom",
        serverUrl,
        allowedTools: ["read_timetable"],
        requireApproval: "never",
      });
      const transport = capturedTransport([
        [
          {
            type: "mcp_list_tools",
            id: "mcp_list_fixture",
            server_label: "classroom",
            tools: [
              { ...timetableTool, input_schema: timetableTool.inputSchema },
            ],
          },
          {
            type: "mcp_call",
            id: "mcp_call_fixture",
            name: "read_timetable",
            server_label: "classroom",
            arguments: JSON.stringify({ topic }),
            output:
              topic === "robotics"
                ? "Robotics — 16:00, Lab 2."
                : "Astronomy — 18:00, Room 4.",
            error: null,
          },
          apiMessage(
            topic === "robotics"
              ? "Robotics — 16:00, Lab 2."
              : "Astronomy — 18:00, Room 4.",
          ),
        ],
      ]);
      const runner = createLessonRunner(
        live,
        env,
        live ? undefined : transport.client,
      );
      const agent = new sdk.Agent({
        name: "Hosted MCP comparison",
        model: env.OPENAI_MODEL || "gpt-6-astra",
        tools: [hosted],
        instructions:
          "Read the timetable using the classroom MCP server and cite its returned time and room.",
      });
      const result = await runner.run(agent, prompt, { signal, maxTurns: 3 });
      const calls = result.rawResponses
        .flatMap((response) => response.output)
        .filter(
          (item) =>
            item.type === "hosted_tool_call" && item.name === "mcp_call",
        );
      if (!calls.length || calls.some((call) => call.providerData?.error))
        throw new Error(
          "The hosted MCP response contains no successful tool call.",
        );
      output = result.finalOutput;
      Object.assign(evidence, {
        executionPath: "OpenAI service → public MCP server",
        providerResponseIsFixture: !live,
        localMcpConnectionOpened: false,
        actualRequestPayloads: live ? undefined : transport.requests,
        itemTypes: result.newItems.map((item) => item.type),
      });
    } else {
      if (number === 81) {
        connection = new sdk.MCPServerStdio({
          name: "Classroom stdio",
          command: process.execPath,
          args: [
            fileURLToPath(
              new URL("./examples/mcp/stdio-server.mjs", import.meta.url),
            ),
          ],
          logger,
          clientSessionTimeoutSeconds: 5,
        });
        evidence.transport = "stdio child process";
      } else {
        fixture = await createMcpHttpFixture({ token });
        const credential =
          number === 84
            ? selectScenario(input.mcpCredential, [
                "valid",
                "invalid",
                "missing",
              ])
            : "missing";
        const headers =
          credential === "valid"
            ? { Authorization: `Bearer ${token}` }
            : credential === "invalid"
              ? { Authorization: "Bearer deliberately-invalid-fixture" }
              : {};
        connection = new sdk.MCPServerStreamableHttp({
          name: "Classroom HTTP",
          url: fixture.url,
          requestInit: { headers },
          logger,
          clientSessionTimeoutSeconds: 5,
        });
        evidence.transport = "Streamable HTTP over loopback";
        if (number === 84) evidence.credential = credential;
      }
      signal?.throwIfAborted();
      try {
        await connection.connect();
      } catch (error) {
        if (
          number !== 84 ||
          evidence.credential === "valid" ||
          !fixture.trace.some((entry) => entry.authentication === "denied")
        )
          throw error;
        evidence.authenticationDenied = true;
        output =
          "The private MCP server rejected the connection — UNAUTHORIZED.";
      }
      if (!evidence.authenticationDenied) {
        const tools = await connection.listTools();
        evidence.discoveredTools = tools.map((tool) => tool.name);
        const model = scriptedModel([
          (request) => {
            requests.push({
              systemInstructions: request.systemInstructions,
              input: request.input,
            });
            return functionCall("read_timetable", { topic });
          },
          (request) => {
            requests.push({
              systemInstructions: request.systemInstructions,
              input: request.input,
            });
            const result = request.input
              .filter((item) => item.type === "function_call_result")
              .at(-1)?.output;
            return message(
              Array.isArray(result)
                ? result.map((item) => item.text ?? "").join("\n")
                : typeof result === "string"
                  ? result
                  : JSON.stringify(result),
            );
          },
        ]);
        const auditClient =
          live && token
            ? new OpenAI({
                apiKey: env.OPENAI_API_KEY,
                maxRetries: 0,
                timeout: 45000,
                fetch: async (url, options) => {
                  requestAudit.push({
                    credentialAbsent: !String(options.body).includes(token),
                  });
                  return fetch(url, options);
                },
              })
            : undefined;
        const runner = createLessonRunner(live, env, auditClient);
        const agent = new sdk.Agent({
          name: "SDK-managed MCP tutor",
          model: live ? env.OPENAI_MODEL || "gpt-6-astra" : model,
          mcpServers: [connection],
          instructions:
            "Call the timetable tool exactly once for the requested topic. Report only its actual result.",
        });
        const result = await runner.run(agent, prompt, { signal, maxTurns: 3 });
        output = result.finalOutput;
        evidence.modelResponses = result.rawResponses.length;
        evidence.toolResultCount = result.newItems.filter(
          (item) => item.type === "tool_call_output_item",
        ).length;
        if (!evidence.toolResultCount)
          throw new Error(
            "The agent completed without invoking the MCP timetable tool.",
          );
      }
      evidence.executionPath = "Application SDK → MCP server";
      evidence.modelRequests = requests;
      evidence.protocolTrace = fixture?.trace;
      if (token) {
        evidence.modelRequestAudit = requestAudit;
        evidence.credentialAbsentFromModelRequests = live
          ? requestAudit.length
            ? requestAudit.every((request) => request.credentialAbsent)
            : null
          : requests.length
            ? !JSON.stringify(requests).includes(token)
            : null;
      }
    }
  } finally {
    try {
      if (connection) {
        await connection.close();
        evidence.connectionClosed = true;
      }
    } finally {
      if (fixture) {
        await fixture.close();
        evidence.serverClosed = true;
      }
    }
  }
  return lessonResult(
    live,
    output,
    evidence,
    [
      [
        "Configure the MCP transport",
        evidence.transport ?? "Hosted MCP definition",
      ],
      [
        "Initialize and discover capabilities",
        evidence.authenticationDenied
          ? "Connection rejected before tool discovery."
          : "The timetable capability is available.",
        "sdk",
      ],
      ["Observe the call path", evidence.executionPath, "tool"],
      [
        "Close owned connections",
        connection
          ? `Connection closed — ${evidence.connectionClosed}`
          : "The provider owns the hosted connection.",
      ],
    ],
    number === 84
      ? "Authentication headers belong to the MCP transport. Model instructions and tool results contain only the data needed for the task. The bearer credential here is an ephemeral classroom fixture."
      : "The SDK owns stdio and HTTP client connections. Hosted MCP moves the connection to the provider. Cleanup runs in finally after success, rejected authentication, or a failed run.",
  );
}
