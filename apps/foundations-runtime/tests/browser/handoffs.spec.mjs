import { test, expect } from "@playwright/test";
import { handoffControls } from "../../public/handoff-lessons.js";

for (let number = 85; number <= 94; number++) {
  test(`Prompt ${number} presents runnable controls and final execution evidence`, async ({
    page,
  }) => {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    const control = handoffControls[number][0];
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
      if (number <= 88)
        await expect(page.locator("#evidence")).toContainText(
          '"connectionsClosed": true',
        );
      if (number === 90)
        await expect(page.locator("#output")).toContainText(
          value === "handoff" ? "Billing specialist" : "Manager",
        );
      if (number === 94)
        await expect(page.locator("#evidence")).toContainText(
          '"invoicePreserved": true',
        );
    }
  });
}

test("MCP and handoff scenarios remain usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (let number = 85; number <= 94; number++) {
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
