import { executeStreaming } from "../../streaming-execution.mjs";

const controller = new AbortController();
const stop = () => controller.abort();
process.once("SIGINT", stop);
try {
  process.stdout.write(
    "Prompt 49 · actual SDK text stream · scripted local model\n\n",
  );
  const result = await executeStreaming(
    49,
    { streamSpeed: "slow" },
    {
      signal: controller.signal,
      onProgress: (event) => {
        if (event.delta) process.stdout.write(event.delta);
      },
    },
  );
  process.stdout.write(
    `\n\nCompleted ${result.evidence.deltaCount} incremental chunks.\n`,
  );
} catch (error) {
  if (controller.signal.aborted) {
    process.stdout.write("\nStream stopped after cleanup.\n");
    process.exitCode = 130;
  } else {
    console.error(error.message);
    process.exitCode = 1;
  }
} finally {
  process.off("SIGINT", stop);
}
