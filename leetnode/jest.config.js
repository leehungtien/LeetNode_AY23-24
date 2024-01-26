module.exports = {
    "testEnvironment": 'jest-environment-jsdom',
    "preset": 'ts-jest',
    "transform": {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
        '\\.js$': 'babel-jest',
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        '^@/(.*)$': '<rootDir>/src/$1',
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    },
    "globals": {
        "NODE_ENV": "test"
    },
    "moduleDirectories": ['<rootDir>/node_modules', '<rootDir>/src', '<rootDir>/src/pages'],
    "testPathIgnorePatterns": [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/coverage',
        '<rootDir>/dist'
    ],
    "moduleFileExtensions": [
        "js",
        "jsx",
        "ts",
        "tsx"
    ],
    "transformIgnorePatterns": [
        "/node_modules/(?!@mantine)",
    ],
}; module.exports = {
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
        "^@/components/Latex$": "<rootDir>/src/components/Latex"
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
    "testMatch": [
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "!**/node_modules/**", // Exclude node_modules
        "!**/src/pages/test.tsx",
    ],
};
