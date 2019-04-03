/* eslint-disable no-process-env*/
const helmet = require('helmet');

const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

module.exports = ((app) => {
  const Fawn = require('Fawn');

  Fawn.init(mongoose, 'fawn_transaction');
  app.use(bodyParser.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());

    app.use(compression());
  }

  if (process.env.NODE_ENV === 'development') {
    // ..
    // app.use(fakeUser);
    app.use(compression());
  }
});

// function fakeUser(req, res, next) {
//   req.user = {
//     name: 'Dummy name',
//     _id: '111111111111111111111111',
//   };
//   return next();
// }
