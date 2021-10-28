/**
 * component creator
 * @Options [-n, --name]
 */
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const tool = require('./tool');

const parentDir = '../../';
const appConfig = tool.jsonParser(path.resolve(__dirname, parentDir + 'app.json'));

const argvs = process.argv;
const argvsFormated = minimist(argvs.slice(2));

const argvsCompName = (argvsFormated._[0] || argvsFormated.n || argvsFormated.name || '').trim();

if (!argvsCompName) {
    console.log(colors.red('missing param: component name\n'));
    return;
}

const compConfigFormat = {
    name: nameStyleFormat.pascal(argvsCompName),
};

const compDirName = path.resolve(__dirname, `${parentDir}${appConfig['compPath']}/${compConfigFormat.name}`);
const compFileName = path.resolve(__dirname, `${compDirName}/${compConfigFormat.name}${appConfig['entryType']}`);
const compCssFileName = path.resolve(__dirname, `${compDirName}/${compConfigFormat.name}${appConfig['styleType']}`);

try {
    fs.statSync(compDirName);
    console.log(colors.red(`compDir is exist: \n${compDirName}\n`));
} catch (err) {
    // 1. create compDir
    fs.mkdir(compDirName, { recursive: true }, (err) => {
        if (err && err.code === 'EEXIST') {
            console.log(colors.red(`compDir is exist: \n${compDirName}\n`));
        } else if (err) {
            console.log(colors.red(`compDir fail: \n${err}\n`));
        } else {
            // 2. create compFile
            fs.writeFile(
                compFileName,
                `/*\n * \n * ${tool.getDataTime()}\n */\n\n\nimport './${compConfigFormat.name}${appConfig['styleType']}';\n\n`,
                {},
                (err) => {
                    if (err) {
                        console.log(colors.red(`compFile fail: \n${err}\n`));
                    } else {
                        console.log(colors.green(`success.\n`));
                    }
                }
            );
            // create style
            fs.writeFile(compCssFileName, '', {}, (err) => {});
        }
    });
}
