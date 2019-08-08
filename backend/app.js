require('newrelic'); // https://rpm.newrelic.com/accounts/2300349/applications/setup#nodejs
const express = require('express');

const app = express();

const path = require('path');

// REMOVE CORSE HEADERS IF NOT REQUIRED IN CASE OF ONE ORIGIN (ONE_APP) DEPLOYMENT
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token'); // eslint-disable-line max-len
  next();
});

require('express-async-errors');

require('./starter/third-party')(app);

require('./starter/db')(app);

require('./starter/logging')(app);

require('./starter/routes')(app);

app.use('/api/mockIO', function(req, res, next) {
  console.log('pid', process.pid, 'handler start, blocking CPU');
  for (let i = 0; i <= 10e9; i += 1) {
    // I/O block
  }
  console.log('pid', process.pid, 'handler end, blocking CPU');
  next();
});

// for one-app on heroku deployment
// app.use('/', express.static(path.join(__dirname, '/angular')));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, 'angular', 'index.html'));
// });

module.exports = app;
