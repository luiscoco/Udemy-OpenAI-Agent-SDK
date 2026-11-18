const pilots = new Set([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 57, 127]);
const create = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function anchor(text, href) {
  const node = create("a", text);
  node.href = href;
  return node;
}

export function mountPilotTheme() {
  let theme = "light";
  try {
    theme = localStorage.getItem("agent-academy-pilot-theme") || theme;
  } catch {}
  const apply = (value) => {
    document.documentElement.dataset.pilotTheme = value;
    for (const button of document.querySelectorAll(
      "[data-pilot-theme-toggle]",
    )) {
      button.setAttribute("aria-pressed", String(value === "dark"));
      button.textContent = value === "dark" ? "Light mode" : "Dark mode";
    }
  };
  apply(theme);
  for (const button of document.querySelectorAll("[data-pilot-theme-toggle]"))
    button.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.pilotTheme === "dark"
          ? "light"
          : "dark";
      apply(next);
      try {
        localStorage.setItem("agent-academy-pilot-theme", next);
      } catch {}
    });
}

export async function mountPilotLesson(number, lessons) {
  if (!pilots.has(number)) return;
  const response = await fetch(`/api/pilot?prompt=${number}`);
  const lesson = await response.json();
  if (!response.ok) throw new Error(lesson.error);
  document.body.classList.add("pilot-app");
  const main = document.querySelector("main");
  const brand = create("div", null, "pilot-brand");
  const home = anchor(
    "Agent Academy",
    `/pilot-guide?prompt=${number}&view=student`,
  );
  home.append(create("span", "OpenAI Agents SDK"));
  brand.append(home);
  const picker = create("label", null, "pilot-lesson-picker");
  picker.append(create("span", "Choose lesson"));
  const select = create("select");
  select.id = "pilot-lesson-picker";
  for (const entry of lessons) {
    const option = create("option", `Prompt ${entry.number} · ${entry.title}`);
    option.value = entry.number;
    option.selected = entry.number === number;
    select.append(option);
  }
  select.addEventListener("change", () => {
    location.href = `/?prompt=${select.value}`;
  });
  picker.append(select);
  brand.append(picker);
  main.prepend(brand);
  const nav = create("nav", null, "pilot-nav");
  nav.setAttribute("aria-label", "Pilot lesson sections");
  for (const [text, href] of [
    ["Learning goals", `/pilot-guide?prompt=${number}&view=student#learning`],
    ["Run instructions", `/pilot-guide?prompt=${number}&view=student#run`],
    ["Workflow", `/pilot-guide?prompt=${number}&view=student#workflow`],
    ["Application lab", "#application-lab"],
    ["Teaching pack", `/pilot-guide?prompt=${number}&view=instructor`],
  ]) {
    const link = anchor(text, href);
    if (href === "#application-lab") link.setAttribute("aria-current", "page");
    nav.append(link);
  }
  const theme = create("button", "Dark mode");
  theme.type = "button";
  theme.dataset.pilotThemeToggle = "";
  nav.append(theme);
  brand.after(nav);
  const intro = document.querySelector(".intro");
  const copy = create("div", null, "pilot-hero-copy");
  copy.append(...intro.childNodes);
  intro.append(copy);
  document.querySelector("#headline").textContent = lesson.title;
  document.querySelector("#summary").textContent = lesson.objective;
  const logo = create("img");
  logo.className = "pilot-icon";
  logo.src = "/assets/openai-icon.svg";
  logo.alt = "OpenAI icon";
  logo.width = 96;
  logo.height = 96;
  intro.append(logo);
  const workflow = create("ol", null, "pilot-workflow");
  workflow.setAttribute("aria-label", "Lesson workflow");
  for (const step of lesson.workflow) {
    const item = create("li");
    item.append(create("h3", step.title), create("p", step.detail));
    workflow.append(item);
  }
  intro.after(workflow);
  const prediction = create("aside", null, "pilot-note pilot-prediction");
  prediction.append(
    create("h3", "Predict before you run"),
    create("p", lesson.prediction),
  );
  workflow.after(prediction);
  const lab = document.querySelector(".lab");
  lab.id = "application-lab";
  document.querySelector("#lab-title").textContent = "Application lab";
  const workspace = document.querySelector(".workspace");
  const config = create("section", null, "pilot-config");
  config.id = "configure";
  config.setAttribute("aria-labelledby", "pilot-config-title");
  const configTitle = create("h3", "Try the workflow");
  configTitle.id = "pilot-config-title";
  config.append(
    configTitle,
    document.querySelector("#exercise-controls"),
    document.querySelector(".execution-controls"),
    document.querySelector("#execution-label"),
  );
  const results = create("section", null, "pilot-result-card");
  results.id = "verify";
  results.setAttribute("aria-labelledby", "pilot-result-title");
  const resultTitle = create("h3", "Inspect the result");
  resultTitle.id = "pilot-result-title";
  const empty = create(
    "p",
    "Run a scenario to inspect the response, execution steps and evidence.",
    "pilot-empty",
  );
  empty.id = "pilot-empty";
  results.append(
    resultTitle,
    empty,
    document.querySelector("#step-status"),
    document.querySelector("#timeline"),
    document.querySelector("#error"),
    document.querySelector("#result"),
  );
  const review = document.querySelector("#course-panel");
  if (review) {
    review.hidden = true;
    results.append(review);
  }
  const grid = create("div", null, "pilot-grid");
  grid.append(config, results);
  workspace.prepend(grid);
  const source = document.querySelector(".source-panel");
  const details = create("details", null, "pilot-source-details");
  details.id = "how-it-works";
  details.append(create("summary", "How it works"), source);
  workspace.append(details);
  document
    .querySelector("#module-buttons")
    ?.addEventListener("click", (event) => {
      if (!event.target.closest("[data-source]")) return;
      details.open = true;
      source.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  const scope = create("p", lesson.execution, "pilot-scope");
  config.append(scope);
  const footer = document.querySelector(".page-footer");
  footer.prepend(create("span", "OpenAI icon belongs to OpenAI. "));
  mountPilotTheme();
}

export function updatePilotResult(number, result) {
  if (!pilots.has(number)) return;
  const empty = document.querySelector("#pilot-empty");
  if (empty) empty.hidden = true;
  const review = document.querySelector("#course-panel");
  if (review) review.hidden = false;
  const card = document.querySelector(".pilot-result-card");
  if (card)
    card.dataset.outcome = result.reviewRecords?.[0]?.decision || "complete";
}
export function resetPilotResult() {
  const empty = document.querySelector("#pilot-empty");
  if (empty) empty.hidden = false;
  if (document.body.classList.contains("pilot-app")) {
    const review = document.querySelector("#course-panel");
    if (review) review.hidden = true;
    document
      .querySelector(".pilot-result-card")
      ?.removeAttribute("data-outcome");
  }
}
