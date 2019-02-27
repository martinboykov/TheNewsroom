/* eslint-disable no-process-env*/
const redis = require('redis');
const client = redis.createClient();
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const redisMiddleware = (req, res, next) => {
  const key = HOST_ADDRESS + req.originalUrl || req.url;
  console.log(key);
  client.get(key, (error, reply) => {
    if (reply) {
      const result = JSON.parse(reply);
      return res.status(200).json({
        message: 'Data fetched successfully by redis',
        data: result,
      });
    }
    if (error) throw error;
    res.sendResponse = res.send;
    res.send = (body) => {
      const data = JSON.parse(body).data;
      client.setex(key, 3600, JSON.stringify(data));
      res.sendResponse(body);
    };
    return next();
  });
};
module.exports = { client, redisMiddleware };
// module.exports = { client, redisMiddleware };
