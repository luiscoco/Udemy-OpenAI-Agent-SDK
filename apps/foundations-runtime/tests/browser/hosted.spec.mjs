import { test, expect } from "@playwright/test";
import { hostedControls } from "../../public/hosted-lessons.js";

for (let number = 75; number <= 84; number++) {
  test(`Prompt ${number} runs its visible scenarios and presents evidence`, async ({
    page,
  }) => {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    const control = hostedControls[number][0];
    for (const [value] of control.options) {
      await page.locator(`#${control.key}`).selectOption(value);
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
        { timeout: 30000 },
      );
      await page.locator("#result summary").click();
      await expect(page.locator("#output")).not.toBeEmpty();
      await expect(page.locator("#error")).toBeHidden();
      if (number === 78 || number === 80) {
        const image = page.locator("#answer-artifacts img").first();
        await expect(image).toBeVisible();
        await expect
          .poll(() =>
            image.evaluate((node) => node.complete && node.naturalWidth > 0),
          )
          .toBe(true);
      }
      if (number === 77)
        await expect(page.locator("#answer-artifacts a")).toHaveCount(
          value === "correct" ? 1 : 0,
        );
      if (number >= 81 && value !== "hosted")
        await expect(page.locator("#evidence")).toContainText(
          '"connectionClosed": true',
        );
    }
  });
}

test("New hosted and MCP controls fit mobile screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (let number = 75; number <= 84; number++) {
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
