import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { courseScenarios, executeCourse } from "../course/index.mjs";
import { getLesson } from "../catalog.mjs";
import { openStore } from "../course/storage.mjs";
import { encrypt, decrypt } from "../course/advanced.mjs";
import { parseCsv, barChart } from "../course/chart.mjs";
import { ClassroomWorkspace } from "../course/workspace.mjs";

for (let number = 95; number <= 200; number++) {
  test(
    `Prompt ${number} executes every listed scenario`,
    { timeout: 180000 },
    async () => {
      assert.equal(getLesson(number).number, number);
      for (const scenario of courseScenarios[number]) {
        const result = await executeCourse(number, { scenario }, { env: {} });
        assert.ok(result.output, `Prompt ${number} ${scenario} needs output`);
        assert.ok(result.events.length >= 2);
        assert.ok(result.evidence);
        if (number === 97 && scenario === "combine") {
          assert.match(result.output, /Research/);
          assert.match(result.output, /Review/);
        }
        if (number === 108) {
          assert.equal(result.evidence.items.length, 2);
          assert.equal(result.evidence.otherTenantItems.length, 0);
        }
        if (number === 120 && scenario === "rejected")
          assert.equal(result.evidence.releasedText, "");
        if (number === 123)
          assert.equal(
            result.evidence.uniqueSideEffects,
            scenario === "approve" ? 1 : 0,
          );
        if (number === 124 && scenario === "restore-process")
          assert.notEqual(
            result.evidence.writerPid,
            result.evidence.resumerPid,
          );
        if (number === 128)
          assert.equal(
            result.evidence.uniqueSideEffects,
            scenario === "revoked" ? 0 : 1,
          );
        if (number === 134 && scenario === "denied")
          assert.equal(result.evidence.allowed, false);
        if (number === 158 && scenario === "handoff")
          assert.equal(result.evidence.activeAgent, "Billing voice specialist");
        if (number === 160)
          assert.equal(
            result.evidence.executions,
            scenario === "approve" ? 1 : 0,
          );
        if (number === 162)
          assert.ok(
            result.evidence.observed.some(
              (item) => item.stage === "stream-input",
            ),
          );
        if (number === 181)
          assert.equal(
            result.evidence.status,
            scenario === "authorized"
              ? 200
              : scenario === "unauthorized"
                ? 401
                : 403,
          );
        if (number === 184) {
          assert.equal(result.evidence.state, "complete");
          assert.equal(result.evidence.effects, 1);
        }
        if (number === 193) {
          assert.equal(result.evidence.owner, "Billing specialist");
          assert.ok(result.evidence.historyItems > 0);
          assert.ok(
            result.evidence.traces.some(
              (item) => item.span_data?.type === "handoff",
            ),
          );
          if (scenario !== "order")
            assert.equal(
              result.evidence.refund.uniqueSideEffects,
              scenario === "refund" ? 1 : 0,
            );
        }
        if (number === 197 && scenario === "analyze") {
          assert.equal(result.evidence.statistics.sum, 39);
          assert.equal(result.artifacts.length, 3);
        }
        if (number === 199) {
          assert.equal(
            result.evidence.voice.activeAgent,
            "Billing voice specialist",
          );
          assert.equal(
            result.evidence.voice.executions,
            scenario === "tool-failure" ? 0 : 1,
          );
        }
        if (number === 200) {
          assert.equal(result.evidence.recovery.effects, 1);
          assert.equal(
            result.evidence.evaluation.accuracy,
            scenario === "regression" ? 0.75 : 1,
          );
        }
      }
    },
  );
}
test("stored review resumes once across independent HTTP-style requests", async () => {
  const pending = await executeCourse(127, { scenario: "pause" }, {});
  assert.equal(pending.evidence.uniqueSideEffects, 0);
  const approved = await executeCourse(
    127,
    { scenario: "approve", reviewId: pending.reviewId },
    {},
  );
  assert.equal(approved.evidence.uniqueSideEffects, 1);
  const duplicate = await executeCourse(
    127,
    { scenario: "approve", reviewId: pending.reviewId },
    {},
  );
  assert.equal(duplicate.evidence.uniqueSideEffects, 1);
});
test("idempotency binds payloads and tenant namespaces", () => {
  const store = openStore();
  const tenant = randomUUID();
  try {
    assert.equal(store.effect(tenant, "id", { amount: 1 }).applied, true);
    assert.equal(store.effect(tenant, "id", { amount: 1 }).applied, false);
    assert.throws(
      () => store.effect(tenant, "id", { amount: 2 }),
      /different arguments/,
    );
    assert.equal(
      store.effect(tenant + "other", "id", { amount: 1 }).applied,
      true,
    );
  } finally {
    store.close();
  }
});
test("AES-GCM authenticates ciphertext and keys", () => {
  const key = randomBytes(32);
  const value = { text: "Robotics" };
  const envelope = encrypt(value, key);
  assert.deepEqual(decrypt(envelope, key), value);
  assert.throws(() => decrypt(envelope, randomBytes(32)));
});
test("uploaded CSV validation and generated PNG bytes", () => {
  assert.deepEqual(parseCsv('name,value\n"Robotics, beginners",18'), [
    { name: "Robotics, beginners", value: 18 },
  ]);
  assert.throws(() => parseCsv("name,value\nA,Infinity"));
  assert.throws(() => parseCsv("name,value\nA,-1"));
  assert.equal(
    barChart([18, 12, 9]).subarray(0, 8).toString("hex"),
    "89504e470d0a1a0a",
  );
});
test("workspace snapshots preserve generated binary images", async () => {
  const source = new ClassroomWorkspace(),
    restored = new ClassroomWorkspace();
  try {
    const image = barChart([18, 12, 9]);
    await source.write("/workspace/chart.png", image);
    await restored.hydrateWorkspace(await source.persistWorkspace());
    const viewed = await restored.viewImage({ path: "/workspace/chart.png" });
    assert.deepEqual(Buffer.from(viewed.image.data, "base64"), image);
  } finally {
    await source.close();
    await restored.close();
  }
});
