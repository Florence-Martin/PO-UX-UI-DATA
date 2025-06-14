// jest.config.js
module.exports = {
  testMatch: [
    "**/__tests__/**/*.?([mc])[jt]s?(x)",
    "**/?(*.)+(spec|test).?([mc])[jt]s?(x)",
    "**/tests/**/*.?([mc])[jt]s?(x)", // Cette ligne permet d'inclure tous les fichiers dans le dossier tests
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
