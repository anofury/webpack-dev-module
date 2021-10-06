/**
 * 读取 src/pages 下的目录，导出 entry 配置
 */
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const { PAGE_PATH, ENTRY_CONFIG_FILE } = require('./creator.config');
const { INCLUDE_ENTRY_LIST, EXCLUDE_ENTRY_LIST } = require('../../.entry');

let entryDirList = fs.readdirSync(PAGE_PATH);
const entryConfigList = [];

if (INCLUDE_ENTRY_LIST && INCLUDE_ENTRY_LIST.length) {
    // 使用配置的入口目录
    entryDirList = INCLUDE_ENTRY_LIST;
}

for (let entryDirItem of entryDirList) {
    const entryDirStat = fs.statSync(`${PAGE_PATH}/${entryDirItem}`);

    if (!entryDirStat.isDirectory()) {
        // 非文件夹
        continue;
    }
    if (EXCLUDE_ENTRY_LIST && EXCLUDE_ENTRY_LIST.length && EXCLUDE_ENTRY_LIST.includes(entryDirItem)) {
        // 指定目录不读取
        continue;
    }

    const entryConfigFileName = `${PAGE_PATH}/${entryDirItem}/${ENTRY_CONFIG_FILE}`;

    try {
        // 是否存在入口配置文件
        fs.statSync(entryConfigFileName);

        const entryConfig = require(entryConfigFileName);
        const entryFormat = [entryConfig['entry']].reduce((acc, val) => acc.concat(val), []);
        const entryConcat = [];

        for (let entryItem of entryFormat) {
            const entryFileName = `${PAGE_PATH}/${entryDirItem}/${entryItem}`;

            // 是否存在入口文件
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

console.log(JSON.stringify(entryConfigList));

module.exports = entryConfigList;
