const fs = require('fs');

const jsonParser = (filename) => {
    let parsetRet = {};

    try {
        const readFileRet = fs.readFileSync(filename, { encoding: 'utf8' });

        parsetRet = JSON.parse(readFileRet);
    } catch (err) {}

    return parsetRet;
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

module.exports = {
    jsonParser,
    getDataTime,
};
