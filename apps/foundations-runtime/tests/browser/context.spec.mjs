import { test, expect } from "@playwright/test";

async function finish(page) {
  for (let step = 0; step < 4; step++) {
    await page.locator("#next-button").click();
    await expect(page.locator("#run-button")).toHaveText("Run exercise", {
      timeout: 15000,
    });
  }
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
}

test("typed context and injected-client controls execute their actual local examples", async ({
  page,
}) => {
  await page.goto("/?prompt=17");
  await page.locator("#contextCase").selectOption("missing-tenant");
  await expect(page.locator("#definition-preview")).not.toContainText(
    '"tenant"',
  );
  await finish(page);
  await expect(page.locator("#output")).toContainText("Context rejected");
  await expect(page.locator("#evidence")).toContainText('"path": "tenant"');
  await page.locator("#contextCase").selectOption("valid");
  await page.locator("#profile").selectOption("luis");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Luis");
  await page.goto("/?prompt=18");
  await page.locator("#profile").selectOption("luis");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Music workshop");
  await expect(page.locator("#evidence")).toContainText("Musical instruments");
});

test("visibility and tenant authorization expose only the intended results", async ({
  page,
}) => {
  await page.goto("/?prompt=19");
  await page.locator("#visibility").selectOption("tool");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText("function_call_result");
  await expect(page.locator("#output")).toContainText("false");
  await page.goto("/?prompt=20");
  await page.locator("#documentId").selectOption("doc-b");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Document unavailable");
  await expect(page.locator("#evidence")).toContainText(
    '"authorization": "denied"',
  );
  await page.locator("#profile").selectOption("luis");
  await finish(page);
  await expect(page.locator("#output")).toContainText("Music club meets");
});

test("preferences and shared-context patterns update the observed SDK evidence", async ({
  page,
}) => {
  await page.goto("/?prompt=21");
  await page.locator("#contextLanguage").selectOption("Spanish");
  await page.locator("#timezone").selectOption("America/New_York");
  await finish(page);
  await expect(page.locator("#output")).toContainText("12:00");
  await expect(page.locator("#output")).toContainText("El taller");
  await page.goto("/?prompt=22");
  for (const pattern of ["handoff", "nested-shared", "nested-copy"]) {
    await page.locator("#contextPattern").selectOption(pattern);
    await finish(page);
    await expect(page.locator("#output")).toContainText(
      pattern === "nested-copy" ? "Parent notes — 0" : "Parent notes — 1",
    );
  }
});

test("safe metadata and lifecycle failures remain inspectable and navigation reaches the last lesson", async ({
  page,
}) => {
  await page.goto("/?prompt=23");
  await finish(page);
  await expect(page.locator("#evidence")).toContainText("classroom-call-1");
  await expect(page.locator("#evidence")).not.toContainText(
    "sample-only-keep-private",
  );
  await page.locator('#navigation a[href="/?prompt=24"]').click();
  await expect(page.locator("#breadcrumb")).toHaveText("Dependency lifecycle");
  for (const lifecycleOutcome of ["failure", "cancel", "init-failure"]) {
    await page.locator("#lifecycleOutcome").selectOption(lifecycleOutcome);
    await finish(page);
    await expect(page.locator("#output")).toContainText("cleaned up");
    await expect(page.locator("#evidence")).toContainText("api.close");
    await expect(page.locator("#evidence")).toContainText("database.close");
  }
});
