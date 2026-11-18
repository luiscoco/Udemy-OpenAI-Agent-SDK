import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  stat,
  cp,
  unlink,
} from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { applyDiff } from "@openai/agents-core";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Manifest } from "@openai/agents/sandbox";

const base = fileURLToPath(
  new URL("../../.runtime/workspaces/", import.meta.url),
);
// This portable adapter executes an explicit command vocabulary. Docker supplies
// OS isolation when a real container client is selected by an application.
export class ClassroomWorkspace {
  constructor(
    manifest = new Manifest({ root: "/workspace" }),
    id = randomUUID(),
  ) {
    if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new Error("Invalid workspace ID");
    this.root = resolve(base, id);
    this.state = { manifest, workspaceReady: false };
    this.operations = [];
  }
  path(path) {
    const logical = path.replace(/^\/workspace\/?/, "");
    const target = resolve(this.root, logical);
    const rel = relative(this.root, target);
    if (rel.startsWith("..") || isAbsolute(rel))
      throw new Error("Workspace path denied");
    return target;
  }
  async start() {
    await mkdir(this.root, { recursive: true });
  }
  async applyManifest(manifest) {
    await this.start();
    for (const item of manifest.iterEntries()) {
      if (item.entry.type === "dir")
        await mkdir(this.path(item.absolutePath), { recursive: true });
      if (item.entry.type === "file")
        await this.write(item.absolutePath, item.entry.content);
      if (item.entry.type === "local_dir")
        await cp(item.entry.src, this.path(item.absolutePath), {
          recursive: true,
          filter: (source) => !source.endsWith(".git"),
        });
    }
    this.state.manifest = manifest;
    this.state.environment = await manifest.resolveEnvironment();
    this.state.workspaceReady = true;
  }
  async write(path, content) {
    const target = this.path(path);
    await mkdir(resolve(target, ".."), { recursive: true });
    await writeFile(target, content);
    this.operations.push({
      operation: "write",
      path,
      bytes: Buffer.byteLength(content),
    });
  }
  async readFile({ path, maxBytes = 65536 }) {
    const bytes = await readFile(this.path(path));
    if (bytes.length > maxBytes)
      throw new Error("Workspace read limit exceeded");
    return bytes.toString("utf8");
  }
  async listDir({ path }) {
    return Promise.all(
      (await readdir(this.path(path))).map(async (name) => ({
        name,
        path: `${path}/${name}`,
        type: (await stat(this.path(`${path}/${name}`))).isDirectory()
          ? "dir"
          : "file",
      })),
    );
  }
  async materializeEntry({ path, entry }) {
    if (entry.type === "file") return this.write(path, entry.content);
    if (entry.type !== "dir")
      throw new Error(
        "Portable materialization supports files and directories",
      );
    await mkdir(this.path(path), { recursive: true });
    for (const [name, child] of Object.entries(entry.children ?? {}))
      await this.materializeEntry({ path: `${path}/${name}`, entry: child });
  }
  async pathExists(path) {
    try {
      await stat(this.path(path));
      return true;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  }
  async directoryExists(path) {
    return (
      (await this.pathExists(path)) &&
      (await stat(this.path(path))).isDirectory()
    );
  }
  async execCommand({ cmd }) {
    this.operations.push({ operation: "command", cmd });
    if (cmd === "read input.txt")
      return this.readFile({ path: "/workspace/input.txt" });
    if (cmd === "analyze") {
      const content = await this.readFile({ path: "/workspace/input.txt" });
      const result = JSON.stringify({
        lines: content.trim().split("\n").length,
        characters: content.length,
      });
      await this.write("/workspace/output/report.json", result);
      return result;
    }
    if (cmd === "test") {
      const module = await import(
        pathToFileURL(this.path("/workspace/calculator.mjs")).href +
          `?version=${randomUUID()}`
      );
      assert.equal(module.add(2, 3), 5);
      assert.equal(module.add(-2, 2), 0);
      return "PASS add(2,3)=5 and add(-2,2)=0";
    }
    if (cmd === "fail")
      throw new Error("Controlled command failure, exit code 1");
    throw new Error("Command outside classroom allowlist");
  }
  supportsPty() {
    return false;
  }
  createEditor() {
    return {
      createFile: async (operation) => {
        await this.write(
          operation.path,
          applyDiff("", operation.diff, "create"),
        );
        return { status: "completed" };
      },
      updateFile: async (operation) => {
        if (operation.moveTo)
          throw new Error(
            "Moving files is outside this fixture's editor contract",
          );
        const before = await this.readFile({ path: operation.path });
        await this.write(operation.path, applyDiff(before, operation.diff));
        return { status: "completed" };
      },
      deleteFile: async (operation) => {
        await unlink(this.path(operation.path));
        return { status: "completed" };
      },
    };
  }
  async viewImage({ path }) {
    const bytes = await readFile(this.path(path));
    if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a")
      throw new Error("PNG signature required");
    return {
      type: "image",
      image: { data: bytes.toString("base64"), mediaType: "image/png" },
    };
  }
  async persistWorkspace() {
    const files = {};
    const walk = async (path) => {
      for (const entry of await this.listDir({ path })) {
        if (entry.type === "dir") await walk(entry.path);
        else
          files[entry.path] = (await readFile(this.path(entry.path))).toString(
            "base64",
          );
      }
    };
    await walk("/workspace");
    return Buffer.from(JSON.stringify({ version: 2, files }));
  }
  async hydrateWorkspace(bytes) {
    const snapshot = JSON.parse(Buffer.from(bytes).toString());
    if (![1, 2].includes(snapshot.version))
      throw new Error("Snapshot version unsupported");
    for (const [path, content] of Object.entries(snapshot.files))
      await this.write(
        path,
        snapshot.version === 1 ? content : Buffer.from(content, "base64"),
      );
    this.state.workspaceReady = true;
  }
  async close() {
    this.closed = true;
  }
}
