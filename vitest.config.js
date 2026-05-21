const { defineConfig } = require("vitest/config");
const path = require("path");

// Detect workspace by current working directory (where vitest is run)
const cwd = process.cwd();
const isFrontend = cwd.includes(path.sep + "frontend");

module.exports = defineConfig({
  test: {
    globals: true,
    environment: isFrontend ? "jsdom" : "node",
    setupFiles: [
      isFrontend
        ? path.resolve(__dirname, "tests/setup.frontend.ts")
        : path.resolve(__dirname, "tests/setup.node.ts"),
    ],
  },
});
