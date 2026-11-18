import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npm, ["run", "build"], {
  env: { ...process.env, SYSTEMYA_OBFUSCATE: "1" },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
process.exitCode = result.status ?? 1;
