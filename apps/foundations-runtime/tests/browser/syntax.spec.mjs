import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

test("source tabs retain code text, line numbers and copy across supported languages", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [number, filename, language] of [
    [5, "first-agent.ts", "typescript"],
    [5, "first_agent.py", "python"],
    [3, "package.json", "json"],
    [57, "tools/calculator.ts", "typescript"],
    [127, "course/approval-agent.mjs", "javascript"],
    [163, "course/voice_pipeline.py", "python"],
    [200, "course/projects.mjs", "javascript"],
  ]) {
    await page.goto(`/?prompt=${number}`);
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    const details = page.locator(".pilot-source-details");
    if (await details.count()) await details.locator("summary").first().click();
    await page.locator(`[data-file="${filename}"]`).click();
    await expect(page.locator("#source-code")).toHaveAttribute(
      "data-language",
      language,
    );
    expect(
      await page.locator('#source-code [class^="hljs-"]').count(),
    ).toBeGreaterThan(0);
    const state = await (
      await page.request.get(`/api/state?prompt=${number}`)
    ).json();
    const lines = await page
      .locator("#source-code > .code-line")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          number: Number(node.dataset.line),
          text: node.textContent,
        })),
      );
    const original = state.sources[filename].split(/\r?\n/);
    for (const line of lines)
      expect(line.text).toBe(original[line.number - 1] || " ");
    await page.locator("#copy-button").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replaceAll("\r\n", "\n")).toBe(state.sources[filename].replaceAll("\r\n", "\n"));
  }
  expect(errors).toEqual([]);
});

test("SQL answers and JSON evidence use readable token colors in both themes", async ({
  page,
}) => {
  await page.goto("/?prompt=9");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await page.locator("#run-button").click();
  await expect(page.locator("body")).toHaveAttribute("data-complete", "true");
  await expect(
    page.locator('#output code[data-language="sql"] .hljs-keyword').first(),
  ).toBeVisible();
  await page.locator("#result summary").click();
  await expect(page.locator("#evidence .hljs-attr").first()).toBeVisible();
  const colors = await page
    .locator("#evidence")
    .evaluate((node) => [
      getComputedStyle(node.querySelector(".hljs-attr")).color,
      getComputedStyle(node.querySelector(".hljs-string")).color,
    ]);
  expect(colors[0]).not.toBe(colors[1]);
  await page.screenshot({
    path: "test-results/syntax-answer-light.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await page.screenshot({
    path: "test-results/syntax-answer-dark.png",
    fullPage: true,
  });
  await page.locator(".pilot-source-details > summary").click();
  await page.locator("#source-code").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/syntax-source.png" });
});

test("multiline code and hostile text render as text with balanced colored lines", async ({
  page,
}) => {
  await page.goto("/?prompt=5");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  const result = await page.evaluate(async () => {
    const { highlightLines, renderAnswer } =
      await import("/syntax/highlight.js");
    const source =
      'value = """first\n    <img src=x onerror=alert(1)>\nlast"""\nprint(value)';
    const holder = document.createElement("div");
    holder.innerHTML = highlightLines(source, "python")
      .map((line) => `<span class="code-line">${line}</span>`)
      .join("");
    const answer = document.createElement("div");
    renderAnswer(
      answer,
      "Example\n```html\n<img src=x onerror=alert(1)>\n```\nEnd",
    );
    return {
      lines: [...holder.children].map((node) => node.textContent),
      secondLineColor: Boolean(
        holder.children[1].querySelector(".hljs-string"),
      ),
      imageCount:
        holder.querySelectorAll("img").length +
        answer.querySelectorAll("img").length,
      answerCode: answer.querySelector("code").textContent,
    };
  });
  expect(result.lines).toEqual([
    'value = """first',
    "    <img src=x onerror=alert(1)>",
    'last"""',
    "print(value)",
  ]);
  expect(result.secondLineColor).toBe(true);
  expect(result.imageCount).toBe(0);
  expect(result.answerCode).toContain("<img src=x onerror=alert(1)>");
});

test("exported teaching guides keep syntax colors offline and when printing", async ({
  page,
}) => {
  await page.goto("/pilot-guide?prompt=5&view=instructor");
  const onlineKeyword = page.locator(".syntax-code .hljs-keyword").first();
  await expect(onlineKeyword).toBeVisible();
  expect(await onlineKeyword.evaluate(node => getComputedStyle(node).color)).toBe("rgb(255, 157, 197)");
  await page.goto(
    pathToFileURL(resolve("teaching-pilot/prompt-005/instructor-guide.html"))
      .href,
  );
  await expect(
    page.locator(".syntax-code .hljs-keyword").first(),
  ).toBeVisible();
  await page.emulateMedia({ media: "print" });
  const colors = await page
    .locator(".syntax-code .hljs-keyword")
    .first()
    .evaluate((node) => ({
      color: getComputedStyle(node).color,
      background: getComputedStyle(node.closest("pre")).backgroundColor,
    }));
  expect(colors.color).toBe("rgb(146, 43, 104)");
  expect(colors.background).toBe("rgb(245, 245, 245)");
  await page.screenshot({ path: "test-results/syntax-guide-print.png" });
});
