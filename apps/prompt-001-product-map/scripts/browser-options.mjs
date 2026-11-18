import { existsSync } from "node:fs";

export function browserOptions() {
  const candidates = [
    process.env.PLAYWRIGHT_BROWSER_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter(Boolean);
  const executablePath = candidates.find((path) => existsSync(path));
  return executablePath ? { executablePath } : {};
}
