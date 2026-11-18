// The May 2022 text obfuscation, recovered from module 337 of main.59cf0c20.js
// (archive/webcrack/bundles/main.59cf0c20.js-d59cfa202dca/readable.js). Every
// letter sits in a group of one to four <s> elements: one carries the letter in a
// "real" class, the rest carry decoy letters in "junk" classes. Rules inserted into
// the page's <style> element at runtime hide the junk, so people read the words
// while textContent (and innerText) returns noise.
//
// In 2022 the 16 class letters were drawn per visitor from a PRNG seeded with
// navigator.userAgent + location.origin. The recovered snapshots froze one draw,
// so these are the classes they use. Draw order inside each pool is not
// recoverable from the markup; it only changes which letter a new text gets.
export const OBFUSCATION_CLASSES = {
  root: "q",
  char: "x",
  real: ["G", "J", "P", "S", "W", "h", "v"],
  junk: ["D", "R", "V", "Y", "i", "r", "z"],
} as const;

// The three rules module 337's style component inserted with CSSOM insertRule.
export function obfuscationRules(): string[] {
  const { root, junk } = OBFUSCATION_CLASSES;
  return [
    `${junk.map((c) => `.${root} .${c}`).join(",")}{position:absolute;z-index:-10;opacity:0}`,
    `.${root},.${root} s{text-decoration:none}`,
    `.${root}>s{display:inline-block}`,
  ];
}

// Module 869: the random-seed npm package (Mash-seeded multiply-with-carry).
function mash(): (data?: unknown) => number | undefined {
  let n = 4022871197;
  return (data) => {
    if (data) {
      const s = String(data);
      for (let i = 0; i < s.length; i++) {
        n += s.charCodeAt(i);
        let h = n * 0.02519603282416938;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 2.3283064365386963e-10;
    }
    n = 4022871197;
    return undefined;
  };
}

interface SeededRandom {
  (range: number): number;
  random(): number;
  intBetween(min: number, max: number): number;
}

function createRandom(seed: string): SeededRandom {
  const order = 48;
  const state = new Array<number>(order).fill(0);
  let carry = 1;
  let phase = order;
  const m = mash();

  m();
  for (let i = 0; i < order; i++) state[i] = m(" ") as number;
  const clean = seed
    .replace(/(^\s*)|(\s*$)/gi, "")
    .replace(/[\x00-\x1F]/gi, "")
    .replace(/\n /, "\n");
  m(clean);
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    for (let j = 0; j < order; j++) {
      state[j] -= m(code) as number;
      if (state[j] < 0) state[j] += 1;
    }
  }

  const next = (): number => {
    if (++phase >= order) phase = 0;
    const t = state[phase] * 1768863 + carry * 2.3283064365386963e-10;
    carry = t | 0;
    return (state[phase] = t - carry);
  };
  const rand = ((range: number) =>
    Math.floor(
      range * (next() + ((next() * 2097152) | 0) * 1.1102230246251565e-16),
    )) as SeededRandom;
  rand.random = () => rand(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
  rand.intBetween = (min, max) =>
    Math.floor(rand.random() * (max - min + 1)) + min;
  return rand;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Module 337's export Z. 2022 seeded it with text + userAgent + origin; this build
// renders once, so the seed is text + the production origin. Same text, same markup.
export function obfuscateText(
  text: string,
  origin = "https://systemya.fracit.al",
): string {
  const { root, char, real, junk } = OBFUSCATION_CLASSES;
  const rand = createRandom(text + origin);
  const words = text.split(" ").map((word) => {
    const letters = word.split("");
    const groups = letters.map((letter, index) => {
      const size = rand.intBetween(1, 4);
      const pick = rand(size);
      let group = "";
      for (let slot = 0; slot < size; slot++) {
        if (slot === pick) {
          group += `<s class="${real[rand(real.length)]}">${escape(letter)}</s>`;
          continue;
        }
        const mode = rand(2);
        const cls = junk[rand(junk.length)];
        const decoy =
          mode === 0
            ? (letters[letters.length - index] ?? "")
            : String.fromCharCode(
                letters[letters.length - index - 1].charCodeAt(0) ^ slot,
              );
        group += `<s class="${cls}">${escape(decoy)}</s>`;
      }
      return `<s class="${char}">${group}</s>`;
    });
    return `<s>${groups.join("")}</s>`;
  });
  return `<s class="${root}">${words.join(" ")}</s>`;
}
