import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Mirrors the filenames used by Fracital's StompController integration. */
export const stompFiles = Object.freeze([
  ["serviceWorker.js", "sw.js"],
  ["injectDocument.js", "doc.js"],
  ["injectWorker.js", "wk.js"],
  ["transportWorker.js", "tw.js"],
  ["rewriteWorker.js", "rw.js"],
  ["controller.mjs", "api.mjs"],
]);

export async function prepareStomp({
  source,
  epoxy,
  destination = resolve("public/vendor/st"),
} = {}) {
  if (!source) {
    try {
      source = (await import("@sysce/stomp/path")).stompPath;
    } catch (error) {
      throw new Error("@sysce/stomp is missing. Run npm ci first.", {
        cause: error,
      });
    }
  }
  epoxy ??= resolve(
    "node_modules/@mercuryworkshop/epoxy-transport/dist/index.mjs",
  );
  const operations = stompFiles.map(([from, to]) => ({
    from: join(source, from),
    to,
  }));
  operations.push({ from: epoxy, to: "link.mjs" });
  // Validate every file before mutating the destination, so a partial package install cannot ship a partial runtime.
  const files = await Promise.all(
    operations.map(async ({ from, to }) => {
      const contents = await readFile(from);
      if (contents.length < 50)
        throw new Error(`Empty STomp runtime asset: ${from}`);
      return {
        from,
        to,
        contents,
        sha256: createHash("sha256").update(contents).digest("hex"),
      };
    }),
  );
  await mkdir(destination, { recursive: true });
  for (const file of files)
    await copyFile(file.from, join(destination, file.to));
  const manifest = {
    package: "@sysce/stomp",
    files: files.map(({ to, contents, sha256 }) => ({
      name: to,
      bytes: contents.length,
      sha256,
    })),
  };
  await writeFile(
    join(destination, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `STomp: copied ${files.length} upstream runtime files to ${destination}`,
  );
  return manifest;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await prepareStomp();
}
