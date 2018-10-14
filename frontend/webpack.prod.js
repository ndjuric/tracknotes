const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.js',
  devtool: 'source-map',
  output: {
    filename: 'js/bundle.min.js',
    path: resolve(__dirname, '../backend/notes/static/'),
    publicPath: '/static/',
  },
  plugins: [],
});
