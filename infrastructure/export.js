/* eslint-disable @typescript-eslint/no-var-requires */
const { getConfigFactory } = require('../config');

module.exports = getConfigFactory({ filename: __filename });
