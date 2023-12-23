const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

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
  console.log('conter updated');
  io.emit('counter', newCounter);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3001;

server.listen(port, '192.168.137.1', () => {
  console.log(`Server is running on port ${port}`);
});
