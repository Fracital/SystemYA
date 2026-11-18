// Prefer verified original 2022 media. Archive replay and CSS fallback are recovery paths.
const capture =
  "https://web.archive.org/web/20220526154012im_/https://sys32.dev/static/media/";
const assets = {
  light: "light.2d95225a7bb6ff1db853.svg",
  dark: "dark.8cbd0429f3449df8c19c.svg",
  theatre: "theatre.4cf739e3dd20f770bb30.webp",
} as const;

type Asset = keyof typeof assets;
const resolved = new Map<Asset, string>();

function checkImage(path: string, timeout = 4500): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    let finished = false;
    const done = (ok: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      resolve(ok);
    };
    const timer = window.setTimeout(() => done(false), timeout);
    image.onload = () => done(image.naturalWidth > 0);
    image.onerror = () => done(false);
    image.src = path;
  });
}

async function getImage(key: Asset): Promise<string | undefined> {
  const cached = resolved.get(key);
  if (cached) return cached;
  const local = `/static/media/${assets[key]}`;
  if (await checkImage(local, 1300)) {
    resolved.set(key, local);
    return local;
  }
  const historical = capture + assets[key];
  if (await checkImage(historical, 6500)) {
    resolved.set(key, historical);
    return historical;
  }
  return undefined;
}

function updateGrid(root: HTMLElement, light: string, dark: string): void {
  const useDark = root.dataset.theme === "dark";
  root.style.setProperty("--grid", `url("${useDark ? dark : light}")`);
  root.style.setProperty("--grid-inverted", `url("${useDark ? light : dark}")`);
}

export function mountHistoricalMedia(root: HTMLElement): void {
  // The verified 2022 grids live locally. Do not flash an invented grid on load.
  let light = `/static/media/${assets.light}`;
  let dark = `/static/media/${assets.dark}`;
  updateGrid(root, light, dark);
  const applyTheme = () => updateGrid(root, light, dark);
  const observer = new MutationObserver(applyTheme);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("astro:before-swap", () => observer.disconnect(), {
    once: true,
  });
  void Promise.all([getImage("light"), getImage("dark")]).then(([l, d]) => {
    if (!root.isConnected) return;
    light = l ?? "/systemya-2022/fallback/light-grid.svg";
    dark = d ?? "/systemya-2022/fallback/dark-grid.svg";
    updateGrid(root, light, dark);
    root.dataset.gridSource = l && d ? "historical" : "fallback";
  });
  if (root.dataset.page === "theatre") {
    void getImage("theatre").then((src) => {
      if (!src || !root.isConnected) return;
      root.querySelectorAll<HTMLElement>(".front").forEach((front) => {
        front.style.backgroundImage = `url("${src}")`;
      });
      root.dataset.theatreSource = "historical";
    });
  }
}
