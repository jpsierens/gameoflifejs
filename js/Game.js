import jquery from 'jquery';

const $ = jquery;

class Game {
	constructor(options){
		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		// start it
		this.drawGrid();
		// ES6: arrow function to keep context.
			// arrows share the same lexical 'this' as their surrounding code.
			// Otherwise the callback of the click event would have a different
			// context. In the past you would have done something like 
			// var self = this; and use 'self' inside the callback to preserve
			// the context.
		$('#universe').on('click', (e) => {this.iniSetUp});
		$('#start').click( (e) => {this.play} );
	}
	// make a cell live (1) or die (0)
	iniSetUp() {
		var pageX = e.pageX-$("#universe").offset().left;
		var pageY = e.pageY-$("#universe").offset().top;
		console.log(pageX, pageY);
		for (let i = 0; i<this.universe.height; i++){
			for (let j=0; j<this.universe.length; j++){
				let cell = this.universe.cells[i][j];
				handleClick(cell);
			}
		}
		function handleClick(cell){
			if (pageX > cell.x && pageX < cell.x+this.universe.length &&
						pageY > cell.y && pageY < cell.y+this.universe.height ) {
				if (cell.state === 0) {
					// make the cell alive
					cell.state = 1;
					// paint the block
					this.ctx.fillStyle = '#333';
					this.ctx.fillRect(cell.x+1, cell.y+1, 
						this.universe.length-2, this.universe.height-2);
				}else {
					// make the cell alive
					cell.state = 0;
					// paint the block
					this.ctx.fillStyle = 'white';
					this.ctx.fillRect(cell.x+1, cell.y+1, 
						this.universe.length-2, this.universe.height-2);
				}
			}
		}
	}
	// start the game
	play(){
		// disable God mode
		$('#universe').off();
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
		for (let i = 1; i<this.length; i++){
			this.ctx.beginPath();
			this.ctx.moveTo(this.universe.cellLength*i,0);
			this.ctx.lineTo(this.universe.cellLength*i, 
				this.universe.height*this.universe.cellHeight);
			this.ctx.stroke();
		}
		// horizontal lines
		for (let i = 1; i<this.height; i++){
			this.ctx.beginPath();
			this.ctx.moveTo(0,this.cellHeight*i);
			this.ctx.lineTo(this.universe.length*this.universe.cellLength, 
				this.universe.cellHeight*i);
			this.ctx.stroke();
		}
	}
}


module.exports = Game;