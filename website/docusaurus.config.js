const app = require('./app.config');
const doc = require('./docusaurus');

module.exports = doc.getConfig(app);
