var Line = class {

	constructor(startX, startY, endX, endY, weight, color) {
		this.startPos = {x: startX, y: startY};
		this.endPos = {x: endX, y: endY};
		this.weight = weight;
		this.color = color;
	}

	show() {
		stroke(this.color);
		strokeWeight(this.weight);
		line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
	}

	getLenght() {
		var lenght = abs((this.startPos.x - this.endPos.x) + (this.startPos.y - this.endPos.y));
		if (lenght == 0) {
			lenght == 0.05;
		}
		return lenght;
	}
}