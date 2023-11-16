module.exports = {
  verbose: true,
  rootDir: './',
  roots: ['<rootDir>/test/'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|\\.(tests|spec))\\.(ts|tsx|js)$',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/styles/', 'src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}'],
  coverageDirectory: 'coverage',
};
