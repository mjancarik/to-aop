export default {
  bail: false,
  verbose: true,
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  transform: {},
  modulePaths: ['<rootDir>/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*Spec.mjs'],
  moduleFileExtensions: ['mjs', 'js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};
