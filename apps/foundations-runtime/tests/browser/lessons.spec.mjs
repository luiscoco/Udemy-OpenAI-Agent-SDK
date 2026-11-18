import { test, expect } from "@playwright/test";
import { lessons } from "../../catalog.mjs";

for (const lesson of lessons) {
  test(`prompt ${lesson.number} runs its exercise, source explorer, quiz, and guide`, async ({
    page,
  }) => {
    if (lesson.number === 25) test.setTimeout(120000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?prompt=${lesson.number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.locator("h1")).toHaveText(lesson.headline);
    await page.locator("#next-button").click();
    await expect(page.locator("#timeline li")).toHaveCount(1, {
      timeout: lesson.number === 25 ? 60000 : 30000,
    });
    await page.locator("#run-button").click();
    await expect(page.locator("body")).toHaveAttribute(
      "data-complete",
      "true",
      { timeout: lesson.number === 25 ? 60000 : 30000 },
    );
    await expect(page.locator("#output")).not.toBeEmpty();
    await page.locator("#result summary").click();
    await expect(page.locator("#evidence")).toBeVisible();
    const tabs = page.locator("#source-tabs button");
    await tabs.last().click();
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#source-code")).not.toBeEmpty();
    await page.locator(`[data-answer="${lesson.correct}"]`).click();
    await expect(page.locator("#quiz-feedback")).toContainText("Correct");
    await page.locator("#guide-button").click();
    await expect(page.locator("#exact-prompt")).toHaveText(lesson.prompt);
    await page.keyboard.press("Escape");
    await page.locator("#reset-button").click();
    await expect(page.locator("#result")).toBeHidden();
    await page.locator("#record-button").click();
    await expect(page.locator(".sidebar")).toBeHidden();
    await page.screenshot({
      path: `test-results/prompt-${lesson.number}-desktop.png`,
    });
    expect(errors).toEqual([]);
  });
}

test("language differences, starter downloads, and mobile controls work", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto("/?prompt=2");
  await page.locator("#language").selectOption("python");
  await expect(page.locator("#source-name")).toHaveText("first_agent.py");
  await page.locator("#capability").selectOption("sessions");
  await expect(page.locator("#capability-description")).toContainText(
    "SQLiteSession",
  );
  await page.locator("#live-mode").click();
  await expect(page.locator("#configuration")).toContainText("TypeScript");
  await expect(page.locator("#run-button")).toBeDisabled();
  await page.goto("/?prompt=3");
  for (const language of ["typescript", "python"]) {
    await page.locator("#language").selectOption(language);
    const download = page.waitForEvent("download");
    await page.locator("#download-starter").click();
    expect((await download).suggestedFilename()).toContain(language);
  }
  for (const lesson of lessons) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?prompt=${lesson.number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#next-button").click();
    await expect(page.locator("#timeline li")).toHaveCount(1, {
      timeout: lesson.number === 25 ? 60000 : 30000,
    });
    await page.screenshot({
      path: `test-results/prompt-${lesson.number}-mobile.png`,
      fullPage: true,
    });
  }
});

test("stop and live configuration preserve usable controls", async ({
  page,
}) => {
  await page.goto("/?prompt=5");
  await page.locator("#run-button").click();
  await expect(page.locator("#run-button")).toHaveText("Stop");
  await page.locator("#run-button").click();
  await expect(page.locator("#execution-label")).toContainText("stopped");
  await page.locator("#live-mode").click();
  await expect(page.locator("#configuration")).toContainText("OPENAI_API_KEY");
  await expect(page.locator("#run-button")).toBeDisabled();
  await expect(page.locator("#custom-question")).toBeVisible();
  await page.locator("#classroom-mode").click();
  await expect(page.locator("#run-button")).toBeEnabled();
});
