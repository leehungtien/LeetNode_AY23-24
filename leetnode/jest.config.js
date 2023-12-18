module.exports = {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
      "<rootDir>/setupTests.js"
    ],
    "transform": {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^@/components/editor/VariablesBox$": "<rootDir>/src/components/editor/VariablesBox",
      "^@/components/Latex$": "<rootDir>/src/components/Latex",
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    "globals": {
      "NODE_ENV": "test"
    },
    "moduleFileExtensions": [
      "js",
      "jsx",
      "ts",
      "tsx"
    ],
    "transformIgnorePatterns": [
      "/node_modules/(?!@mantine)"
    ],
    "modulePaths": ["<rootDir>/src/"],
    "testMatch": [
      "**/?(*.)+(spec|test).[tj]s?(x)",
      "!**/node_modules/**", // Exclude node_modules
      "!**/src/pages/test.tsx",
    ],
};
  