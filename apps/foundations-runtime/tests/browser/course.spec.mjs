import { test, expect } from "@playwright/test";
import { remainingControls } from "../../public/remaining-lessons.js";

for (let number = 95; number <= 200; number++) {
  test(`Prompt ${number} loads and runs through its browser controls`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.locator("#scenario option")).toHaveCount(
      remainingControls[number][0].options.length,
    );
    await page.locator("#run-button").click();
    await expect(page.locator("body")).toHaveAttribute(
      "data-complete",
      "true",
      { timeout: 40000 },
    );
    await expect(page.locator("#error")).toBeHidden();
    await expect(page.locator("#output")).not.toBeEmpty();
    await page.locator("#result summary").click();
    await expect(page.locator("#evidence")).not.toBeEmpty();
    expect(errors).toEqual([]);
    if (
      [104, 112, 120, 128, 144, 152, 160, 168, 176, 184, 192, 200].includes(
        number,
      )
    )
      await page.screenshot({
        path: `test-results/prompt-${number}-desktop.png`,
        fullPage: true,
      });
  });
}
test("Approval interface resumes its stored review", async ({ page }) => {
  await page.goto("/?prompt=127");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
  await expect(page.locator("#course-panel")).toContainText("teacher-fixture");
  await page.locator('[data-decision="approve"]').click();
  await expect(page.locator("#course-panel")).toContainText(
    '"uniqueSideEffects": 1',
  );
  await expect(page.locator('[data-decision="approve"]')).toHaveCount(0);
});
test("Uploaded CSV produces measured data and downloadable chart", async ({
  page,
}) => {
  await page.goto("/?prompt=197");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await page
    .locator("#csv-upload")
    .setInputFiles({
      name: "class.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("name,value\nA,4\nB,6"),
    });
  await expect(page.locator("#course-panel")).toContainText("Loaded class.csv");
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
  await expect(page.locator("#output")).toContainText("Total 10");
  await expect(page.locator("#answer-artifacts a")).toHaveCount(3);
  await expect(page.locator("#answer-artifacts img")).toBeVisible();
});
test("Chat frontend receives streamed output and retains a thread", async ({
  page,
}) => {
  await page.goto("/?prompt=182");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await page.locator("#chat-message").fill("Explain tools");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator("#chat-log")).toContainText(
    "Your request was “Explain tools”",
    { timeout: 30000 },
  );
  await expect(page.locator("#chat-log")).toContainText(
    "Source — classroom-handbook",
  );
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeEnabled();
});
test("Course panels remain usable on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const number of [95, 127, 138, 153, 161, 182, 191, 197, 200]) {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/prompt-${number}-mobile.png`,
      fullPage: true,
    });
  }
});
