const path = require('path');

module.exports = {
	entry: {
		index: path.resolve(__dirname, 'index'),
		editorReact: path.resolve(__dirname, 'js/index')
	},
	output: {
		path: path.resolve(__dirname, 'build')
	},
	resolve: {
		alias: {
			'@js': path.resolve(__dirname, 'js'),
			'@plugins': path.resolve(__dirname, 'js/plugins')
		}
	},
	watch: true,
	watchOptions: {
		ignored: '/node_modules/'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	}
};