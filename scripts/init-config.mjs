import { copyFile, access } from "node:fs/promises";

const source = new URL("../config/config.example.js", import.meta.url);
const target = new URL("../config/config.js", import.meta.url);

try {
  await access(target);
  console.log("config/config.js already exists. No changes made.");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
  await copyFile(source, target);
  console.log(
    "Created config/config.js from the website2 configuration template.",
  );
  console.log(
    "Review host, port, mirrors, optional APIs, and proxy settings before serving publicly.",
  );
}
