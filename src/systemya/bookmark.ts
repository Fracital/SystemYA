// /bookmark.html: the May 2022 Insta-Proxy page, recovered from chunk 372.b61d9907
// (archive/webcrack/bundles/372.b61d9907.chunk.js-10ed619bddc4). The original download loaded
// cdn.jsdelivr.net/gh/sysce/query/dist/query.js, which no longer exists; the file now opens
// SystemYA itself, full window, from the downloaded copy.
export const BOOKMARK_MAIN = `<main><h1>Insta-Proxy</h1><hr><h2>What is Insta-Proxy?</h2><p>Insta-Proxy is a new script that allows you to open an unblocked proxy when needed.</p><h2>How to install Insta-Proxy:</h2><p>To install Insta-Proxy Addon, simply download the file below: <br><span id="systemya-bookmark-download"></span></p><h2>How to use Insta-Proxy:</h2><ol><li>Open your Files app</li><li>Find your Downloads folder</li><li>Look for Insta-Proxy.html (If you can't find Insta-Proxy.html, download it from above)</li><li>Open Insta-Proxy.html in your web browser.</li></ol><p>Once you have completed all the steps, you will be on Insta-Proxy.</p></main>`;

export function mountBookmark(root: HTMLElement): void {
  const slot = root.querySelector<HTMLElement>("#systemya-bookmark-download");
  if (!slot || slot.childElementCount) return;
  const site = JSON.stringify(`${location.origin}/`);
  const html = `<!DOCTYPE HTML><html><head><title>about:blank</title><meta charset='utf-8' /><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;display:block}</style></head><body><iframe src=${site}></iframe></body></html>`;
  const file = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = document.createElement("a");
  link.style.color = "red";
  link.href = file;
  link.download = "Insta-Proxy.html";
  link.textContent = "Download Insta-Proxy";
  slot.append(link);
  document.addEventListener(
    "astro:before-swap",
    () => URL.revokeObjectURL(file),
    { once: true },
  );
}
