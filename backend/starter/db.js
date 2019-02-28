/* eslint-disable no-process-env*/
const winston = require('winston');
const debug = require('debug')('debug');
const mongoose = require('mongoose');
const MONGO_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`;

module.exports = (() => {
  mongoose.set('debug', true);
  mongoose.connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => {
      if (process.env.NODE_ENV === 'production') {
        winston.info('Connected to MongoDB database...');
      }
      if (process.env.NODE_ENV === 'development') {
        debug('Connected to MongoDB database...');
      }
    });
});
