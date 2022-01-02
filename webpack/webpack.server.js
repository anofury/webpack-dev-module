const VConsolePlugin = require('vconsole-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { getAbsolutePath, getAppConfig } = require('./scripts/tool');
const APP_CONFIG = getAppConfig();

const serverConfig = {
    mode: 'development',
    output: {
        clean: false,
    },
    devServer: {
        static: {
            directory: getAbsolutePath(APP_CONFIG['dist']),
        },
        allowedHosts: 'all',
        compress: true,
        // proxy: {
        //     '/api': 'http://code:1314',
        // },
        // host: '0.0.0.0',
        historyApiFallback: true,
        port: 9000,
        hot: true,
    },
    plugins: [
        new VConsolePlugin({
            enable: true,
        }),
    ],
};

module.exports = merge(baseConfig, serverConfig);
