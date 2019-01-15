/* eslint-disable no-process-env*/
const http = require('http');
const app = require('./backend/app');

const port = process.env.PORT || '3000';

app.set('port', port); // port is reserved word in express

const server = http.createServer(app);
server.listen(port, () => console.log(`Server is listening on port: ${port}`));
