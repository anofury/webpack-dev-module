const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { getAbsolutePath, getAppConfig, getEntryHtml } = require('./scripts/tool');
const { entry, html } = getEntryHtml();
const APP_CONFIG = getAppConfig();

module.exports = {
    entry,
    context: path.resolve(__dirname, '../'),
    output: {
        clean: true,
        path: getAbsolutePath(APP_CONFIG['dist']),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]',
        pathinfo: false,
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif|bmp)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024,
                    },
                },
            },
            {
                test: /\.(svg)/i,
                type: 'asset/inline',
                generator: {
                    dataUrl: (content) => {
                        content = content.toString();
                        return svgToMiniDataURI(content);
                    },
                },
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.less$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(sass|scss)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    // {
                    //     loader: 'thread-loader',
                    //     options: {
                    //         workerParallelJobs: 2,
                    //     },
                    // },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        ...html.map(
            (item) =>
                new HtmlWebPackPlugin({
                    chunks: item['chunks'],
                    chunksSortMode: 'manual',
                    title: item['title'],
                    filename: item['htmlname'],
                    template: getAbsolutePath(APP_CONFIG['template'], item['template']),
                    timestamp: new Date().getTime(),
                    scriptLoading: 'blocking',
                    meta: {
                        // for mobile
                        viewport:
                            'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover,shrink-to-fit=no',
                        'theme-color': APP_CONFIG['window']['mainColor'],
                    },
                    minify: {
                        collapseWhitespace: true,
                        removeComments: true,
                        minifyCSS: true,
                        minifyJS: true,
                    },
                })
        ),
        new CopyWebpackPlugin({
            patterns: [
                {
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ['**/*.html'],
                    },
                    from: getAbsolutePath(APP_CONFIG['static']),
                    to: getAbsolutePath(APP_CONFIG['dist']),
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['jsx', '.js'],
        alias: {
            '@comp': getAbsolutePath(APP_CONFIG['component']),
            '@util': getAbsolutePath(APP_CONFIG['util']),
            '@mocks': getAbsolutePath(APP_CONFIG['mock']),
        },
    },
};
