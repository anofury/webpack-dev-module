const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const VConsolePlugin = require('vconsole-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const IS_PROD_DEBUG = process.env.npm_lifecycle_event === 'build-app-debug';

const prodConfig = {
    mode: 'production',
    output: {
        clean: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                parallel: true,
                terserOptions: {
                    compress: {
                        ...(!IS_PROD_DEBUG && { pure_funcs: ['console.log'] }),
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    minChunks: 2,
                    minSize: 0,
                    name: 'vendors',
                },
                commons: {
                    chunks: 'all',
                    test: /\.(ts|tsx|js|jsx)/,
                    priority: -10,
                    minChunks: 2,
                    minSize: 0,
                    name: 'commons',
                },
            },
        },
    },
    plugins: [
        new VConsolePlugin({
            enable: IS_PROD_DEBUG,
        }),
    ],
};

module.exports = merge(baseConfig, prodConfig);
