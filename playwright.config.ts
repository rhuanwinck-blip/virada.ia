import { defineConfig, devices } from "@playwright/test";

const webServer =
  process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1"
    ? undefined
    : {
        command: "next dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 90_000
      };

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure"
  },
  webServer,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } }
  ]
});
