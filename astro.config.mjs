import { defineConfig } from "astro/config";
import { staticClientObfuscator } from "./scripts/static-client-obfuscator.mjs";

// systemya.fracit.al is an nginx static root. The edge proxies Holt (/room/), games (/v1/games/,
// /cdn/) and Fracital Accounts (/api/).
// Do not attach website2's Node middleware or generate any /room, /v1, /cdn or /api files.

// `npm run dev` and `npm run preview` only serve files, so they forward the edge's paths to the
// live site: chat, games and accounts then work on localhost too. The edge checks Origin, so it is
// rewritten to the live site's, and cookies lose their Domain so the browser keeps them for
// localhost. Dev only; nothing here reaches the build.
const EDGE = "https://systemya.fracit.al";
const edgeRoute = {
  target: EDGE,
  changeOrigin: true,
  secure: true,
  ws: true,
  configure(proxy) {
    proxy.on("proxyReq", (req) => {
      if (req.getHeader("origin")) req.setHeader("origin", EDGE);
      const referer = req.getHeader("referer");
      if (typeof referer === "string")
        req.setHeader("referer", EDGE + new URL(referer).pathname);
    });
    proxy.on("proxyReqWs", (req) => {
      req.setHeader("origin", EDGE);
    });
    proxy.on("proxyRes", (res) => {
      const cookies = res.headers["set-cookie"];
      if (cookies)
        res.headers["set-cookie"] = cookies.map((c) =>
          c.replace(/;\s*Domain=[^;]+/i, ""),
        );
      const location = res.headers.location;
      if (typeof location === "string" && location.startsWith(EDGE))
        res.headers.location = location.slice(EDGE.length) || "/";
    });
  },
};
const edgeProxy = Object.fromEntries(
  ["/api/", "/room/", "/cdn/", "/v1/"].map((path) => [path, edgeRoute]),
);

export default defineConfig({
  site: "https://systemya.fracit.al",
  output: "static",
  build: {
    format: "preserve",
  },
  devToolbar: { enabled: false },
  vite: {
    server: { proxy: edgeProxy },
    preview: { proxy: edgeProxy },
    // Shared browser chunks are named by hash only, so no served file name says what a module
    // does (stomp-oauth.ts would otherwise ship as stomp-oauth.<hash>.js).
    environments: {
      client: {
        build: {
          rolldownOptions: { output: { chunkFileNames: "_astro/[hash].js" } },
        },
      },
    },
    plugins:
      process.env.SYSTEMYA_OBFUSCATE === "1" ? [staticClientObfuscator()] : [],
  },
});
