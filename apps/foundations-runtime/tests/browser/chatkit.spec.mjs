import { test, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { once } from "node:events";
import { pythonExecutable } from "../../python-runtime.mjs";
import { createApp } from "../../server.mjs";

test("Self-hosted ChatKit persists and streams a tutor thread", async ({
  page,
}) => {
  test.setTimeout(120000);
  const child = spawn(
    pythonExecutable(),
    [fileURLToPath(new URL("../../course/chatkit_http.py", import.meta.url))],
    {
      env: { ...process.env, CHATKIT_PORT: "4191", OPENAI_API_KEY: "" },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const lessonApp=createApp({number:191,env:{}});
  let diagnostics = "";
  child.stderr.on("data", (chunk) => (diagnostics += chunk.toString()));
  try {
    await new Promise((resolve,reject)=>{lessonApp.once('error',reject);lessonApp.listen(3291,'127.0.0.1',resolve);});
    await page.goto('http://127.0.0.1:3291');
    await expect(page.locator('body')).toHaveAttribute('data-ready','true');
    await expect(page.getByRole('link',{name:'Open ChatKit companion on port 4191'})).toHaveAttribute('href','http://127.0.0.1:4191');
    let ready = false;
    for (let attempt = 0; attempt < 90; attempt++) {
      if (child.exitCode !== null) break;
      try {
        const response = await fetch("http://127.0.0.1:4191");
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {}
      await delay(500);
    }
    expect(ready, diagnostics).toBe(true);
    await page.goto("http://127.0.0.1:4191");
    await page.waitForFunction(
      () => customElements.get("openai-chatkit"),
      {},
      { timeout: 25000 },
    );
    const frame = page.frameLocator("iframe");
    await frame
      .getByRole("button", { name: "Explain tools", exact: true })
      .click({ timeout: 25000 });
    await expect(
      frame.getByText(/Agent tools run application functions/),
    ).toBeVisible({ timeout: 20000 });
    await page.screenshot({
      path: "test-results/chatkit-companion.png",
      fullPage: true,
    });
    const response = await fetch("http://127.0.0.1:4191/chatkit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "threads.list",
        params: { limit: 20, order: "desc" },
      }),
    });
    expect(response.ok).toBe(true);
    const body = await response.json();
    expect(body).toBeTruthy();
  } finally {
    if(lessonApp.listening){lessonApp.closeAllConnections();await new Promise(resolve=>lessonApp.close(resolve));}
    if (child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
  }
});
