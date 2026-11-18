import { test, expect } from "@playwright/test";
import { pilotLessons } from "../../teaching/pilot-lessons.mjs";

for (const { number } of pilotLessons) {
  test(`Pilot ${number} uses the reference style, official icon and working controls`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.locator("body")).toHaveClass(/pilot-app/);
    await expect(page.getByRole("img", { name: "OpenAI icon" })).toBeVisible();
    expect(
      await page
        .getByRole("img", { name: "OpenAI icon" })
        .evaluate((image) => image.complete && image.naturalWidth > 0),
    ).toBe(true);
    await expect(
      page.getByRole("navigation", { name: "Pilot lesson sections" }),
    ).toBeVisible();
    if (number === 8) await page.locator("#fault").selectOption("imports");
    await page.locator("#run-button").click();
    await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
    await expect(page.locator("#output")).not.toBeEmpty();
    if (number === 12) {
      await page.locator("#responseLanguage").selectOption("Spanish");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      const evidence = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      expect(evidence.resolvedInstructions).toContain("Teach Ada in Spanish");
      expect(evidence.resolvedInstructions).not.toContain(
        evidence.localContext.userId,
      );
    }
    if (number === 13) {
      await page.locator("#version").selectOption("2");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await expect(page.locator("#output")).toContainText(
        "Which option do you prefer?",
      );
      const evidence = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      expect(evidence.storage).toBe("versioned application code");
      expect(evidence.instructions).toContain("three concise bullet points");
    }
    if (number === 14) {
      await page.locator("#variant").selectOption("guided");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      const evidence = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      expect(evidence.distinctAgentObjects).toBe(true);
      expect(evidence.baseInstructionsAfterClone).toBe(
        evidence.base.instructions,
      );
      expect(evidence.clone.name).toBe("Guided AI tutor");
    }
    if (number === 9) {
      const baseline = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      await page.locator("#agentName").fill("School SQL tutor");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      const renamed = JSON.parse(await page.locator("#evidence").textContent());
      expect(renamed.agent.name).toBe("School SQL tutor");
      expect(renamed.agent.instructions).toBe(baseline.agent.instructions);
      expect(renamed.agent.configuredTools).toEqual([]);
      for (const [scenario, expected] of [
        ["unrelated", "marketing"],
        ["clarification", "dialect"],
      ]) {
        await page.locator("#scenario").selectOption(scenario);
        await page.locator("#run-button").click();
        await expect(page.locator("body")).toHaveAttribute(
          "data-complete",
          "true",
        );
        await expect(page.locator("#output")).toContainText(expected);
      }
      await page.locator("#scenario").selectOption("relevant");
      await page.locator("#style").selectOption("guided");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await expect(page.locator("#output")).toContainText("What would one row");
      await expect(page.locator("#identity-instructions")).toContainText(
        "three short numbered teaching steps",
      );
    }
    if (number === 10) {
      await page.locator("#request").selectOption("missing");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await expect(page.locator("#output")).toContainText("intended audience");
      const complete = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      await page.locator("#instructionSet").selectOption("goal-only");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      const goalOnly = JSON.parse(
        await page.locator("#evidence").textContent(),
      );
      expect(complete.includedSections).toHaveLength(4);
      expect(goalOnly.includedSections).toEqual(["goal"]);
      expect(goalOnly.question).toBe(complete.question);
    }
    if (number === 11) {
      for (const [ticket, label] of [
        ["login", "access"],
        ["payment", "billing"],
        ["crash", "technical"],
      ]) {
        await page.locator("#ticket").selectOption(ticket);
        await page.locator("#run-button").click();
        await expect(page.locator("body")).toHaveAttribute(
          "data-complete",
          "true",
        );
        const evidence = JSON.parse(
          await page.locator("#evidence").textContent(),
        );
        expect(evidence.after.output).toBe(label);
        expect(evidence.examples).toHaveLength(3);
        expect(evidence.after.instructions).toContain(
          "billing, access, or technical",
        );
        expect(evidence.modelOutputIsScripted).toBe(true);
      }
    }
    if ([6, 7].includes(number)) {
      await page.locator("#result summary").click();
      await expect(page.locator("#evidence")).toContainText(
        '"actualLocalToolCalls": 1',
      );
      await page.locator("#activity").selectOption("music");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await expect(page.locator("#output")).toContainText("Studio");
    }
    if (number === 8) {
      await page.locator("#result summary").click();
      await expect(page.locator("#evidence")).toContainText(
        "ERR_MODULE_NOT_FOUND",
      );
      for (const [fault, expected] of [
        ["missing", "Configure the server environment"],
        ["invalid", "Replace the rejected credential"],
        ["model", "Check model name and access"],
        ["rate", "Inspect the limit before retrying"],
        ["installation", "Check registry connectivity"],
      ]) {
        await page.locator("#fault").selectOption(fault);
        await page.locator("#run-button").click();
        await expect(page.locator("body")).toHaveAttribute(
          "data-complete",
          "true",
        );
        await expect(page.locator("#output")).toHaveText(expected);
      }
    }
    if (number === 57) {
      await page.locator("#result summary").click();
      await expect(page.locator("#evidence")).toContainText('"value": 37.5');
      await page.locator("#calculatorQuestion").selectOption("concept");
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await page.locator("#result summary").click();
      await expect(page.locator("#evidence")).toContainText(
        '"toolExecutions": 0',
      );
    }
    if (number === 127) {
      await page.locator('[data-decision="approve"]').click();
      await expect(page.locator("#evidence")).toContainText(
        '"uniqueSideEffects": 1',
      );
      await expect(page.locator(".pilot-result-card")).toHaveAttribute(
        "data-outcome",
        "approved",
      );
      await page.locator("#reset-button").click();
      await page.locator("#run-button").click();
      await expect(page.locator("body")).toHaveAttribute(
        "data-complete",
        "true",
      );
      await page.locator('[data-decision="reject"]').click();
      await expect(page.locator("#evidence")).toContainText(
        '"uniqueSideEffects": 0',
      );
      await expect(page.locator(".pilot-result-card")).toHaveAttribute(
        "data-outcome",
        "rejected",
      );
    }
    await page.locator(".pilot-source-details > summary").click();
    await expect(page.locator("#source-code")).toBeVisible();
    if (number === 7) {
      await page.locator(".pilot-source-details > summary").click();
      await page.getByRole("button", { name: "Service", exact: true }).click();
      await expect(page.locator(".pilot-source-details")).toHaveAttribute(
        "open",
        "",
      );
      await expect(page.locator("#source-code")).toContainText(
        "export async function askClub",
      );
    }
    await page.screenshot({
      path: `test-results/pilot-${number}-desktop.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Dark mode", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-pilot-theme",
      "dark",
    );
    await page.screenshot({
      path: `test-results/pilot-${number}-dark.png`,
      fullPage: true,
    });
    if (number === 9) {
      await page.locator("#record-button").click();
      await expect(page.locator("body")).toHaveClass(/recording/);
      expect(
        await page
          .locator("#output")
          .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeGreaterThanOrEqual(18);
      await page.screenshot({
        path: "test-results/pilot-9-recording-view.png",
      });
      await page.locator("#record-button").click();
    }
    expect(errors).toEqual([]);
  });
  test(`Pilot ${number} teaching guides are printable and downloadable`, async ({
    page,
  }) => {
    await page.goto(`/pilot-guide?prompt=${number}&view=student`);
    await expect(
      page.getByRole("heading", { name: "Student exercises", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Answer key", exact: true }),
    ).toHaveCount(0);
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download teaching pack", exact: true })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      `prompt-${String(number).padStart(3, "0")}-teaching-pack.zip`,
    );
    await page
      .getByRole("link", { name: "Instructor guide", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Narration script", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Answer key", exact: true }),
    ).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".pilot-nav")).toBeHidden();
    await page.screenshot({
      path: `test-results/pilot-${number}-print.png`,
      fullPage: true,
    });
  });
}
test("pilot layouts fit a mobile screen and keep the other lessons accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const { number } of pilotLessons) {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/pilot-${number}-mobile.png`,
      fullPage: true,
    });
  }
  await page.locator("#pilot-lesson-picker").selectOption("128");
  await expect(page.locator("body")).toHaveAttribute("data-prompt", "128");
  await expect(page.locator("body")).not.toHaveClass(/pilot-app/);
});
