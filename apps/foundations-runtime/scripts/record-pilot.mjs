import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createApp } from "../server.mjs";
import { browserOptions } from "./browser-options.mjs";
import { pilotLessons } from "../teaching/pilot-lessons.mjs";

const root = fileURLToPath(new URL("../../teaching-pilot/", import.meta.url));
const requested = process.argv.slice(2).map(Number);
const numbers = requested.length
  ? requested
  : pilotLessons.map((lesson) => lesson.number);
if (
  numbers.some(
    (number) => !pilotLessons.some((lesson) => lesson.number === number),
  )
) {
  throw new Error("Choose a lesson listed in the teaching hub.");
}
const browser = await chromium.launch({ ...browserOptions(), headless: true });
try {
  for (const number of numbers) {
    const directory = resolve(
      root,
      `prompt-${String(number).padStart(3, "0")}`,
      "recordings",
    );
    await mkdir(directory, { recursive: true });
    const server = createApp({ number, env: {} });
    await new Promise((done, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", done);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    let context;
    try {
      context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: directory, size: { width: 1920, height: 1080 } },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const video = page.video();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const hold = () => page.waitForTimeout(2000);
      const run = async () => {
        await page.locator("#run-button").click();
        await expect(page.locator("body")).toHaveAttribute(
          "data-complete",
          "true",
        );
        await page.locator("#result").scrollIntoViewIfNeeded();
        await hold();
      };
      const evidence = async () => {
        const details = page.locator("#result details");
        if ((await details.getAttribute("open")) === null) {
          await page.locator("#result summary").click();
        }
        await page.locator("#evidence").scrollIntoViewIfNeeded();
        await hold();
      };
      await page.goto(`${origin}/?prompt=${number}`);
      await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
      await page.screenshot({
        path: resolve(directory, "desktop.png"),
        fullPage: true,
      });
      await hold();
      if (number === 8) await page.locator("#fault").selectOption("imports");
      await run();
      if (number === 12) {
        await evidence();
        await page.locator("#responseLanguage").selectOption("Spanish");
        await run();
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          "Teach Ada in Spanish",
        );
        await page.locator("#user").selectOption("luis");
        await page.locator("#application").selectOption("workshop");
        await run();
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          "Teach Luis in Spanish",
        );
      } else if (number === 13) {
        await evidence();
        await page.locator("#version").selectOption("2");
        await run();
        await evidence();
        await page.locator("#responseLanguage").selectOption("Spanish");
        await run();
        await evidence();
        await page.locator("#storage").selectOption("hosted");
        await run();
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          '"classroomReferenceIsPlaceholder": true',
        );
        await page.locator("#storage").selectOption("code");
        await run();
        await evidence();
      } else if (number === 14) {
        await evidence();
        await page.locator("#variant").selectOption("guided");
        await run();
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          '"distinctAgentObjects": true',
        );
      } else if (number === 9) {
        await evidence();
        const baseline = JSON.parse(
          await page.locator("#evidence").textContent(),
        );
        await page.locator("#agentName").fill("School SQL tutor");
        await run();
        const renamed = JSON.parse(
          await page.locator("#evidence").textContent(),
        );
        expect(renamed.agent.name).toBe("School SQL tutor");
        expect(renamed.agent.instructions).toBe(baseline.agent.instructions);
        expect(renamed.agent.configuredTools).toEqual([]);
        await evidence();
        for (const scenario of ["unrelated", "clarification"]) {
          await page.locator("#scenario").selectOption(scenario);
          await run();
          await evidence();
        }
        await page.locator("#scenario").selectOption("relevant");
        await page.locator("#style").selectOption("guided");
        await run();
        await expect(page.locator("#output")).toContainText(
          "What would one row",
        );
        await evidence();
      } else if (number === 10) {
        await evidence();
        await page.locator("#request").selectOption("missing");
        await run();
        await expect(page.locator("#output")).toContainText(
          "intended audience",
        );
        await evidence();
        const complete = JSON.parse(
          await page.locator("#evidence").textContent(),
        );
        await page.locator("#instructionSet").selectOption("goal-only");
        await run();
        await evidence();
        const goalOnly = JSON.parse(
          await page.locator("#evidence").textContent(),
        );
        expect(goalOnly.question).toBe(complete.question);
        expect(goalOnly.includedSections).toEqual(["goal"]);
      } else if (number === 11) {
        await evidence();
        for (const [ticket, label] of [
          ["payment", "billing"],
          ["crash", "technical"],
        ]) {
          await page.locator("#ticket").selectOption(ticket);
          await run();
          await evidence();
          const result = JSON.parse(
            await page.locator("#evidence").textContent(),
          );
          expect(result.after.output).toBe(label);
          expect(result.examples).toHaveLength(3);
        }
      } else if ([6, 7].includes(number)) {
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          '"actualLocalToolCalls": 1',
        );
        await page
          .locator("#activity")
          .selectOption(number === 6 ? "astronomy" : "music");
        await run();
        await expect(page.locator("#output")).toContainText(
          number === 6 ? "Science room" : "Studio",
        );
        await evidence();
      } else if (number === 8) {
        await evidence();
        await expect(page.locator("#evidence")).toContainText(
          "ERR_MODULE_NOT_FOUND",
        );
        for (const fault of [
          "missing",
          "invalid",
          "model",
          "rate",
          "installation",
        ]) {
          await page.locator("#fault").selectOption(fault);
          await run();
          await evidence();
        }
      } else if (number === 127) {
        await expect(page.locator('[data-decision="approve"]')).toBeVisible();
        await page.locator('[data-decision="approve"]').click();
        await expect(page.locator("#evidence")).toContainText(
          '"uniqueSideEffects": 1',
        );
        await evidence();
        await page.locator("#reset-button").click();
        await run();
        await page.locator('[data-decision="reject"]').click();
        await expect(page.locator("#evidence")).toContainText(
          '"uniqueSideEffects": 0',
        );
        await evidence();
      } else {
        await evidence();
        if (number === 57) {
          await expect(page.locator("#evidence")).toContainText(
            '"value": 37.5',
          );
          await page.locator("#calculatorQuestion").selectOption("concept");
        } else {
          await page
            .locator("#question")
            .selectOption("What is a function tool?");
        }
        await run();
        await evidence();
        if (number === 57)
          await expect(page.locator("#evidence")).toContainText(
            '"toolExecutions": 0',
          );
      }
      await page.locator(".pilot-source-details > summary").click();
      if (number === 9)
        await page.locator('[data-file="identity/contract.js"]').click();
      if ([10, 11].includes(number))
        await page.locator('[data-file="definitions/builders.js"]').click();
      if (number === 7)
        await page.locator('[data-file="services/club-service.mjs"]').click();
      if (number === 127)
        await page.locator('[data-file="course/approval-agent.mjs"]').click();
      await page.locator("#source-code").scrollIntoViewIfNeeded();
      await hold();
      if (number === 5) {
        await page.locator("#language").selectOption("python");
        await page.locator("#source-code").scrollIntoViewIfNeeded();
        await hold();
      }
      await page.screenshot({ path: resolve(directory, "final-frame.png") });
      await page
        .getByRole("button", { name: "Dark mode", exact: true })
        .click();
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: resolve(directory, "dark.png"),
        fullPage: true,
      });
      await hold();
      await page
        .getByRole("button", { name: "Light mode", exact: true })
        .click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: resolve(directory, "mobile.png"),
        fullPage: true,
      });
      if (errors.length) throw new Error(errors.join("\n"));
      await context.close();
      context = undefined;
      await video.saveAs(resolve(directory, "walkthrough.webm"));
      await video.delete();
      await writeFile(
        resolve(directory, "capture.json"),
        JSON.stringify(
          {
            prompt: number,
            mode: "classroom",
            audio: false,
            description:
              "Silent scenario demonstration. Edit with narration.txt and storyboard.csv for a narrated lesson.",
            viewport: { width: 1920, height: 1080 },
            browserErrors: errors,
            capturedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      console.log(`Recorded prompt ${number} in ${directory}`);
    } finally {
      await context?.close();
      server.closeAllConnections();
      await new Promise((done) => server.close(done));
    }
  }
} finally {
  await browser.close();
}
