import { test, expect } from "@playwright/test";

async function finish(page) {
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true", {
    timeout: 30000,
  });
  await page.locator("#result summary").click();
}
test("run items, accounting, exceptions and explicit history work through their controls", async ({
  page,
}) => {
  for (const [number, key, value, output] of [
    [45, "itemView", "handoffs", "handoff_output_item"],
    [46, "usageScope", "nested", "Observed requests — 3"],
    [47, "exceptionCase", "timeout", "ModelTimeoutError"],
    [48, "historyPolicy", "omit", "Please provide the workshop city"],
  ]) {
    await page.goto(`/?prompt=${number}`);
    await page.locator(`#${key}`).selectOption(value);
    await finish(page);
    await expect(page.locator("#output")).toContainText(output);
  }
});
test("browser receives text while the SDK run is still active and Stop preserves usable controls", async ({
  page,
}) => {
  await page.goto("/?prompt=49");
  await page.locator("#streamSpeed").selectOption("slow");
  await page.locator("#run-button").click();
  await expect(page.locator("#stream-text")).toContainText("An agent", {
    timeout: 10000,
  });
  await expect(page.locator("body")).toHaveAttribute("data-complete", "false");
  await expect(page.locator("#run-button")).toHaveText("Stop");
  await page.locator("#run-button").click();
  await expect(page.locator("#stream-status")).toHaveText("Stream stopped");
  await page.locator("#reset-button").click();
  await expect(page.locator("#stream-text")).toBeEmpty();
  await finish(page);
  await expect(page.locator("#evidence")).toContainText('"deltaCount": 19');
});
test("raw event filters and agent handoffs display actual streamed progress", async ({
  page,
}) => {
  await page.goto("/?prompt=50");
  await page.locator("#eventView").selectOption("raw");
  await finish(page);
  await expect(page.locator("#stream-events")).toContainText(
    "output_text_delta",
  );
  await expect(page.locator("#stream-events")).not.toContainText("tool_called");
  await page.goto("/?prompt=51");
  await page.locator("#streamSpecialist").selectOption("astronomy");
  await finish(page);
  await expect(page.locator("#stream-events")).toContainText("Astronomy tutor");
  await expect(page.locator("#output")).toContainText("handoff_occurred");
});
test("tool failures, partial stream failures and cancellation keep incomplete work unconsumed", async ({
  page,
}) => {
  for (const [number, key, value, expected] of [
    [52, "toolOutcome", "failure", "ToolCallError"],
    [53, "completionCase", "failure", "Stream failed"],
    [54, "cancelPoint", "third", "cancelled after 3"],
  ]) {
    await page.goto(`/?prompt=${number}`);
    await page.locator(`#${key}`).selectOption(value);
    await finish(page);
    await expect(page.locator("#output")).toContainText(expected);
    await expect(page.locator("#evidence")).toContainText('"consumed": false');
    await expect(page.locator("#evidence")).toContainText(
      '"resourceClosed": true',
    );
  }
});
