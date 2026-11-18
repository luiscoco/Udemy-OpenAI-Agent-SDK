import test from "node:test";
import assert from "node:assert/strict";
import { executeStructured as run } from "../structured-execution.mjs";
import { productSchema } from "../examples/structured/schemas.mjs";
import { classifyStructuredResult } from "../examples/structured/result-classification.mjs";
import {
  mediaFixtures,
  imageQuestion,
  documentQuestion,
} from "../examples/structured/media-inputs.mjs";
import { createApp } from "../server.mjs";
import { once } from "node:events";

test("Python SDK returns Product and rejects bad fields with strict Pydantic validation", async () => {
  for (const schemaCase of [
    "valid",
    "missing-field",
    "wrong-type",
    "numeric-string",
  ]) {
    const { evidence: e } = await run(25, { schemaCase });
    assert.equal(e.accepted, schemaCase === "valid");
    assert.equal(e.localModelCalls, 1);
    if (e.accepted) {
      assert.equal(e.pythonType, "Product");
      assert.equal(e.value.price, 12.5);
    } else assert.ok(e.issues.length);
  }
});
test("Zod validation rejects missing fields, nonnumbers, and numeric strings", async () => {
  for (const schemaCase of [
    "valid",
    "missing-field",
    "wrong-type",
    "numeric-string",
  ]) {
    const { evidence: e } = await run(26, { schemaCase });
    assert.equal(e.accepted, schemaCase === "valid");
    assert.equal(e.consumed, e.accepted);
  }
});
test("nested output validates enums, arrays, nullability, and required fields", async () => {
  for (const nestedCase of [
    "null-note",
    "with-note",
    "invalid-enum",
    "missing-name",
  ]) {
    const { evidence: e } = await run(27, { nestedCase });
    assert.equal(e.accepted, ["null-note", "with-note"].includes(nestedCase));
    if (nestedCase === "null-note")
      assert.equal(e.schemaValidatedValue.note, null);
  }
});
test("business rules reject impossible dates, reversed dates, quantities and unverified evidence after schema success", async () => {
  for (const businessCase of [
    "valid",
    "reversed-dates",
    "invalid-date",
    "zero-quantity",
    "missing-evidence",
  ]) {
    const { evidence: e } = await run(28, { businessCase });
    assert.equal(e.schemaPassed, true);
    assert.equal(e.accepted, businessCase === "valid");
    if (!e.accepted) assert.ok(e.business.errors.length);
  }
});
test("completion gate handles real approval interruption and refuses to consume partial objects", async () => {
  for (const [resultCase, status] of [
    ["complete", "completed"],
    ["refusal", "refused"],
    ["incomplete", "incomplete"],
    ["approval", "paused"],
  ]) {
    const { evidence: e } = await run(29, { resultCase });
    assert.equal(e.classification.status, status);
    assert.equal(e.classification.consumed, status === "completed");
    assert.equal(e.toolExecuted, false);
    if (resultCase === "approval") {
      assert.equal(e.interruptionCount, 1);
      assert.equal(e.approvalStateAvailable, true);
    }
  }
  assert.equal(
    classifyStructuredResult(
      { finalOutput: { name: "x", price: "1" } },
      productSchema,
    ).status,
    "invalid",
  );
  assert.equal(
    classifyStructuredResult({}, productSchema).status,
    "incomplete",
  );
});
test("actual bundled media is encoded through SDK content types and provider payload conversion", async () => {
  const f = await mediaFixtures();
  assert.equal(f.pdf.subarray(0, 4).toString(), "%PDF");
  assert.equal(f.image.subarray(1, 4).toString(), "PNG");
  assert.ok(
    imageQuestion(f, "describe")[0].content[1].image.startsWith(
      "data:image/png;base64,",
    ),
  );
  assert.ok(
    documentQuestion(f, "pdf", "summarize")[0].content[1].file.startsWith(
      "data:application/pdf;base64,",
    ),
  );
  const image = (await run(30, {})).evidence;
  assert.match(JSON.stringify(image.actualSDKRequests), /image_url/);
  assert.equal(image.imageSHA256, f.imageHash);
  const pdf = (await run(31, {})).evidence;
  assert.match(JSON.stringify(pdf.actualSDKRequests), /file_data/);
  assert.match(pdf.actualDocumentText, /20 minutes/);
  const text = (await run(31, { documentFormat: "text" })).evidence;
  assert.doesNotMatch(JSON.stringify(text.actualSDKRequests), /file_data/);
});
test("real multimodal tools forward text, image and file outputs into the next provider request", async () => {
  for (const toolModality of ["text", "image", "file"]) {
    const { evidence: e } = await run(32, { toolModality });
    assert.deepEqual(e.observedToolCalls, [toolModality]);
    assert.equal(e.actualSDKRequests.length, 2);
    const followup = JSON.stringify(e.actualSDKRequests[1]);
    assert.match(followup, /function_call_output/);
    assert.match(
      followup,
      toolModality === "image"
        ? /input_image/
        : toolModality === "file"
          ? /input_file/
          : /Robotics/,
    );
    assert.equal(e.externalNetworkRequests, 0);
  }
});
test("isolated SDK model resolution honors agent, workflow, then process precedence", async () => {
  for (const [modelScope, expected] of [
    ["all", "gpt-6-astra"],
    ["workflow", "gpt-6-sol"],
    ["process", "gpt-6-luna"],
  ]) {
    const { evidence: e } = await run(33, { modelScope });
    assert.equal(e.resolvedModel, expected);
  }
});
test("actual provider requests map modelSettings fields and unsupported sampling is rejected before transmission", async () => {
  const verbose = (await run(34, {})).evidence;
  assert.equal(verbose.capturedRequest.text.verbosity, "low");
  assert.equal(verbose.capturedRequest.max_output_tokens, 512);
  for (const settingsCase of ["temperature", "top-p"]) {
    const rejected = (await run(34, { settingsCase })).evidence;
    assert.equal(rejected.accepted, false);
    assert.equal(rejected.requestsSent, 0);
    const accepted = (await run(34, { settingsCase, modelPreset: "luna" }))
      .evidence;
    assert.equal(accepted.accepted, true);
    assert.equal(accepted.capturedRequest.reasoning.effort, "none");
    assert.equal(
      accepted.capturedRequest[
        settingsCase === "temperature" ? "temperature" : "top_p"
      ],
      settingsCase === "temperature" ? 0.2 : 0.8,
    );
  }
});
test("media routes serve exact whitelisted assets with binary content types", async () => {
  const server = createApp({ number: 30, env: {} });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const [name, mime] of [
      ["classroom-shapes.png", "image/png"],
      ["classroom-workshop.pdf", "application/pdf"],
    ]) {
      const response = await fetch(`${base}/assets/${name}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), mime);
      assert.ok((await response.arrayBuffer()).byteLength > 1000);
    }
    assert.equal((await fetch(`${base}/assets/unknown.pdf`)).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("live adapters pass real SDK configuration, multimodal inputs and cancellation without paid inference", async () => {
  const calls = [];
  const signal = new AbortController().signal;
  class Client {
    constructor(options) {
      calls.push({ client: options });
    }
  }
  class Runner {
    constructor(options) {
      assert.equal(options.tracingDisabled, true);
    }
    async run(agent, input, options) {
      calls.push({ agent, input, options });
      return {
        finalOutput:
          typeof agent.outputType === "object"
            ? { name: "Observed product", price: 9 }
            : "Observed live answer",
        interruptions: [],
      };
    }
  }
  const env = {
    OPENAI_API_KEY: "fixture-test-secret",
    OPENAI_MODEL: "compatible-test-model",
  };
  const options = { env, signal, dependencies: { Runner, OpenAI: Client } };
  const product = await run(26, { mode: "live" }, options);
  assert.equal(product.evidence.schemaValidatedValue.name, "Observed product");
  assert.equal(calls.at(-1).agent.model, "compatible-test-model");
  assert.equal(calls.at(-1).options.signal, signal);
  await run(30, { mode: "live" }, options);
  assert.ok(
    calls.at(-1).input[0].content[1].image.startsWith("data:image/png;base64,"),
  );
  await run(31, { mode: "live" }, options);
  assert.ok(
    calls
      .at(-1)
      .input[0].content[1].file.startsWith("data:application/pdf;base64,"),
  );
  await run(
    34,
    { mode: "live", modelPreset: "luna", settingsCase: "temperature" },
    options,
  );
  assert.equal(calls.at(-1).agent.model, "gpt-6-luna");
  assert.equal(calls.at(-1).agent.modelSettings.temperature, 0.2);
  assert.equal(calls.find((c) => c.client).client.apiKey, env.OPENAI_API_KEY);
  await assert.rejects(
    () => run(29, { mode: "live" }, { env }),
    /controlled local/,
  );
  await assert.rejects(
    () => run(26, { mode: "live" }, { env: {} }),
    /OPENAI_API_KEY/,
  );
});
