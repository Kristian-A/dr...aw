var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");;
app.use(express.static('public'));

var io = require('socket.io')(server);

var users = [];
var cachedRoles = [];

var lastTime = new Date().getTime();

var fill = 100;
var tries;

var permutations = [
	["drawer", "traitor", "spectator"],
	["spectator", "drawer", "traitor"],
	["traitor", "spectator", "drawer"]
]

var currentPerm = Math.floor(Math.random()*3);
function nextPerm() {
	currentPerm += 1;
	if (currentPerm > permutations.length - 1) {
		currentPerm = 0;
	}
	return permutations[currentPerm];
}


var perm = nextPerm();
var i = 0;

function events(socket) {
    console.log(socket.id + ' connected to the server.');
	var currentUser = {
    	id: socket.id,
    	score: 0,
    	role: null
    };
    users.push(currentUser); 
    if (cachedRoles.length != 0) {
		data = {
			role: cachedRoles[0]
		}
		currentUser.role = cachedRoles[0];
		cachedRoles.splice(0, 1);
    }
    else {
	   	data = {
			role: perm[i]
		}
		currentUser.role = perm[i];
	}
	
    console.log(currentUser.role);
	io.to(currentUser.id).emit('role', data);
    i++;	
    if (users.length == 3) {
        var data = {
            status: "playing"
        }
        io.sockets.emit('status', data);
   	}
    ///console.log(users );

    socket.on('addLine', function(data) {
    	socket.broadcast.emit('addLine', data);
    });

    socket.on('event', function(data) {
		socket.broadcast.emit('event', data);
    });

    socket.on('tries', function() {
        var dataTries = {
            tries: 3
        }
        io.sockets.emit('tries', dataTries);
    });

    function swapPlayers() {
    	for (var i = 0; i < users.length; i++) {
    		if (users[i].role == 'traitor') { 
    			users[i].role = 'drawer';
    			data = {
    				role: 'drawer'
    			}
    			io.to(users[i].id).emit('role', data);
    		}
    		else if (users[i].role == 'drawer') {
    			users[i].role = 'traitor';
    			data = {
    				role: 'traitor'
    			}
    			io.to(users[i].id).emit('role', data);
    		}
    	}
    	fill = 100;
    	return fill;
    }

    function checkLevel() {
    	if (fill < 0) {
    		fill = 0;
            var data = {
                status: "guessing"
            }
            var dataTries = {
                tries: 3
            }
            io.sockets.emit('status', data);
            io.sockets.emit('tries', dataTries);

            ///guessWord();		
    	}
    	var data = {
    		fill: fill
    	};
    	return data;
    }

    socket.on('swap', function() {
        swapPlayers();
        var data = {
            status: "playing"
        }
        io.sockets.emit('status', data);
    });

    socket.on('jarDrainTime', function() {
        var currentTime = new Date().getTime();
        var val;
        if (currentTime - lastTime > 100) {
            lastTime = currentTime;
			val = 0.3;
        } 
        else {
			val = 0;
        } 
        fill -= val;

        io.sockets.emit('jarDrainTime', checkLevel());
    });

    socket.on('jarDrainLine', function(data) {
    	fill -= data.val;
    
        io.sockets.emit('jarDrainLine', checkLevel());
    });
    socket.on('disconnect', function() {
    	for(var j = 0; j < users.length; j++) {
    		if (socket.id == users[j].id) {
    			cachedRoles.push(users[j].role);
    			users.splice(j, 1);
    		}
    	}
    	i--;
    });
    //socket.on('requestRole', )
}

io.sockets.on('connection', events);


