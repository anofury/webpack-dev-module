/**
 * page creator
 * @Options [-n, --name] [-t, --title] [--htmlname] [--template]
 */
const fs = require('fs');
const minimist = require('minimist');
const colors = require('colors');
const nameStyleFormat = require('naming-style');
const tool = require('./tool');

const parentDir = '../../';
const appConfig = require(parentDir + 'app.json');
const entryConfigTemplate = (entry, title, filename, template) => {
    return {
        entry: [entry],
        title,
        filename,
        template,
    };
};

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

const entryDirName = tool.getAbsolutePath(`${parentDir}${appConfig['pagePath']}/${entryConfigFormat.name}`);
const entryFileName = tool.getAbsolutePath(`${entryDirName}/${entryConfigFormat.entry}${appConfig['entryType']}`);
const entryCssFileName = tool.getAbsolutePath(`${entryDirName}/${entryConfigFormat.entry}${appConfig['styleType']}`);
const entryConfigFileName = tool.getAbsolutePath(
    `${entryDirName}/${tool.getEntryConfigFileName(entryConfigFormat.entry)}`
);

try {
    fs.statSync(entryDirName);
    console.log(colors.red(`entryDirName is exist: \n${entryDirName}`));
} catch (err) {
    // 1. create entryDir
    fs.mkdir(entryDirName, { recursive: true }, (err) => {
        if (err) {
            console.log(colors.red(`entryDir fail: \n${err}`));
        } else {
            // 2. create entryFile
            fs.writeFile(
                entryFileName,
                `/*\n * \n * ${tool.getDataTime()}\n */\nimport './${entryConfigFormat.entry}${
                    appConfig['styleType']
                }';\n`,
                {},
                (err) => {
                    if (err) {
                        console.log(colors.red(`entryFile fail: \n${err}`));
                    } else {
                        // 3. create entryConfigFile
                        entryConfigFormat.entry = `${entryConfigFormat.entry}${appConfig['entryType']}`;
                        entryConfigFormat.htmlName = entryConfigFormat.htmlName.includes('.html')
                            ? entryConfigFormat.htmlName
                            : `${entryConfigFormat.htmlName}.html`;
                        entryConfigFormat.template = entryConfigFormat.template.includes('.html')
                            ? entryConfigFormat.template
                            : `${entryConfigFormat.template}.html`;

                        const entryConfigData = JSON.stringify(
                            entryConfigTemplate(
                                entryConfigFormat.entry,
                                entryConfigFormat.title,
                                entryConfigFormat.htmlName,
                                entryConfigFormat.template
                            ),
                            null,
                            '\t'
                        );
                        fs.writeFile(entryConfigFileName, entryConfigData, {}, (err) => {
                            if (err) {
                                console.log(colors.red(`entryConfigFile fail: \n${err}`));
                            } else {
                                console.log(colors.green(`success.`));
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
