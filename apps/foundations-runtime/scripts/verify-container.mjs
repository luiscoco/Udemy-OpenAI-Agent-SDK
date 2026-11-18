import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const command = promisify(execFile);
const id = randomUUID();
const name = `agent-course-verify-${id}`;
const volume = `agent-course-verify-${id}`;
const docker = async (args) =>
  (
    await command("docker", args, {
      windowsHide: true,
      timeout: 60000,
      maxBuffer: 1024 * 1024,
    })
  ).stdout.trim();
let running = false;
async function start() {
  await docker([
    "run",
    "--rm",
    "--detach",
    "--name",
    name,
    "--publish",
    "127.0.0.1::3300",
    "--volume",
    `${volume}:/app/.runtime`,
    "agent-course:prompts-200",
  ]);
  running = true;
  const address = await docker(["port", name, "3300/tcp"]);
  const base = `http://${address}`;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(base + "/health");
      if (response.ok) return base;
    } catch {}
    await delay(250);
  }
  throw new Error("Container health did not become ready");
}
async function stop() {
  if (running) {
    await docker(["stop", "--time", "10", name]);
    running = false;
  }
}
async function execute(base, prompt, input) {
  const response = await fetch(`${base}/api/execute?prompt=${prompt}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "classroom", ...input }),
    signal: AbortSignal.timeout(60000),
  });
  const result = await response.json();
  assert.equal(response.status, 200, JSON.stringify(result));
  return result;
}
try {
  await docker(["volume", "create", volume]);
  let base = await start();
  assert.match(await (await fetch(base + "/course-panel.js")).text(), /4191/);
  const paused = await execute(base, 127, { scenario: "pause" });
  assert.equal(paused.evidence.uniqueSideEffects, 0);
  await stop();
  base = await start();
  const approved = await execute(base, 127, {
    scenario: "approve",
    reviewId: paused.reviewId,
  });
  assert.equal(approved.evidence.uniqueSideEffects, 1);
  const voice = await execute(base, 161, { scenario: "complete" });
  assert.ok(
    voice.evidence.events.some(
      (event) => event.type === "voice_stream_event_audio",
    ),
  );
  const coding = await execute(base, 198, { scenario: "fix" });
  assert.equal(coding.evidence.reviewAccepted, true);
  const support = await execute(base, 193, { scenario: "order" });
  assert.ok(
    support.evidence.traces.some((item) => item.span_data?.type === "handoff"),
  );
  const capstone = await execute(base, 200, { scenario: "recover" });
  assert.equal(capstone.evidence.recovery.effects, 1);
  const report = {
    image: "agent-course:prompts-200",
    health: true,
    persistentReviewAcrossRestart: true,
    voicePipeline: true,
    codingChecks: true,
    supportTrace: true,
    chatkitCompanionPort: 4191,
    crashRecovery: true,
  };
  await writeFile(
    new URL("../../test-results/container-verification.json", import.meta.url),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await stop();
  await docker(["volume", "rm", volume]);
}
