import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { pythonExecutable } from "../python-runtime.mjs";
const child = spawn(
  pythonExecutable(),
  [fileURLToPath(new URL("./chatkit_http.py", import.meta.url))],
  { stdio: "inherit", windowsHide: true },
);
process.once("SIGINT", () => child.kill());
process.once("SIGTERM", () => child.kill());
child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
child.once("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
