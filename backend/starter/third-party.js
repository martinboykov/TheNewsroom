/* eslint-disable no-process-env*/
const debug = require('debug')('debug');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const limiterHandler = require('../middleware/limiter');
const slowDown = require('express-slow-down');
const limiter = slowDown({
  windowMs: 10 * 60 * 1000, // 10 minutes
  delayAfter: 1000, // allow 1000 requests per 10 minutes, then...
  delayMs: 100, // begin adding 100ms of delay per request above 1000:
  // request # 1001 is delayed by 100ms
  // request # 1002 is delayed by 200ms
  // request # 1003 is delayed by 300ms
  // etc.
});

//  apply to all requests

module.exports = ((app) => {
  const Fawn = require('fawn');

  Fawn.init(mongoose, 'fawn_transaction');
  app.use(bodyParser.json());
  app.use(cors());

  app.use('/api/mockIO', async function(req, res, next) {
    debug('pid', process.pid, 'handler start, blocking CPU');
    const loop = () => setTimeout(() => {
      debug('HTTP request finished');
    }, 10000);
    await loop();
    debug('pid', process.pid, 'handler end, blocking CPU');
    next();
  });
  app.use('/api/mockCPU', async function(req, res, next) {
    debug('pid', process.pid, 'handler start, blocking CPU');
    const loop = () => new Promise((resolve, reject) => {
      for (let i = 0; i <= 10e9; i += 1) {
        // CPU
      }
      resolve(debug('CPU finished the task'));
    });
    await loop();
    debug('pid', process.pid, 'handler end, blocking CPU');
    next();
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());

    app.use(compression());

    app.use(limiter, limiterHandler);
  }

  if (process.env.NODE_ENV === 'development') {
    app.use(compression());

    // app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
    app.use(limiter, limiterHandler);
  }
});

