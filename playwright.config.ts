import { defineConfig, devices } from "@playwright/test";
import { env } from "process";

const setupEnv = env.SETUP_E2E_ENVIRONMENT == "true";
const setup = [
  {
    name: "setup",
    testMatch: "global-setup.ts",
    teardown: "teardown"
  },
  {
    name: "teardown",
    testMatch: "global-teardown.ts"
  }
];
const projects = [
  {
    name: "api",
    testMatch: "api/**/*.spec.ts",
    dependencies: setupEnv ? ["setup"] : []
  },
  {
    name: "ui",
    testMatch: "ui/**/*.spec.ts",
    dependencies: setupEnv ? ["setup"] : []
  }
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./spec/e2e/tests",
  outputDir: "./tmp/test-results",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Do not retry tests */
  retries: 0,
  /* Do not run tests in parallel because of mock server */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["junit", { outputFile: "tmp/playwright.xml" }],
    ["allure-playwright", { outputFolder: "tmp/allure-results", detail: false }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://${env.APP_HOST || "localhost"}:3000`,
    /* Save screenshot on failure */
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  /* Configure projects to run */
  projects: setupEnv ? [...setup, ...projects] : projects
});
