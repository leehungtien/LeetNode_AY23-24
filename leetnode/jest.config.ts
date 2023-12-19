export default {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/pages/test.tsx",
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    //"^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "/^.+.(css|less|scss|sass)$/": "identity-obj-proxy",
  },
};
