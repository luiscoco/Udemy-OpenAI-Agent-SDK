import hljs from "./vendor/core.min.js";
import javascript from "./vendor/languages/javascript.min.js";
import typescript from "./vendor/languages/typescript.min.js";
import python from "./vendor/languages/python.min.js";
import json from "./vendor/languages/json.min.js";
import sql from "./vendor/languages/sql.min.js";
import powershell from "./vendor/languages/powershell.min.js";
import bash from "./vendor/languages/bash.min.js";
import yaml from "./vendor/languages/yaml.min.js";
import xml from "./vendor/languages/xml.min.js";
import css from "./vendor/languages/css.min.js";
import dockerfile from "./vendor/languages/dockerfile.min.js";
import markdown from "./vendor/languages/markdown.min.js";
import ini from "./vendor/languages/ini.min.js";

const grammars = {
  javascript,
  typescript,
  python,
  json,
  sql,
  powershell,
  bash,
  yaml,
  xml,
  css,
  dockerfile,
  markdown,
  ini,
};
for (const [name, grammar] of Object.entries(grammars))
  hljs.registerLanguage(name, grammar);

const languages = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  python: "python",
  json: "json",
  sql: "sql",
  ps1: "powershell",
  ps: "powershell",
  powershell: "powershell",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  yml: "yaml",
  yaml: "yaml",
  html: "xml",
  htm: "xml",
  xml: "xml",
  svg: "xml",
  css: "css",
  dockerfile: "dockerfile",
  md: "markdown",
  markdown: "markdown",
  ini: "ini",
  toml: "ini",
};

export function languageFor(name = "") {
  const filename = String(name).split(/[\\/]/).at(-1).toLowerCase();
  const extension = filename.split(".").at(-1);
  return Object.hasOwn(languages, extension)
    ? languages[extension]
    : Object.hasOwn(grammars, filename)
      ? filename
      : "plaintext";
}

const escape = (text) =>
  String(text).replace(
    /[&<>]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character],
  );

export function highlightCode(text, name) {
  const language = languageFor(name);
  return language === "plaintext"
    ? escape(text)
    : hljs.highlight(String(text), { language, ignoreIllegals: true }).value;
}

export function highlightLines(text, name) {
  const html = highlightCode(String(text).replace(/\r\n/g, "\n"), name);
  const lines = [];
  const spans = [];
  let line = "";
  // Balance token spans on each visual line while retaining multiline lexer state.
  for (const part of html.split(/(\n|<span\b[^>]*>|<\/span>)/)) {
    if (part === "\n") {
      lines.push(line + "</span>".repeat(spans.length));
      line = spans.join("");
    } else {
      if (part.startsWith("<span")) spans.push(part);
      if (part === "</span>") spans.pop();
      line += part;
    }
  }
  lines.push(line);
  return lines;
}

export function highlightElement(node, name) {
  const text = node.textContent;
  node.innerHTML = highlightCode(text, name);
  node.classList.add("syntax-code");
  node.dataset.language = languageFor(name);
}

export function highlightJson(node) {
  try {
    JSON.parse(node.textContent);
  } catch {
    node.classList.remove("syntax-code");
    delete node.dataset.language;
    return;
  }
  highlightElement(node, "json");
}

export function renderAnswer(node, value) {
  const text = String(value);
  const blocks =
    /^```([\w-]*)[ \t]*\r?\n([\s\S]*?)^```[ \t]*$|^SELECT\b[\s\S]*?;[ \t]*(?=\r?$)|^for [^\r\n]+:\r?\n(?:[ \t]+[^\r\n]*(?:\r?\n|$))+/gim;
  node.replaceChildren();
  let offset = 0;
  for (const match of text.matchAll(blocks)) {
    node.append(document.createTextNode(text.slice(offset, match.index)));
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    const fenced = match[2] !== undefined;
    code.textContent = fenced ? match[2] : match[0];
    pre.append(code);
    pre.className = "answer-code syntax-code";
    highlightElement(
      code,
      fenced ? match[1] : /^SELECT\b/i.test(match[0]) ? "sql" : "python",
    );
    node.append(pre);
    offset = match.index + match[0].length;
  }
  node.append(document.createTextNode(text.slice(offset)));
}
