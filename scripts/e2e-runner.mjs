import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout as wait } from "node:timers/promises";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const bin = path.join(root, "node_modules", ".bin");
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");
const playwrightCli = require.resolve("@playwright/test/cli");
const env = {
  ...process.env,
  PATH: `${bin}${path.delimiter}${process.env.PATH || ""}`,
  DEMO_MODE: process.env.DEMO_MODE || "true",
  PLAYWRIGHT_SKIP_WEB_SERVER: "1",
  PLAYWRIGHT_BROWSERS_PATH:
    process.env.PLAYWRIGHT_BROWSERS_PATH || path.resolve(root, "../../work/ms-playwright")
};

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    cwd: root,
    env,
    stdio: options.stdio || "inherit",
    shell: false
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch("http://localhost:3000/api/health");
      if (response.ok) return;
    } catch {
      // Server is still booting.
    }
    await wait(1000);
  }
  throw new Error("Next dev server did not become ready in time.");
}

const server = spawnCommand(process.execPath, [nextCli, "dev", "--hostname", "localhost", "--port", "3000"], {
  stdio: "ignore"
});

let exitCode = 1;
try {
  await waitForServer();
  const test = spawnCommand(process.execPath, [playwrightCli, "test", "--workers=1", "--reporter=list"]);
  const code = await new Promise((resolve) => test.on("exit", resolve));
  exitCode = Number(code || 0);
} finally {
  if (!server.killed) server.kill();
  await wait(500);
  process.exit(exitCode);
}
