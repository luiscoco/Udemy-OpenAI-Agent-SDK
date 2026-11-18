import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createApp } from "../server.mjs";
import { pilotLessons } from "../teaching/pilot-lessons.mjs";
import {
  pilotSourceMap,
  renderPilotGuide,
  teachingFiles,
  teachingArchive,
} from "../teaching/materials.mjs";
import { executeLesson } from "../execute.mjs";

test("each pilot has a complete narration, storyboard, worksheet and instructor guide", async () => {
  for (const lesson of pilotLessons) {
    assert.ok(lesson.narration.length >= 6);
    assert.ok(lesson.exercises.length >= 2);
    assert.ok(lesson.instructor.rubric.length >= 4);
    assert.match(
      lesson.narration.map((beat) => beat.speech).join(" "),
      /classroom/i,
    );
    const files = await teachingFiles(lesson.number);
    for (const name of [
      "narration.txt",
      "storyboard.csv",
      "student-worksheet.html",
      "instructor-guide.html",
      "source-map.json",
      "assets/openai-icon.svg",
    ])
      assert.ok(files[name]);
    assert.match(files["student-worksheet.html"], /Student exercises/);
    assert.doesNotMatch(files["student-worksheet.html"], /<h2>Answer key/);
    assert.match(files["instructor-guide.html"], /<h2>Answer key/);
    assert.match(files["instructor-guide.html"], /<h2>Storyboard/);
    assert.match(files["instructor-guide.html"], /<h2>Narration script/);
    const archive = await teachingArchive(lesson.number);
    assert.equal(archive.bytes.readUInt32LE(), 0x04034b50);
    assert.equal(
      archive.bytes.readUInt32LE(archive.bytes.length - 22),
      0x06054b50,
    );
  }
});
test("source anchors and hashes match the executable lesson files", async () => {
  for (const lesson of pilotLessons)
    for (const source of await pilotSourceMap(lesson.number)) {
      const bytes = await readFile(
        new URL(`../${source.path}`, import.meta.url),
      );
      assert.equal(
        source.sha256,
        createHash("sha256").update(bytes).digest("hex"),
      );
      assert.ok(
        source.text.split(/\r?\n/)[source.line - 1].includes(source.needle),
      );
    }
});
test("the supplied OpenAI icon is included without modifying its bytes", async () => {
  const icon = await readFile(
    new URL("../public/assets/openai-icon.svg", import.meta.url),
  );
  for (const lesson of pilotLessons)
    assert.deepEqual(
      (await teachingFiles(lesson.number))["assets/openai-icon.svg"],
      icon,
    );
});
test("pilot lesson expectations match classroom execution", async () => {
  const dynamic = await executeLesson(
    12,
    { user: "luis", responseLanguage: "Spanish", application: "workshop" },
    { env: {} },
  );
  assert.match(dynamic.evidence.resolvedInstructions, /Teach Luis in Spanish/);
  assert.ok(
    !dynamic.evidence.resolvedInstructions.includes(
      dynamic.evidence.localContext.userId,
    ),
  );
  for (const version of ["1", "2"]) {
    const result = await executeLesson(
      13,
      { version, storage: "code" },
      { env: {} },
    );
    assert.equal(result.evidence.storage, "versioned application code");
    assert.equal(result.evidence.version, version);
    assert.ok(result.evidence.instructions);
  }
  for (const variant of ["concise", "guided"]) {
    const result = await executeLesson(14, { variant }, { env: {} });
    assert.equal(result.evidence.distinctAgentObjects, true);
    assert.equal(
      result.evidence.baseInstructionsAfterClone,
      result.evidence.base.instructions,
    );
  }
  const identity = await executeLesson(9, {}, { env: {} });
  const renamed = await executeLesson(
    9,
    { agentName: "School SQL tutor" },
    { env: {} },
  );
  assert.equal(renamed.evidence.agent.name, "School SQL tutor");
  assert.equal(
    renamed.evidence.agent.instructions,
    identity.evidence.agent.instructions,
  );
  assert.equal(renamed.output, identity.output);
  assert.deepEqual(identity.evidence.agent.configuredTools, []);
  for (const specialist of ["sql", "python"]) {
    for (const scenario of ["relevant", "unrelated", "clarification"]) {
      const result = await executeLesson(
        9,
        { specialist, scenario, style: "guided" },
        { env: {} },
      );
      assert.equal(result.evidence.specialist, specialist);
      assert.equal(result.evidence.scenario, scenario);
      assert.equal(result.evidence.modelResponses, 0);
      assert.ok(result.output.includes("?"));
    }
  }
  const complete = await executeLesson(10, { request: "missing" }, { env: {} });
  const goalOnly = await executeLesson(
    10,
    { request: "missing", instructionSet: "goal-only" },
    { env: {} },
  );
  assert.deepEqual(complete.evidence.includedSections, [
    "goal",
    "information",
    "actions",
    "completion",
  ]);
  assert.deepEqual(goalOnly.evidence.includedSections, ["goal"]);
  assert.equal(complete.evidence.question, goalOnly.evidence.question);
  assert.match(complete.output, /audience.*how long/i);
  for (const [ticket, label] of [
    ["login", "access"],
    ["payment", "billing"],
    ["crash", "technical"],
  ]) {
    const result = await executeLesson(11, { ticket }, { env: {} });
    assert.equal(result.evidence.after.output, label);
    assert.equal(result.evidence.examples.length, 3);
    assert.equal(result.evidence.modelOutputIsScripted, true);
    assert.match(
      result.evidence.after.instructions,
      /billing, access, or technical/,
    );
  }
  for (const number of [6, 7]) {
    for (const activity of ["robotics", "astronomy", "music"]) {
      const result = await executeLesson(number, { activity }, { env: {} });
      assert.equal(result.evidence.arguments.activity, activity);
      assert.equal(result.evidence.actualLocalToolCalls, 1);
      assert.equal(result.evidence.simulatedModelCalls, 2);
      assert.ok(result.output.includes(result.evidence.toolResult.room));
    }
  }
  for (const fault of [
    "imports",
    "missing",
    "invalid",
    "model",
    "rate",
    "installation",
  ]) {
    const result = await executeLesson(8, { fault }, { env: {} });
    assert.ok(result.evidence.error.code);
    assert.ok(result.evidence.diagnosis.command);
    assert.match(
      result.label,
      ["imports", "missing"].includes(fault)
        ? /Actual local/
        : /Injected error/,
    );
  }
  for (const language of ["typescript", "python"]) {
    const result = await executeLesson(5, { language }, { env: {} });
    assert.equal(
      result.evidence.resultField,
      language === "python" ? "result.final_output" : "result.finalOutput",
    );
  }
  const arithmetic = await executeLesson(
    57,
    { calculatorQuestion: "arithmetic" },
    { env: {} },
  );
  assert.equal(arithmetic.evidence.toolExecutions, 1);
  assert.equal(arithmetic.evidence.observedResults[0].value, 37.5);
  const conceptual = await executeLesson(
    57,
    { calculatorQuestion: "concept" },
    { env: {} },
  );
  assert.equal(conceptual.evidence.toolExecutions, 0);
  for (const decision of ["approve", "reject"]) {
    const paused = await executeLesson(127, { scenario: "pause" }, { env: {} });
    assert.equal(paused.evidence.uniqueSideEffects, 0);
    const reviewed = await executeLesson(
      127,
      { scenario: decision, reviewId: paused.reviewId },
      { env: {} },
    );
    assert.equal(reviewed.reviewId, paused.reviewId);
    assert.equal(
      reviewed.evidence.uniqueSideEffects,
      decision === "approve" ? 1 : 0,
    );
  }
});
test("teaching routes return scoped guides, files and downloads", async () => {
  const server = createApp({ number: 5, env: {} });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const lesson of pilotLessons) {
      const data = await (
        await fetch(`${base}/api/pilot?prompt=${lesson.number}`)
      ).json();
      assert.equal(data.number, lesson.number);
      for (const source of data.sources) {
        const sourceResponse = await fetch(
          `${base}/api/source?prompt=${lesson.number}&name=${encodeURIComponent(source.key)}`,
        );
        assert.equal(
          sourceResponse.status,
          200,
          `${lesson.number} source ${source.key}`,
        );
      }
      const page = await fetch(
        `${base}/pilot-guide?prompt=${lesson.number}&view=student`,
      );
      assert.equal(page.status, 200);
      assert.match(await page.text(), /OpenAI icon/);
      const zip = await fetch(`${base}/api/pilot-pack?prompt=${lesson.number}`);
      assert.equal(zip.headers.get("content-type"), "application/zip");
      assert.ok((await zip.arrayBuffer()).byteLength > 10000);
    }
    assert.equal(
      (await fetch(base + "/api/pilot-file?prompt=5&file=../../.env")).status,
      404,
    );
    assert.equal((await fetch(base + "/api/pilot?prompt=15")).status, 400);
    assert.equal(
      (await fetch(base + "/pilot-guide?prompt=5&view=unknown")).status,
      400,
    );
    await assert.rejects(renderPilotGuide(15), /pilot prompt/);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
