function Debuff(img, x, y, side) {
	this.img = loadImage(img);
	this.x = x;
	this.y = y;
	this.side = side;
	this.startTime = new Date();

	this.show = function() {
		image(this.img, this.x, this.y, this.side, this.side);
	}

	this.clicked = function() {
		return (this.x <= mouseX && mouseX <= this.x + this.side
	   && this.y <= mouseY && mouseY <= this.y + this.side);
	}

	this.use = function() {}

	this.stop = function() {}
}