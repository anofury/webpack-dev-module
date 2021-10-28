/**
 * page creator
 * @Options [-n, --name] [-t, --title] [--htmlname] [--template]
 */
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const tool = require('./tool');

const parentDir = '../../';
const appConfig = tool.jsonParser(path.resolve(__dirname, parentDir + 'app.json'));
const entryConfigTemplate = (entry, title, filename, template) => `{
    "entry": ["${entry}"],
    "title": "${title}",
    "filename": "${filename}",
    "template": "${template}"
}`;

const argvs = process.argv;
const argvsFormated = minimist(argvs.slice(2));

// parser argvs
const argvsName = (argvsFormated._[0] || argvsFormated.n || argvsFormated.name || '').trim();
const argvsTitle = argvsFormated._[1] || argvsFormated.t || argvsFormated.title || argvsName;
const argvsHtmlName = argvsFormated._[2] || argvsFormated.htmlname || argvsName;
const argvsTemplate = argvsFormated._[3] || argvsFormated.template || appConfig['defaultTemplate'];

if (!argvsName) {
    console.log(colors.red('missing param: entry name\n'));
    return;
}

const entryConfigFormat = {
    name: nameStyleFormat.hyphen(argvsName), // join with `-`
    entry: nameStyleFormat.camel(argvsName), // camel
    title: /[\u4e00-\u9fa5]/.test(argvsTitle) ? argvsTitle : nameStyleFormat.hyphen(argvsTitle),
    htmlName: nameStyleFormat.snake(argvsHtmlName),
    template: argvsTemplate,
};

const entryDirName = path.resolve(__dirname, `${parentDir}${appConfig['pagePath']}/${entryConfigFormat.name}`);
const entryFileName = path.resolve(__dirname, `${entryDirName}/${entryConfigFormat.entry}${appConfig['entryType']}`);
const entryCssFileName = path.resolve(__dirname, `${entryDirName}/${entryConfigFormat.entry}${appConfig['styleType']}`);
const entryConfigFileName = path.resolve(__dirname, `${entryDirName}/${appConfig['entryConfigFile']}`);

try {
    fs.statSync(entryDirName);
    console.log(colors.red(`entryDirName is exist: \n${entryDirName}\n`));
} catch (err) {
    // 1. create entryDir
    fs.mkdir(entryDirName, { recursive: true }, (err) => {
        if (err) {
            console.log(colors.red(`entryDir fail: \n${err}\n`));
        } else {
            // 2. create entryFile
            fs.writeFile(
                entryFileName,
                `/*\n * \n * ${tool.getDataTime()}\n */\nimport './${entryConfigFormat.entry}${appConfig['styleType']}';\n\n`,
                {},
                (err) => {
                    if (err) {
                        console.log(colors.red(`entryFile fail: \n${err}\n`));
                    } else {
                        // 3. create entryConfigFile
                        entryConfigFormat.entry = `${entryConfigFormat.entry}${appConfig['entryType']}`;
                        entryConfigFormat.htmlName = entryConfigFormat.htmlName.includes('.html')
                            ? entryConfigFormat.htmlName
                            : `${entryConfigFormat.htmlName}.html`;
                        entryConfigFormat.template = entryConfigFormat.template.includes('.html')
                            ? entryConfigFormat.template
                            : `${entryConfigFormat.template}.html`;

                        const entryConfigData = entryConfigTemplate(
                            entryConfigFormat.entry,
                            entryConfigFormat.title,
                            entryConfigFormat.htmlName,
                            entryConfigFormat.template
                        );
                        fs.writeFile(entryConfigFileName, entryConfigData, {}, (err) => {
                            if (err) {
                                console.log(colors.red(`entryConfigFile fail: \n${err}\n`));
                            } else {
                                console.log(colors.green(`success.\n`));
                            }
                        });
                    }
                }
            );
            // create style
            fs.writeFile(entryCssFileName, '', {}, (err) => {});
        }
    });
}
