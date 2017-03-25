ColorBox = function(x, y, width) {
	this.width = width;
	this.height = (width/5)*2;
	this.x = x;
	this.y = y;
	this.colors = [
		[0, 0, 0],// black 1 --
        [128, 128, 128],//    grey 3 --
        [255, 0, 0],// red 5 --
        [255, 106, 0],// orange    7 --
        [0, 38, 255],// dark blue  9    --
        [255, 255, 255],//white 2 -- 
        [0, 198, 0],//green 10 4 -- 
        [255, 0, 220],// pink 6 -- 
        [255, 216, 0],// yellow 8 --
        [0, 205, 255]// light blue --
	];

	this.show = function() {
		var side = width/5;
		var i = 0;
		for (var y = 0; y < 2; y++) {
			for (var x = 0; x < 5; x++) {
				var current = this.colors[i]
				fill(current[0], current[1], current[2]);
				strokeWeight(2);
				stroke(0);
				rect(this.x + x*side, this.y + y*side, side, side);
				i += 1;
			}
		}
	}

	this.onColorBox = function() {
		endX = this.x + this.width;
		endY = this.y + this.height;
		return (mouseX > this.x && mouseX < endX) 
			 && (mouseY > this.y && mouseY < endY);
	}

	this.getColor = function() {
		var iX = floor((mouseX-this.x) / (width/5));
		var iY = floor((mouseY-this.y) / (width/5));
		return this.colors[iY*5 + iX];
	}
}

