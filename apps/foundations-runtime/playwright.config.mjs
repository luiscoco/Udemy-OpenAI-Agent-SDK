import { defineConfig } from "@playwright/test";
import { browserOptions } from "./scripts/browser-options.mjs";
import { fileURLToPath } from "node:url";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: fileURLToPath(new URL("../test-results/browser", import.meta.url)),
  workers: 1,
  reporter: "list",
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:3192",
    viewport: { width: 1600, height: 1000 },
    launchOptions: browserOptions(),
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node foundations-runtime/launch.mjs 2",
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    url: "http://127.0.0.1:3192/api/state",
    reuseExistingServer: false,
    env: { PORT: "3192", OPENAI_API_KEY: "", OPENAI_MODEL: "gpt-6-astra" },
  },
});
