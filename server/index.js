const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const ip = require("ip")

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});


app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('updateCounter', (newCounter) => {
  io.emit('counter', newCounter);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3001;

server.listen(port, ip.address(), () => {
  console.log(`Server is running on ${ip.address()}:${port}`);
});
