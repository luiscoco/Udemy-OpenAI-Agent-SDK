import { test, expect } from "@playwright/test";

test("identity inputs update the actual contract and all three classroom scenarios", async ({
  page,
}) => {
  await page.goto("/?prompt=9");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#category")).toHaveText("Agent definitions");
  const original = await page.locator("#identity-instructions").textContent();
  await page.locator("#agentName").fill("Mira, classroom tutor");
  await expect(page.locator("#identity-instructions")).toHaveText(original);
  await page.locator("#style").selectOption("guided");
  await expect(page.locator("#identity-instructions")).toContainText(
    "three short numbered",
  );
  for (const scenario of ["relevant", "unrelated", "clarification"]) {
    await page.locator("#scenario").selectOption(scenario);
    await page.locator("#run-button").click();
    await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
    await expect(page.locator("#output")).toContainText("1.");
    await expect(page.locator("#evidence")).toContainText(
      '"name": "Mira, classroom tutor"',
    );
    await expect(page.locator("#evidence")).toContainText(
      `"scenario": "${scenario}"`,
    );
  }
  await page.locator("#specialist").selectOption("python");
  await expect(page.locator("#agentName")).toHaveValue("Mira, classroom tutor");
  await expect(page.locator("#identity-responsibility")).toContainText(
    "Python",
  );
  await expect(page.locator("#identity-question")).toContainText(
    "Fix my Python function",
  );
  await page.locator("#live-mode").click();
  await expect(page.locator("#identity-custom-question")).toBeVisible();
  await expect(page.locator("#run-button")).toBeDisabled();
  await page.locator("#identity-custom-question").fill("Explain Python lists.");
  await expect(page.locator("#identity-custom-question")).toHaveValue(
    "Explain Python lists.",
  );
  await page.locator("#classroom-mode").click();
  await expect(page.locator("#run-button")).toBeEnabled();
});
