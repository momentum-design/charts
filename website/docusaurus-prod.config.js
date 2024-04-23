const app = require('./app.config');
const doc = require('./docusaurus');

// if you want to serve the site locally with live server, please use '/build/' instead.
app.baseUrl = '/charts/';
app.staticDirectories = ['static'];
module.exports = doc.getConfig(app);