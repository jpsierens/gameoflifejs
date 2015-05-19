class Universe {
	constructor(length, height){
		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
		this.height = height;
		this.length = length;
	}
	create() {
		// Assign the tilemap in relation with the length and height of the universe.
		for (let i = 0; i<this.height; i++) {
			this.cells.push(new Array());
			for (let j = 0; j<this.length; j++) {
				// at the initial universe, every cell is dead (0)
				this.cells[i].push(0)
			}
		}
	}
}

module.exports = Universe;