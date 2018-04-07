import Universe from './js/Universe';
import Game from './js/Game';

// in pixels
const CELL_LENGTH = 16;
const CELL_HEIGHT = 16;
// in cell units
const UNIVERSE_LENGTH = 40;
const UNIVERSE_HEIGHT = 40;

const canvas = document.getElementById('universe');
const ctx = canvas.getContext('2d');

const universe = new Universe({
	uniLength: UNIVERSE_LENGTH, 
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_LENGTH
});

universe.create();

const game = new Game({
	// enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas,
	context: ctx,
	universe,
	speed: 200
});

game.iniSetup();

