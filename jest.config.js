// jest.config.js
const {defaults} = require('jest-config');

module.exports = {
  ...defaults,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  // ...
};

