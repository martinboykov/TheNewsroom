/* eslint-disable no-process-env*/
const redis = require('redis');
const HOST_ADDRESS = process.env.HOST_ADDRESS;
const client = redis.createClient();

const redisMiddleware = (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = HOST_ADDRESS + req.originalUrl || req.url;
  return client.get(key, (error, reply) => {
    if (reply) {
      console.log(key + ' fetched by redis');
      const result = JSON.parse(reply);
      return res.status(200).json({
        message: 'Data fetched successfully by redis',
        data: result,
      });
    }
    if (error) throw new Error(error);
    res.sendResponse = res.send;
    res.send = (body) => {
      console.log(key + ' fetched by mongodb');
      const data = JSON.parse(body).data;
      client.setex(key, 3600, JSON.stringify(data));
      res.sendResponse(body);
    };
    return next();
  });
};
module.exports = { client, redisMiddleware };
// module.exports = { client, redisMiddleware };
