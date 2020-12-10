const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './api/index.ts',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js'
    },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
          },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
      ],
  },
  externals: [nodeExternals()],
};