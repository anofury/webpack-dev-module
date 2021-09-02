module.exports = {
    // 打包存放目录
    DIST_PATH: '../dist',
    // 入口目录
    PAGE_PATH: '../src/pages',
    // 组件目录
    COMP_PATH: '../src/components',
    // 通过import引用的公共静态资源
    STATIC_PATH: '../static',
    // 会使用CopyWebpackPlugin复制到DIST，除.html文件
    TEMPLATE_PATH: '../template',
    // 入口配置文件名
    ENTRY_CONFIG_FILE: '_entry_.js',
    // 模板文件
    TEMPLATE: 'default.html',
    // 创建者
    AUTHOR: 'anofury',
    // 样式文件后缀
    CSS_EXT: '.less',
    // 文件后缀
    ENTRY_EXT: '.js',
    // 设置入口文件前缀
    PREFIX: false,
};
