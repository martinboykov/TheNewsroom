require('newrelic'); // https://rpm.newrelic.com/accounts/2300349/applications/setup#nodejs
const express = require('express');

const app = express();

const path = require('path');

require('express-async-errors');

require('./starter/third-party')(app);

require('./starter/db')(app);

require('./starter/logging')(app);

require('./starter/routes')(app);

app.use('/api/mockIO', async function(req, res, next) {
  console.log('pid', process.pid, 'handler start, blocking CPU');
  const loop = () => setTimeout(() => {
    console.log('HTTP request finished');
  }, 10000);
  await loop();
  console.log('pid', process.pid, 'handler end, blocking CPU');
  next();
});
app.use('/api/mockCPU', async function(req, res, next) {
  console.log('pid', process.pid, 'handler start, blocking CPU');
  const loop = () => new Promise((resolve, reject) => {
    for (let i = 0; i <= 10e9; i += 1) {
      // CPU
    }
    resolve(console.log('CPU finished the task'));
  });
  await loop();
  console.log('pid', process.pid, 'handler end, blocking CPU');
  next();
});

// for one-app on heroku deployment
// app.use('/', express.static(path.join(__dirname, '/angular')));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, 'angular', 'index.html'));
// });

module.exports = app;
