const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: './src/index.ts',
  devtool: IS_PROD ? false : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
