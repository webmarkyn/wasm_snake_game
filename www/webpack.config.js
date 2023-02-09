const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './bootstrap.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bootstrap.js',
  },
  mode: 'development',
  plugins: [new CopyWebpackPlugin({
    patterns: [{ from: './index.html', to: './'}]
  })]
}
