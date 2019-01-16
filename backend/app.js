/* eslint-disable no-process-env*/

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Article = require('./models/article');

const Category = require('./models/category');

const Subcategory = require('./models/subcategory');


// mongoose.connect('mongodb+srv://martinboykov:<PASSWORD>@cluster0-ekat5.mongodb.net/test?retryWrites=true')
mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER_NAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ekat5.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB database...'))
  .catch(() => console.log('Connection to MongoDB failed!'));

app.use(bodyParser.json());

// REMOVE CORSE HEADERS IF NOT REQUIRED IN CASE OF ONE ORIGIN (ONE_APP) DEPLOYMENT
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  next();
});


module.exports = app;
