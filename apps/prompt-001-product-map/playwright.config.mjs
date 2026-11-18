import { defineConfig } from "@playwright/test";
import { browserOptions } from "./scripts/browser-options.mjs";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3101",
    viewport: { width: 1600, height: 1000 },
    launchOptions: browserOptions(),
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:3101/api/config",
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: "3101",
      OPENAI_API_KEY: "",
      ENABLE_AGENTS_API: "false",
      ENABLE_CODEX: "false",
    },
  },
});
