import { test, expect } from "@playwright/test";

test("students can run every product, inspect evidence, reset, and use the knowledge check", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(4);
  for (const product of ["agents-sdk", "responses", "agents-api", "codex"]) {
    await page.locator(`.product-card[data-product="${product}"]`).click();
    expect(await page.locator('#code-content [class^="hljs-"]').count()).toBeGreaterThan(0);
    await page.locator("#run-button").click();
    await expect(page.locator("body")).toHaveAttribute(
      "data-execution",
      "complete",
      { timeout: 15000 },
    );
    await expect(page.locator("#result-title")).toHaveText(
      "Illustrative result",
    );
    await page.locator("#evidence-title").click();
    await expect(page.locator("#result-evidence")).toBeVisible();
    await page.locator("#reset-button").click();
    await expect(page.locator("#result-panel")).toBeHidden();
  }
  await page.locator("#next-button").click();
  await expect(page.locator("#step-counter")).toHaveText("Step 1 of 4");
  await expect(page.locator(".code-line.highlight").first()).toBeVisible();
  await page.locator('[data-answer="codex"]').click();
  await expect(page.locator("#challenge-feedback")).toContainText(
    "Try another product",
  );
  await page.locator('[data-answer="responses"]').click();
  await expect(page.locator("#challenge-feedback")).toContainText("Exactly");
  await page.locator("#challenge-next").click();
  await expect(page.locator("#challenge-question")).toContainText(
    "private order tool",
  );
  expect(errors).toEqual([]);
});

test("live configuration, stop, guide, and recording view work", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#live-mode").click();
  await expect(page.locator("#setup-notice")).toContainText("OPENAI_API_KEY");
  await expect(page.locator("#run-button")).toBeDisabled();
  await page.locator("#demo-mode").click();
  await page.locator("#run-button").click();
  await expect(page.locator("#run-label")).toHaveText("Stop");
  await page.locator("#run-button").click();
  await expect(page.locator("#error-panel")).toContainText("Playback stopped");
  await page.locator("#reset-button").click();
  await page.locator("#notes-button").click();
  await expect(page.locator("#guide-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("#recording-button").click();
  await expect(page.locator(".hero")).toBeHidden();
  await expect(page.locator(".sidebar")).toBeHidden();
  await page.screenshot({
    path: "test-results/product-map-desktop.png",
    fullPage: true,
  });
});

test("mobile layout stays within the viewport and retains working controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator('[data-product="responses"]').click();
  await expect(page.locator("#lab-title")).toContainText("Responses API");
  await page.locator("#next-button").click();
  await expect(page.locator("#step-counter")).toHaveText("Step 1 of 3");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/product-map-mobile.png",
    fullPage: true,
  });
});
