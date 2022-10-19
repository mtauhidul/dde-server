const http = require('http');
const app = require('./app');
require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

const server = http.createServer(app);

const port = process.env.PORT || 3001;

// Clusters

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen(port, () => {
    console.log(`Server ${process.pid} is running on port ${port}`);
  });
}

// Clustered server
