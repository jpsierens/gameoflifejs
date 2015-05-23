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
				let id = i*this.length+j
				this.cells[i].push({
					id, 
					state:0,
					x:j*this.cellLength,
					y:i*this.cellHeight,
					neighbours: [
						// top neighbours
						id-this.length-1, id-this.length, id-this.length+1,
						// side neigbours
						id-1, id+1,
						//bottom neigbours
						id+this.length-1, id+this.length, id+this.length+1 
					]
				});
			}
		}
	}
}

module.exports = Universe;