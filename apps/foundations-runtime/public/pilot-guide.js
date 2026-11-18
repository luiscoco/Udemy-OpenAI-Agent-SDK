import { mountPilotTheme } from "./pilot-ui.js";
mountPilotTheme();
document
  .querySelector("#guide-print")
  ?.addEventListener("click", () => window.print());
