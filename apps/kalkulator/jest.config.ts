/// <reference types="node" />
const nxPreset = require('../../jest.preset.js');

const { resolver, ...nxPresetWithoutResolver } = nxPreset;

module.exports = {
  ...nxPresetWithoutResolver,
  displayName: 'kalkulator',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/kalkulator',
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
