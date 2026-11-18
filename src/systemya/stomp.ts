/**
 * STomp for the recovered SystemYA UI.
 * Mirrors Fracital's vendored controller, service worker and Epoxy setup.
 * The upstream runtime assets are prepared by scripts/prepare-stomp.mjs.
 */
import type {
  StompController,
  Frame,
  Assets,
  NavigateInfo,
} from "@sysce/stomp";

const DIRECTORY = "/vendor/st/";
const ASSETS: Assets = {
  serviceWorker: "sw.js",
  injectDocument: "doc.js",
  injectWorker: "wk.js",
  transportWorker: "tw.js",
  rewriteWorker: "rw.js",
};

type Module = typeof import("@sysce/stomp");
let booting: Promise<StompController> | undefined;
let currentFrame: Frame | undefined;
let embeddedFrame: HTMLIFrameElement | undefined;

// The edge has no Wisp relay for systemya.fracit.al; Fracital's public relay carries STomp.
const WISP_URL = "wss://holywisp.fracit.al/";

/** Fired on window when the proxy view closes (its Back button, or closeService()). */
export const SERVICE_CLOSED = "systemya:service-closed";

export function bootStomp(): Promise<StompController> {
  if (!booting) {
    booting = (async () => {
      if (!("serviceWorker" in navigator))
        throw new Error("This browser does not support service workers.");
      if (!window.isSecureContext)
        throw new Error("STomp requires HTTPS or localhost.");
      const file = `${DIRECTORY}api.js`;
      const { default: Controller } = (await import(
        /* @vite-ignore */ file
      )) as Module;
      const registration = await Controller.register(DIRECTORY, {
        assets: ASSETS,
      });
      const controller = new Controller({
        serviceworker: registration,
        transport: {
          module: `${DIRECTORY}link.js`,
          options: [{ wisp: WISP_URL }],
        },
        directory: DIRECTORY,
        assets: ASSETS,
        codec: "xor",
        cache: true,
        // Turns on the worker's request log, so `request` events reach the controller
        // (stomp-oauth.ts catches the OAuth callback with them).
        onRequest: () => {},
        onOpen: (url: string) => {
          // A link asking for another tab opens within the current SystemYA proxy view.
          void openStomp(url);
        },
      });
      await controller.wait();
      return controller;
    })().catch((error) => {
      booting = undefined;
      throw error;
    });
  }
  return booting;
}

function elements(): {
  box: HTMLElement;
  frame: HTMLIFrameElement;
  status: HTMLElement;
  title: HTMLElement;
} {
  const box = document.querySelector<HTMLElement>("#systemya-service");
  const frame = document.querySelector<HTMLIFrameElement>(
    "#systemya-service-frame",
  );
  const status = document.querySelector<HTMLElement>(
    "#systemya-service-status",
  );
  const title = document.querySelector<HTMLElement>("#systemya-service-title");
  if (!box || !frame || !status || !title)
    throw new Error("SystemYA proxy view is missing");
  return { box, frame, status, title };
}

export async function openStomp(value: string): Promise<void> {
  const url = new URL(value, location.href);
  if (!/^https?:$/.test(url.protocol))
    throw new TypeError("Only HTTP and HTTPS sites can be proxied");
  const { box, frame, status, title } = elements();
  box.hidden = false;
  document.body.dataset.systemyaProxy = "open";
  title.textContent = url.hostname;
  status.textContent = "Connecting...";
  try {
    const controller = await bootStomp();
    if (embeddedFrame !== frame || !currentFrame) {
      embeddedFrame = frame;
      currentFrame = controller.createFrame(frame);
      currentFrame.addEventListener("navigate", (event: Event) => {
        const detail = (event as CustomEvent<NavigateInfo>).detail;
        if (detail?.url) {
          title.textContent = detail.title || new URL(detail.url).hostname;
          status.textContent = "";
        }
      });
    }
    await currentFrame.go(url.href);
    status.textContent = "";
  } catch (error) {
    status.textContent = `Proxy unavailable: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export function openEmbed(src: string, title: string): void {
  const { box, frame, status, title: titleNode } = elements();
  box.hidden = false;
  document.body.dataset.systemyaProxy = "open";
  status.textContent = "";
  titleNode.textContent = title;
  currentFrame = undefined;
  embeddedFrame = undefined;
  frame.src = src;
}

export function closeService(): void {
  const box = document.querySelector<HTMLElement>("#systemya-service");
  const frame = document.querySelector<HTMLIFrameElement>(
    "#systemya-service-frame",
  );
  if (box) box.hidden = true;
  document.body.dataset.systemyaProxy = "";
  if (frame) frame.src = "about:blank";
  currentFrame = undefined;
  embeddedFrame = undefined;
  window.dispatchEvent(new Event(SERVICE_CLOSED));
}

export async function reloadService(): Promise<void> {
  if (currentFrame) await currentFrame.reload();
  else
    document
      .querySelector<HTMLIFrameElement>("#systemya-service-frame")
      ?.contentWindow?.location.reload();
}
