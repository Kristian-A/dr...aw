var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

var io = require('socket.io')(server);

function events(socket) {
    console.log(socket.id + ' connected to the server.');
    io.to(socket.id).emit('id', socket.id);

    socket.on('mouse', function(data) {
        socket.broadcast.emit('mouse', data);
    });

    socket.on('event', function(data) {
      socket.broadcast.emit('event', data);
    });
}

io.sockets.on('connection', events);