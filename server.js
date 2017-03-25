var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");;
app.use(express.static('public'));

var io = require('socket.io')(server);

var users = [];

var lastTime = new Date().getTime();

var permutations = [
	["drawer", "saboteur", "spectator"],
	["spectator", "drawer", "saboteur"],
	["saboteur", "spectator", "drawer"]
]

var currentPerm = Math.floor(Math.random()*3);
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
    			role: perm[i]
    		}
            console.log(i + " " + perm[i]);
    		io.to(user.id).emit('role', data);
    	}
        data = {};
        io.sockets.emit('start', data);
   	}
    ///console.log(users );

    socket.on('addLine', function(data) {
    	socket.broadcast.emit('addLine', data);
    });

    socket.on('event', function(data) {
		socket.broadcast.emit('event', data);
    });

    socket.on('jarDrainTime', function() {
        var currentTime = new Date().getTime();
        if (currentTime - lastTime > 100) {
            lastTime = currentTime;
            data = {
                val: 0.3
            }
        } 
        else {
            data = {
                val: 0
            }
        } 
        io.sockets.emit('jarDrainTime', data);
    });

    socket.on('jarDrainLine', function(data) {
        socket.broadcast.emit('jarDrainLine', data);
    });
    //socket.on('requestRole', )
}

io.sockets.on('connection', events);


