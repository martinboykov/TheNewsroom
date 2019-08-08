/* eslint-disable no-process-env*/
const http = require('http');
const app = require('./app');
const debug = require('debug')('debug');

const normalizePort = (val) => { // checks if env ports are valid numbers
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

const onError = (error) => {
  const addr = server.address();
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port); // port is reserved word in express
// Workers can share any TCP connection
// In this case it is an HTTP server
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);


// Using default node.js cluster module
// ------------------------------------
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// // const WORKERS = process.env.WEB_CONCURRENCY || 2;
// const WORKERS = 2;
// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   // Fork workers.
//   for (let i = 0; i < WORKERS; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   const normalizePort = (val) => { // checks if env ports are valid numbers
//     const port = parseInt(val, 10);
//     if (isNaN(port)) {
//       // named pipe
//       return val;
//     }
//     if (port >= 0) {
//       // port number
//       return port;
//     }
//     return false;
//   };

//   const onError = (error) => {
//     const addr = server.address();
//     if (error.syscall !== 'listen') {
//       throw error;
//     }
//     const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
//     switch (error.code) {
//       case 'EACCES':
//         console.error(bind + ' requires elevated privileges');
//         process.exit(1);
//         break;
//       case 'EADDRINUSE':
//         console.error(bind + ' is already in use');
//         process.exit(1);
//         break;
//       default:
//         throw error;
//     }
//   };

//   const onListening = () => {
//     const addr = server.address();
//     const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
//     debug('Listening on ' + bind);
//   };

//   const port = normalizePort(process.env.PORT || '3000');

//   app.set('port', port); // port is reserved word in express
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   const server = http.createServer(app);
//   server.on('error', onError);
//   server.on('listening', onListening);
//   server.listen(port);
//   console.log(`Worker ${process.pid} started`);
// }
