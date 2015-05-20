class Universe {
	constructor(options){
		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
		this.height = options.uniHeight;
		this.length = options.uniLength;
		this.cellHeight = options.cellHeight;
		this.cellLength = options.cellLength;
	}
	create() {
		// Assign the tilemap in relation with the length and height of the 
		// universe.
		for (let i = 0; i<this.height; i++) {
			this.cells.push(new Array());
			for (let j = 0; j<this.length; j++) {
				// assign each cell a structure with the id, state and 
				// coordinates of that cell
				this.cells[i].push({
					id:i*this.length+j, 
					state:0,
					x:j*this.cellLength,
					y:i*this.cellHeight
				});
			}
		}
	}
}

module.exports = Universe;