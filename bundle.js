(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsUniverse = require('./js/Universe');

var _jsUniverse2 = _interopRequireDefault(_jsUniverse);

var _jsGame = require('./js/Game');

var _jsGame2 = _interopRequireDefault(_jsGame);

// in pixels
var CELL_LENGTH = 16;
var CELL_HEIGHT = 16;
// in cell units
var UNIVERSE_LENGTH = 40;
var UNIVERSE_HEIGHT = 40;

var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');

var universe = new _jsUniverse2['default']({
	uniLength: UNIVERSE_LENGTH,
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_LENGTH
});
universe.create();

var game = new _jsGame2['default']({
	// enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas: canvas,
	context: ctx,
	universe: universe,
	speed: 200
});

game.drawGrid();
game.iniSetUp();

},{"./js/Game":2,"./js/Universe":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Game = (function () {
	// set up instance variables

	function Game(options) {
		_classCallCheck(this, Game);

		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		this.universeElem = document.getElementById('universe');
		this.speed = options.speed;
	}

	_createClass(Game, [{
		key: 'iniSetUp',

		// initial set up
		value: function iniSetUp() {
			// Note: using bind to pass the class' context to the callbacks
			// not sure if this can be improved.
			this.universeElem.addEventListener('click', loopCells.bind(this));
			// when user click, start the game
			document.getElementById('start').addEventListener('click', this.play.bind(this));
		}
	}, {
		key: 'play',

		// start the game
		value: function play(e) {
			// remove god mode
			this.universeElem.removeEventListener('click', loopCells);
			// game loop
			setInterval(step.bind(this), this.speed);
		}
	}, {
		key: 'drawGrid',

		// draw grid
		value: function drawGrid() {
			this.ctx.strokeStyle = '#777';
			this.ctx.lineWidth = 1;
			// vertical lines
			for (var i = 1; i < this.universe.length; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.universe.cellLength * i, 0);
				this.ctx.lineTo(this.universe.cellLength * i, this.universe.height * this.universe.cellHeight);
				this.ctx.stroke();
			}
			// horizontal lines
			for (var i = 1; i < this.universe.height; i++) {
				this.ctx.beginPath();
				this.ctx.moveTo(0, this.universe.cellHeight * i);
				this.ctx.lineTo(this.universe.length * this.universe.cellLength, this.universe.cellHeight * i);
				this.ctx.stroke();
			}
		}
	}]);

	return Game;
})();

// Private methods
// --------------------

// Loop over the cells
function loopCells(e) {
	var universeElem = document.getElementById('universe');
	var pageX = e.pageX - universeElem.offsetLeft;
	var pageY = e.pageY - universeElem.offsetTop;

	for (var i = 0; i < this.universe.height; i++) {
		for (var j = 0; j < this.universe.length; j++) {
			var cell = this.universe.cells[i][j];
			handleClick(this, cell, pageX, pageY);
		}
	}
}

// give life or death to the cell clicked.
// Note: because loopCells is a callback which has the class context
// bound to it, this function which is called in the callback doesn't get the
// context implicitly, so I must pass it. Doesn't feel clean...
function handleClick(self, cell, pageX, pageY) {
	if (pageX > cell.x && pageX < cell.x + self.universe.cellLength && pageY > cell.y && pageY < cell.y + self.universe.cellHeight) {
		changeCells(self, cell);
	}
}

