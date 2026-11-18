import { test, expect } from "@playwright/test";

async function finish(page) {
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true", {
    timeout: 30000,
  });
  await page.locator("#result summary").click();
}
test("structured scenarios reject invalid output and separate business validation", async ({
  page,
}) => {
  for (const [number, key, value, output] of [
    [26, "schemaCase", "numeric-string", "Rejected before consumption"],
    [27, "nestedCase", "invalid-enum", "Rejected before consumption"],
    [28, "businessCase", "invalid-date", "Rejected before consumption"],
    [29, "resultCase", "approval", "Outcome — paused"],
  ]) {
    await page.goto(`/?prompt=${number}`);
    await page.locator(`#${key}`).selectOption(value);
    await finish(page);
    await expect(page.locator("#output")).toContainText(output);
    if (number === 28)
      await expect(page.locator("#evidence")).toContainText(
        '"schemaPassed": true',
      );
    if (number === 29)
      await expect(page.locator("#evidence")).toContainText(
        '"toolExecuted": false',
      );
  }
});
test("image, document and tool fixtures are visible and expose actual request evidence", async ({
  page,
}) => {
  for (const number of [30, 31, 32]) {
    await page.goto(`/?prompt=${number}`);
    if (number === 30 || number === 32)
      await expect(page.locator(".media-fixture img")).toBeVisible();
    if (number === 31 || number === 32) {
      const link = page.locator(".media-fixture a").first();
      await expect(link).toHaveAttribute(
        "href",
        "/assets/classroom-workshop.pdf",
      );
      const response = await page.request.get("/assets/classroom-workshop.pdf");
      expect(response.headers()["content-type"]).toBe("application/pdf");
    }
    if (number === 32)
      await page.locator("#toolModality").selectOption("image");
    await finish(page);
    await expect(page.locator("#evidence")).toContainText(
      '"classroomInferenceIsScripted": true',
    );
    if (number === 32)
      await expect(page.locator("#evidence")).toContainText("input_image");
  }
});
test("model controls show precedence and reject incompatible generation settings", async ({
  page,
}) => {
  await page.goto("/?prompt=33");
  await page.locator("#modelScope").selectOption("process");
  await finish(page);
  await expect(page.locator("#output")).toContainText(
    "Resolved request model — gpt-6-luna",
  );
  await page.goto("/?prompt=34");
  await page.locator("#settingsCase").selectOption("temperature");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Configuration rejected");
  await page.locator("#modelPreset").selectOption("luna");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText('"temperature": 0.2');
});
