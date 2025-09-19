require('dotenv').config();
const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const connectDB = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.services');
const httpServer = require('http').createServer(app);
// Connect to the database
connectDB();

initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
