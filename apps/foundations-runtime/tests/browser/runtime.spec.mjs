import { test, expect } from "@playwright/test";

async function finish(page) {
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true", {
    timeout: 30000,
  });
  await page.locator("#result summary").click();
}

test("reasoning and routing controls expose measured acceptance and actual call counts", async ({
  page,
}) => {
  await page.goto("/?prompt=35");
  await page.locator("#reasoningComparison").selectOption("verbosity");
  await finish(page);
  await expect(page.locator("#output")).toContainText("checks pass");
  await expect(page.locator("#evidence")).toContainText(
    '"inferenceIsScripted": true',
  );
  await page.goto("/?prompt=36");
  await page.locator("#routingTask").selectOption("hard");
  await finish(page);
  await expect(page.locator("#output")).toContainText("gpt-6-astra");
  await expect(page.locator("#output")).toContainText("SDK model calls — 2");
  await page.locator("#routingStrategy").selectOption("direct");
  await finish(page);
  await expect(page.locator("#output")).toContainText("SDK model calls — 1");
});
test("API compatibility, provider streaming and custom adapters expose actual outcomes", async ({
  page,
}) => {
  await page.goto("/?prompt=37");
  await page.locator("#apiFeature").selectOption("hosted");
  await finish(page);
  await expect(page.locator("#output")).toContainText("chat — rejected");
  await page.goto("/?prompt=38");
  await page.locator("#providerFeature").selectOption("streaming");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText("output_text_delta");
  await page.goto("/?prompt=39");
  await page.locator("#adapterScenario").selectOption("invalid");
  await finish(page);
  await expect(page.locator("#output")).toContainText("ModelBehaviorError");
  await expect(page.locator("#source-code")).toContainText("implements Model");
});
test("WebSocket connection policies and SDK turn limits remain inspectable", async ({
  page,
}) => {
  await page.goto("/?prompt=40");
  await finish(page);
  await expect(page.locator("#output")).toContainText("connections — 1");
  await page.locator("#connectionPolicy").selectOption("fresh");
  await finish(page);
  await expect(page.locator("#output")).toContainText("connections — 2");
  await page.goto("/?prompt=42");
  await page.locator("#turnBudget").selectOption("1");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText('"consumed": false');
  await expect(page.locator("#output")).toContainText("Model calls — 1");
  await expect(page.locator("#source-code")).toContainText("maxTurns: budget");
});
test("Python sync execution, workflow defaults and paused result properties work through the UI", async ({
  page,
}) => {
  await page.goto("/?prompt=41");
  await page.locator("#executionMethod").selectOption("sync-python");
  await finish(page);
  await expect(page.locator("#output")).toContainText(
    "Completed Python SDK execution",
  );
  await page.goto("/?prompt=43");
  await finish(page);
  await expect(page.locator("#output")).toContainText("maxTokens 128");
  await expect(page.locator("#output")).toContainText("maxTokens 1024");
  await page.goto("/?prompt=44");
  await page.locator("#resultScenario").selectOption("approval");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Waiting for approval");
  await expect(page.locator("#evidence")).toContainText(
    '"toolExecuted": false',
  );
});
