const fs = require('fs');
const path = require('path');
const nameStyleFormat = require('naming-style');

const getAbsolutePath = (dir) => {
    return path.resolve(__dirname, dir);
};

const getDataTime = () => {
    const now = new Date();
    let nowRet = now.toLocaleString();

    try {
        now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
        nowRet = now.toISOString().replace(/\-/g, '/').replace(/\T/, ' ').slice(0, 19);
    } catch (err) {}

    return nowRet;
};

const getEntryConfigFileName = (dirname) => {
    return nameStyleFormat.camel(dirname) + '.json';
};

const entryCacheGenerator = (content) => {
    fs.writeFile(getAbsolutePath('../.entry'), content, {}, (err) => {});
};

module.exports = {
    getAbsolutePath,
    getDataTime,
    getEntryConfigFileName,
    entryCacheGenerator,
};
