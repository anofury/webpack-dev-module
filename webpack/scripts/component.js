/**
 * component creator
 * @Options comp-dir:[comp-name] [--need-style]
 */
const fs = require('fs');
const { exit } = require('process');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { getAbsolutePath, getAppConfig, getDataTime } = require('./tool');

const APP_CONFIG = getAppConfig();

let compDirName;
let args;
try {
    args = minimist(process.argv.slice(2), { boolean: ['need-style'] });
    compDirName = args._[0].split(':').slice(0, 2);
    if (!compDirName || !compDirName.length) {
        throw 'error argv: comp-dir:[comp-name]\n';
    }
    if (compDirName.some((item) => /[\u4e00-\u9fa5]/.test(item))) {
        throw 'error argv: not utf-8\n';
    }
} catch (error) {
    console.log(colors.red(error));
    exit();
}

const dirName = nameStyleFormat.pascal(compDirName[0]);
const compName = nameStyleFormat.pascal(compDirName[1] || dirName);

const compFileName = compName + APP_CONFIG.entryExt;
const compStyleName = compName + APP_CONFIG.styleExt;

const dirPathName = getAbsolutePath(APP_CONFIG.component, dirName);
const compFilePathName = getAbsolutePath(APP_CONFIG.component, dirName, compFileName);
const compStylePathName = getAbsolutePath(APP_CONFIG.component, dirName, compStyleName);

const needStyle = process.env.npm_config_need_style || args['need-style'];

try {
    fs.statSync(compFilePathName);
    console.log(colors.red(`[comp-name] is exist: ${compFilePathName}\n`));
    exit();
} catch (error) {}

if (needStyle) {
    try {
        fs.statSync(compStylePathName);
        console.log(colors.red(`[comp-style] is exist: ${compStylePathName}\n`));
        exit();
    } catch (error) {}
}

fs.mkdir(dirPathName, { recursive: true }, (err) => {
    if (err) {
        console.log(colors.red('error mkdir: [comp-dir]\n'));
        exit();
    }
    fs.writeFile(compFilePathName, `/*\n * \n * ${getDataTime()}\n */\n`, {}, (err) => {
        if (err) {
            console.log(colors.red(`error writeFile: ${compFilePathName}\n`));
        } else {
            console.log(colors.green(`new Component: ${dirName}/${compFileName} \n`));
        }
    });
    needStyle && fs.writeFile(compStylePathName, '', {}, (err) => {});
});
