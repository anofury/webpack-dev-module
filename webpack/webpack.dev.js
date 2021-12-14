const VConsolePlugin = require('vconsole-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new VConsolePlugin({
            enable: true,
        }),
    ],
};

module.exports = merge(baseConfig, devConfig);
