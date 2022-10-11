const app = require('./app');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

const http = require('http');

const server = http.createServer(app);

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen({ port: process.env.PORT || 3000 }, () => {
    console.log(`Server ${process.pid} is running on port ${port}`);
  });
}

// app.listen((PORT = 8080), () => {
//   console.log(`Server running on port ${PORT}`);
// });
