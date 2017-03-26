InputBox = class {
	constructor(x, y, width) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = width*0.5;
		this.currentWord = [];
		this.symbolSize = width*0.04;
	}

	show() {
		noStroke();
		fill(0);
		rect(this.x, this.y, this.width, this.height, 30);
		fill(255);
		rect(this.x + this.width*0.1, this.y + this.height*0.4, this.width*0.8, this.height*0.2);
		var x = this.x + this.width*0.1 + this.width*0.4, y = this.y + this.height*0.4 + this.height*0.1;
		fill(0, 255, 0);
		var w = '';
		for (var i = 0; i < this.currentWord.length; i++) {
			w += this.currentWord[i];
		}
		textSize(this.symbolSize);
		text(w, x-this.currentWord.length*7, y);
	}


}