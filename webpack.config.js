const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: 'development',
	module: {
        rules: [
            {
                test: /\.glsl$/,
                use: "webpack-glsl-loader"
            }
        ]
    }
};