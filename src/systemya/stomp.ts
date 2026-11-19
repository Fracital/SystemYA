/**
 * STomp's controller for code outside the browser page (sign-in). Browsing runs in the UI on
 * /app/ (src/systemya/proxy.ts), which starts its own controller on the same runtime and service
 * worker. scripts/prepare-stomp.mjs prepares the runtime under DIRECTORY with this build's file
 * names and helper names, and writes them to stomp-build.json.
 */
import type { StompController } from "@sysce/stomp";
import config from "./stomp-config.json";
import build from "./stomp-build.json";
import { openProxy } from "./proxy";

const DIRECTORY = build.directory;
// The edge has no Wisp relay for systemya.fracit.al; Fracital's public relay carries STomp.
const WISP_URL = config.wisp;
const ASSETS = build.assets;

type Module = typeof import("@sysce/stomp");
let booting: Promise<StompController> | undefined;

export function bootStomp(): Promise<StompController> {
  if (!booting) {
    booting = (async () => {
      if (!("serviceWorker" in navigator))
        throw new Error("This browser does not support service workers.");
      if (!window.isSecureContext)
        throw new Error("STomp requires HTTPS or localhost.");
      // An absolute URL made at run time: Vite leaves it alone, in dev and in the build, and the
      // browser loads the file from public/ as it is.
      const file = new URL(`${DIRECTORY}${build.controller}`, location.href)
        .href;
      const { default: Controller } = (await import(
        /* @vite-ignore */ file
      )) as Module;
      const registration = await Controller.register(DIRECTORY, {
        assets: ASSETS,
      });
      const controller = new Controller({
        serviceworker: registration,
        transport: {
          module: `${DIRECTORY}${build.transport.epoxy}`,
          options: [{ wisp: WISP_URL }],
          http3: { module: `${DIRECTORY}${build.transport.h3}` },
        },
        directory: DIRECTORY,
        assets: ASSETS,
        names: build.names,
        codec: "xor",
        cache: true,
        // Turns on the worker's request log, so `request` events reach the controller
        // (stomp-oauth.ts catches the OAuth callback with them).
        onRequest: () => {},
        // A page asking for another window opens on the proxy page instead.
        onOpen: (url: string) => openProxy(url),
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
