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

var fillPercentage;

var role;
var start = false;

function setup() {
   SCRwidth = screen.width - screen.width*0.012;
   SCRheight = screen.height - screen.height*0.17;

   canvas = createCanvas(SCRwidth, SCRheight);

   startWidth = SCRwidth*0.3;
   endHeight = SCRheight*0.8;

   fillPercentage = 100;

   socket = io.connect('http://192.168.97.221:3000');
   
   //events
   socket.on('id', function(data) {
      id = data;
   })

   socket.on('role', function(data) {
      if (data.role == 'drawer') {
         role = new Drawer();
      }
      else {//if (data.role == 'saboteur') {
         role = new Spectator();
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

   socket.on('start', function(data) {
      start = true;
   });

   socket.on('jarDrainTime', function(data) {
      fillPercentage -= data.val;
   });

   socket.on('jarDrainLine', function(data) {
      fillPercentage -= data.val;
   });


   palette = new ColorBox(width - width*0.18, height - height*0.165, width*0.15);
   slider = new Slider(width - width*0.5, height - height*0.11, 6, 50, width*0.25);
   jar = new Jar(width*0.054, height*0.35, width*0.2);
   currentColor = [255, 255, 255];
   currentWeight = slider.getValue();
}

function draw() {
   console.log(start);
   if (start) {
      role.draw();
      socket.emit('jarDrainTime');
   }
}


function mousePressed() {
   if (palette.onColorBox()) {
      currentColor = palette.getColor();
      var data = {color: currentColor, inf: 'switchColor'}
      socket.emit('event', data);
   }
   else if (slider.onSlider()) {
      click = 'circle';
   }
   else {
      click = 'canvas';
   }  
}

function mouseReleased() {
   click = false;
   resetPos = true;
   data = {
      inf: 'mouseReleased'
   };
   socket.emit('event', data);
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