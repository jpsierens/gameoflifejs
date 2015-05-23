class Game {
	// set up instance variables
	constructor(options){
		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		this.universeElem = document.getElementById('universe');
	}
	// initial set up
	iniSetUp() {
		// Note: using bind to pass the class' context to the callbacks
		// not sure if this can be improved.
		this.universeElem.addEventListener('click', loopCells.bind(this));
		// when user click, start the game
		document.getElementById('start')
			.addEventListener('click', this.play.bind(this));
	}
	// start the game
	play(e){
		var self = this;
		// remove god mode
		console.log('play game!');
		this.universeElem.removeEventListener('click', loopCells);
		// game loop
		setInterval(step.bind(this), 200);
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
// --------------------

// Loop over the cells
function loopCells(e) {
	var universeElem = document.getElementById('universe');
	var pageX = e.pageX - universeElem.offsetLeft;
	var pageY = e.pageY - universeElem.offsetTop;

	for (let i = 0; i<this.universe.height; i++){
		for (let j=0; j<this.universe.length; j++){
			let cell = this.universe.cells[i][j];
			handleClick(this, cell, pageX, pageY);
		}
	}
}

// give life or death to the cell clicked.
// Note: because loopCells is a callback which has the class context
// bound to it, this function which is called in the callback doesn't get the
// context implicitly, so I must pass it. Doesn't feel clean...
function handleClick(self, cell, pageX, pageY){
	if (pageX > cell.x && pageX < cell.x+self.universe.cellLength &&
				pageY > cell.y && pageY < cell.y+self.universe.cellHeight ) {
		console.log(cell)
		if (cell.state === 0) {
			// make the cell alive
			cell.state = 1;
			// paint the block
			self.ctx.fillStyle = '#333';
			self.ctx.fillRect(cell.x+1, cell.y+1, 
				self.universe.cellLength-2, self.universe.cellHeight-2);
		}else {
			// make the cell dead
			cell.state = 0;
			// paint the block
			self.ctx.fillStyle = 'white';
			self.ctx.fillRect(cell.x+1, cell.y+1, 
				self.universe.cellLength-2, self.universe.cellHeight-2);
		}
	}
}

// 1 step = 1 generation
function step(){
	var self = this;
	for (let i = 0; i<this.universe.height; i++){
		for (let j=0; j<this.universe.length; j++){
			let cell = this.universe.cells[i][j];
			transitions(self, cell);
		}
	}
}

function transitions(self, cell) {
	if (cell.state === 1){
		// ze life rules
		// -------------------
		// Any live cell with fewer than two live neighbours dies, as 
		// if caused by under-population.
		var neighboursAlive = 0;
		for (let i=0; i<8; i++){
			let neighbourID = cell.neighbours[i];
			let row = Math.floor(neighbourID/self.universe.length);
			let column = neighbourID % self.universe.length;
			let neighbour = self.universe.cells[row][column];
			if (neighbour.state === 1) neighboursAlive++;
		}
		if (neighboursAlive < 2) {
			console.log('kill!');
			console.log(cell.x)
			cell.state = 0;
			self.ctx.fillRect(cell.x+1, cell.y+1, 
				self.universe.cellLength-2, self.universe.cellHeight-2);
		}
	}
}


module.exports = Game;