import Universe from './js/Universe';

//const cus I don't want them to change.
// in cell units
const UNIVERSE_LENGTH = 15;
const UNIVERSE_HEIGHT = 15;
// in pixels
const CELL_LENGTH = 32;
const CELL_HEIGHT = 32;

var universe = new Universe();
universe.create(UNIVERSE_LENGTH, UNIVERSE_HEIGHT);


// drawing the universe
var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');
drawGrid();

// draw grid
function drawGrid() {
	// vertical lines
	for (let i = 1; i<UNIVERSE_LENGTH; i++){
		ctx.beginPath();
		ctx.moveTo(CELL_LENGTH*i,0);
		ctx.lineTo(CELL_LENGTH*i, UNIVERSE_HEIGHT*CELL_HEIGHT);
		ctx.stroke();
	}
}




