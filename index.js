// server.js
const http = require("http");
const app = require("./app");

require('dotenv').config();

// Use environment variable or default to port 3000
const PORT = process.env.PORT_NUMBER || 3001;

// Create and start the server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
