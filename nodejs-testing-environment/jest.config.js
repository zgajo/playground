// ./server/jest.config.js
module.exports = {
  displayName: "server",
  testEnvironment: "node",
  testRegex: "((\\.|/*.)(spec))\\.js?$",
  modulePaths: ["<rootDir>/src", "<rootDir>/*", "<rootDir>/test"],
};
