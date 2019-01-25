const winston = require('winston');
const debug = require('debug')('debug');

module.exports = function(err, req, res, next) {
  // Log the exeption inside of express
  if (process.ENV === 'production') {
    winston.error(err.message, err);
  }
  if (process.ENV === 'development') {
    debug(err.message, err);
  }

  // Send to client
  return res.status(500).json({ message: 'Something failed' });
};
