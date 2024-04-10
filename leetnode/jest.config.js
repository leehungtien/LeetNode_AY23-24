module.exports = {
    "testEnvironment": 'jest-environment-jsdom',
    // "preset": 'ts-jest',
    "setupFilesAfterEnv": [
        "<rootDir>/setupTests.js"
    ],
    "transform": {
        '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: 'tsconfig.test.json', }],
        '^.+\\.(js|jsx)$': 'babel-jest',
        '\\.js$': 'babel-jest',
        "^.+\\.jsx?$": "babel-jest",
        // "^.+\\.tsx?$": ['ts-jest', { tsconfig: 'tsconfig.test.json', }],
    },
    "moduleNameMapper": {
        '^@/(.*)$': '<rootDir>/src/$1',
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
        "^@/components/editor/VariablesBox$": "<rootDir>/src/components/editor/VariablesBox",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/components/editor/VariablesBox$": "<rootDir>/src/components/editor/VariablesBox",
        "^@/components/Latex$": "<rootDir>/src/components/Latex",
    },
    "globals": {
        "NODE_ENV": "test",
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
    "modulePaths": ["<rootDir>/src/"],
    "testMatch": [
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "!**/node_modules/**", // Exclude node_modules
        "!**/src/pages/test.tsx",
    ],
};
