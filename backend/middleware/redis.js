/* eslint-disable no-process-env*/
const redis = require('redis');
const client = redis.createClient();
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const redisMiddleware = (req, res, next) => {
  const key = HOST_ADDRESS + req.originalUrl || req.url;
  client.get(key, async (error, reply) => {
    if (reply) {
       console.log(key + 'fetched by redis');
      const result = await JSON.parse(reply);
      return res.status(200).json({
        message: 'Data fetched successfully by redis',
        data: result,
      });
    }
    if (error) throw error;
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
