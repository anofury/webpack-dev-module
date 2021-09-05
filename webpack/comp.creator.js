/**
 * 根据命令行参数, 新建组件文件及文件夹，并放置 src/components 下
 * @Options [-n, --name] [-t, --title] [--author]
 */
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { prefix } = require('./creator.template');
const { COMP_PATH, CSS_EXT, ENTRY_EXT, AUTHOR, PREFIX } = require('./creator.config');

const argvs = process.argv;
const argvsFormated = minimist(argvs.slice(2));

const argvsCompName = (argvsFormated._[0] || argvsFormated.n || argvsFormated.name || '').trim();
const argvsTitle = argvsFormated._[1] || argvsFormated.t || argvsFormated.title || argvsCompName;
const argvsAuthor = argvsFormated.author || AUTHOR || os.hostname();

if (!argvsCompName) {
    console.log(colors.red('缺少必要参数：\nname: 组件文件名\n'));
    return;
}

const compConfig = {
    name: nameStyleFormat.pascal(argvsCompName),
    title: /[\u4e00-\u9fa5]/.test(argvsTitle) ? argvsTitle : nameStyleFormat.pascal(argvsTitle),
    author: argvsAuthor,
};

const compDirName = path.resolve(__dirname, `${COMP_PATH}/${compConfig.name}`);
const compFileName = path.resolve(__dirname, `${compDirName}/${compConfig.name}${ENTRY_EXT}`);
const compCssFileName = path.resolve(__dirname, `${compDirName}/${compConfig.name}${CSS_EXT}`);

const now = new Date();
now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
const date = now.toISOString().replace(/\-/g, '/').replace(/\T/, ' ').slice(0, 19);
const compPrefix = PREFIX ? prefix(compConfig.title, compConfig.author, date) : '';

try {
    fs.statSync(compDirName);
    console.log(colors.red(`文件夹已存在: \n${compDirName}\n`));
} catch (err) {
    // 1. 创建组件目录
    fs.mkdir(compDirName, { recursive: true }, (err) => {
        if (err && err.code === 'EEXIST') {
            console.log(colors.red(`文件夹已存在: \n${compDirName}\n`));
        } else if (err) {
            console.log(colors.red(`文件夹创建失败: \n${err}\n`));
        } else {
            // 2. 创建组件文件
            fs.writeFile(compFileName, compPrefix + `\n\nimport './${compConfig.name}${CSS_EXT}';\n\n`, {}, (err) => {
                if (err) {
                    console.log(colors.red(`组件文件创建失败: \n${err}\n`));
                } else {
                    console.log(colors.green(`组件文件创建成功.\n`));
                }
            });
            // 创建样式文件
            fs.writeFile(compCssFileName, '', {}, (err) => {});
        }
    });
}
