const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    output: {
        publicPath: '/',
    },
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
