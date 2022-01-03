const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
    mode: 'development',
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
    },
    devtool: 'eval-cheap-module-source-map',
};

process.env.NODE_ENV = 'development';

module.exports = merge(baseConfig, devConfig);
