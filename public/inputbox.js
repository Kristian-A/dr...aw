InputBox = class {
	constructor(x, y, width, correctWord) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = width*0.5;
		this.correctWord = correctWord;
	}

	show() {
		noStroke();
		fill(0);
		rect(this.x, this.y, this.width, this.height, 30);
		fill(255);
		rect(this.x + this.width*0.1, this.y + this.height*0.4 , this.width*0.8, this.height*0.2);
		
	}


}