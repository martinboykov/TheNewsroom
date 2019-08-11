/* eslint-disable no-process-env*/
const debug = require('debug')('debug');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
let client;
if (process.env.NODE_ENV === 'production') {
  // redis REDIS HEROKU
  // ...................
  // client = redis.createClient(process.env.REDIS_URL);

  // redis REDIS LABS
  // ...................
  client = redis.createClient(
    process.env.REDISCLOUD_URL,
    {
      no_ready_check: true,
    });
}
if (process.env.NODE_ENV === 'development') {
  // redis REDIS LOCAL
  // ...................
  client = redis.createClient();
  // client = redis.createClient({
  //   port: process.env.REDIS_HOST_PORT, // replace with your port
  //   host: process.env.REDIS_HOST_IP, // replace with your hostanme or IP address');
  //   retry_strategy: function(options) {
  //     if (options.error && options.error.code === 'ECONNREFUSED') {
  //       // End reconnecting on a specific error and flush all commands with
  //       // a individual error
  //       return new Error('The server refused the connection');
  //     }
  //     if (options.total_retry_time > 1000 * 60 * 60) {
  //       // End reconnecting after a specific timeout and flush all commands
  //       // with a individual error
  //       return new Error('Retry time exhausted');
  //     }
  //     if (options.attempt > 10) {
  //       // End reconnecting with built in error
  //       return 'undefined';
  //     }
  //     // reconnect after
  //     return Math.min(options.attempt * 100, 3000);
  //   },
  // });
}

// JSON parse/stringify =>
// CPU >>>>>>>>>>>>>
const redisMiddleware = async (req, res, next) => {
  if (!client.connected) return next();
  if (req.method !== 'GET') return next();
  const key = process.env.HOST_ADDRESS + req.originalUrl || req.url;
  const reply = await client.getAsync(key);
  const result = JSON.parse(reply);
  if (reply) {
    debug(key + ' fetched by redis');
    return res.status(200).json({
      message: 'Data fetched successfully by redis',
      data: result,
    });
  }
  res.sendResponse = res.send;
  res.send = async (body) => {
    debug(key + ' fetched by mongodb');
    const data = JSON.parse(body).data;
    await client.setexAsync(key, 3600, JSON.stringify(data));
    res.sendResponse(body);
  };
  return next();
};

module.exports = { client, redisMiddleware };
