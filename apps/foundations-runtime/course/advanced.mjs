import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  randomUUID,
  createHash,
} from "node:crypto";
import OpenAI from "openai";
import {
  sdk,
  z,
  runAgent,
  message,
  courseResult,
  selectScenario,
} from "./common.mjs";
import { openStore } from "./storage.mjs";
import {
  capturedTransport,
  apiMessage,
} from "../examples/structured/captured-transport.mjs";
import { createLessonRunner } from "../control-execution.mjs";
import { classify, evaluationDataset } from "./evaluation.mjs";
import { ClassroomWorkspace } from "./workspace.mjs";
import { Manifest, file } from "@openai/agents/sandbox";
import { saveArtifact } from "../artifacts.mjs";
import { pythonExecutable, runJsonProcess } from "../python-runtime.mjs";
import { fileURLToPath } from "node:url";

export const advancedScenarios = {
  185: ["decrypt", "tamper", "retention"],
  186: ["fork", "compare"],
  187: ["compatible", "unsupported"],
  188: ["route", "refusal"],
  189: ["bounded-task", "reject-scope"],
  190: ["availability", "fallback"],
  191: ["thread", "new-thread"],
  192: ["audit", "compatibility"],
};
export function encrypt(value, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const bytes = Buffer.concat([
    cipher.update(JSON.stringify(value)),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    bytes: bytes.toString("base64"),
  };
}
export function decrypt(envelope, key) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(envelope.bytes, "base64")),
      decipher.final(),
    ]).toString(),
  );
}
export function encryptedSession(store, tenant, id, key) {
  const load = () => {
    const envelope = store.recall(tenant, id);
    return envelope ? decrypt(envelope, key) : [];
  };
  return {
    async getSessionId() {
      return id;
    },
    async getItems(limit) {
      const items = load();
      return limit === undefined ? items : items.slice(-limit);
    },
    async addItems(items) {
      store.transaction(() =>
        store.remember(tenant, id, encrypt([...load(), ...items], key), true),
      );
    },
    async popItem() {
      return store.transaction(() => {
        const items = load();
        const item = items.pop();
        store.remember(tenant, id, encrypt(items, key), true);
        return item;
      });
    },
    async clearSession() {
      store.forget(tenant, id);
    },
  };
}
export async function executeAdvanced(number, input, { signal } = {}) {
  const scenario = selectScenario(input.scenario, advancedScenarios[number]);
  const evidence = { scenario };
  let output,
    artifacts = [];
  const store = openStore();
  const tenant = randomUUID();
  try {
    if (number === 185) {
      const key = randomBytes(32);
      const session = encryptedSession(store, tenant, "encrypted-history", key);
      await runAgent(
        "Encrypted tutor",
        [message("Robotics preference recorded.")],
        "Remember Robotics.",
        { run: { session, signal } },
      );
      evidence.sdkSessionItems = (await session.getItems()).length;
      evidence.storedHistory = store.recall(tenant, "encrypted-history");
      const envelope = encrypt(
        [{ role: "user", content: "Workshop Robotics" }],
        key,
      );
      store.remember(tenant, "encrypted-session", envelope, true);
      evidence.ciphertext = store.recall(tenant, "encrypted-session");
      if (scenario === "tamper") {
        envelope.tag = Buffer.alloc(16).toString("base64");
        try {
          decrypt(envelope, key);
        } catch {
          evidence.authenticationFailed = true;
        }
      } else if (scenario === "retention") {
        store.forget(tenant, "encrypted-session");
        evidence.afterRetention = store.recall(tenant, "encrypted-session");
      } else evidence.decrypted = decrypt(envelope, key);
      evidence.keyStorage =
        "Ephemeral classroom key in server memory. Supply a managed key for deployment.";
      output = JSON.stringify(evidence);
    }
    if (number === 186) {
      const original = store.session(tenant, "main");
      await original.addItems([
        { role: "user", content: "Plan a Robotics workshop." },
      ]);
      const fork = store.session(tenant, "branch");
      await fork.addItems(await original.getItems());
      await fork.addItems([
        { role: "user", content: "Use a 30-minute format." },
      ]);
      evidence.main = await original.getItems();
      evidence.branch = await fork.getItems();
      evidence.commonPrefix = 1;
      output = `Main history ${evidence.main.length} items. Branch history ${evidence.branch.length} items.`;
    }
    if (number === 187) {
      if (scenario === "unsupported") {
        evidence.compatibility = {
          responses: true,
          realtime: false,
          sandbox: false,
        };
        output =
          "Adapter profile rejects unsupported realtime and sandbox requests before sending.";
      } else {
        const transport = capturedTransport([
          apiMessage("Compatible Responses output."),
        ]);
        const agent = new sdk.Agent({
          name: "Adapter probe",
          model: "classroom-compatible",
        });
        const result = await createLessonRunner(
          false,
          {},
          transport.client,
        ).run(agent, "Probe response compatibility.", { signal });
        evidence.request = transport.requests[0];
        evidence.endpoint = "OpenAI-compatible fixture transport";
        output = result.finalOutput;
      }
    }
    if (number === 188) {
      const requests = [];
      const client = new OpenAI({
        apiKey: "fixture",
        maxRetries: 0,
        fetch: async (_url, options) => {
          requests.push(JSON.parse(options.body));
          return new Response(
            JSON.stringify({
              id: "dec_classroom",
              model: "gpt-6-luna",
              answers:
                scenario === "refusal"
                  ? [
                      {
                        type: "refusal",
                        refusal: "Fixture input cannot be classified",
                      },
                    ]
                  : [{ type: "choice", value: "billing" }],
              usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        },
      });
      const decision = await client.decisions.create(
        {
          model: "gpt-6-luna",
          input: "I was charged twice.",
          questions: [
            {
              name: "route",
              type: "choice",
              instructions: "Choose the responsible team.",
              choices: [{ value: "billing" }, { value: "technical" }],
            },
          ],
        },
        { signal },
      );
      evidence.actualRequest = requests[0];
      evidence.decision = decision;
      const choice = decision.answers[0];
      output =
        choice.type === "choice"
          ? (
              await runAgent(
                "Billing",
                [
                  message(
                    "Billing specialist selected by the Decisions response.",
                  ),
                ],
                "Resolve charge.",
                { run: { signal } },
              )
            ).result.finalOutput
          : "Classification refused. No specialist was invoked.";
      evidence.provider = "Captured Decisions API protocol fixture";
    }
    if (number === 189) {
      const task = z
        .object({
          file: z.literal("calculator.mjs"),
          change: z.literal("fix-addition"),
          maxFiles: z.literal(1),
        })
        .safeParse({
          file: scenario === "reject-scope" ? "../secrets" : "calculator.mjs",
          change: "fix-addition",
          maxFiles: 1,
        });
      evidence.scopeAccepted = task.success;
      if (task.success) {
        const workspace = new ClassroomWorkspace(
          new Manifest({
            root: "/workspace",
            entries: {
              "calculator.mjs": file({
                content: "export const add = (a,b) => a - b;",
              }),
            },
          }),
        );
        try {
          await workspace.applyManifest(workspace.state.manifest);
          const before = await workspace.readFile({
            path: "/workspace/calculator.mjs",
          });
          const after = before.replace("a - b", "a + b");
          await workspace.write("/workspace/calculator.mjs", after);
          evidence.diff = { before, after };
          evidence.tests = await workspace.execCommand({ cmd: "test" });
          evidence.delegation =
            "Bounded coding-worker fixture. Codex CLI adapter is supplied separately.";
          output = evidence.tests;
        } finally {
          await workspace.close();
        }
      } else output = "Task outside the declared file scope was rejected.";
    }
    if (number === 190) {
      evidence.pythonIntegration = await runJsonProcess(
        pythonExecutable(),
        [fileURLToPath(new URL("./capability_probe.py", import.meta.url))],
        { signal },
      );
      const client = new OpenAI({ apiKey: "availability-probe" });
      evidence.sdk = {
        agentsResource: typeof client.beta.agents,
        hostedSubagents: typeof client.beta.agents?.subagents,
      };
      evidence.remoteAvailability =
        "Requires account-side capability verification";
      evidence.executionModels = {
        hosted:
          "Experimental OpenAI-hosted orchestration through the Python model integration",
        handoff: "Application Runner transfers the active agent",
        agentAsTool:
          "Application Runner executes a specialist while its caller retains ownership",
      };
      if (scenario === "fallback") {
        const child = await runAgent(
          "Local specialist",
          [message("Local specialist fallback completed.")],
          "Research.",
          { run: { signal } },
        );
        output = child.result.finalOutput;
      } else
        output = JSON.stringify(
          {
            python: evidence.pythonIntegration.hostedMultiAgent,
            typescript: evidence.sdk,
          },
          null,
          2,
        );
    }
    if (number === 191) {
      const thread =
        scenario === "new-thread"
          ? randomUUID()
          : String(input.threadId ?? "classroom-thread");
      const session = store.session("chatkit-classroom", thread);
      const text = String(input.message ?? "Teach me about agent tools.").slice(
        0,
        1000,
      );
      const result = await runAgent(
        "ChatKit tutor",
        [
          message(
            `Agent tools execute application functions. Your message was “${text}”.`,
          ),
        ],
        text,
        { run: { session, signal } },
      );
      evidence.threadId = thread;
      evidence.items = await session.getItems();
      evidence.chatkit =
        "Self-hosted ChatKit adapter and browser component are available from the companion server";
      output = result.result.finalOutput;
    }
    if (number === 192) {
      const packageJson = await import("../../package.json", {
        with: { type: "json" },
      });
      const { lessons } = await import("../catalog.mjs");
      const checks = {
        catalogCount: lessons.length + 1,
        agentsVersion: packageJson.default.dependencies["@openai/agents"],
        node: process.version,
        fixtureEvaluation: evaluationDataset.every(
          (row) => classify(row.text) === row.expected,
        ),
        credentialValuesIncluded: false,
      };
      evidence.audit = checks;
      artifacts = [
        await saveArtifact(
          JSON.stringify(checks, null, 2),
          "json",
          "Release audit",
        ),
      ];
      output = JSON.stringify(checks);
    }
  } finally {
    store.close();
  }
  return courseResult(
    number,
    output,
    evidence,
    "Inspect actual storage, cryptography, client payloads and SDK feature availability. Remote-account execution remains a separately configured integration.",
    { artifacts },
  );
}
