module.exports = {
  // Other Jest config options
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@react-pdf/renderer|@react-pdf/primitives|@supabase/auth-helpers-nextjs|jose).+\\.js$",
  ],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }],
  ],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov", "json", "cobertura"],

  // Add the setupFiles option
  setupFiles: ["<rootDir>/jest.setup.js"],
};
