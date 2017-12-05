const http = require('http');
const app = require('./app');

// Basic Server Settings
const port = process.env.port || 3000;
const server = http.createServer(app);

// Listen to the Port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

