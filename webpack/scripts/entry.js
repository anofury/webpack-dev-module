/**
 * entry creator
 * @Options entry-dir:[entry-name] [--need-style]
 */
const fs = require('fs');
const { exit } = require('process');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');

const { getAbsolutePath, getAppConfig, getDataTime, addEntryConfig2AppConfig } = require('./tool');

const APP_CONFIG = getAppConfig();
const ENTRY_PACK_TEMP = (entry, title, htmlname, template) => {
    return {
        chunks: [entry],
        title,
        htmlname,
        template,
    };
};

let entryDirPathNameArr;
let args;
try {
    args = minimist(process.argv.slice(2), { boolean: ['need-style'] });
    if (!args._[0]) {
        throw 'error argv: entry-dir:[entry-name]\n';
    }
    entryDirPathNameArr = args._[0].split(':');
    if (!entryDirPathNameArr || !entryDirPathNameArr.length) {
        throw 'error argv: entry-dir:[entry-name]\n';
    }
    if (entryDirPathNameArr.some((item) => /[\u4e00-\u9fa5]/.test(item))) {
        throw 'error argv: only letters\n';
    }
} catch (error) {
    console.log(colors.red(error));
    exit();
}

let entryDirPathName;
if (entryDirPathNameArr.length < 3) {
    entryDirPathName = nameStyleFormat.hyphen(entryDirPathNameArr[0]);
} else {
    // multiple directory
    entryDirPathName = entryDirPathNameArr
        .slice(0, entryDirPathNameArr.length - 1)
        .reduce((totalDir, currentDir) => totalDir.concat([nameStyleFormat.hyphen(currentDir)]), [])
        .join('/');
}

const entryName = nameStyleFormat.camel(entryDirPathNameArr.slice(-1)[0]);
const htmlName = nameStyleFormat.snake(entryName) + '.html';
const title = nameStyleFormat.hyphen(entryName);

const entryFileName = entryName + APP_CONFIG['extension']['javascript'];
const entryStyleName = entryName + APP_CONFIG['extension']['stylesheet'];
const entryPackName = entryName + '.json';

const dirPathName = getAbsolutePath(APP_CONFIG['entry'], entryDirPathName);
const entryPathName = getAbsolutePath(APP_CONFIG['entry'], entryDirPathName, entryFileName);
const entryStylePathName = getAbsolutePath(APP_CONFIG['entry'], entryDirPathName, entryStyleName);
const entryPackPathName = getAbsolutePath(APP_CONFIG['entry'], entryDirPathName, entryPackName);

const needStyle = process.env.npm_config_need_style || args['need-style'];

try {
    fs.statSync(entryPathName);
    console.log(colors.red(`[entry-name] is exist: ${entryPathName}\n`));
    exit();
} catch (error) {}

try {
    fs.statSync(entryPackPathName);
    console.log(colors.red(`[entry-pack] is exist: ${entryPackPathName}\n`));
    exit();
} catch (error) {}

if (needStyle) {
    try {
        fs.statSync(entryStylePathName);
        console.log(colors.red(`[entry-style] is exist: ${entryStylePathName}\n`));
        exit();
    } catch (error) {}
}

fs.mkdir(dirPathName, { recursive: true }, (err) => {
    if (err) {
        console.log(colors.red('error mkdir: [entry-dir]\n'));
        exit();
    }
    fs.writeFile(entryPathName, `/*\n * \n * ${getDataTime()}\n */\n`, {}, (err) => {
        if (err) {
            console.log(colors.red(`error writeFile: ${entryPathName}\n`));
        }
    });
    fs.writeFile(
        entryPackPathName,
        JSON.stringify(ENTRY_PACK_TEMP(entryFileName, title, htmlName, 'default.html'), null, '\t'),
        {},
        (err) => {
            if (err) {
                console.log(colors.red(`error writeFile: ${entryPackPathName}\n`));
            } else {
                addEntryConfig2AppConfig(`'./${entryDirPathName}/${entryName}'`);
                console.log(colors.green(`new entry: '${APP_CONFIG['entry']}/${entryDirPathName}/${entryName}'\n`));
            }
        }
    );
    needStyle && fs.writeFile(entryStylePathName, '', {}, (err) => {});
});
