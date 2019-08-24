/* eslint-disable no-process-env*/
const debug = require('debug')('debug');

const speedLimiterHandler = (req, res, next) => {
  // app.use(limiter);
  if (req.slowDown.remaining === 1) {
    debug(req.slowDown);
    return res.status(429).json({
      message: 'Too Many Requests.',
      data: req.slowDown,
    });
  }
  return next();
};

module.exports = speedLimiterHandler;
