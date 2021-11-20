/**
 * page creator
 * @Options page-dir:[page-name] [--need-style]
 */
const fs = require('fs');
const { exit } = require('process');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { getAbsolutePath, getAppConfig, getDataTime } = require('./tool');

const APP_CONFIG = getAppConfig();
const ENTRY_PACK_TEMP = (entry, title, htmlname, template) => {
    return {
        chunks: [entry],
        title,
        htmlname,
        template,
    };
};

let pageDirName;
let args;
try {
    args = minimist(process.argv.slice(2), { boolean: ['need-style'] });
    pageDirName = args._[0].split(':');
    if (!pageDirName || !pageDirName.length) {
        throw 'error argv: page-dir:[page-name]\n';
    }
    if (pageDirName.some((item) => /[\u4e00-\u9fa5]/.test(item))) {
        throw 'error argv: not utf-8\n';
    }
} catch (error) {
    console.log(colors.red(error));
    exit();
}

let dirName;
if (pageDirName.length < 3) {
    dirName = nameStyleFormat.hyphen(pageDirName[0]);
} else {
    // multiple directory
    dirName = pageDirName
        .slice(0, pageDirName.length - 1)
        .reduce((totalDir, currentDir) => totalDir.concat([nameStyleFormat.hyphen(currentDir)]), [])
        .join('/');
}

const pageName = nameStyleFormat.camel(pageDirName.slice(-1)[0]);
const htmlName = nameStyleFormat.snake(pageName) + '.html';
const title = nameStyleFormat.hyphen(pageName);

const entryName = pageName + APP_CONFIG.entryExt;
const entryStyleName = pageName + APP_CONFIG.styleExt;
const entryPackName = pageName + '.json';

const dirPathName = getAbsolutePath(APP_CONFIG.page.dir, dirName);
const entryPathName = getAbsolutePath(APP_CONFIG.page.dir, dirName, entryName);
const entryStylePathName = getAbsolutePath(APP_CONFIG.page.dir, dirName, entryStyleName);
const entryPackPathName = getAbsolutePath(APP_CONFIG.page.dir, dirName, entryPackName);

const needStyle = process.env.npm_config_need_style || args['need-style'];

try {
    fs.statSync(entryPathName);
    console.log(colors.red(`[page-name] is exist: ${entryPathName}\n`));
    exit();
} catch (error) {}

try {
    fs.statSync(entryPackPathName);
    console.log(colors.red(`[page-pack] is exist: ${entryPackPathName}\n`));
    exit();
} catch (error) {}

if (needStyle) {
    try {
        fs.statSync(entryStylePathName);
        console.log(colors.red(`[page-style] is exist: ${entryStylePathName}\n`));
        exit();
    } catch (error) {}
}

fs.mkdir(dirPathName, { recursive: true }, (err) => {
    if (err) {
        console.log(colors.red('error mkdir: [page-dir]\n'));
        exit();
    }
    fs.writeFile(entryPathName, `/*\n * \n * ${getDataTime()}\n */\n`, {}, (err) => {
        if (err) {
            console.log(colors.red(`error writeFile: ${entryPathName}\n`));
        }
    });
    fs.writeFile(
        entryPackPathName,
        JSON.stringify(ENTRY_PACK_TEMP(entryName, title, htmlName, 'default.html'), null, '\t'),
        {},
        (err) => {
            if (err) {
                console.log(colors.red(`error writeFile: ${entryPackPathName}\n`));
            } else {
                console.log(colors.green(`new Page: './${dirName}/${pageName}',\n`));
            }
        }
    );
    needStyle && fs.writeFile(entryStylePathName, '', {}, (err) => {});
});
