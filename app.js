import Universe from './js/Universe';
import Game from './js/Game';

// in pixels
const CELL_LENGTH = 32;
const CELL_HEIGHT = 32;
// in cell units
const UNIVERSE_LENGTH = 15;
const UNIVERSE_HEIGHT = 15;

var universe = new Universe({
	uniLength: UNIVERSE_LENGTH, 
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_LENGTH
});
universe.create();

var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');

var game = new Game({
	// enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas,
	context: ctx,
	universe
});
game.drawGrid();
game.iniSetUp();

