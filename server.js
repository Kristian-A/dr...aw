var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");;
app.use(express.static('public'));

var io = require('socket.io')(server);

var users = [];
var cachedRoles = [];

var lastTime = new Date().getTime();

var fill = 100;
var tries = 3;
var wordList = ['bird', 'plane', 'apple', 'horse', 'rabbit',
'table', 'chair'];
var word;

var permutations = [
	["drawer", "traitor", "spectator"],
	["spectator", "drawer", "traitor"],
	["traitor", "spectator", "drawer"]
]

function generateWord(words) {
   var index = Math.floor(Math.random()*(words.length-1));
   return wordList[index];
}
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

word = generateWord(wordList);
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
        console.log(word);
        io.sockets.emit('status', data);
   	}
    ///console.log(users );

    socket.on('correctWord', function() {
        data = {word: word};
        io.sockets.emit('correctWord', data);
    });

    socket.on('addLine', function(data) {
    	socket.broadcast.emit('addLine', data);
    });

    socket.on('event', function(data) {
		socket.broadcast.emit('event', data);
    });

    socket.on('guess', function (data) {
        var w = '';
        for (var i = 0; i < data.word.length; i++) {
            w += data.word[i];
        }

        if (w == word) {
            console.log('pozna');
            for (var i = 0; i < users.length; i++) {
                if (users[i].role == 'drawer') {
                    users[i].score += 2;
                }
                else if(users[i].role == 'spectator') {
                    users[i].score += 1;
                }
            }

            perm = nextPerm();
            for (var i = 0; i < users.length; i++) {
                users[i].role = perm[i];
                data = {
                    role: users[i].role
                }
                io.to(users[i].id).emit('role', data);
            }
            fill = 100;
            io.sockets.emit('status', {status: 'playing'});
            io.sockets.emit('clearCanvas');
            while (true) {
                var newWord = generateWord(wordList);
                if (word != newWord) {
                    word = newWord;
                    break;
                }
            }
        }   
        else {
            tries -= 1;
            if (tries == 0) {
                console.log(tries);
                swapPlayers();
                var data = {
                    status: "playing"
                }
                io.sockets.emit('status', data);
                tries = 3;
            }
        }

    });

    socket.on('word', function(data) {
        io.sockets.emit('word', data);
    });

    socket.on('tries', function() {
        var data = {
            tries: tries
        };
        io.sockets.emit('tries', data);
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
 
            io.sockets.emit('status', data);

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


