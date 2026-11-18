import { createInterface } from "node:readline";
import { handleMcp } from "./fixture-protocol.mjs";

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of lines) {
  try {
    const response = handleMcp(JSON.parse(line));
    if (response) process.stdout.write(JSON.stringify(response) + "\n");
  } catch {
    process.stdout.write(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      }) + "\n",
    );
  }
}
