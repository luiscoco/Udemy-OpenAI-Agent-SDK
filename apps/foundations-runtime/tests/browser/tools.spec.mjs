import { test, expect } from "@playwright/test";
async function finish(page) {
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true", {
    timeout: 30000,
  });
  await page.locator("#result summary").click();
}

test("tools batch approval recovery and actual SSE client disconnection expose settled outcomes", async ({
  page,
}) => {
  await page.goto("/?prompt=55");
  await finish(page);
  await expect(page.locator("#stream-status")).toHaveText(
    "Paused · approval required",
  );
  await expect(page.locator("#output")).toContainText("Tool executions — 0");
  await page.locator("#approvalDecision").selectOption("approve");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Tool executions — 1");
  await page.goto("/?prompt=56");
  await page.locator("#sseClient").selectOption("disconnect");
  await finish(page);
  await expect(page.locator("#output")).toContainText(
    "Client disconnected — true",
  );
  await expect(page.locator("#evidence")).toContainText('"modelIdle": true');
});
test("tools batch calculator, schema constraints and metadata comparison use observed callbacks", async ({
  page,
}) => {
  await page.goto("/?prompt=57");
  await finish(page);
  await expect(page.locator("#output")).toContainText("37.5");
  await expect(page.locator("#stream-progress")).toHaveCount(0);
  await page.locator("#calculatorQuestion").selectOption("concept");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText('"toolExecutions": 0');
  await page.goto("/?prompt=58");
  await page.locator("#argumentCase").selectOption("wrong-type");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText(
    '"callbackExecutions": 0',
  );
  await page.goto("/?prompt=59");
  await page.locator("#descriptionQuality").selectOption("vague");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText(
    '"selectedCorrectCapability": false',
  );
});
test("tools batch HTTP errors and SQLite isolation preserve public error and tenant boundaries", async ({
  page,
}) => {
  await page.goto("/?prompt=60");
  await page.locator("#apiScenario").selectOption("unauthorized");
  await finish(page);
  await expect(page.locator("#output")).toContainText("AUTHENTICATION_FAILED");
  await page.goto("/?prompt=61");
  await page.locator("#recordCase").selectOption("injection");
  await finish(page);
  await expect(page.locator("#output")).toContainText('"found": false');
  await expect(page.locator("#evidence")).toContainText('"queryOnly": true');
  await page.locator("#databaseProfile").selectOption("ben");
  await page.locator("#recordCase").selectOption("own");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Astronomy club");
});
test("tools batch return formats, safe failures and explicit timeout retry remain inspectable", async ({
  page,
}) => {
  await page.goto("/?prompt=62");
  await finish(page);
  await expect(page.locator("#output")).toContainText("durationMinutes");
  await page.locator("#returnFormat").selectOption("text");
  await finish(page);
  await expect(page.locator("#output")).toContainText("30 minutes");
  await page.goto("/?prompt=63");
  await page.locator("#toolErrorPolicy").selectOption("propagate");
  await finish(page);
  await expect(page.locator("#output")).toContainText("UPSTREAM_UNAVAILABLE");
  await expect(page.locator("#evidence")).not.toContainText(
    "CLASSROOM_SECRET_DO_NOT_EXPOSE",
  );
  await page.goto("/?prompt=64");
  await page.locator("#timeoutPolicy").selectOption("retry");
  await finish(page);
  await expect(page.locator("#output")).toContainText(
    "Application retries — 1",
  );
  await expect(page.locator("#evidence")).toContainText(
    '"backendSettled": true',
  );
});

test("tools batch mobile controls fit and execute the first stage for every new lesson", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (let number = 55; number <= 64; number++) {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#next-button").click();
    await expect(page.locator("#timeline li")).toHaveCount(1, {
      timeout: 15000,
    });
    await page.screenshot({
      path: `test-results/prompt-${number}-mobile.png`,
      fullPage: true,
    });
  }
});
