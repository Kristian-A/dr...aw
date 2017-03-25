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

var fillPercentage;

var role;
var status = "loading";


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
   });


   function drainFill(data) {
      fillPercentage = data.fill;
   }

   socket.on('jarDrainTime', drainFill);

   socket.on('jarDrainLine', drainFill);

   palette = new ColorBox(width - width*0.18, height - height*0.165, width*0.15);
   slider = new Slider(width - width*0.5, height - height*0.11, 6, 50, width*0.25);
   jar = new Jar(width*0.054, height*0.35, width*0.2);
   input = new InputBox(,0, width*0.4, "zdr");
   currentColor = [255, 255, 255];
   currentWeight = slider.getValue();

}

function draw() {
   console.log(status);
   if (status == "playing") {
      role.draw();
      socket.emit('jarDrainTime');
   }
   else if (status == "guessing") {
      role.draw();
      input.show();

   }
}


function mousePressed() {
   role.mousePressed();
}

function mouseReleased() {
   click = false;
   resetPos = true;
   data = {
      inf: 'mouseReleased'
   };
   socket.emit('event', data);
}

function keyPressed() {
   role.keyPressed();
}
//Other

function dynamicBackground() {
   fill(47);
   stroke(0);
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