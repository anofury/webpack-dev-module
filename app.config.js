module.exports = {
    page: {
        dir: './src/pages',
        items: [
            // 业务模块
            './test-1/test-sub-1/page1',
            './test-1/test-sub-2/page2',
            // 业务模块
            './test-2/page3',
        ],
    },
    window: {
        mainColor: '#F0392F',
        mainTapColor: '#F0392F',
    },
    component: './src/components',
    template: './src/templates',
    static: './static',
    dist: './dist',
    styleExt: '.less',
    entryExt: '.js',
    entryCache: '.entry', // entry解析结果缓存文件
};
