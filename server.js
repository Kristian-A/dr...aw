var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");;
app.use(express.static('public'));

var io = require('socket.io')(server);

var users = [];

var permutations = [
	["drawer", "saboteur", "spectator"],
	["spectator", "drawer", "saboteur"],
	["saboteur", "spectator", "drawer"]
]

var currentPerm = Math.floor(Math.random()*(freeRoles.length));
function nextPerm() {
	currentPerm += 1;
	if (currentPerm > permutations.length - 1) {
		currentPerm = 0;
	}
	return permutations[currentPerm];
}

function events(socket) {
    console.log(socket.id + ' connected to the server.');
	var currentUser = {
    	id: socket.id,
    	score: 0,
    };
    users.push(currentUser);
    if (users.length == 3) {
    	var perm = nextPerm();
    	for (var i = 0; i < users.length; i++) {
    		var user = users[i];
    		data = {
    			role: perm[i];
    		}
    		io.sockets.socket(user.id).emit('role', data);
    	}
   	}
    ///console.log(users );
    socket.on('roundEnd', function() {
    	freeRoles = [1,2,3];
    });
    socket.on('addLine', function(data) {
    	socket.broadcast.emit('addLine', data);
    });

    socket.on('event', function(data) {
		socket.broadcast.emit('event', data);
    });

    socket.on()

    //socket.on('requestRole', )
}

io.sockets.on('connection', events);


