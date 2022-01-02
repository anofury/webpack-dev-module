const fs = require('fs');
const os = require('os');
const path = require('path');

const APP_CONFIG_NAME = 'app.config.js';

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
    return require(getAbsolutePath(APP_CONFIG_NAME));
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
 * 获取entry、html配置
 * @returns
 */
const getEntryHtml = () => {
    return require('./parser');
};
/**
 * 生成entry配置文件
 * @param {String} content
 */
const generatorEntryCache = (content) => {
    fs.writeFile(getAbsolutePath(getAppConfig()['extension']['entryoutput']), content, {}, (err) => {});
};
/**
 * 为app.config.js增加entry配置文件路径
 * @param {*} entryDir 页面配置文件路径
 */
const addEntryConfig2AppConfig = (entryDir) => {
    // TODO
    entryDir = ('' + entryDir || '').trim();

    if (!entryDir) return;

    const appConfigString = fs.readFileSync(getAbsolutePath(APP_CONFIG_NAME), { encoding: 'utf8' });
    const appConfigArr = appConfigString.split(os.EOL);
    // console.log(appConfigString);
    // console.log(
    //     appConfigString.match(
    //         new RegExp(`module:\\s+\\{(${os.EOL}|.)*\\}`)
    //     )
    // );
};

addEntryConfig2AppConfig('./sds/sdsds/dsd');

module.exports = {
    IS_PROD: process.env.npm_lifecycle_event === 'build-app',
    IS_PROD_DEBUG: process.env.npm_lifecycle_event === 'build-app-debug',
    getAppConfig,
    getAbsolutePath,
    getDataTime,
    getEntryHtml,
    generatorEntryCache,
    addEntryConfig2AppConfig,
};
