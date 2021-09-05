// webpack 使用
// 存在 _entry_.js 且 entry 配置正确的文件夹为入口文件夹
module.exports = {
    // 入口文件名，string | string[]
    entry: ['testPage1.js', 'moreEntry1.js', 'moreEntry2.jsx'],
    // html标题
    title: 'test-page-1',
    // html文件名
    filename: 'test_page_1.html',
    // 使用模板
    template: 'default.html',
}
