/**
 * entry-config parser
 */
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const tool = require('./tool');

const parentDir = '../../';
let appConfig;

try {
    appConfig = require(parentDir + 'app.json');
} catch (err) {
    console.log(colors.red(`The configuration file must be in JSON format: app.json`));
    return;
}

let entryDirList = fs.readdirSync(tool.getAbsolutePath(parentDir + appConfig['pagePath']));
let entryConfigList = [];

if (appConfig['entryIncludeList'] && appConfig['entryIncludeList'].length) {
    // using config if exit
    entryDirList = appConfig['entryIncludeList'];
}

for (let entryDirItem of entryDirList) {
    let entryDirStat;

    try {
        entryDirStat = fs.statSync(tool.getAbsolutePath(`${parentDir}${appConfig['pagePath']}/${entryDirItem}`));
    } catch (err) {
        console.log(colors.yellow(`no such file or directory : ${entryDirItem}`));
        continue;
    }

    if (!entryDirStat.isDirectory()) {
        // non folder
        continue;
    }
    if (
        appConfig['entryExcludeList'] &&
        appConfig['entryExcludeList'].length &&
        appConfig['entryExcludeList'].includes(entryDirItem)
    ) {
        // specify directory will not be parsed
        continue;
    }

    const entryConfigFileName = `${parentDir}${appConfig['pagePath']}/${entryDirItem}/${tool.getEntryConfigFileName(
        entryDirItem
    )}`;

    try {
        // if exit entry-config
        fs.statSync(tool.getAbsolutePath(entryConfigFileName));

        const entryConfig = require(entryConfigFileName);
        const entryFormat = [entryConfig['entry']].reduce((acc, val) => acc.concat(val), []);
        const entryConcat = [];

        for (let entryItem of entryFormat) {
            const entryFileName = `${parentDir}${appConfig['pagePath']}/${entryDirItem}/${entryItem}`;

            // if exit entry
            fs.statSync(tool.getAbsolutePath(entryFileName));

            entryConcat.push({
                [entryItem.split('.')[0]]: path.resolve(__dirname, entryFileName),
            });
        }

        const newEntryConfig = {
            ...entryConfig,
            entry: entryConcat,
        };

        entryConfigList.push(newEntryConfig);
    } catch (err) {
        console.log(colors.yellow(`ignore: ${entryDirItem}`));
    }
}

// save entry parser result
tool.entryCacheGenerator(JSON.stringify(entryConfigList, null, '\t'));

module.exports = entryConfigList;
