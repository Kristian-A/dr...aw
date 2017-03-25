var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");;
app.use(express.static('public'));

var io = require('socket.io')(server);

var ids = [];

function events(socket) {
    console.log(socket.id + ' connected to the server.');
    io.to(socket.id).emit('id', socket.id);

    socket.on('addLine', function(data) {
        socket.broadcast.emit('addLine', data);
    });

    socket.on('event', function(data) {
      socket.broadcast.emit('event', data);
    });
}
io.sockets.on('connection', events);