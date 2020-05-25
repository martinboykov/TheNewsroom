/* eslint-disable no-process-env*/
const winston = require('winston');
const debug = require('debug')('debug');
const mongoose = require('mongoose');
let mongoURI = '';
if (process.env.NODE_ENV === 'production') {
  mongoURI = `mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`;
} else if (process.env.NODE_ENV === 'staging') {
  mongoURI = `mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`;
} else if (process.env.NODE_ENV === 'development') {
  mongoURI = `mongodb://localhost:27017/TheNewsroom`;
}
const redis = require('./../middleware/redis.js').redisMiddleware;
const client = require('./../middleware/redis.js').client;
module.exports = ((app) => {
  const mongooseConnection = mongoose.connect(mongoURI, {
    // options are set uppon: https://mongoosejs.com/docs/deprecations.html
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });
  if (process.env.NODE_ENV === 'production') {
    mongooseConnection.then(() => {
      winston.info('Connected to MongoDB database...');
      mongoose.set('autoIndex', false);
    });
    client.on('connect', function() {
      winston.info('Redis client connected');
    });
    // we already are catching the errors with winston.uncoughterror.....
    app.use(redis);
  }
  if (process.env.NODE_ENV === 'development') {
    mongooseConnection.then(() => {
      debug('Connected to MongoDB database...');
      // mongoose.set('debugs', true);
    });
    client.on('connect', function() {
      debug('Redis client connected');
    });
    client.on('error', function(err) {
      debug('Something went wrong ' + err);
    });
    app.use(redis);
  }
});
