const { getJestProjectsAsync } = require('@nx/jest');

/// <reference types="node" />
module.exports = async () => ({
  projects: await getJestProjectsAsync(),
});
