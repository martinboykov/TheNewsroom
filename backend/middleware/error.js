const winston = require('winston');
const debug = require('debug')('debug');

module.exports = function(err, req, res, next) {
  // Log the error/exeption inside of express
  if (process.ENV === 'production') {
    winston.logger.error(err.message, err);
  } else { // process.ENV === 'development'
    debug(err.message, err);
  }

  // Send res to client
  return res.status(500).json({ message: 'Something failed' });
};
