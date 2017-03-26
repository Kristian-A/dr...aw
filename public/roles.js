function Drawer() {
	this.draw = function() {
		background(100);
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
		  	var dec = el.getLenght()/50;
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
		jar.fill(currentColor, fillPercentage);
		jar.show();
	}

	this.mousePressed = function() {
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

	this.keyTyped = function() {}
}

function Spectator() {
	this.draw = function() {
		background(255, 0, 0);
		for (var i = 0; i < lines.length; i++) {
			lines[i].show();
		}

		dynamicBackground();
		palette.show();
		slider.show();
		jar.fill(currentColor, fillPercentage);
		jar.show();
	}

	this.mousePressed = function() {}

	this.keyTyped = function() {
		if (key >= 'a' && key <= 'z') {
			input.currentWord += key;
			console.log(input.currentWord);
		}
		else if (key == BACKSPACE) {
			input.currentWord.splice(input.currentWord.length-1, 1);
		}
	}
}

function Traitor() {
	this.draw = function() {
		background(255);
		for (var i = 0; i < lines.length; i++) {
			lines[i].show();
		}

		dynamicBackground(); 
		jar.fill(currentColor, fillPercentage);
		jar.show();		
	}

	this.mousePressed = function() {
		console.log('traitor click');
	}

	this.keyTyped = function() {}
}