class Game {
	constructor(options){
		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		this.universeElem = document.getElementById('universe');
	}
	// make a cell live (1) or die (0)
	iniSetUp() {

		this.universeElem.addEventListener('click', loopCells.bind(this));

		// when user click, start the game
		document.getElementById('start').addEventListener('click', this.play.bind(this));
	}
	// start the game
	play(){
		// remove god mode
		console.log('play game!');
		this.universeElem.removeEventListener('click', loopCells);
		// loop over each cell
		for (let i = 0; i<this.universe.cellHeight; i++){
			for (let j=0; j<this.universe.cellLength; j++){
				let cell = universe.cells[i][j];
				if (cell.state === 1){
					
				}
			}
		}
	}
	// draw grid
	drawGrid() {
		this.ctx.strokeStyle = '#777';
		this.ctx.lineWidth = 1;
		// vertical lines
		for (let i = 1; i<this.universe.length; i++){
			this.ctx.beginPath();
			this.ctx.moveTo(this.universe.cellLength*i,0);
			this.ctx.lineTo(this.universe.cellLength*i, 
				this.universe.height*this.universe.cellHeight);
			this.ctx.stroke();
		}
		// horizontal lines
		for (let i = 1; i<this.universe.height; i++){
			this.ctx.beginPath();
			this.ctx.moveTo(0,this.universe.cellHeight*i);
			this.ctx.lineTo(this.universe.length*this.universe.cellLength, 
				this.universe.cellHeight*i);
			this.ctx.stroke();
		}
	}
}

// Private methods
// ----

function loopCells(e) {
	var universeElem = document.getElementById('universe');
	var pageX = e.pageX - universeElem.offsetLeft;
	var pageY = e.pageY - universeElem.offsetTop;
	console.log(pageX, pageY);

	for (let i = 0; i<this.universe.height; i++){
		for (let j=0; j<this.universe.length; j++){
			let cell = this.universe.cells[i][j];
			handleClick(this, cell, pageX, pageY);
		}
	}
}

function handleClick(self, cell, pageX, pageY){
	if (pageX > cell.x && pageX < cell.x+self.universe.cellLength &&
				pageY > cell.y && pageY < cell.y+self.universe.cellHeight ) {
		if (cell.state === 0) {
			// make the cell alive
			cell.state = 1;
			// paint the block
			self.ctx.fillStyle = '#333';
			self.ctx.fillRect(cell.x+1, cell.y+1, 
				self.universe.cellLength-2, self.universe.cellHeight-2);
		}else {
			// make the cell alive
			cell.state = 0;
			// paint the block
			self.ctx.fillStyle = 'white';
			self.ctx.fillRect(cell.x+1, cell.y+1, 
				self.universe.cellLength-2, self.universe.cellHeight-2);
		}
	}
}


module.exports = Game;