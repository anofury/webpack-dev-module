const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const VConsolePlugin = require('vconsole-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { IS_PROD_DEBUG } = require('./scripts/tool');

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name]_[contenthash:8].js',
        assetModuleFilename: 'assets/[name]_[contenthash:8][ext]',
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
            new CssMinimizerPlugin({
                parallel: true,
            }),
        ],
        moduleIds: 'deterministic',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    // name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    minChunks: 2,
                    minSize: 0,
                },
                commons: {
                    chunks: 'all',
                    // name: 'commons',
                    test: /\.(ts|tsx|js|jsx)/,
                    priority: -10,
                    minChunks: 2,
                    minSize: 0,
                },
            },
        },
        // runtimeChunk: true,
    },
    plugins: [
        new VConsolePlugin({
            enable: IS_PROD_DEBUG,
        }),
    ],
};

module.exports = merge(baseConfig, prodConfig);
