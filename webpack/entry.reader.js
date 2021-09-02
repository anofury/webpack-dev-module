/**
 * 读取 src/pages 下的目录，导出 entry 配置
 * 对于 htmlname 相同的 entry，合并成一个 chunks 并仅使用第一个入口配置
 */
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const { PAGE_PATH, ENTRY_CONFIG_FILE } = require('./creator.config');
const { INCLUDE_ENTRY_LIST, EXCLUDE_ENTRY_LIST } = require('../.entry');

let entryDirList = fs.readdirSync(PAGE_PATH);
const entryConfigList = [];

if (INCLUDE_ENTRY_LIST && INCLUDE_ENTRY_LIST.length) {
    // 使用配置的入口目录
    entryDirList = INCLUDE_ENTRY_LIST;
}

for (let entryDirItem of entryDirList) {
    if (EXCLUDE_ENTRY_LIST && EXCLUDE_ENTRY_LIST.length && EXCLUDE_ENTRY_LIST.includes(entryDirItem)) {
        // 指定目录不读取
        continue;
    }

    const entryConfigFileName = `${PAGE_PATH}/${entryDirItem}/${ENTRY_CONFIG_FILE}`;

    try {
        // 是否存在入口配置文件
        fs.statSync(entryConfigFileName);

        const entryConfig = require(entryConfigFileName);
        const entryFileName = `${PAGE_PATH}/${entryDirItem}/${entryConfig.entry}`;

        // 是否存在入口文件
        fs.statSync(entryFileName);

        entryConfigList.push(
            Object.assign({}, entryConfig, {
                entry: [entryConfig.entry.split('.')[0]],
                entrypath: [path.resolve(__dirname, entryFileName)],
            })
        );
    } catch (err) {
        console.log(colors.yellow(`未识别目录: ${entryDirItem}`));
    }
}

console.log(entryConfigList);

module.exports = entryConfigList;
