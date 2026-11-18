import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";
import { createApp } from "../server.mjs";
import { browserOptions } from "./browser-options.mjs";

const directory = resolve("recordings");
await mkdir(directory, { recursive: true });
const server = createApp({ env: {} });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
let context;
try {
  browser = await chromium.launch({ ...browserOptions(), headless: true });
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: directory, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.locator(".product-card").first().waitFor();
  await pause(2200);
  await page.locator("#recording-button").click();
  for (const product of ["responses", "agents-sdk", "agents-api", "codex"]) {
    await page.locator(`.product-card[data-product="${product}"]`).click();
    await pause(1800);
    while (
      (await page.locator("body").getAttribute("data-execution")) !== "complete"
    ) {
      await page.locator("#next-button").click();
      await pause(2000);
    }
    await page.locator("#evidence-title").click();
    await pause(2500);
    await page.locator("#evidence-title").click();
  }
  await page.screenshot({
    path: resolve(directory, "prompt-001-final-frame.png"),
  });
  const video = page.video();
  await context.close();
  context = undefined;
  const destination = resolve(
    directory,
    `prompt-001-product-map-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`,
  );
  await video.saveAs(destination);
  await video.delete();
  console.log(`Lesson recording saved to ${destination}`);
} finally {
  await context?.close();
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
