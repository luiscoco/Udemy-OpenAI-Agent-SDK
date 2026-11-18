import test from "node:test";
import assert from "node:assert/strict";
import { executeLesson } from "../execute.mjs";
import { hostedControls } from "../public/hosted-lessons.js";
import { csvStatistics, classroomCsv } from "../hosted-execution.mjs";
import { decodeGeneratedImage, readArtifact } from "../artifacts.mjs";
import { createRetrievalDatabase } from "../examples/hosted/retrieval-database.mjs";
import { createMcpHttpFixture } from "../examples/mcp/http-server.mjs";
import { createApp } from "../server.mjs";
import { apiMessage } from "../examples/structured/captured-transport.mjs";

for (let number = 75; number <= 84; number++) {
  test(`Prompt ${number} classroom scenarios expose verified execution evidence`, async () => {
    const rows = hostedControls[number].reduce(
      (rows, control) =>
        rows.flatMap((row) =>
          control.options.map(([value]) => ({ ...row, [control.key]: value })),
        ),
      [{}],
    );
    for (const input of rows) {
      const result = await executeLesson(number, input, { env: {} });
      const e = result.evidence;
      assert.equal(e.inferenceIsScripted, true);
      assert.ok(result.output);
      if (number === 75) {
        assert.equal(e.retrievedEvidence.length, Number(input.retrievalLimit));
        assert.ok(
          e.retrievedEvidence.every(
            (document) =>
              document.attributes.department === input.retrievalDepartment,
          ),
        );
        assert.equal(result.citations.length, Number(input.retrievalLimit));
        const tool = e.actualRequestPayloads[0].tools[0];
        assert.equal(tool.max_num_results, Number(input.retrievalLimit));
        assert.deepEqual(tool.filters, {
          type: "eq",
          key: "department",
          value: input.retrievalDepartment,
        });
      }
      if (number === 76) {
        assert.ok(
          e.queries.every(
            (query) => query.parameters[0] === e.context.tenantId,
          ),
        );
        assert.equal(
          e.retrieved[0].sufficient,
          input.ragQuestion === "robotics",
        );
        assert.equal(e.connectionClosed, true);
        if (input.ragQuestion === "unknown")
          assert.match(result.output, /insufficient evidence/);
        else
          assert.match(
            result.output,
            input.ragProfile === "alice" ? /doc-a/ : /doc-b/,
          );
      }
      if (number === 77) {
        assert.equal(e.accepted, input.analysisCase === "correct");
        assert.equal(
          result.artifacts.length,
          input.analysisCase === "correct" ? 1 : 0,
        );
        if (e.accepted) {
          const file = await readArtifact(
            result.artifacts[0].url.split("/").at(-1),
          );
          assert.equal(file.bytes.toString(), "total,mean\n120,40\n");
        }
      }
      if (number === 78) {
        const file = await readArtifact(
          result.artifacts[0].url.split("/").at(-1),
        );
        assert.equal(
          decodeGeneratedImage(file.bytes.toString("base64")).extension,
          "png",
        );
      }
      if (number === 79) {
        assert.equal(
          e.distinctContainers,
          input.containerPolicy === "reuse" ? 1 : 2,
        );
        const ids = e.actualRequestPayloads.map(
          (payload) => payload.tools[0].environment.container_id,
        );
        assert.deepEqual(ids, e.observedContainerIds);
        assert.equal(e.networkPolicy.type, input.shellNetwork);
      }
      if (number === 80) {
        assert.equal(e.verified, true);
        assert.equal(e.observedCount, Number(input.computerActions));
        assert.equal(e.actualActions.length, Number(input.computerActions));
        assert.equal(e.browserClosed, true);
        assert.ok(result.artifacts.length >= 2);
        assert.notEqual(
          result.artifacts[0].sha256,
          result.artifacts.at(-1).sha256,
        );
      }
      if (number >= 81) {
        if (input.mcpPath === "hosted") {
          assert.equal(e.localMcpConnectionOpened, false);
          assert.equal(e.actualRequestPayloads[0].tools[0].type, "mcp");
        } else {
          assert.equal(e.connectionClosed, true);
          if (number !== 81) assert.equal(e.serverClosed, true);
          if (number === 84 && input.mcpCredential !== "valid") {
            assert.equal(e.authenticationDenied, true);
            assert.ok(
              !e.protocolTrace.some((entry) => entry.method === "tools/call"),
            );
          } else {
            assert.equal(e.toolResultCount, 1);
            assert.match(
              result.output,
              input.mcpTopic === "robotics" ? /16:00/ : /18:00/,
            );
            if (number === 84)
              assert.equal(e.credentialAbsentFromModelRequests, true);
          }
        }
      }
    }
  });
}

