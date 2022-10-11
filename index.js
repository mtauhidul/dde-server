const app = require('./app');
const http = require('http');

const server = http.createServer(app);

app.listen((PORT = 8080), () => {
  console.log(`Server running on port ${PORT}`);
});
