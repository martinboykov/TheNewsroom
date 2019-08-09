/* eslint-disable no-process-env*/
const helmet = require('helmet');

const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

module.exports = ((app) => {
  const Fawn = require('fawn');

  Fawn.init(mongoose, 'fawn_transaction');
  app.use(bodyParser.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());

    app.use(compression());
  }

  if (process.env.NODE_ENV === 'development') {
    app.use(compression());
  }
});