test("Tenant binding and input validation reject cross-tenant injection-shaped retrieval", async () => {
  const database = await createRetrievalDatabase();
  try {
    assert.throws(() => database.search({}, "robotics"), /Authenticated/);
    assert.equal(
      database.search(
        { userId: "alice", tenantId: "tenant-a" },
        "robotics' OR 1=1 --",
      ).sufficient,
      false,
    );
    assert.deepEqual(
      database
        .search({ userId: "alice", tenantId: "tenant-a" }, "robotics")
        .documents.map((item) => item.sourceId),
      ["doc-a"],
    );
  } finally {
    database.close();
  }
  assert.deepEqual(csvStatistics(classroomCsv), { total: 120, mean: 40 });
  for (const csv of [
    "wrong,header\na,1",
    "workshop,attendance\na,NaN",
    "workshop,attendance\na,-1",
    "workshop,attendance\na,2,3",
    "workshop,attendance\na,9007199254740991\nb,1",
  ])
    assert.throws(() => csvStatistics(csv));
  assert.throws(() => decodeGeneratedImage("not an image"), /base64/);
  assert.throws(
    () => decodeGeneratedImage(Buffer.from("text").toString("base64")),
    /format/,
  );
});

test("MCP HTTP server rejects foreign origins and unauthorized calls before discovery", async () => {
  const fixture = await createMcpHttpFixture({ token: "ephemeral-test-token" });
  try {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    });
    assert.equal(
      (
        await fetch(fixture.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://untrusted.example",
          },
          body,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(fixture.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        })
      ).status,
      401,
    );
    assert.ok(!fixture.trace.some((entry) => entry.method === "tools/list"));
  } finally {
    await fixture.close();
  }
});

test("Artifact endpoint serves stored files and rejects traversal and private-file paths", async () => {
  const result = await executeLesson(78, {}, { env: {} });
  const server = createApp({ number: 78, env: {} });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const image = await fetch(base + result.artifacts[0].url);
    assert.equal(image.headers.get("content-type"), "image/png");
    assert.equal(
      (await image.arrayBuffer()).byteLength,
      result.artifacts[0].bytes,
    );
    for (const path of [
      "/api/artifacts/.env",
      "/api/artifacts/%2e%2e%2f.env",
      "/.env",
    ])
      assert.equal((await fetch(base + path)).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Live Code Interpreter downloads validated CSV before deleting every owned resource", async (t) => {
  const operations = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const path = new URL(url).pathname;
    const method = options?.method ?? "GET";
    operations.push(`${method} ${path}`);
    const json = (value) =>
      new Response(JSON.stringify(value), {
        headers: { "Content-Type": "application/json" },
      });
    if (method === "POST" && path === "/v1/files")
      return json({ id: "file_owned" });
    if (method === "POST" && path === "/v1/containers")
      return json({ id: "cntr_owned" });
    if (method === "POST" && path === "/v1/responses") {
      const answer = apiMessage('{"total":120,"mean":40}');
      answer.content[0].annotations = [
        {
          type: "container_file_citation",
          file_id: "cfile_summary",
          container_id: "cntr_owned",
          filename: "summary.csv",
          start_index: 0,
          end_index: 0,
        },
      ];
      return json({
        id: "resp_fixture",
        object: "response",
        status: "completed",
        created_at: 0,
        model: "gpt-6-astra",
        output: [
          {
            type: "code_interpreter_call",
            id: "ci_owned",
            container_id: "cntr_owned",
            status: "completed",
            code: "# Mocked provider calculation",
            outputs: [],
          },
          answer,
        ],
        usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
      });
    }
    if (
      method === "GET" &&
      path === "/v1/containers/cntr_owned/files/cfile_summary/content"
    )
      return new Response("total,mean\n120,40\n");
    if (method === "DELETE")
      return path.endsWith("file_owned")
        ? json({ id: "file_owned", deleted: true })
        : new Response(null, { status: 204 });
    throw new Error(`Unexpected mocked API request ${method} ${path}`);
  });
  const result = await executeLesson(
    77,
    { mode: "live" },
    { env: { OPENAI_API_KEY: "fixture-api-key", OPENAI_MODEL: "gpt-6-astra" } },
  );
  assert.equal(result.evidence.accepted, true);
  assert.equal(result.artifacts.length, 1);
  assert.ok(
    result.evidence.resourceCleanup.every((resource) => resource.closed),
  );
  assert.ok(
    operations.findIndex((value) => value.startsWith("GET")) <
      operations.findIndex((value) => value.startsWith("DELETE")),
  );
});
