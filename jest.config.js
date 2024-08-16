// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/*.spec.ts'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};
