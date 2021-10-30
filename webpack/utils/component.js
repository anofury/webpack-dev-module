/**
 * component creator
 * @Options [-n, --name]
 */
const fs = require('fs');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const tool = require('./tool');

const parentDir = '../../';
const appConfig = require(parentDir + 'app.json');

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

const compDirName = tool.getAbsolutePath(`${parentDir}${appConfig['compPath']}/${compConfigFormat.name}`);
const compFileName = tool.getAbsolutePath(`${compDirName}/${compConfigFormat.name}${appConfig['entryType']}`);
const compCssFileName = tool.getAbsolutePath(`${compDirName}/${compConfigFormat.name}${appConfig['styleType']}`);

try {
    fs.statSync(compDirName);
    console.log(colors.red(`compDir is exist: \n${compDirName}`));
} catch (err) {
    // 1. create compDir
    fs.mkdir(compDirName, { recursive: true }, (err) => {
        if (err && err.code === 'EEXIST') {
            console.log(colors.red(`compDir is exist: \n${compDirName}`));
        } else if (err) {
            console.log(colors.red(`compDir fail: \n${err}`));
        } else {
            // 2. create compFile
            fs.writeFile(
                compFileName,
                `/*\n * \n * ${tool.getDataTime()}\n */\nimport './${compConfigFormat.name}${
                    appConfig['styleType']
                }';\n\n`,
                {},
                (err) => {
                    if (err) {
                        console.log(colors.red(`compFile fail: \n${err}`));
                    } else {
                        console.log(colors.green(`success.`));
                    }
                }
            );
            // create style
            fs.writeFile(compCssFileName, '', {}, (err) => {});
        }
    });
}
