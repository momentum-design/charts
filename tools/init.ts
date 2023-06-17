const path = require('path');
const cli = require('@bndynet/cli');

cli.print(cli.styles.info(`
# This utility will walk you through creating a package.json file.
# It only covers the most common items, and tries to guess sensible defaults.

# Use "npm i"  to install the default packages.
`));

cli.questions(['Your package name:', 'Your package description:', 'Author name:', 'Author email:', 'Git repository url:']).then((answers: any[]) => {
  const pkgName = answers[0];
  const libName = pkgName.indexOf('/') > 0 ? pkgName.split('/')[1].toLowerCase() : pkgName.toLowerCase();
  const pkgDescription = answers[1].trim();
  const username = answers[2].trim();
  const useremail = answers[3].trim();
  const repoUrl = answers[4].trim();
  const pkgJson = JSON.parse(cli.readFile(path.resolve(__dirname, '..', 'package.json')));

  pkgJson.name = pkgName;
  pkgJson.version = '0.0.0-dev';
  pkgJson.description = pkgDescription;
  pkgJson.main = `dist/${libName}.umd.js`;
  pkgJson.module = `dist/${libName}.es5.js`;
  if (username) {
    pkgJson.author.name = username;
  }
  if (useremail) {
    pkgJson.author.email = useremail;
  }
  pkgJson.repository.url = repoUrl;

  cli.startSection('init project');

  cli.log('prepare CHANGELOG.md ...')
  cli.writeFile(path.resolve(__dirname, '..', 'CHANGELOG.md'), '', () => {});
  cli.success('done');

  const pkgContent = JSON.stringify(pkgJson, null, 2);
  cli.log('generate package.json ...')
  cli.writeFile(path.resolve(__dirname, '..', 'package.json'), pkgContent, () => {});
  cli.success('done');

  cli.log('generate project site ...');
  const templateIndexFilePath = path.resolve(__dirname, '../_templates', 'index.html');
  const indexFilePath = path.resolve(__dirname, '../site', 'index.html');
  let siteIndexHtml = cli.readFile(templateIndexFilePath);
  siteIndexHtml = siteIndexHtml
    .replace(/{{package.name}}/g, pkgJson.name)
    .replace(/{{package.subname}}/g, libName)
    .replace(/{{package.repository.url}}/g, pkgJson.repository.url);
  cli.writeFile(indexFilePath, siteIndexHtml, () => {});
  cli.success('done');

  cli.log('install dependencies ...');
  cli.beginRun('npm i', (code: number) => {
    code === 0 && cli.success('Your project is ready.')
    cli.print('');
   });
});
