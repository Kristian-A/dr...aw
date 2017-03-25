Slider = function(x, y, min, max, width) {
	this.width = width;
	this.height = width/27;
	this.x = x;
	this.y = y;
	this.min = min;
	this.max = max;
	this.circlex = this.x + width/2;
	this.circley = this.y + this.height/2;
	this.d = 24;

	this.sliderimg = loadImage("textures/slider.png");

	this.show = function() {
		//slider
		image(this.sliderimg, this.x, this.y, this.width, this.height);
		strokeWeight(2);
		stroke(0);
		fill(255, 153, 51);
		
		//selected
		strokeWeight(this.height);
		stroke(0);
		line(this.circlex, this.circley, this.x+this.width - 2, this.circley);

		//ball
		//strokeWeight(2);
		noStroke();
		fill(255, 153, 51);
		ellipse(this.circlex, this.circley, this.d, this.d);

		//preview
		this.preview(this.x + this.width + this.d*2, this.y + this.height/2);
	}

	this.onSlider = function() {
		endx = this.x + this.width;
		endy = this.y + 20;
		return mouseX >= this.x && mouseX <= endx &&
			   mouseY >= this.y - 7 && mouseY <= endy + 7
	}

	this.move = function(newX) {
		start = this.x;
		end = this.x + this.width;
		if (newX > end) {
			this.circlex = end;
		} else if (newX < start) {
			this.circlex = start;
		} else {
			this.circlex = newX;
		}
	}

	this.getValue = function() {
		dist = this.circlex - this.x;
		fract = dist / this.width;
		range = this.max-this.min;
		return (min + range*fract);
	}

	this.preview = function(x, y) {
		noStroke();
		fill(152, 56, 169);
		var size = this.getValue();
		ellipse(x, y, size, size);
	}
}