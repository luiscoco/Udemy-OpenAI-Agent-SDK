import { chromium } from "@playwright/test";
import { browserOptions } from "../../../../foundations-runtime/scripts/browser-options.mjs";
import { saveArtifact } from "../../../../foundations-runtime/artifacts.mjs";

export async function createBrowserComputer({ signal } = {}) {
  const browser = await chromium.launch({
    ...browserOptions(),
    headless: true,
  });
  let context;
  try {
    context = await browser.newContext({
      viewport: { width: 640, height: 400 },
      serviceWorkers: "block",
    });
    await context.route("**/*", (route) => route.abort());
    const page = await context.newPage();
    await page.setContent(
      '<!doctype html><html lang="en"><meta charset="utf-8"><title>Isolated classroom counter</title><body style="font-family:Arial;background:#f5f4ff;padding:24px"><h1>Workshop counter</h1><button style="position:absolute;left:40px;top:110px;width:180px;height:48px;background:#6547c7;color:white;border:0;font-size:18px" onclick="document.querySelector(\'#count\').textContent=Number(document.querySelector(\'#count\').textContent)+1">Add one student</button><p style="position:absolute;top:180px">Students enrolled <strong id="count" style="display:block;font-size:64px;color:#6547c7">0</strong></p></body></html>',
    );
    const screenshots = [];
    const actions = [];
    const computer = {
      environment: "browser",
      dimensions: [640, 400],
      async screenshot() {
        signal?.throwIfAborted();
        const bytes = await page.screenshot({ type: "png" });
        screenshots.push(
          await saveArtifact(
            bytes,
            "png",
            `Observed browser screenshot ${screenshots.length + 1}`,
          ),
        );
        return bytes.toString("base64");
      },
      async click(x, y, button = "left") {
        signal?.throwIfAborted();
        if (!["left", "right"].includes(button))
          throw new Error("Unsupported classroom mouse button.");
        actions.push({ type: "click", x, y });
        await page.mouse.click(x, y, { button });
      },
      async doubleClick(x, y) {
        signal?.throwIfAborted();
        await page.mouse.dblclick(x, y);
      },
      async scroll(x, y, scrollX, scrollY) {
        signal?.throwIfAborted();
        await page.mouse.move(x, y);
        await page.mouse.wheel(scrollX, scrollY);
      },
      async type(text) {
        signal?.throwIfAborted();
        await page.keyboard.insertText(text);
      },
      async wait() {
        signal?.throwIfAborted();
        await page.evaluate(
          () => new Promise((resolve) => requestAnimationFrame(resolve)),
        );
      },
      async move(x, y) {
        signal?.throwIfAborted();
        await page.mouse.move(x, y);
      },
      async keypress(keys) {
        signal?.throwIfAborted();
        await page.keyboard.press(
          keys
            .map(
              (key) =>
                ({ ENTER: "Enter", TAB: "Tab", ESC: "Escape" })[key] ?? key,
            )
            .join("+"),
        );
      },
      async drag(path) {
        signal?.throwIfAborted();
        if (!path.length) return;
        await page.mouse.move(...path[0]);
        await page.mouse.down();
        try {
          for (const point of path.slice(1)) await page.mouse.move(...point);
        } finally {
          await page.mouse.up();
        }
      },
    };
    return {
      computer,
      screenshots,
      actions,
      count: async () => Number(await page.locator("#count").textContent()),
      async close() {
        try {
          await context.close();
        } finally {
          await browser.close();
        }
      },
    };
  } catch (error) {
    try {
      await context?.close();
    } finally {
      await browser.close();
    }
    throw error;
  }
}
