const fs = require('fs');
const path = require('path');

/**
 * 获取绝对路径
 * @param {String} dir 相对路径
 * @returns
 */
const getAbsolutePath = (...dir) => {
    return path.resolve(__dirname, '../../', ...dir);
};
/**
 * 获取项目配置
 * @returns
 */
const getAppConfig = () => {
    return require(getAbsolutePath('app.config.js'));
};
/**
 * 获取当前格式化时间
 * @returns
 */
const getDataTime = () => {
    const now = new Date();
    let nowRet = now.toLocaleString();

    try {
        now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
        nowRet = now.toISOString().replace(/\-/g, '/').replace(/\T/, ' ').slice(0, 19);
    } catch (err) {}

    return nowRet;
};
/**
 * 生成entry配置文件
 * @param {String} content
 */
const generatorEntryCache = (content) => {
    fs.writeFile(getAbsolutePath(getAppConfig().entryCache), content, {}, (err) => {});
};
/**
 * 获取entry、html配置
 * @returns
 */
const getEntryHtml = () => {
    return require('./parser');
};

module.exports = {
    getAppConfig,
    getAbsolutePath,
    getDataTime,
    generatorEntryCache,
    getEntryHtml,
};
