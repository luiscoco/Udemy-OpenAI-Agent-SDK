import {
  SandboxAgent,
  Manifest,
  file,
  dir,
  shell,
  skills,
  Capability,
  memory,
  filesystem,
  compaction,
  StaticCompactionPolicy,
  localDir,
  mount,
  localBindMountStrategy,
} from "@openai/agents/sandbox";
import {
  sdk,
  z,
  scriptedModel,
  functionCall,
  message,
  courseResult,
  selectScenario,
} from "./common.mjs";
import { ClassroomWorkspace } from "./workspace.mjs";
import { saveArtifact } from "../../../foundations-runtime/artifacts.mjs";
import { openStore } from "./storage.mjs";
import { randomUUID, createHash } from "node:crypto";
import { withService } from "../../../foundations-runtime/course/reliability.mjs";
import { barChart } from "../../../foundations-runtime/course/chart.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";

export const sandboxScenarios = {
  129: ["input-output", "read-only"],
  130: ["full-manifest", "minimal-manifest"],
  131: ["portable", "docker-contract", "hosted-contract"],
  132: ["repository", "instructions"],
  133: ["same-tenant", "other-tenant"],
  134: ["allowed", "denied"],
  135: ["artifact", "preview"],
  136: ["reuse", "snapshot", "run-state"],
  137: ["success", "failure", "interactive-capability"],
  138: ["patch", "image"],
  139: ["run-skill", "inspect-skill"],
  140: ["eager", "lazy"],
  141: ["read-memory", "disabled"],
  142: ["compact", "full"],
  143: ["allowed", "denied"],
  144: ["dependencies", "cleanup"],
};
class ReportCapability extends Capability {
  type = "report";
  instructions() {
    return "Write the report only to /workspace/output/report.txt. Preserve all input files.";
  }
  tools() {
    return [
      sdk.tool({
        name: "write_report",
        parameters: z.object({
          path: z.enum(["/workspace/output/report.txt"]),
          text: z.string().max(2000),
        }),
        execute: async ({ path, text }) => {
          await this._session.write(path, text);
          return "Report persisted";
        },
      }),
    ];
  }
}
export async function executeSandbox(number, input, { signal } = {}) {
  const scenario = selectScenario(input.scenario, sandboxScenarios[number]);
  let manifest = new Manifest({
    root: "/workspace",
    entries: {
      "input.txt": file({ content: "Robotics\nAstronomy\nDrama\n" }),
      output: dir(),
      "AGENTS.md": file({
        content: "Write outputs under output/. Preserve input.txt.",
      }),
      "calculator.mjs": file({ content: "export const add = (a,b) => a - b;" }),
    },
    environment: { COURSE: "agents" },
  });
  if (number === 130 && scenario === "minimal-manifest")
    manifest = new Manifest({
      root: "/workspace",
      entries: { "input.txt": file({ content: "Robotics\n" }) },
    });
  if (number === 132) {
    const source = fileURLToPath(
      new URL(
        `../../.runtime/repository-source/${randomUUID()}/`,
        import.meta.url,
      ),
    );
    await mkdir(source, { recursive: true });
    await writeFile(
      join(source, "calculator.mjs"),
      "export const add = (a,b) => a - b;\n",
    );
    await writeFile(
      join(source, "AGENTS.md"),
      "Fix calculator.mjs. Run its checks. Preserve other files.",
    );
    await promisify(execFile)("git", ["init", source], { windowsHide: true });
    manifest = new Manifest({
      root: "/workspace",
      entries: { ...manifest.entries, repository: localDir({ src: source }) },
      environment: { COURSE: "agents" },
    });
  }
  const session = new ClassroomWorkspace(manifest);
  const evidence = {
    adapter: "Portable classroom filesystem adapter",
    isolation:
      "Application path and command allowlists. OS isolation requires a container or hosted provider.",
    scenario,
  };
  let output = "",
    artifacts = [];
  await session.applyManifest(manifest);
  try {
    if ([129, 130, 132, 137].includes(number)) {
      const command =
        number === 129 && scenario === "read-only"
          ? "read input.txt"
          : number === 137 && scenario === "failure"
            ? "fail"
            : "analyze";
      const agent = new SandboxAgent({
        name: "Workspace analyst",
        model: scriptedModel([
          functionCall("exec_command", { cmd: command }),
          message(
            "Workspace operation completed. Inspect the command result and generated files.",
          ),
        ]),
        defaultManifest: manifest,
        capabilities: [shell()],
        baseInstructions:
          "Use the prepared input file and preserve source data.",
      });
      try {
        const result = await new sdk.Runner({ tracingDisabled: true }).run(
          agent,
          "Analyze the prepared classroom data.",
          { sandbox: { session }, signal, maxTurns: 4 },
        );
        output = result.finalOutput;
        evidence.items = result.newItems.map((item) => ({
          type: item.type,
          output: item.output,
        }));
      } catch (error) {
        evidence.error = error.message;
        output = "Command failure captured.";
      }
      evidence.manifest = manifest.describe();
      evidence.environment = Object.keys(session.state.environment);
      evidence.interactiveSupported = session.supportsPty();
      if (number === 137 && scenario === "interactive-capability")
        output =
          "This adapter reports supportsPty=false. A PTY-capable provider exposes interactive write_stdin.";
      if (number === 132)
        evidence.repositoryInstructions = await session.readFile({
          path: "/workspace/repository/AGENTS.md",
        });
      if (number === 132)
        evidence.repositoryFiles = await session.listDir({
          path: "/workspace/repository",
        });
    }
    if (number === 131) {
      const configs = {
        portable: {
          backend: "classroom",
          operations: ["read", "write", "analyze"],
          cost: "local disk",
        },
        "docker-contract": {
          backend: "DockerSandboxClient",
          image: "node:24-bookworm-slim",
          networkMode: "none",
          requires: "Docker Linux containers",
          executed: false,
        },
        "hosted-contract": {
          backend: "provider supplied SandboxClient",
          requires: "Provider credentials and lifecycle implementation",
          executed: false,
        },
      };
      evidence.configuration = configs[scenario];
      await session.execCommand({ cmd: "analyze" });
      output = JSON.stringify(evidence.configuration, null, 2);
    }
    if (number === 133) {
      const store = openStore();
      try {
        const tenant = randomUUID();
        store.remember(tenant, "report", "Robotics report", true);
        evidence.mountedData = store.recall(
          scenario === "same-tenant" ? tenant : "other-tenant",
          "report",
        );
        evidence.mountMode = "Application-scoped SQLite namespace";
        evidence.providerMountDefinition = new Manifest({
          root: "/workspace",
          entries: {
            external: mount({
              source: store.path,
              mountPath: "/workspace/external",
              readOnly: true,
              mountStrategy: localBindMountStrategy(),
            }),
          },
        }).describe();
        output = JSON.stringify(evidence.mountedData);
      } finally {
        store.close();
      }
    }
    if (number === 134) {
      try {
        if (scenario === "denied")
          await session.readFile({ path: "../../.env" });
        else await session.readFile({ path: "/workspace/input.txt" });
        evidence.allowed = true;
      } catch (error) {
        evidence.allowed = false;
        evidence.error = error.message;
      }
      evidence.network = "No network commands are exposed by this adapter";
      evidence.credentialsExposed = [];
      output = JSON.stringify(evidence);
    }
    if (number === 135) {
      await session.execCommand({ cmd: "analyze" });
      artifacts = [
        await saveArtifact(
          await session.readFile({ path: "/workspace/output/report.json" }),
          "json",
          "Analysis report",
        ),
      ];
      evidence.previewContract = {
        port: 3000,
        requires: "Provider resolveExposedPort and a running preview server",
        available: false,
      };
      if (scenario === "preview") {
        evidence.preview = await withService(
          (_request, response) => {
            response.setHeader("Content-Type", "application/json");
            session
              .readFile({ path: "/workspace/output/report.json" })
              .then((text) => response.end(text))
              .catch(() => {
                response.writeHead(500);
                response.end();
              });
          },
          async (url) => {
            const response = await fetch(url, { signal });
            return {
              url,
              status: response.status,
              report: await response.json(),
              lifecycle: "Owned loopback preview, closed after inspection",
            };
          },
        );
      }
      output =
        scenario === "artifact"
          ? "Download the generated analysis report."
          : `Loopback preview returned HTTP ${evidence.preview.status}. Its report is preserved in the downloadable artifact.`;
    }
    if (number === 136) {
      await session.execCommand({ cmd: "analyze" });
      const snapshot = await session.persistWorkspace();
      const second = scenario === "reuse" ? session : new ClassroomWorkspace();
      if (second !== session) await second.hydrateWorkspace(snapshot);
      evidence.restored = await second.readFile({
        path: "/workspace/output/report.json",
      });
      evidence.snapshotSha256 = createHash("sha256")
        .update(snapshot)
        .digest("hex");
      evidence.runStateScope =
        "Agent RunState and workspace snapshot are separately persisted resources";
      if (scenario === "run-state") {
        const agent = new sdk.Agent({
          name: "Continuity tutor",
          model: scriptedModel([
            message(
              "Report reference retained at /workspace/output/report.json",
            ),
          ]),
        });
        const result = await new sdk.Runner({ tracingDisabled: true }).run(
          agent,
          "Record the workspace reference.",
          { signal },
        );
        const serialized = result.state.toString();
        const restored = await sdk.RunState.fromString(agent, serialized);
        evidence.serializedAgentStateBytes = Buffer.byteLength(serialized);
        evidence.restoredRunState = restored.constructor.name;
      }
      await second.close();
      output = evidence.restored;
    }
    if (number === 138) {
      if (scenario === "patch") {
        const before = await session.readFile({
          path: "/workspace/calculator.mjs",
        });
        const capability = filesystem().bind(session);
        const patchTool = capability
          .tools()
          .find((tool) => tool.name === "apply_patch");
        evidence.patchResult = await patchTool.invoke(
          new sdk.RunContext(),
          JSON.stringify({
            operation: {
              type: "update_file",
              path: "/workspace/calculator.mjs",
              diff: `@@\n-export const add = (a,b) => a - b;\n+export const add = (a,b) => a ${input.regression ? "*" : "+"} b;`,
            },
          }),
        );
        const after = await session.readFile({
          path: "/workspace/calculator.mjs",
        });
        evidence.diff = { before, after };
        try {
          output = await session.execCommand({ cmd: "test" });
          evidence.testPassed = true;
        } catch (error) {
          evidence.testPassed = false;
          evidence.testError = error.message;
          output = "Checks failed. " + error.message;
        }
      } else {
        const image = barChart([18, 12, 9]);
        await session.write("/workspace/output/chart.png", image);
        const viewTool = filesystem()
          .bind(session)
          .tools()
          .find((tool) => tool.name === "view_image");
        const viewed = await viewTool.invoke(
          new sdk.RunContext(),
          JSON.stringify({ path: "/workspace/output/chart.png" }),
        );
        evidence.viewResultType = typeof viewed;
        artifacts = [
          await saveArtifact(
            image,
            "png",
            "Generated classroom chart inspected through the SDK filesystem tool",
          ),
        ];
        evidence.pngSignature = image.subarray(0, 8).toString("hex");
        output = "Image bytes validated and published for inspection.";
      }
    }
    if ([139, 140].includes(number)) {
      let capability = skills({
        skills: [
          {
            name: "classroom-report",
            description: "Summarize the prepared classroom input.",
            content:
              "---\nname: classroom-report\ndescription: Summarize classroom input\n---\nRead input.txt. Run analyze. Inspect output/report.json.",
            deferred: scenario === "lazy",
            scripts: { "analyze.txt": file({ content: "analyze" }) },
            references: {
              "format.txt": file({ content: "Report lines and characters." }),
            },
          },
        ],
      });
      if (scenario === "lazy")
        capability = skills({
          lazyFrom: {
            source: dir({
              children: {
                "classroom-report": dir({
                  children: {
                    "SKILL.md": file({
                      content:
                        "---\nname: classroom-report\ndescription: Analyze prepared classroom input\n---\nRun analyze and inspect output/report.json.",
                    }),
                  },
                }),
              },
            }),
            index: [
              {
                name: "classroom-report",
                description: "Analyze prepared classroom input",
                path: "classroom-report",
              },
            ],
          },
        });
      const prepared = capability.processManifest(
        new Manifest({
          root: manifest.root,
          entries: { ...manifest.entries },
          environment: { COURSE: "agents" },
        }),
      );
      await session.applyManifest(prepared);
      evidence.instructions = await capability
        .bind(session)
        .instructions(prepared);
      evidence.skillPaths = prepared.describe();
      if (scenario !== "inspect-skill") {
        session.state.manifest = manifest;
        const plan = [
          ...(scenario === "lazy"
            ? [
                functionCall(
                  "load_skill",
                  { skill_name: "classroom-report" },
                  "load-skill",
                ),
              ]
            : []),
          functionCall("exec_command", { cmd: "analyze" }, "analyze-skill"),
          message("Skill workflow completed."),
        ];
        const model = scriptedModel(plan, { captureRequests: true });
        const agent = new SandboxAgent({
          name: "Skill runner",
          model,
          defaultManifest: manifest,
          capabilities: [shell(), capability],
        });
        await new sdk.Runner({ tracingDisabled: true }).run(
          agent,
          "Use the classroom-report skill.",
          { sandbox: { session }, signal, maxTurns: 5 },
        );
        evidence.sdkModelCalls = model.requests.length;
        evidence.loadedSkill = await session.pathExists(
          `/workspace/${capability.skillsPath}/classroom-report/SKILL.md`,
        );
      }
      output = evidence.instructions || "Lazy skill index prepared.";
    }
    if (number === 141) {
      const capability =
        scenario === "read-memory"
          ? memory({ read: true, generate: false })
          : null;
      evidence.dependencies = capability
        ? [...capability.requiredCapabilityTypes()]
        : [];
      const store = openStore();
      try {
        const tenant = randomUUID();
        store.remember(tenant, "preference", "Prefer CSV reports", true);
        evidence.memory =
          scenario === "read-memory"
            ? store.recall(tenant, "preference")
            : null;
        evidence.conversationItems = (
          await new sdk.MemorySession().getItems()
        ).length;
        output = JSON.stringify(evidence);
      } finally {
        store.close();
      }
    }
    if (number === 142) {
      await session.execCommand({ cmd: "analyze" });
      const full = Array.from({ length: 30 }, (_, i) => `Exploration ${i}`);
      const context =
        scenario === "compact"
          ? ["Report stored at /workspace/output/report.json"]
          : full;
      const referenced = await session.readFile({
        path: "/workspace/output/report.json",
      });
      evidence.context = context;
      evidence.compactionPolicy = compaction({
        policy: new StaticCompactionPolicy(2000),
      }).samplingParams({});
      evidence.reopenedArtifact = referenced;
      output = `Context records ${context.length}. Workspace report ${referenced}`;
    }
    if (number === 143) {
      const capability = new ReportCapability().bind(session);
      const tool = capability.tools()[0];
      try {
        output = await tool.invoke(
          new sdk.RunContext(),
          JSON.stringify({
            path:
              scenario === "allowed"
                ? "/workspace/output/report.txt"
                : "/workspace/input.txt",
            text: "Robotics report",
          }),
        );
        evidence.allowed = true;
      } catch (error) {
        evidence.allowed = false;
        evidence.error = error.message;
        output = "Capability argument rejected.";
      }
      evidence.toolSchema = tool.parameters;
    }
    if (number === 144) {
      const capability = memory({ read: true, generate: false });
      evidence.dependencies = [...capability.requiredCapabilityTypes()];
      evidence.availableCapabilities = [shell().type, filesystem().type];
      evidence.missing = evidence.dependencies.filter(
        (type) => !evidence.availableCapabilities.includes(type),
      );
      await session.close();
      evidence.closed = session.closed;
      output = JSON.stringify(evidence);
    }
    evidence.operations = session.operations;
  } finally {
    await session.close();
    evidence.closed = session.closed;
  }
  return courseResult(
    number,
    output,
    evidence,
    "The portable adapter performs bounded local file operations. Provider-only capabilities are identified in the evidence.",
    { artifacts },
  );
}
