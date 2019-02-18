const express = require('express');

const app = express();

// const path = require('path');

require('express-async-errors');

require('./starter/third-party')(app);

require('./starter/db')();

require('./starter/logging')(app);

// app.use('/', express.static(path.join(__dirname, '/angular')));

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

require('./starter/routes')(app);

module.exports = app;
