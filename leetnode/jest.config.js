module.exports = {

  "testEnvironment": "jest-environment-jsdom",

  "setupFilesAfterEnv": [
    "<rootDir>/setupTests.js"
  ],

  "transform": {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: 'tsconfig.test.json', }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '\\.js$': 'babel-jest',
    "^.+\\.jsx?$": "babel-jest",
    
    
    "^.+\\.tsx?$": "ts-jest",
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.[jt]sx?$": ["ts-jest", {"useESM": true}],
    "^.+\\.[jt]sx?$": "babel-jest"
  },

  "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",

      "^@/components/(.*)$": "<rootDir>/src/components/$1",
      "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
      "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
      "^@/api/(.*)$": "<rootDir>/src/api/$1",
      "^@/(.*)$": "<rootDir>/src/$1",
      "^@/node_modules/(.*)$": "<rootDir>/node_modules/$1",
      'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',


      "^@/components/editor/VariablesBox$": "<rootDir>/src/components/editor/VariablesBox",
      "^@/components/Latex$": "<rootDir>/src/components/Latex",
  },

  "globals": {
    "NODE_ENV": "test",
  },
  
  "moduleFileExtensions": [
    "js",
    "jsx",
    "ts",
    "tsx"
  ],

  "moduleDirectories": ['<rootDir>/node_modules', '<rootDir>/src', '<rootDir>/src/pages'],

  "transformIgnorePatterns": [
    "/node_modules/(?!@mantine)"
  ],

  "testPathIgnorePatterns": [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage',
    '<rootDir>/dist'
],

};