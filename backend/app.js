/* eslint-disable no-process-env*/

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postRoutes = require('./routes/post');

const subcategoryController = require('./routes/subcategory');

const categoryController = require('./routes/category');

const tagController = require('./routes/tag');

const Fawn = require('Fawn');

Fawn.init(mongoose, 'fawn_transaction');

/* eslint-disable no-max-len*/
mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB database...'))
  .catch((err) => console.log('Connection to MongoDB failed!', err));

app.use(bodyParser.json());

// REMOVE CORSE HEADERS IF NOT REQUIRED IN CASE OF ONE ORIGIN (ONE_APP) DEPLOYMENT
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token'); // eslint-disable-line max-len
  next();
});

app.use('/api/posts', postRoutes);

app.use('/api/subcategories', subcategoryController);

app.use('/api/categories', categoryController);

app.use('/api/tags', tagController);

module.exports = app;
