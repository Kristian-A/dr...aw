var socket;
var id;

var currentColor, currentWeight;
var lines = [];
var SCRwidth, SCRheight;
var canvasWidth, canvasHeight;
var click;

var resetPos = false;
var prevX, prevY;

var palette;
var slider;
var jar;
var input;
<<<<<<< HEAD
var deb1;
=======
>>>>>>> origin/master

var fillPercentage;

var role;
var status = "loading";
<<<<<<< HEAD
var tries;

var correctWord;
=======
var tries = 3;
>>>>>>> origin/master

function setup() {
   SCRwidth = screen.width - screen.width*0.012;
   SCRheight = screen.height - screen.height*0.17;

   canvas = createCanvas(SCRwidth, SCRheight);

   startWidth = SCRwidth*0.3;
   endHeight = SCRheight*0.8;


   socket = io.connect('http://192.168.0.105:3000');
   
   //events
   socket.on('id', function(data) {
      id = data;
   })

   socket.on('role', function(data) {
      if (data.role == 'drawer') {
         role = new Drawer();
      }
      else if (data.role == 'traitor') {
         role = new Traitor();
      }
      else {
         role = new Spectator();
      }

      console.log(role);
   });

   socket.on('turnEnd', function() {
      if (!(role instanceof Spectator)) {

      }
   });

   socket.on('addLine', function(data) {
    	var el = new Line(data.startPos.x, data.startPos.y, data.endPos.x, data.endPos.y, data.weight, data.color);
		lines.push(el);
   });

   socket.on('event', function(data) {
      if (data.inf == 'mouseReleased') {
         resetPos = true;
      }
      else if (data.inf == 'slider') {
         slider.move(data.sliderX);
      }
      else if(data.inf == 'switchColor') {
      	currentColor = data.color;
      }
   });

   socket.on('status', function(data) {
      status = data.status;
<<<<<<< HEAD
   });

   socket.on('tries', function(data) {
      tries = data.tries;
   });

   socket.on('word', function(data) {
      input.currentWord = data.word;
      console.log(input.currentWord);
   })

   socket.on('correctWord', function(data) {
      if (role instanceof Drawer || role instanceof Traitor) {
         correctWord = data.word;
      } 
      else {
         correctWord = null;
      }
   });

   socket.on('clearCanvas', function() {
      lines = [];
   });
=======
   });

   socket.on('tries', function(data) {
      tries = data.tries;
   });

>>>>>>> origin/master

   function drainFill(data) {
      fillPercentage = data.fill;
   }

   socket.on('jarDrainTime', drainFill);

   socket.on('jarDrainLine', drainFill);

   palette = new ColorBox(width - width*0.18, height - height*0.165, width*0.15);
   slider = new Slider(width - width*0.5, height - height*0.11, 6, 50, width*0.25);
   jar = new Jar(width*0.054, height*0.35, width*0.2);
<<<<<<< HEAD
   input = new InputBox(0, 0, width*0.4);
   deb1 = new Debuff("textures/button-outline.png", width*0.5, height*0.11, 100);
=======
   input = new InputBox(0, 0, width*0.4, "zdr");
>>>>>>> origin/master
   currentColor = [255, 255, 255];
   currentWeight = slider.getValue();

}

function draw() {
<<<<<<< HEAD
   socket.emit('tries');
   socket.emit('correctWord');
=======

>>>>>>> origin/master
   if (status == "playing") {
      role.draw();
      socket.emit('jarDrainTime');
   }
   else if (status == "guessing") {
      role.draw();
      input.show();
   }
<<<<<<< HEAD

   if (correctWord) {
      fill(0, 255, 255);
      text(correctWord, width*0.2, height*0.8);
   }
   deb1.use();
   deb1.stop();
=======
>>>>>>> origin/master
}


function mousePressed() {
   if(status == "playing") {
      role.mousePressed();
   }
}

function mouseReleased() {
   click = false;
   resetPos = true;
   data = {
      inf: 'mouseReleased'
   };
   socket.emit('event', data);
   if (role instanceof Traitor) {
      console.log(role);
      role.mouseReleased();
   }
}

function keyTyped() {
<<<<<<< HEAD
   if (role instanceof Spectator) {
      role.keyTyped();
   }
=======
   role.keyTyped();
>>>>>>> origin/master
}
//Other

function dynamicBackground() {
   fill(47);
   noStroke();
   strokeWeight(2);
   beginShape();
   vertex(0, 0);
   vertex(SCRwidth*0.3, 0);
   vertex(SCRwidth*0.3, SCRheight*0.8);
   vertex(SCRwidth, SCRheight*0.8);
   vertex(SCRwidth, SCRheight);
   vertex(0, SCRheight);
   endShape();
}

function onCanvas() {
   return startWidth <= mouseX && mouseY <= endHeight;
}