// 1 step = 1 generation
function step() {
	var self = this;
	var cellsToChange = [];
	for (var i = 0; i < this.universe.height; i++) {
		for (var j = 0; j < this.universe.length; j++) {
			var cell = this.universe.cells[i][j];
			transitions(self, cell, cellsToChange);
		}
	}
	// update the cells that should be updated
	for (var i = 0; i < cellsToChange.length; i++) {
		var cell = getCellById(self, cellsToChange[i]);
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
	for (var i = 0; i < 8; i++) {
		var neighbourID = cell.neighbours[i];
		if (neighbourID >= uniLength * uniHeight || neighbourID < 0) continue;
		var neighbour = getCellById(self, neighbourID);
		if (neighbour.state === 1) neighboursAlive++;
	}
	if (cell.state === 1) {
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
	} else {
		// 4) Any dead cell with exactly three live neighbours becomes a
		// live cell, as if by reproduction.
		if (neighboursAlive === 3) cellsToChange.push(cell.id);
	}
}

function changeCells(self, cell) {
	self.ctx.fillStyle = cell.state ? 'white' : '#333';
	self.ctx.fillRect(cell.x + 1, cell.y + 1, self.universe.cellLength - 2, self.universe.cellHeight - 2);
	cell.state = cell.state ? 0 : 1;
}

function getCellById(self, id) {
	var row = Math.floor(id / self.universe.length);
	var column = id % self.universe.length;
	return self.universe.cells[row][column];
}

module.exports = Game;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Universe = (function () {
	function Universe(options) {
		_classCallCheck(this, Universe);

		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
		this.height = options.uniHeight;
		this.length = options.uniLength;
		this.cellHeight = options.cellHeight;
		this.cellLength = options.cellLength;
	}

	_createClass(Universe, [{
		key: "create",
		value: function create() {
			// Assign the tilemap in relation with the length and height of the
			// universe.
			for (var i = 0; i < this.height; i++) {
				this.cells.push(new Array());
				for (var j = 0; j < this.length; j++) {
					// assign each cell a structure with the id, state and
					// coordinates of that cell
					var id = i * this.length + j;
					this.cells[i].push({
						id: id,
						state: 0,
						x: j * this.cellLength,
						y: i * this.cellHeight,
						neighbours: [
						// top neighbours
						id - this.length - 1, id - this.length, id - this.length + 1,
						// side neigbours
						id - 1, id + 1,
						//bottom neigbours
						id + this.length - 1, id + this.length, id + this.length + 1]
					});
				}
			}
		}
	}]);

	return Universe;
})();

module.exports = Universe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9hcHAuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9qcy9HYW1lLmpzIiwiL2hvbWUvanBzaWVyZW5zL1NpdGVzL2dhbWVvZmxpZmUvanMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OzBCQ0FxQixlQUFlOzs7O3NCQUNuQixXQUFXOzs7OztBQUc1QixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOztBQUUzQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxDLElBQUksUUFBUSxHQUFHLDRCQUFhO0FBQzNCLFVBQVMsRUFBRSxlQUFlO0FBQzFCLFVBQVMsRUFBRSxlQUFlO0FBQzFCLFdBQVUsRUFBRSxXQUFXO0FBQ3ZCLFdBQVUsRUFBRSxXQUFXO0NBQ3ZCLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFbEIsSUFBSSxJQUFJLEdBQUcsd0JBQVM7OztBQUduQixPQUFNLEVBQU4sTUFBTTtBQUNOLFFBQU8sRUFBRSxHQUFHO0FBQ1osU0FBUSxFQUFSLFFBQVE7QUFDUixNQUFLLEVBQUUsR0FBRztDQUNWLENBQUMsQ0FBQzs7QUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7Ozs7SUMvQlYsSUFBSTs7O0FBRUUs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R0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDOztBQUVsRCxRQUFFLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDOztBQUVWLFFBQUUsR0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQ2xEO01BQ0QsQ0FBQyxDQUFDO0tBQ0g7SUFDRDtHQUNEOzs7UUFsQ0ksUUFBUTs7O0FBcUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL2pzL1VuaXZlcnNlJztcbmltcG9ydCBHYW1lIGZyb20gJy4vanMvR2FtZSc7XG5cbi8vIGluIHBpeGVsc1xuY29uc3QgQ0VMTF9MRU5HVEggPSAxNjtcbmNvbnN0IENFTExfSEVJR0hUID0gMTY7XG4vLyBpbiBjZWxsIHVuaXRzXG5jb25zdCBVTklWRVJTRV9MRU5HVEggPSA0MDtcbmNvbnN0IFVOSVZFUlNFX0hFSUdIVCA9IDQwO1xuXG52YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciB1bml2ZXJzZSA9IG5ldyBVbml2ZXJzZSh7XG5cdHVuaUxlbmd0aDogVU5JVkVSU0VfTEVOR1RILCBcblx0dW5pSGVpZ2h0OiBVTklWRVJTRV9IRUlHSFQsXG5cdGNlbGxMZW5ndGg6IENFTExfTEVOR1RILFxuXHRjZWxsSGVpZ2h0OiBDRUxMX0xFTkdUSFxufSk7XG51bml2ZXJzZS5jcmVhdGUoKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZSh7XG5cdC8vIGVuaGFuY2VkIG9iamVjdCBsaXRlcmFsc1xuXHQvLyAnY2FudmFzLCcgaXMgdGhlIHNhbWUgYXMgJ2NhbnZhczogY2FudmFzLCdcblx0Y2FudmFzLFxuXHRjb250ZXh0OiBjdHgsXG5cdHVuaXZlcnNlLFxuXHRzcGVlZDogMjAwXG59KTtcblxuZ2FtZS5kcmF3R3JpZCgpO1xuZ2FtZS5pbmlTZXRVcCgpO1xuXG4iLCJjbGFzcyBHYW1lIHtcblx0Ly8gc2V0IHVwIGluc3RhbmNlIHZhcmlhYmxlc1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKXtcblx0XHR0aGlzLmNhbnZhcyA9IG9wdGlvbnMuY2FudmFzO1xuXHRcdHRoaXMuY3R4ID0gb3B0aW9ucy5jb250ZXh0O1xuXHRcdHRoaXMudW5pdmVyc2UgPSBvcHRpb25zLnVuaXZlcnNlO1xuXHRcdHRoaXMudW5pdmVyc2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG5cdFx0dGhpcy5zcGVlZCA9IG9wdGlvbnMuc3BlZWQ7XG5cdH1cblx0Ly8gaW5pdGlhbCBzZXQgdXBcblx0aW5pU2V0VXAoKSB7XG5cdFx0Ly8gTm90ZTogdXNpbmcgYmluZCB0byBwYXNzIHRoZSBjbGFzcycgY29udGV4dCB0byB0aGUgY2FsbGJhY2tzXG5cdFx0Ly8gbm90IHN1cmUgaWYgdGhpcyBjYW4gYmUgaW1wcm92ZWQuXG5cdFx0dGhpcy51bml2ZXJzZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb29wQ2VsbHMuYmluZCh0aGlzKSk7XG5cdFx0Ly8gd2hlbiB1c2VyIGNsaWNrLCBzdGFydCB0aGUgZ2FtZVxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpXG5cdFx0XHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnBsYXkuYmluZCh0aGlzKSk7XG5cdH1cblx0Ly8gc3RhcnQgdGhlIGdhbWVcblx0cGxheShlKXtcblx0XHQvLyByZW1vdmUgZ29kIG1vZGVcblx0XHR0aGlzLnVuaXZlcnNlRWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGxvb3BDZWxscyk7XG5cdFx0Ly8gZ2FtZSBsb29wXG5cdFx0c2V0SW50ZXJ2YWwoc3RlcC5iaW5kKHRoaXMpLCB0aGlzLnNwZWVkKTtcblx0fVxuXHQvLyBkcmF3IGdyaWRcblx0ZHJhd0dyaWQoKSB7XG5cdFx0dGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG5cdFx0dGhpcy5jdHgubGluZVdpZHRoID0gMTtcblx0XHQvLyB2ZXJ0aWNhbCBsaW5lc1xuXHRcdGZvciAobGV0IGkgPSAxOyBpPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmN0eC5tb3ZlVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksMCk7XG5cdFx0XHR0aGlzLmN0eC5saW5lVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksIFxuXHRcdFx0XHR0aGlzLnVuaXZlcnNlLmhlaWdodCp0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQpO1xuXHRcdFx0dGhpcy5jdHguc3Ryb2tlKCk7XG5cdFx0fVxuXHRcdC8vIGhvcml6b250YWwgbGluZXNcblx0XHRmb3IgKGxldCBpID0gMTsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRcdHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jdHgubW92ZVRvKDAsdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0KmkpO1xuXHRcdFx0dGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UubGVuZ3RoKnRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCwgXG5cdFx0XHRcdHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcblx0XHRcdHRoaXMuY3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBQcml2YXRlIG1ldGhvZHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIExvb3Agb3ZlciB0aGUgY2VsbHNcbmZ1bmN0aW9uIGxvb3BDZWxscyhlKSB7XG5cdHZhciB1bml2ZXJzZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcblx0dmFyIHBhZ2VYID0gZS5wYWdlWCAtIHVuaXZlcnNlRWxlbS5vZmZzZXRMZWZ0O1xuXHR2YXIgcGFnZVkgPSBlLnBhZ2VZIC0gdW5pdmVyc2VFbGVtLm9mZnNldFRvcDtcblxuXHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRmb3IgKGxldCBqPTA7IGo8dGhpcy51bml2ZXJzZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRsZXQgY2VsbCA9IHRoaXMudW5pdmVyc2UuY2VsbHNbaV1bal07XG5cdFx0XHRoYW5kbGVDbGljayh0aGlzLCBjZWxsLCBwYWdlWCwgcGFnZVkpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBnaXZlIGxpZmUgb3IgZGVhdGggdG8gdGhlIGNlbGwgY2xpY2tlZC5cbi8vIE5vdGU6IGJlY2F1c2UgbG9vcENlbGxzIGlzIGEgY2FsbGJhY2sgd2hpY2ggaGFzIHRoZSBjbGFzcyBjb250ZXh0XG4vLyBib3VuZCB0byBpdCwgdGhpcyBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgaW4gdGhlIGNhbGxiYWNrIGRvZXNuJ3QgZ2V0IHRoZVxuLy8gY29udGV4dCBpbXBsaWNpdGx5LCBzbyBJIG11c3QgcGFzcyBpdC4gRG9lc24ndCBmZWVsIGNsZWFuLi4uXG5mdW5jdGlvbiBoYW5kbGVDbGljayhzZWxmLCBjZWxsLCBwYWdlWCwgcGFnZVkpe1xuXHRpZiAocGFnZVggPiBjZWxsLnggJiYgcGFnZVggPCBjZWxsLngrc2VsZi51bml2ZXJzZS5jZWxsTGVuZ3RoICYmXG5cdFx0XHRcdHBhZ2VZID4gY2VsbC55ICYmIHBhZ2VZIDwgY2VsbC55K3NlbGYudW5pdmVyc2UuY2VsbEhlaWdodCApIHtcblx0XHRjaGFuZ2VDZWxscyhzZWxmLCBjZWxsKTtcblx0fVxufVxuXG4vLyAxIHN0ZXAgPSAxIGdlbmVyYXRpb25cbmZ1bmN0aW9uIHN0ZXAoKXtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgY2VsbHNUb0NoYW5nZSA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRmb3IgKGxldCBqPTA7IGo8dGhpcy51bml2ZXJzZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRsZXQgY2VsbCA9IHRoaXMudW5pdmVyc2UuY2VsbHNbaV1bal07XG5cdFx0XHR0cmFuc2l0aW9ucyhzZWxmLCBjZWxsLCBjZWxsc1RvQ2hhbmdlKTtcblx0XHR9XG5cdH1cblx0Ly8gdXBkYXRlIHRoZSBjZWxscyB0aGF0IHNob3VsZCBiZSB1cGRhdGVkXG5cdGZvciAobGV0IGk9MDsgaTxjZWxsc1RvQ2hhbmdlLmxlbmd0aDsgaSsrKXtcblx0XHRsZXQgY2VsbCA9IGdldENlbGxCeUlkKHNlbGYsIGNlbGxzVG9DaGFuZ2VbaV0pO1xuXHRcdC8vIGlmIHRoZSBjZWxsIHN0YXRlIHdhcyAwIGNoYW5nZSB0byAxLCBhbmQgdmljZSB2ZXJzYS5cblx0XHRjaGFuZ2VDZWxscyhzZWxmLCBjZWxsKTtcblx0fVxufVxuXG4vKlxuKlx0cGFzcyB0aGUgY2VsbCB0aHJvdWdoIHRoZSA0IHJ1bGVzLiBcblx0Tm90ZTogY2VsbHMgc2hvdWxkIG5vdCB1cGRhdGUgaGVyZSwgc2luY2UgYWx0ZXJpbmcgMSBiZWZvcmUgeW91IGNhblxuXHRhbmFseXplIHRoZSBvdGhlcnMgd2lsbCBjYXVzZSBlcnJvbmVvdXMgb3V0Y29tZXMuXG4qL1xuZnVuY3Rpb24gdHJhbnNpdGlvbnMoc2VsZiwgY2VsbCwgY2VsbHNUb0NoYW5nZSkge1xuXHR2YXIgdW5pTGVuZ3RoID0gc2VsZi51bml2ZXJzZS5sZW5ndGg7XG5cdHZhciB1bmlIZWlnaHQgPSBzZWxmLnVuaXZlcnNlLmhlaWdodDtcblx0dmFyIG5laWdoYm91cnNBbGl2ZSA9IDA7XG5cdC8vIEdvIHRocm91Z2ggdGhlIG5laWdoYm91cnMgb2YgZWFjaCBjZWxsLlxuXHRmb3IgKGxldCBpPTA7IGk8ODsgaSsrKXtcblx0XHRsZXQgbmVpZ2hib3VySUQgPSBjZWxsLm5laWdoYm91cnNbaV07XG5cdFx0aWYgKG5laWdoYm91cklEID49IHVuaUxlbmd0aCp1bmlIZWlnaHQgfHwgbmVpZ2hib3VySUQgPDApIGNvbnRpbnVlO1xuXHRcdGxldCBuZWlnaGJvdXIgPSBnZXRDZWxsQnlJZChzZWxmLCBuZWlnaGJvdXJJRCk7XG5cdFx0aWYgKG5laWdoYm91ci5zdGF0ZSA9PT0gMSkgbmVpZ2hib3Vyc0FsaXZlKys7XG5cdH1cblx0aWYgKGNlbGwuc3RhdGUgPT09IDEpe1xuXHRcdC8vIHplIGxpZmUgcnVsZXNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gMSkgQW55IGxpdmUgY2VsbCB3aXRoIGZld2VyIHRoYW4gdHdvIGxpdmUgbmVpZ2hib3VycyBkaWVzLCBhcyBcblx0XHQvLyBpZiBjYXVzZWQgYnkgdW5kZXItcG9wdWxhdGlvbi5cblx0XHQvLyAyKSBBbnkgbGl2ZSBjZWxsIHdpdGggdHdvIG9yIHRocmVlIGxpdmUgbmVpZ2hib3VycyBsaXZlcyBvbiB0byBcblx0XHQvLyB0aGUgbmV4dCBnZW5lcmF0aW9uLlxuXHRcdGlmIChuZWlnaGJvdXJzQWxpdmUgPCAyKSBjZWxsc1RvQ2hhbmdlLnB1c2goY2VsbC5pZCk7XG5cdFx0Ly8gMykgQW55IGxpdmUgY2VsbCB3aXRoIG1vcmUgdGhhbiB0aHJlZSBsaXZlIG5laWdoYm91cnMgZGllcywgYXMgaWYgXG5cdFx0Ly8gYnkgb3ZlcmNyb3dkaW5nLlxuXHRcdGVsc2UgaWYgKG5laWdoYm91cnNBbGl2ZSA+IDMpIGNlbGxzVG9DaGFuZ2UucHVzaChjZWxsLmlkKTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyA0KSBBbnkgZGVhZCBjZWxsIHdpdGggZXhhY3RseSB0aHJlZSBsaXZlIG5laWdoYm91cnMgYmVjb21lcyBhIFxuXHRcdC8vIGxpdmUgY2VsbCwgYXMgaWYgYnkgcmVwcm9kdWN0aW9uLlxuXHRcdGlmIChuZWlnaGJvdXJzQWxpdmUgPT09IDMpIGNlbGxzVG9DaGFuZ2UucHVzaChjZWxsLmlkKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VDZWxscyhzZWxmLCBjZWxsKSB7XG5cdHNlbGYuY3R4LmZpbGxTdHlsZSA9IChjZWxsLnN0YXRlKSA/ICd3aGl0ZScgOiAnIzMzMyc7XG5cdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRzZWxmLnVuaXZlcnNlLmNlbGxMZW5ndGgtMiwgc2VsZi51bml2ZXJzZS5jZWxsSGVpZ2h0LTIpO1xuXHRjZWxsLnN0YXRlID0gKGNlbGwuc3RhdGUpID8gMCA6IDE7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxCeUlkKHNlbGYsIGlkKSB7XG5cdGxldCByb3cgPSBNYXRoLmZsb29yKGlkL3NlbGYudW5pdmVyc2UubGVuZ3RoKTtcblx0bGV0IGNvbHVtbiA9IGlkICUgc2VsZi51bml2ZXJzZS5sZW5ndGg7XG5cdHJldHVybiBzZWxmLnVuaXZlcnNlLmNlbGxzW3Jvd11bY29sdW1uXTtcbn0gXG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNsYXNzIFVuaXZlcnNlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0Ly8gdGhpcyB3aWxsIGJlIHRoZSB0aWxlbWFwLCAyRCBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSB1bml2ZXJzZVxuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmhlaWdodCA9IG9wdGlvbnMudW5pSGVpZ2h0O1xuXHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy51bmlMZW5ndGg7XG5cdFx0dGhpcy5jZWxsSGVpZ2h0ID0gb3B0aW9ucy5jZWxsSGVpZ2h0O1xuXHRcdHRoaXMuY2VsbExlbmd0aCA9IG9wdGlvbnMuY2VsbExlbmd0aDtcblx0fVxuXHRjcmVhdGUoKSB7XG5cdFx0Ly8gQXNzaWduIHRoZSB0aWxlbWFwIGluIHJlbGF0aW9uIHdpdGggdGhlIGxlbmd0aCBhbmQgaGVpZ2h0IG9mIHRoZSBcblx0XHQvLyB1bml2ZXJzZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLmhlaWdodDsgaSsrKSB7XG5cdFx0XHR0aGlzLmNlbGxzLnB1c2gobmV3IEFycmF5KCkpO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGo8dGhpcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHQvLyBhc3NpZ24gZWFjaCBjZWxsIGEgc3RydWN0dXJlIHdpdGggdGhlIGlkLCBzdGF0ZSBhbmQgXG5cdFx0XHRcdC8vIGNvb3JkaW5hdGVzIG9mIHRoYXQgY2VsbFxuXHRcdFx0XHRsZXQgaWQgPSBpKnRoaXMubGVuZ3RoK2pcblx0XHRcdFx0dGhpcy5jZWxsc1tpXS5wdXNoKHtcblx0XHRcdFx0XHRpZCwgXG5cdFx0XHRcdFx0c3RhdGU6MCxcblx0XHRcdFx0XHR4OmoqdGhpcy5jZWxsTGVuZ3RoLFxuXHRcdFx0XHRcdHk6aSp0aGlzLmNlbGxIZWlnaHQsXG5cdFx0XHRcdFx0bmVpZ2hib3VyczogW1xuXHRcdFx0XHRcdFx0Ly8gdG9wIG5laWdoYm91cnNcblx0XHRcdFx0XHRcdGlkLXRoaXMubGVuZ3RoLTEsIGlkLXRoaXMubGVuZ3RoLCBpZC10aGlzLmxlbmd0aCsxLFxuXHRcdFx0XHRcdFx0Ly8gc2lkZSBuZWlnYm91cnNcblx0XHRcdFx0XHRcdGlkLTEsIGlkKzEsXG5cdFx0XHRcdFx0XHQvL2JvdHRvbSBuZWlnYm91cnNcblx0XHRcdFx0XHRcdGlkK3RoaXMubGVuZ3RoLTEsIGlkK3RoaXMubGVuZ3RoLCBpZCt0aGlzLmxlbmd0aCsxIFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVW5pdmVyc2U7Il19
