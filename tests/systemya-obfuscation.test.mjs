import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  OBFUSCATION_CLASSES,
  obfuscateText,
  obfuscationRules,
} from "../src/systemya/obfuscate.ts";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const { root, char, real, junk } = OBFUSCATION_CLASSES;
const block = new RegExp(
  `<s class="${root}">(?:<s>(?:<s class="${char}">(?:<s class="\\w">[^<]*</s>)+</s>)*</s> ?)+</s>`,
  "g",
);

// What a reader sees: only the letters in real classes.
function reveal(markup) {
  return markup
    .replace(/<s class="(\w)">([^<]*)<\/s>/g, (_, cls, text) =>
      real.includes(cls) ? text : junk.includes(cls) ? "" : `<${cls}?>`,
    )
    .replace(/<[^>]+>/g, "");
}

// What a scraper reading textContent gets.
const textContent = (markup) => markup.replace(/<[^>]+>/g, "");

test("snapshot obfuscation uses the frozen 2022 class draw, one real letter per group", () => {
  for (const page of ["support", "contact", "privacy"]) {
    const html = read(`src/systemya/snapshots/${page}.html`);
    assert.ok(html.startsWith("<style></style>"));
    const blocks = html.match(block) ?? [];
    assert.ok(blocks.length > 0, page);
    for (const b of blocks) {
      for (const group of b.match(
        new RegExp(`<s class="${char}">(?:<s class="\\w">[^<]*</s>)+</s>`, "g"),
      )) {
        const classes = [...group.matchAll(/<s class="(\w)">/g)]
          .map((m) => m[1])
          .slice(1);
        assert.equal(classes.filter((c) => real.includes(c)).length, 1, group);
        assert.ok(
          classes.every((c) => real.includes(c) || junk.includes(c)),
          group,
        );
      }
    }
  }
  const support = read("src/systemya/snapshots/support.html").match(block);
  assert.deepEqual(support.map(reveal), [
    "SystemYA",
    "proxy",
    "proxy",
    "proxy",
    "proxy",
  ]);
  assert.notEqual(textContent(support[1]), "proxy");
  const contact = read("src/systemya/snapshots/contact.html").match(block);
  assert.deepEqual(contact.map(reveal), [
    "support@sys32.dev",
    "Discord",
    "https://discord.gg/rXFjfYt3ae",
  ]);
});

test("the 2022 style rules hide every junk class and undo <s> strikethrough", () => {
  const [hide, decoration, words] = obfuscationRules();
  const hidden = hide.slice(0, hide.indexOf("{")).split(",");
  assert.deepEqual(
    hidden,
    junk.map((c) => `.${root} .${c}`),
  );
  assert.match(hide, /\{position:absolute;z-index:-10;opacity:0\}$/);
  assert.equal(decoration, `.${root},.${root} s{text-decoration:none}`);
  assert.equal(words, `.${root}>s{display:inline-block}`);
  const layout = read("src/layouts/SystemYALayout.astro");
  assert.match(layout, /obfuscationRules\(\)/);
  assert.match(layout, /insertRule/);
  assert.match(layout, /data-astro-rerun/);
});

test("obfuscateText reproduces module 337: readable through the rules, noise to textContent", () => {
  for (const text of [
    "Insta-Proxy",
    "unblocked proxy",
    "Insta-Proxy Addon",
    "Insta-Proxy.html",
    "Download Insta-Proxy",
    "a < b & c",
  ]) {
    const markup = obfuscateText(text);
    assert.equal(markup, obfuscateText(text));
    assert.match(markup, new RegExp(`^${block.source}$`));
    assert.equal(
      reveal(markup).replace(/&lt;/g, "<").replace(/&amp;/g, "&"),
      text,
    );
  }
  assert.notEqual(textContent(obfuscateText("Insta-Proxy")), "Insta-Proxy");
  const bookmark = read("src/systemya/bookmark.ts");
  for (const text of [
    "Insta-Proxy",
    "unblocked proxy",
    "Insta-Proxy Addon",
    "Insta-Proxy.html",
    "Download Insta-Proxy",
  ]) {
    assert.ok(bookmark.includes(`o("${text}")`), text);
  }
});
