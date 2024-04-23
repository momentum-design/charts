const fs = require('fs');
const sh = require('shelljs');

sh.echo('⚑ gh-pages preparing...');

const fileGettingStarted = './website/docs/tutorials/getting-started.md';
sh.cp('README.md', fileGettingStarted);
let data = fs.readFileSync(fileGettingStarted, 'utf8');
data = data.replace(
  '# @momentum-design/charts',
  `---
sidebar_position: 1
---

# Getting Started`,
);
fs.writeFileSync(fileGettingStarted, data);


const fileChangelog = `./website/blog/CHANGELOG.md`;
sh.cp('CHANGELOG.md', fileChangelog);
data = fs.readFileSync(fileChangelog, 'utf8');
data = data.replace(/(#+\s)/gi, '#$1');
data = `# Changelog

` + data;
fs.writeFileSync(fileChangelog, data);

sh.echo(`✔ done at ${new Date().toISOString()}`);
