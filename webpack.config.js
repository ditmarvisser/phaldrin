const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ["./src/js/index.ts"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/bundle.js"
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: "./dist",
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.geojson$/,
				exclude: /node_modules/,
				use: {
					loader: "json-loader",
				},
			},
			{
				test: /\.ts$/,
				use: {
					loader: "ts-loader",
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js']
	}
};
