// 入口文件前缀
const prefix = (title, author, date) => `/*
* Created by ${author} on ${date}
* ${title}
*/
`;

// 入口配置文件
const entry = (entry, title, filename, template) => `// webpack 使用
// 存在 _entry_.js 且 entry 配置正确的文件夹为入口文件夹
module.exports = {
    // 入口文件名
    entry: '${entry}',
    // html标题
    title: '${title}',
    // html文件名
    filename: '${filename}',
    // 使用模板
    template: '${template}',
}
`;

module.exports = {
    prefix,
    entry,
};
