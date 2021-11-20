/**
 * entry-config parser
 */
const fs = require('fs');
const { exit } = require('process');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { getAppConfig, getAbsolutePath, generatorEntryCache } = require('./tool');

const APP_CONFIG = getAppConfig();
const pageDir = APP_CONFIG.page.dir;
const pageList = APP_CONFIG.page.items;
const entryConfigParseRet = [];

for (let index = 0; index < pageList.length; index++) {
    let entryConfig;
    let entryConfigParseItem = {};
    const pagePathItem = pageList[index];
    const entryNameSplitIndex = pagePathItem.lastIndexOf('/');
    const entryDir = pagePathItem.slice(0, entryNameSplitIndex + 1);
    const entryName = pagePathItem.slice(entryNameSplitIndex + 1);
    const entryConfigPath = getAbsolutePath(pageDir, entryDir, entryName + '.json');

    try {
        entryConfig = require(entryConfigPath);
    } catch (error) {
        console.log(colors.red(`error entryConfig: ${entryConfigPath}\n`));
        exit();
    }

    const entryConfigItemList = entryConfig['chunks'];
    for (let entryIdx = 0; entryIdx < entryConfigItemList.length; entryIdx++) {
        const entryConfigItem = entryConfigItemList[entryIdx];
        const entryConfigItemSplitIndex = entryConfigItem.lastIndexOf('.');
        const entryItemName = nameStyleFormat.camel(entryConfigItem.slice(0, entryConfigItemSplitIndex));
        const entryItemPath = getAbsolutePath(pageDir, entryDir, entryConfigItem);

        try {
            fs.statSync(entryItemPath);
            entryConfigParseItem[entryItemName] = entryItemPath;
        } catch (error) {
            console.log(colors.red(`error entryConfigItem: ${entryItemPath}\n`));
            exit();
        }
    }

    entryConfig['chunks'] = entryConfigParseItem;

    entryConfigParseRet.push(entryConfig);
}

// save entry-config to disk
generatorEntryCache(JSON.stringify(entryConfigParseRet, null, '\t'));

const entryConfigParseCopy = JSON.parse(JSON.stringify(entryConfigParseRet));
const entry = entryConfigParseCopy.reduce((totalEntry, currentEntry) => {
    return { ...totalEntry, ...currentEntry['chunks'] };
}, {});
const html = entryConfigParseCopy.reduce((totalEntry, currentEntry) => {
    currentEntry['chunks'] = Object.keys(currentEntry['chunks']);
    return totalEntry.concat([currentEntry]);
}, []);

module.exports = { entry, html };
