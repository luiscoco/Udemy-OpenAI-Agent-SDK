import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

export async function installedConfiguration() {
  const coreDirectory = dirname(require.resolve("@openai/agents-core"));
  const sdkDirectory = dirname(require.resolve("@openai/agents"));
  const declaration = await readFile(join(coreDirectory, "agent.d.ts"), "utf8");
  const manifest = JSON.parse(
    await readFile(join(sdkDirectory, "../package.json"), "utf8"),
  );
  const block = declaration
    .split("export interface AgentConfiguration<")[1]
    ?.split("export type AgentOptions")[0];
  if (!block)
    throw new Error(
      "Cannot locate AgentConfiguration in this installed SDK's declaration file.",
    );
  const fields = [...block.matchAll(/^ {4}([A-Za-z]\w*)\??:/gm)].map(
    (match) => match[1],
  );
  if (!fields.length)
    throw new Error("No public AgentConfiguration fields were found.");
  return {
    package: "@openai/agents",
    version: manifest.version,
    fields,
    source: "Installed @openai/agents-core/dist/agent.d.ts",
  };
}
