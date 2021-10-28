/**
 * entry-config parser
 */
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const tool = require('./tool');

const parentDir = '../../';
const appConfig = tool.jsonParser(path.resolve(__dirname, parentDir + 'app.json'));

let entryDirList = fs.readdirSync(parentDir + appConfig['pagePath']);
const entryConfigList = [];

if (appConfig['entryIncludeList'] && appConfig['entryIncludeList'].length) {
    // using config if exit
    entryDirList = appConfig['entryIncludeList'];
}

for (let entryDirItem of entryDirList) {
    const entryDirStat = fs.statSync(`${parentDir}${appConfig['pagePath']}/${entryDirItem}`);

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

    const entryConfigFileName = `${parentDir}${appConfig['pagePath']}/${entryDirItem}/${appConfig['entryConfigFile']}`;

    try {
        // if exit entry-config
        fs.statSync(entryConfigFileName);

        const entryConfig = tool.jsonParser(entryConfigFileName);
        const entryFormat = [entryConfig['entry']].reduce((acc, val) => acc.concat(val), []);
        const entryConcat = [];

        for (let entryItem of entryFormat) {
            const entryFileName = `${parentDir}${appConfig['pagePath']}/${entryDirItem}/${entryItem}`;

            // if exit entry
            fs.statSync(entryFileName);

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
        console.log(colors.yellow(`未识别目录: ${entryDirItem}`));
    }
}

module.exports = entryConfigList;
