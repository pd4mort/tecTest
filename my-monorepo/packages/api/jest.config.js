module.exports = {
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
