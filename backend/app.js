/* eslint-disable no-process-env*/
require('express-async-errors');

const debug = require('debug')('debug');

const morgan = require('morgan');

const winston = require('winston');

const error = require('./middleware/error');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postRoutes = require('./routes/post');

const subcategoryController = require('./routes/subcategory');

const categoryController = require('./routes/category');

const tagController = require('./routes/tag');

const Fawn = require('Fawn');

Fawn.init(mongoose, 'fawn_transaction');

if (app.get('env') === 'production') {
  mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useCreateIndex: true, useNewUrlParser: true }) // eslint-disable-line max-len
    .then(() => winston.info('Connected to MongoDB database...'));
  winston.add(winston.transports.File, { filename: './backend/logfile.log' });
  const exeptionsLogger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        json: true,
      }),
      new winston.transports.File({
        filename: './backend/uncaughtException.log',
        handleExceptions: true,
        json: true,
      }),
    ],
    exitOnError: false,
  });
  exeptionsLogger.error('Exceptionlogger initiated');
  process.on('unhandledRejection', (ex) => { // for async code outside express
    throw ex;
  });
}

if (app.get('env') === 'development') {
  mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useCreateIndex: true, useNewUrlParser: true }) // eslint-disable-line max-len
    .then(() => debug('Connected to MongoDB database...'));
  app.use(morgan('tiny'));
  process.on('uncaughtException', (ex) => { // for sync code outside express
    debug(ex);
  });
  process.on('unhandledRejection', (ex) => { // for async code outside express
    debug(ex);
  });
}

app.use(bodyParser.json());

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

app.use('/api/posts', postRoutes);

app.use('/api/subcategories', subcategoryController);

app.use('/api/categories', categoryController);

app.use('/api/tags', tagController);

app.use(error);

module.exports = app;
