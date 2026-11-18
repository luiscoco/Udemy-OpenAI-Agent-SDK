import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import {
  highlightCode,
  highlightLines,
  languageFor,
} from "../public/syntax/highlight.js";
import { lessons } from "../catalog.mjs";
import { lessonSources } from "../execute.mjs";
import { teachingFiles } from "../teaching/materials.mjs";

test("language grammars color syntax and escape HTML without changing code text", () => {
  for (const [filename, code, token] of [
    ["example.ts", 'const value: string = "hello";', "keyword"],
    ["example.mjs", 'const url = "https://example.com";', "string"],
    ["example.py", 'def greet(name):\n    return "hello"', "keyword"],
    ["example.json", '{"count": 42, "ready": true}', "attr"],
    ["example.sql", "SELECT COUNT(*) FROM orders;", "keyword"],
    ["example.ps1", '$name = "Teacher"\nWrite-Output $name', "variable"],
    ["example.sh", 'echo "hello"', "string"],
    ["example.yaml", "enabled: true", "attr"],
    ["Dockerfile", "FROM node:24", "keyword"],
    ["example.html", '<div title="example">Hello</div>', "name"],
    ["example.css", ".card { color: red; }", "attribute"],
    ["example.md", "# Lesson", "section"],
    ["example.ini", "[app]\nname=Teacher", "section"],
  ]) {
    assert.match(
      highlightCode(code, filename),
      new RegExp(`hljs-${token}`),
      filename,
    );
  }
  const unsafe = '<img src=x onerror="alert(1)">& value';
  for (const name of ["constructor", "__proto__", "unknown"])
    assert.equal(languageFor(name), "plaintext");
  assert.equal(
    highlightCode(unsafe, "unknown.txt"),
    '&lt;img src=x onerror="alert(1)"&gt;&amp; value',
  );
  assert.ok(!highlightCode(unsafe, "example.html").includes("<img"));
});

test("multiline tokens keep their color across balanced numbered lines", () => {
  for (const [name, source, token] of [
    ["example.ts", "/* first\n   second */\nconst result = 1;", "comment"],
    [
      "example.py",
      'text = """first\n    second\nthird"""\nprint(text)',
      "string",
    ],
    ["example.js", "const text = `first\n  second`;", "string"],
  ]) {
    const lines = highlightLines(source, name);
    assert.equal(lines.length, source.split("\n").length);
    assert.match(lines[1], new RegExp(`hljs-${token}`));
    for (const line of lines)
      assert.equal(
        (line.match(/<span\b/g) ?? []).length,
        (line.match(/<\/span>/g) ?? []).length,
      );
    const plain = lines.map((line) => line.replace(/<[^>]+>/g, "")).join("\n");
    assert.equal(plain.replaceAll("&quot;", '"'), source);
  }
});

test("every shared lesson source has a supported language and can be highlighted", async () => {
  const sources = new Map();
  for (const lesson of lessons) {
    for (const [name, source] of Object.entries(
      await lessonSources(lesson.number),
    ))
      sources.set(name, source);
  }
  for (const [name, source] of sources) {
    assert.notEqual(languageFor(name), "plaintext", name);
    assert.ok(highlightCode(source.slice(0, 30000), name).length, name);
  }
});

test("standalone prompt 1 ships the same highlighter and teaching packs contain offline colors", async () => {
  const shared = new URL("../public/syntax/", import.meta.url);
  const standalone = new URL(
    "../../prompt-001-product-map/public/syntax/",
    import.meta.url,
  );
  async function compare(directory = "") {
    for (const entry of await readdir(new URL(directory, shared), {
      withFileTypes: true,
    })) {
      const name = directory + entry.name;
      if (entry.isDirectory()) await compare(name + "/");
      else
        assert.deepEqual(
          await readFile(new URL(name, shared)),
          await readFile(new URL(name, standalone)),
          name,
        );
    }
  }
  await compare();
  const files = await teachingFiles(5);
  assert.ok(files["assets/syntax.css"].length);
  assert.match(files["instructor-guide.html"], /hljs-keyword/);
  assert.match(files["instructor-guide.html"], /assets\/syntax.css/);
});
