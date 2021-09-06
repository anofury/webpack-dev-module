// 入口文件前缀
const prefix = (title, author, date) => `/*
* Created by ${author} on ${date}
* ${title}
*/
`;

// 入口配置文件
const entry = (entry, title, filename, template) => `// For Webpack
module.exports = {
    // string | string[]
    entry: '${entry}',
    title: '${title}',
    filename: '${filename}',
    template: '${template}',
}
`;

module.exports = {
    prefix,
    entry,
};
