import { defineConfig } from "astro/config";
import { staticClientObfuscator } from "./scripts/static-client-obfuscator.mjs";

// systemya.fracit.al is an nginx static root. The edge proxies Holt (/room/), games (/v1/games/,
// /cdn/) and Fracital Accounts (/api/).
// Do not attach website2's Node middleware or generate any /room, /v1, /cdn or /api files.
export default defineConfig({
  site: "https://systemya.fracit.al",
  output: "static",
  build: {
    format: "preserve",
  },
  devToolbar: { enabled: false },
  vite: {
    plugins:
      process.env.SYSTEMYA_OBFUSCATE === "1" ? [staticClientObfuscator()] : [],
  },
});
