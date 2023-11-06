module.exports = {

    "testEnvironment": "jsdom",
    "transform": {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        // "^@/components/course/(.*)$": "<rootDir>/src/components/course/$1",
        // "^@/components/editor/VariablesBox$": "<rootDir>/src/components/editor/VariablesBox",
        // "^@/components/Latex$": "<rootDir>/src/components/Latex",
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
        "^@/api/(.*)$": "<rootDir>/src/api/$1"
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
    ]
};