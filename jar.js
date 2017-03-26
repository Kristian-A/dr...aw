Jar = function(x, y, width) {

	this.jarimg = loadImage("textures/jar.png");
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = width*1.4;
	this.level = 100;

	this.show = function() {
		image(this.jarimg, this.x, this.y, this.width, this.height);
	}

	this.fill = function(color, startY) {

		fract = (startY/100)*this.height;
		startY = this.y + this.height - fract;
		this.level = startY;
		fill(color);
		beginShape();

		vertex(this.x, startY+2);
		vertex(this.x+this.width, startY+2);
		vertex(this.x+this.width, this.y+this.height);
		vertex(this.x, this.y+this.height);

		endShape();
	}
}