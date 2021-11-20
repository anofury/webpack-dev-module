const getDataTime = () => {
    const now = new Date();
    let nowRet = now.toLocaleString();

    try {
        now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
        nowRet = now.toISOString().replace(/\-/g, '/').replace(/\T/, ' ').slice(0, 19);
    } catch (err) {}

    return nowRet;
};

export default getDataTime;
