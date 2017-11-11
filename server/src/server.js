var Dispatcher = require('./Dispatcher').Dispatcher
var lights = require('./lights')
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);
console.log("Server started on port 8000")

io.on('connection', function (socket) {
  console.log("Client Connected")
  socket.emit('connected', {});
  socket.on('CHANGE_LIGHT', function (state) {
    Dispatcher.next({
      action: 'CHANGE_LIGHT',
      value: state,
    })
    io.emit('LIGHT', state)
  });
});
