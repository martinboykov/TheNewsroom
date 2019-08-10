/* eslint-disable no-process-env*/
const debug = require('debug')('debug');

const speedLitimerHandler = (req, res, next) => {
  // app.use(limiter);
  if (req.slowDown.remaining === 1) {
    console.log(req.slowDown.remaining);
    debug(req.slowDown);
    return res.status(429).json({
      message: 'Too Many Requests.fhfghfghfghgfhfgh',
      data: req.slowDown,
    });
  }
  return next();
};

module.exports = speedLitimerHandler;
