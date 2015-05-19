//const cus I don't want them to change.
const UNIVERSE_LENGTH = 15;
const UNIVERSE_HEIGHT = 15;
const CELL_LENGTH = 32;
const CELL_HEIGHT = 32;

class Universe {
	constructor(){
		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
	}
	create() {
		// Assign the tilemap in relation with the length and height of the universe.
		for (let i = 0; i<UNIVERSE_HEIGHT; i++) {
			this.cells.push(new Array());
			for (let j = 0; j<UNIVERSE_LENGTH; j++) {
				// at the initial universe, every cell is dead (0)
				this.cells[i].push(0)
			}
		}
	}
}

module.exports = Universe;