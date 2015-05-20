import Universe from './js/Universe';
import jquery from 'jquery';

//const cus I don't want them to change.
const $ = jquery;
// in pixels
const CELL_LENGTH = 32;
const CELL_HEIGHT = 32;
// in cell units
const UNIVERSE_LENGTH = 15;
const UNIVERSE_HEIGHT = 15;
const CELL_X = 1;
const CELL_Y = 1;

var universe = new Universe({
	uniLength: UNIVERSE_LENGTH, 
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_HEIGHT
});
universe.create();


// drawing the universe
var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');
drawGrid();
console.log(universe.cells);
$('#universe').click(iniSetUp);


// make a cell live (1) or die (0)
function iniSetUp(e) {
	var pageX = e.pageX-$("#universe").offset().left;
	var pageY = e.pageY-$("#universe").offset().top;
	console.log(pageX, pageY)
	for (let i = 0; i<UNIVERSE_HEIGHT; i++){
		for (let j=0; j<UNIVERSE_LENGTH; j++){
			let cell = universe.cells[i][j];
			handleClick(cell);
		}
	}
	function handleClick(cell){
		if (pageX > cell.x && pageX < cell.x+CELL_LENGTH &&
				pageY > cell.y && pageY < cell.y+CELL_HEIGHT ) {
			if (cell.state === 0) {
				// make the cell alive
				cell.state = 1;
				// paint the block
				ctx.fillStyle = '#333';
				ctx.fillRect(cell.x+1, cell.y+1, CELL_LENGTH-2, CELL_HEIGHT-2);
			}else {
				// make the cell alive
				cell.state = 0;
				// paint the block
				ctx.fillStyle = 'white';
				ctx.fillRect(cell.x+1, cell.y+1, CELL_LENGTH-2, CELL_HEIGHT-2);
			}
		}
	}
}

// draw grid
function drawGrid() {
	ctx.strokeStyle = '#777';
	ctx.lineWidth = 1;
	// vertical lines
	for (let i = 1; i<UNIVERSE_LENGTH; i++){
		ctx.beginPath();
		ctx.moveTo(CELL_LENGTH*i,0);
		ctx.lineTo(CELL_LENGTH*i, UNIVERSE_HEIGHT*CELL_HEIGHT);
		ctx.stroke();
	}
	// horizontal lines
	for (let i = 1; i<UNIVERSE_HEIGHT; i++){
		ctx.beginPath();
		ctx.moveTo(0,CELL_HEIGHT*i);
		ctx.lineTo(UNIVERSE_LENGTH*CELL_LENGTH, CELL_HEIGHT*i);
		ctx.stroke();
	}
}




