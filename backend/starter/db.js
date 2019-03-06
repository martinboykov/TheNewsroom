/* eslint-disable no-process-env*/
const winston = require('winston');
const debug = require('debug')('debug');
const mongoose = require('mongoose');
const MONGO_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`;
const redis = require('./../middleware/redis.js').redisMiddleware;
const client = require('./../middleware/redis.js').client;
module.exports = ((app) => {
  mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
    .then(() => {
      if (process.env.NODE_ENV === 'production') {
        winston.info('Connected to MongoDB database...');
        mongoose.set('autoIndex', false);
      }
      if (process.env.NODE_ENV === 'development') {
        debug('Connected to MongoDB database...');
        // mongoose.set('debug', true);
      }
    });
  client.on('connect', function() {
    debug('Redis client connected');
  });
  // client.on('error', function(err) {
  //   debug('Something went wrong ' + err);
  // });
  app.use(redis);
});
