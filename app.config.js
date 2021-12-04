module.exports = {
    page: {
        dir: './src/pages',
        items: [
            // 业务模块列表
            './test-1/entry',
            // 业务模块
            './test-2/page3',
        ],
    },
    window: {
        mainColor: '#FDCF4A',
        mainTapColor: '#F6B816',
    },
    template: './src/templates',
    component: './src/components',
    util: './src/utils',
    static: './static',
    mock: './_mocks_',
    dist: './dist',
    styleExt: '.less',
    entryExt: '.js',
    entryCache: '.entrycache',
};
