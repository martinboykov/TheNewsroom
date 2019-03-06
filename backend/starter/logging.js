/* eslint-disable no-process-env*/
const debug = require('debug')('debug');

const morgan = require('morgan');

const winston = require('winston');

module.exports = ((app) => {
  if (process.env.NODE_ENV === 'production') {
    winston.add(winston.transports.File, { filename: './backend/logfile.log' });
    const exeptionsLogger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          json: true,
        }),
        new winston.transports.File({
          filename: './backend/uncaughtException.log',
          handleExceptions: true,
          json: true,
        }),
      ],
      exitOnError: false,
    });
    exeptionsLogger.info('Exceptionlogger initiated');
    process.on('unhandledRejection', (ex) => { // for async code outside express
      throw ex;
    });
  }

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
    process.on('uncaughtException', (ex) => { // for sync code outside express
      debug(ex);
    });
    process.on('unhandledRejection', (ex) => { // for async code outside express
      debug(ex);
    });
  }
});
