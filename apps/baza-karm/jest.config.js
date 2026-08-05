/* eslint-disable */
const path = require('path');
const nxPreset = require('../../jest.preset.js');

// Strip the resolver - we'll set moduleDirectories instead to help
// Jest find modules in the root node_modules from this subdirectory.
const { resolver, ...nxPresetWithoutResolver } = nxPreset;

module.exports = {
  ...nxPresetWithoutResolver,
  displayName: 'baza-karm',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/baza-karm',
  // Help Jest's internal resolver find modules in root node_modules
  moduleDirectories: ['node_modules', path.join(__dirname, '../../node_modules')],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      require.resolve('jest-preset-angular'),
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    require.resolve('jest-preset-angular/build/serializers/no-ng-attributes'),
    require.resolve('jest-preset-angular/build/serializers/ng-snapshot'),
    require.resolve('jest-preset-angular/build/serializers/html-comment'),
  ],
};
