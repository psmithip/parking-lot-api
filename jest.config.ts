import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src/tests'],
  clearMocks: true,
  globalSetup: '<rootDir>/src/tests/global-setup.ts',
  globalTeardown: '<rootDir>/src/tests/global-teardown.ts',
};

export default jestConfig;
