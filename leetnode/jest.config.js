module.exports = {
    // preset: 'ts-jest',
    // testEnvironment: 'jsdom',
    // moduleNameMapper: {
    //   '^@/(.*)$': '<rootDir>/src/$1',
    // },
    // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // transform: {
    //   '^.+\\.(ts|tsx)$': 'ts-jest',
    // },
    // coverageReporters: ['lcov', 'text'],
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
    "testEnvironment": "jsdom",
    "transform": {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
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
  