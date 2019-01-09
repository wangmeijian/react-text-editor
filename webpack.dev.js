var merge = require('webpack-merge');
var baseConfig = require('./webpack.base');
var path = require('path');

const devConfig = merge(baseConfig, {
	output: {		
		filename: '[name].bundle.js'
	},
	devtool: 'eval-source-map'
})

module.exports = devConfig;