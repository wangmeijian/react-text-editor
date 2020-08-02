const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

const devConfig = merge(baseConfig, {
	output: {		
		filename: '[name].bundle.js'
	},
	devtool: 'eval-source-map',
	devServer: {
	  contentBase: path.join(__dirname, "build"),
	  inline: true,
	  port: 8000
	},
	plugins: [
    new Webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname,'./public/index.html')
		})
	]
})

module.exports = devConfig;