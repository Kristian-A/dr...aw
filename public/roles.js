function Drawer() {
	this.draw = function() {
		background(255);
		for (var i = 0; i < lines.length; i++) {
			lines[i].show();
		}

		if (click == 'canvas' && onCanvas()) {
			if (resetPos || !prevX) {
				prevX = mouseX;
				prevY = mouseY;
			 	resetPos = false;
			}
			var el = new Line(prevX, prevY, mouseX, mouseY, currentWeight, currentColor);
		  	var dec = el.getLenght()/50
		  	data = {
		  		val: dec
		  	}
		  	socket.emit('jarDrainLine', data)
			lines.push(el);
			var data = {
				startPos: el.startPos,
				endPos: el.endPos,
				weight: el.weight,
				color: el.color
			};
			socket.emit('addLine', data);
			prevX = mouseX;
			prevY = mouseY;
		}

		else if(click == 'circle') {
			slider.move(mouseX);
			var data = {sliderX: mouseX, inf: "slider"};
			socket.emit('event', data);
			currentWeight = slider.getValue();
		} 
		else {
			resetPos = true;
		}

		dynamicBackground();
		palette.show();
		slider.show();
		if (fillPercentage > 0) {
			jar.fill(currentColor, fillPercentage);
		}
		else {
		  //drugiq na hod
		}
		jar.show();
	}

	this.mousePressed = function() {

	}

	this.mouseReleased = function() {

	}
}

function Spectator() {
	this.draw = function() {
		background(255);
		for (var i = 0; i < lines.length; i++) {
			lines[i].show();
		}

		dynamicBackground();
		palette.show();
		slider.show();
		if (fillPercentage > 0) {
		}
		else {
			console.log("drasti");
		}
		jar.fill(currentColor, fillPercentage);
		jar.show();
	}
}