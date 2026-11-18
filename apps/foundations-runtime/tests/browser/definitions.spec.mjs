import { test, expect } from "@playwright/test";

async function finish(page) {
  for (let step = 0; step < 4; step++) {
    await page.locator("#next-button").click();
    await expect(page.locator("#run-button")).toHaveText("Run exercise");
  }
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
}

test("instruction, comparison, dynamic, and cloned-agent controls produce distinct evidence", async ({
  page,
}) => {
  await page.goto("/?prompt=10");
  await page.locator("#request").selectOption("missing");
  await finish(page);
  await expect(page.locator("#output")).toContainText("how long");
  await page.locator("#instructionSet").selectOption("goal-only");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText('"goal"');

  await page.goto("/?prompt=11");
  await page.locator("#ticket").selectOption("payment");
  await finish(page);
  await expect(page.locator("#output")).toContainText("billing");
  await expect(page.locator("#evidence")).toContainText('"examples"');

  await page.goto("/?prompt=12");
  await page.locator("#user").selectOption("luis");
  await page.locator("#responseLanguage").selectOption("Spanish");
  await page.locator("#application").selectOption("workshop");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Luis, un agente");
  await expect(page.locator("#definition-preview")).toContainText("Spanish");

  await page.goto("/?prompt=14");
  await page.locator("#variant").selectOption("guided");
  await finish(page);
  await expect(page.locator("#output")).toContainText("1.");
  await expect(page.locator("#evidence")).toContainText(
    '"distinctAgentObjects": true',
  );
});

test("stored prompts expose deprecation and hosted setup while code versions run locally", async ({
  page,
}) => {
  await page.goto("/?prompt=13");
  await expect(page.locator(".prompt-deprecation")).toContainText(
    "November 30, 2026",
  );
  await page.locator("#version").selectOption("2");
  await page.locator("#responseLanguage").selectOption("Spanish");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Opciones de entrega");
  await page.locator("#storage").selectOption("hosted");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText(
    "pmpt_CLASSROOM_FIXTURE",
  );
  await expect(page.locator("#evidence")).toContainText('"promptId"');
  await page.locator("#live-mode").click();
  await expect(page.locator("#configuration")).toContainText(
    "STORED_PROMPT_ID",
  );
  await expect(page.locator("#run-button")).toBeDisabled();
});

test("clarification advances as requirements are supplied and configuration categories stay usable", async ({
  page,
}) => {
  await page.goto("/?prompt=15");
  await finish(page);
  await expect(page.locator("#output")).toContainText("audience and duration");
  await page.locator("#audience").selectOption("beginners");
  await finish(page);
  await expect(page.locator("#output")).toHaveText(
    "Please provide duration for the robotics workshop.",
  );
  await page.locator("#duration").selectOption("60");
  await finish(page);
  await expect(page.locator("#output")).toContainText("60 minutes");

  await page.goto("/?prompt=16");
  for (const category of ["capabilities", "validation", "context", "run"]) {
    await page.locator("#configCategory").selectOption(category);
    await finish(page);
    await expect(page.locator("#evidence")).toContainText(
      '"constructionOnly": true',
    );
  }
  await expect(page.locator("#output")).toContainText("runOptions");
  await expect(page.locator("#category")).toHaveText("Agent definitions");
  await expect(page.locator("#mode-controls")).toBeHidden();
});
