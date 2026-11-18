import { test, expect } from "@playwright/test";
import { controlControls } from "../../public/control-lessons.js";

for (let number = 65; number <= 74; number++) {
  test(`Prompt ${number} controls run and reveal execution evidence`, async ({
    page,
  }) => {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    const control = controlControls[number][0];
    for (const [value] of control.options) {
      await page.locator(`#${control.key}`).selectOption(value);
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await page.locator("#result summary").click();
      await expect(page.locator("#output")).not.toBeEmpty();
      await expect(page.locator("#evidence")).toContainText(
        '"inferenceIsScripted": true',
      );
      await expect(page.locator("#error")).toBeHidden();
      if (number === 73)
        await expect(page.locator("#answer-sources a")).toHaveAttribute(
          "href",
          "https://developers.openai.com/api/docs/guides/tools-web-search",
        );
      if (number === 74)
        await expect(page.locator("#answer-sources")).toContainText(
          "workshop-handbook.txt",
        );
    }
  });
}

test("New lesson controls fit mobile screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (let number = 65; number <= 74; number++) {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#next-button").click();
    await expect(page.locator("#timeline li")).toHaveCount(1);
    await page.screenshot({
      path: `test-results/prompt-${number}-mobile.png`,
      fullPage: true,
    });
  }
});
