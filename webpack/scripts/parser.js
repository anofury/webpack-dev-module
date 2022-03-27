/**
 * entry-config parser
 */
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const { IS_PROD, IS_PROD_DEBUG, getAbsolutePath, getAppConfig, generatorEntryCache } = require('./tool');

const APP_CONFIG = getAppConfig();
const pageList =
    !IS_PROD && !IS_PROD_DEBUG && APP_CONFIG['pages']['include'] && APP_CONFIG['pages']['include'].length
        ? APP_CONFIG['pages']['include']
        : APP_CONFIG['pages']['default'];
const entryConfigParseRet = [];

pageList.forEach((pagePathItem) => {
    let entryConfigList;
    const entryNameSplitIndex = pagePathItem.lastIndexOf('/');
    const entryConfigDir = pagePathItem.slice(0, entryNameSplitIndex + 1);
    const entryConfigName = pagePathItem.slice(entryNameSplitIndex + 1);
    const entryConfigPath = getAbsolutePath(entryConfigDir, entryConfigName + '.json');

    try {
        entryConfigList = require(entryConfigPath);
    } catch (error) {
        console.log(colors.red(`error entryConfig: ${entryConfigPath}\n`));
        exit();
    }

    if (!Array.isArray(entryConfigList)) {
        entryConfigList = [entryConfigList];
    }

    entryConfigList.forEach((entryConfigItem) => {
        let entryConfigParseItem = {};
        const entryConfigItemList = entryConfigItem['chunks'];

        entryConfigItemList.forEach((entryConfigItemListItem) => {
            const entryConfigItemSplitIndex = entryConfigItemListItem.lastIndexOf('.');
            const entryItemPath = getAbsolutePath(entryConfigDir, entryConfigItemListItem);
            const entryItemName = nameStyleFormat.camel(
                path.join(entryConfigDir, entryConfigItemListItem.slice(0, entryConfigItemSplitIndex))
            );

            try {
                fs.statSync(entryItemPath);
                entryConfigParseItem[entryItemName] = entryItemPath;
            } catch (error) {
                console.log(colors.red(`error entryConfigItem: ${entryItemPath}\n`));
                exit();
            }
        });

        if (Object.keys(entryConfigParseItem).length) {
            if (entryConfigParseRet.some((item) => item['htmlname'] === entryConfigItem['htmlname'])) {
                console.log(colors.red(`same htmlname: ${entryConfigItem['htmlname']}\n`));
                exit();
            }

            entryConfigItem['chunks'] = entryConfigParseItem;
            entryConfigParseRet.push(entryConfigItem);
        }
    });
});

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
