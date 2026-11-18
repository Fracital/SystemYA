import JavaScriptObfuscator from "javascript-obfuscator";

// Opt-in Vite plugin. Obfuscate before Rollup finalizes content-hashed chunk names.
// Leave copied STomp, SDK, historical media, and third-party vendor files unchanged.
export function staticClientObfuscator() {
  let isServerBuild = false;
  return {
    name: "systemya-static-client-obfuscator",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      isServerBuild = Boolean(config.build.ssr);
    },
    renderChunk(code, chunk) {
      if (isServerBuild || !chunk.fileName.endsWith(".js")) return null;
      if (!chunk.fileName.startsWith("_astro/")) return null;
      const obfuscated = JavaScriptObfuscator.obfuscate(code, {
        ...JavaScriptObfuscator.getOptionsByPreset("low-obfuscation"),
        renameGlobals: false,
      }).getObfuscatedCode();
      return { code: obfuscated, map: null };
    },
  };
}
