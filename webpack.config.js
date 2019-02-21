const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require("webpack-node-externals");

const entries = {};

Object.keys(slsw.lib.entries).forEach(
  key => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]])
);

module.exports = {
  devtool: 'source-map',
  entry: entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  optimization: {
    // Turn off minimization of code
    // minimize: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
  externals: [
    nodeExternals({
      modulesFromFile: true
    })
  ],
};
