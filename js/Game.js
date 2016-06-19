class Game {
	// set up instance variables
	constructor(options){
        this.timer = null;
		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		this.universeElem = document.getElementById('universe');
		this.speed = options.speed;

		// store refeences to bound listeners since otherwise you can't remove the listeners
		this.stopListener = this.stop.bind(this);
		this.playListener = this.play.bind(this);
	}
	// initial set up
	iniSetUp() {
		/* this indirection is tacky but when, in method stop() I tried to call 
		   iniSetup() using this.iniSetup() I got an error, very odd.  So I made this private 
		   function doSetup so it could be called from iniSetup and stop */
		doSetup.call(this);
	}
    // stop the game
    stop(e) {
        // remove restart listener, it'll be added again if game start clicked
        document.getElementById('stop').removeEventListener('click', this.stopListener);
        // stop the timer
        clearInterval(this.timer);
        // reinitialise the game
        // this.iniSetup(); // causes an error "this.iniSetup is not a function!? bizarre"
        doSetup.call(this);
    }
    // start the game
	play(e){
        // add click event to stop button
        document.getElementById('stop').addEventListener('click', this.stopListener);
        // remove the play click listener
        document.getElementById('start').removeEventListener('click', this.playListener);
		// remove god mode
		this.universeElem.removeEventListener('click', loopCells);
		// game loop, store handle for restart to stop the timer
		this.timer = setInterval(step.bind(this), this.speed);
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

function doSetup() {
	// Note: using bind to pass the class' context to the callbacks
	// not sure if this can be improved.
	this.universeElem.addEventListener('click', loopCells.bind(this));
	// when user click, start the game
	document.getElementById('start').addEventListener('click', this.playListener);
}

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
		changeCells(self, cell);
	}
}

// 1 step = 1 generation
function step(){
	var self = this;
	var cellsToChange = [];
	for (let i = 0; i<this.universe.height; i++){
		for (let j=0; j<this.universe.length; j++){
			let cell = this.universe.cells[i][j];
			transitions(self, cell, cellsToChange);
		}
	}
	// update the cells that should be updated
	for (let i=0; i<cellsToChange.length; i++){
		let cell = getCellById(self, cellsToChange[i]);
		// if the cell state was 0 change to 1, and vice versa.
		changeCells(self, cell);
	}
}

/*
*	pass the cell through the 4 rules. 
	Note: cells should not update here, since altering 1 before you can
	analyze the others will cause erroneous outcomes.
*/
function transitions(self, cell, cellsToChange) {
	var uniLength = self.universe.length;
	var uniHeight = self.universe.height;
	var neighboursAlive = 0;
	// Go through the neighbours of each cell.
	for (let i=0; i<8; i++){
		let neighbourID = cell.neighbours[i];
		if (neighbourID >= uniLength*uniHeight || neighbourID <0) continue;
		let neighbour = getCellById(self, neighbourID);
		if (neighbour.state === 1) neighboursAlive++;
	}
	if (cell.state === 1){
		// ze life rules
		// -------------------
		// 1) Any live cell with fewer than two live neighbours dies, as 
		// if caused by under-population.
		// 2) Any live cell with two or three live neighbours lives on to 
		// the next generation.
		if (neighboursAlive < 2) cellsToChange.push(cell.id);
		// 3) Any live cell with more than three live neighbours dies, as if 
		// by overcrowding.
		else if (neighboursAlive > 3) cellsToChange.push(cell.id);
	}
	else {
		// 4) Any dead cell with exactly three live neighbours becomes a 
		// live cell, as if by reproduction.
		if (neighboursAlive === 3) cellsToChange.push(cell.id);
	}
}

function changeCells(self, cell) {
	self.ctx.fillStyle = (cell.state) ? 'white' : '#333';
	self.ctx.fillRect(cell.x+1, cell.y+1, 
			self.universe.cellLength-2, self.universe.cellHeight-2);
	cell.state = (cell.state) ? 0 : 1;
}

function getCellById(self, id) {
	let row = Math.floor(id/self.universe.length);
	let column = id % self.universe.length;
	return self.universe.cells[row][column];
} 


module.exports = Game;
