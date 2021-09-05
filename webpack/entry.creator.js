/**
 * 根据命令行参数,使用 entry.template.js 模板文件新建入口文件及文件夹，并放置 src/pages 下
 * @Options [-n, --name] [-t, --title] [--htmlname] [--template] [--author]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { prefix, entry } = require('./creator.template');
const { PAGE_PATH, ENTRY_CONFIG_FILE, CSS_EXT, ENTRY_EXT, AUTHOR, TEMPLATE, PREFIX } = require('./creator.config');

const argvs = process.argv;
const argvsFormated = minimist(argvs.slice(2));

// 读取命令行参数
const argvsName = (argvsFormated._[0] || argvsFormated.n || argvsFormated.name || '').trim();
const argvsTitle = argvsFormated._[1] || argvsFormated.t || argvsFormated.title || argvsName;
const argvsHtmlName = argvsFormated.htmlname || argvsName;
const argvsTemplate = argvsFormated.template || TEMPLATE;
const argvsAuthor = argvsFormated.author || AUTHOR || os.hostname();

if (!argvsName) {
    console.log(colors.red('缺少必要参数：\nname: 入口文件夹名\n'));
    return;
}

// 格式化命令行参数
const entryConfig = {
    name: nameStyleFormat.hyphen(argvsName), // 文件夹使用-连接
    entry: nameStyleFormat.camel(argvsName), // 入口文件使用首字母小写的驼峰式
    title: /[\u4e00-\u9fa5]/.test(argvsTitle) ? argvsTitle : nameStyleFormat.hyphen(argvsTitle),
    htmlName: nameStyleFormat.snake(argvsHtmlName),
    template: argvsTemplate,
    author: argvsAuthor,
};

const entryDirName = path.resolve(__dirname, `${PAGE_PATH}/${entryConfig.name}`);
const entryFileName = path.resolve(__dirname, `${entryDirName}/${entryConfig.entry}${ENTRY_EXT}`);
const entryCssFileName = path.resolve(__dirname, `${entryDirName}/${entryConfig.entry}${CSS_EXT}`);
const entryConfigFileName = path.resolve(__dirname, `${entryDirName}/${ENTRY_CONFIG_FILE}`);

const now = new Date();
now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
const date = now.toISOString().replace(/\-/g, '/').replace(/\T/, ' ').slice(0, 19);
const entryPrefix = PREFIX ? prefix(entryConfig.title, entryConfig.author, date) : '';

try {
    fs.statSync(entryDirName);
    console.log(colors.red(`文件夹已存在: \n${entryDirName}\n`));
} catch (err) {
    // 1. 创建入口目录
    fs.mkdir(entryDirName, { recursive: true }, (err) => {
        if (err) {
            console.log(colors.red(`文件夹创建失败: \n${err}\n`));
        } else {
            // 2. 创建入口目录文件
            fs.writeFile(entryFileName, entryPrefix + `\n\nimport './${entryConfig.entry}${CSS_EXT}';\n\n`, {}, (err) => {
                if (err) {
                    console.log(colors.red(`入口文件创建失败: \n${err}\n`));
                } else {
                    // 3. 创建入口配置文件
                    entryConfig.entry = `${entryConfig.entry}${ENTRY_EXT}`;
                    entryConfig.htmlName = entryConfig.htmlName.includes('.html')
                        ? entryConfig.htmlName
                        : `${entryConfig.htmlName}.html`;
                    entryConfig.template = entryConfig.template.includes('.html')
                        ? entryConfig.template
                        : `${entryConfig.template}.html`;

                    const entryConfigData = entry(
                        entryConfig.entry,
                        entryConfig.title,
                        entryConfig.htmlName,
                        entryConfig.template
                    );
                    fs.writeFile(entryConfigFileName, entryConfigData, {}, (err) => {
                        if (err) {
                            console.log(colors.red(`入口配置文件模板创建失败: \n${err}\n`));
                        } else {
                            console.log(colors.green(`入口创建成功.\n`));
                        }
                    });
                }
            });
            // 创建样式文件
            fs.writeFile(entryCssFileName, '', {}, (err) => {});
        }
    });
}
