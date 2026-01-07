const nextJest = require("next/jest");

// Wrap Next.js Jest config to load Next-specific transforms.
const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/lib/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
