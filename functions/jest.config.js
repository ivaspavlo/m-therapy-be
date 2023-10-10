module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "**/tests/**"
  ],
  "testPathIgnorePatterns": [
    'lib/',
    'node_modules/'
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
