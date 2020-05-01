// require('newrelic'); // https://rpm.newrelic.com/accounts/2300349/applications/setup#nodejs
const express = require('express');

const app = express();

const path = require('path');

require('express-async-errors');

require('./starter/third-party')(app);

require('./starter/db')(app);

require('./starter/logging')(app);

require('./starter/routes')(app);

// for one-app deployment
// app.use('/', express.static(path.join(__dirname, '/angular')));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, 'angular', 'index.html'));
// });

module.exports = app;
