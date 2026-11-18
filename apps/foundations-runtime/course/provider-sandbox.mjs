// Optional actual Docker provider run. Start Docker with Linux containers first.
import {
  DockerSandboxClient,
  Manifest,
  file,
  dir,
  SandboxAgent,
  shell,
} from "@openai/agents/sandbox/local";
import { sdk, scriptedModel, functionCall, message } from "./common.mjs";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const client = new DockerSandboxClient({
  image: process.env.SANDBOX_IMAGE || "node:24-bookworm-slim",
  networkMode: "none",
  workspaceBaseDir: fileURLToPath(
    new URL("../../.runtime/docker-workspaces", import.meta.url),
  ),
});
const manifest = new Manifest({
  root: "/workspace",
  entries: {
    "input.txt": file({ content: "Robotics\nAstronomy\n" }),
    output: dir(),
  },
  environment: { COURSE: "agents" },
});
await mkdir(
  fileURLToPath(new URL("../../.runtime/docker-workspaces", import.meta.url)),
  { recursive: true },
);
const session = await client.create({ manifest });
try {
  const agent = new SandboxAgent({
    name: "Container analyst",
    defaultManifest: manifest,
    capabilities: [shell()],
    model: scriptedModel([
      functionCall("exec_command", {
        cmd: "wc -l input.txt > output/report.txt && cat output/report.txt",
      }),
      message("Container report created."),
    ]),
  });
  const result = await new sdk.Runner({ tracingDisabled: true }).run(
    agent,
    "Count the input lines and save the report.",
    { sandbox: { session }, maxTurns: 4 },
  );
  console.log(
    JSON.stringify(
      {
        output: result.finalOutput,
        report: Buffer.from(
          await session.readFile({ path: "/workspace/output/report.txt" }),
        ).toString(),
        provider: client.backendId,
        network: "none",
      },
      null,
      2,
    ),
  );
} finally {
  await session.close();
}
