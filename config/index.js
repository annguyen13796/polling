/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const path = require('path');

const getConfigFactory = ({ filename }) => {
	return async (sls) => {
		const stage = sls?.variables?.options?.stage;
		console.log('options', stage);
		console.log('parsing file name', filename);
		// the caller config file name will be exactly the same to the config directory's name
		const caller = path.parse(filename);
		process.env.NODE_ENV = stage ? stage : 'dev';
		process.env.NODE_CONFIG_DIR = `${caller.dir}/${caller.name.split('.')[0]}`;

		console.log('current stg', process.env.NODE_ENV);
		console.log('current callerFileName', process.env.NODE_CONFIG_DIR);

		delete require.cache[require.resolve('config')];
		const config = require('config');
		console.log('config', config.util.toObject());
		return config.util.toObject();
	};
};

module.exports = {
	getConfigFactory,
};
