/* eslint-disable no-process-env*/
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const client = redis.createClient();

const redisMiddleware = async (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = HOST_ADDRESS + req.originalUrl || req.url;
  const reply = await client.getAsync(key);
  const result = JSON.parse(reply);
  if (reply) {
    console.log(key + ' fetched by redis');
    return res.status(200).json({
      message: 'Data fetched successfully by redis',
      data: result,
    });
  }
  res.sendResponse = res.send;
  res.send = async (body) => {
    console.log(key + ' fetched by mongodb');
    const data = JSON.parse(body).data;
    await client.setexAsync(key, 3600, JSON.stringify(data));
    res.sendResponse(body);
  };
  return next();
};
// return client.get(key, (error, reply) => {
//   if (error) throw new Error(error);
//   if (reply) {
//     console.log(key + ' fetched by redis');
//     const result = JSON.parse(reply);
//     return res.status(200).json({
//       message: 'Data fetched successfully by redis',
//       data: result,
//     });
//   }
//   res.sendResponse = res.send;
//   res.send = (body) => {
//     console.log(key + ' fetched by mongodb');
//     const data = JSON.parse(body).data;
//     client.setex(key, 3600, JSON.stringify(data));
//     res.sendResponse(body);
//   };
//   return next();
// });

module.exports = { client, redisMiddleware };
// module.exports = { client, redisMiddleware };


