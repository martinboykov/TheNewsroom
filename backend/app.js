const express = require('express');

const app = express();

const bodyParser = require('body-parser');
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

app.get('/api/articles', (req, res, next) => {
  const articles = [
    {
      id: '1',
      title: 'First article',
      content: 'Some text coming from the server!',
    },
    {
      id: '2',
      title: 'Second article',
      content: 'Some text coming from the server!',
    },
  ];
  res.status(200).json({
    message: 'Articles fetched successfully',
    articles: articles,
  });
});

app.post('/api/articles', (req, res, next) => {
  const article = req.body;
  console.log(article);
  res.status(201).json({
    message: 'Article added successfully', // not neccessary
  });
});

module.exports = app;
