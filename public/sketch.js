var socket;
var id;

var SCRwidth, SCRheight;
var click;

var resetPos = false;
var prevX, prevY;



function setup() {
   SCRwidth = 800;
   SCRheight = 800;

   canvas = createCanvas(SCRwidth, SCRheight);
   background(51);
   strokeWeight(16);


   socket = io.connect('http://localhost:3000');
   
   //events
   socket.on('id', function(data) {
      id = data;
   })

   socket.on('mouse', function(data) {
      prevX = data.prevx;
      prevY = data.prevy;
      showLine(prevX, prevY, data.x, data.y);
   });

   socket.on('event', function(data) {
      if (data.inf == 'mouseReleased') {
         resetPos = true;
      }
   });
}

function draw() {
   if (click == true) {
      if (resetPos || !prevX) {
         prevX = mouseX;
         prevY = mouseY;
         resetPos = false;
      }
      showLine(prevX, prevY, mouseX, mouseY);
      sendmouse(mouseX, mouseY);  
      prevX = mouseX;
      prevY = mouseY;
   } 
   else {
      resetPos = true;
   }
}

function mousePressed() {
   console.log(id);
      click = true; 
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

function showLine(ax, ay, bx, by) {
   line(ax, ay, bx, by);
}


function sendmouse(xpos, ypos) {
   console.log("sendmouse: " + xpos + " " + ypos);
   var data = {
      prevx: prevX,
      prevy: prevY,
      x: xpos,
      y: ypos,
   };
   socket.emit('mouse', data);
}
