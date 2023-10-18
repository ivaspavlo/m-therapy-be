module.exports = {
  "verbose": true,
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "**/tests/**"
  ],
  "testPathIgnorePatterns": [
    '<rootDir>/lib/',
    '<rootDir>/node_modules/'
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "modulePaths": [
    "<rootDir>"
  ]
}
