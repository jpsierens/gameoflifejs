(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsUniverse = require('./js/Universe');

var _jsUniverse2 = _interopRequireDefault(_jsUniverse);

var _jsGame = require('./js/Game');

var _jsGame2 = _interopRequireDefault(_jsGame);

// in pixels
var CELL_LENGTH = 32;
var CELL_HEIGHT = 32;
// in cell units
var UNIVERSE_LENGTH = 15;
var UNIVERSE_HEIGHT = 15;

var universe = new _jsUniverse2['default']({
	uniLength: UNIVERSE_LENGTH,
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_LENGTH
});
universe.create();

var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');

var game = new _jsGame2['default']({
	// enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas: canvas,
	context: ctx,
	universe: universe
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
			var self = this;
			// remove god mode
			console.log('play game!');
			this.universeElem.removeEventListener('click', loopCells);
			// game loop
			setInterval(step.bind(this), 200);
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
		console.log(cell);
		if (cell.state === 0) {
			// make the cell alive
			cell.state = 1;
			// paint the block
			self.ctx.fillStyle = '#333';
			self.ctx.fillRect(cell.x + 1, cell.y + 1, self.universe.cellLength - 2, self.universe.cellHeight - 2);
		} else {
			// make the cell dead
			cell.state = 0;
			// paint the block
			self.ctx.fillStyle = 'white';
			self.ctx.fillRect(cell.x + 1, cell.y + 1, self.universe.cellLength - 2, self.universe.cellHeight - 2);
		}
	}
}

// 1 step = 1 generation
function step() {
	var self = this;
	for (var i = 0; i < this.universe.height; i++) {
		for (var j = 0; j < this.universe.length; j++) {
			var cell = this.universe.cells[i][j];
			transitions(self, cell);
		}
	}
}

function transitions(self, cell) {
	if (cell.state === 1) {
		// ze life rules
		// -------------------
		var uniLength = self.universe.length;
		var uniHeight = self.universe.height;
		var neighboursAlive = 0;
		for (var i = 0; i < 8; i++) {
			var neighbourID = cell.neighbours[i];
			if (neighbourID >= uniLength * uniHeight || neighbourID < 0) continue;
			var row = Math.floor(neighbourID / self.universe.length);
			var column = neighbourID % self.universe.length;
			var neighbour = self.universe.cells[row][column];
			if (neighbour.state === 1) neighboursAlive++;
		}
		// Any live cell with fewer than two live neighbours dies, as
		// if caused by under-population.
		if (neighboursAlive < 2) {
			cell.state = 0;
			self.ctx.fillStyle = 'white';
			self.ctx.fillRect(cell.x + 1, cell.y + 1, self.universe.cellLength - 2, self.universe.cellHeight - 2);
		}
	}
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
						id - 16, id - 15, id - 14,
						// side neigbours
						id - 1, id + 1,
						//bottom neigbours
						id + 14, id + 15, id + 16]
					});
				}
			}
		}
	}]);

	return Universe;
})();

module.exports = Universe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9hcHAuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9qcy9HYW1lLmpzIiwiL2hvbWUvanBzaWVyZW5zL1NpdGVzL2dhbWVvZmxpZmUvanMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OzBCQ0FxQixlQUFlOzs7O3NCQUNuQixXQUFXOzs7OztBQUc1QixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOztBQUUzQixJQUFJLFFBQVEsR0FBRyw0QkFBYTtBQUMzQixVQUFTLEVBQUUsZUFBZTtBQUMxQixVQUFTLEVBQUUsZUFBZTtBQUMxQixXQUFVLEVBQUUsV0FBVztBQUN2QixXQUFVLEVBQUUsV0FBVztDQUN2QixDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWxCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxJQUFJLEdBQUcsd0JBQVM7OztBQUduQixPQUFNLEVBQU4sTUFBTTtBQUNOLFFBQU8sRUFBRSxHQUFHO0FBQ1osU0FBUSxFQUFSLFFBQVE7Q0FDUixDQUFDLENBQUM7QUFDSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7Ozs7SUM3QlYsSUFBSTs7O0FBRUUsVUFGTixJQUFJLENBRUcsT0FBTyxF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LEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7O0FBRTdDLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7QUFDekMsT0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsY0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3RDO0VBQ0Q7Q0FDRDs7Ozs7O0FBTUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQzdDLEtBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQzFELEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFHO0FBQzlELFNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakIsTUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTs7QUFFckIsT0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7O0FBRWYsT0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQzVCLE9BQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUMs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RVYsUUFBRSxHQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxFQUFFLENBQ25CO01BQ0QsQ0FBQyxDQUFDO0tBQ0g7SUFDRDtHQUNEOzs7UUFsQ0ksUUFBUTs7O0FBcUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL2pzL1VuaXZlcnNlJztcbmltcG9ydCBHYW1lIGZyb20gJy4vanMvR2FtZSc7XG5cbi8vIGluIHBpeGVsc1xuY29uc3QgQ0VMTF9MRU5HVEggPSAzMjtcbmNvbnN0IENFTExfSEVJR0hUID0gMzI7XG4vLyBpbiBjZWxsIHVuaXRzXG5jb25zdCBVTklWRVJTRV9MRU5HVEggPSAxNTtcbmNvbnN0IFVOSVZFUlNFX0hFSUdIVCA9IDE1O1xuXG52YXIgdW5pdmVyc2UgPSBuZXcgVW5pdmVyc2Uoe1xuXHR1bmlMZW5ndGg6IFVOSVZFUlNFX0xFTkdUSCwgXG5cdHVuaUhlaWdodDogVU5JVkVSU0VfSEVJR0hULFxuXHRjZWxsTGVuZ3RoOiBDRUxMX0xFTkdUSCxcblx0Y2VsbEhlaWdodDogQ0VMTF9MRU5HVEhcbn0pO1xudW5pdmVyc2UuY3JlYXRlKCk7XG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcbnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZSh7XG5cdC8vIGVuaGFuY2VkIG9iamVjdCBsaXRlcmFsc1xuXHQvLyAnY2FudmFzLCcgaXMgdGhlIHNhbWUgYXMgJ2NhbnZhczogY2FudmFzLCdcblx0Y2FudmFzLFxuXHRjb250ZXh0OiBjdHgsXG5cdHVuaXZlcnNlXG59KTtcbmdhbWUuZHJhd0dyaWQoKTtcbmdhbWUuaW5pU2V0VXAoKTtcblxuIiwiY2xhc3MgR2FtZSB7XG5cdC8vIHNldCB1cCBpbnN0YW5jZSB2YXJpYWJsZXNcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0dGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcblx0XHR0aGlzLmN0eCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHR0aGlzLnVuaXZlcnNlID0gb3B0aW9ucy51bml2ZXJzZTtcblx0XHR0aGlzLnVuaXZlcnNlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml2ZXJzZScpO1xuXHR9XG5cdC8vIGluaXRpYWwgc2V0IHVwXG5cdGluaVNldFVwKCkge1xuXHRcdC8vIE5vdGU6IHVzaW5nIGJpbmQgdG8gcGFzcyB0aGUgY2xhc3MnIGNvbnRleHQgdG8gdGhlIGNhbGxiYWNrc1xuXHRcdC8vIG5vdCBzdXJlIGlmIHRoaXMgY2FuIGJlIGltcHJvdmVkLlxuXHRcdHRoaXMudW5pdmVyc2VFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9vcENlbGxzLmJpbmQodGhpcykpO1xuXHRcdC8vIHdoZW4gdXNlciBjbGljaywgc3RhcnQgdGhlIGdhbWVcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKVxuXHRcdFx0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wbGF5LmJpbmQodGhpcykpO1xuXHR9XG5cdC8vIHN0YXJ0IHRoZSBnYW1lXG5cdHBsYXkoZSl7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdC8vIHJlbW92ZSBnb2QgbW9kZVxuXHRcdGNvbnNvbGUubG9nKCdwbGF5IGdhbWUhJyk7XG5cdFx0dGhpcy51bml2ZXJzZUVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb29wQ2VsbHMpO1xuXHRcdC8vIGdhbWUgbG9vcFxuXHRcdHNldEludGVydmFsKHN0ZXAuYmluZCh0aGlzKSwgMjAwKTtcblx0fVxuXHQvLyBkcmF3IGdyaWRcblx0ZHJhd0dyaWQoKSB7XG5cdFx0dGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG5cdFx0dGhpcy5jdHgubGluZVdpZHRoID0gMTtcblx0XHQvLyB2ZXJ0aWNhbCBsaW5lc1xuXHRcdGZvciAobGV0IGkgPSAxOyBpPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmN0eC5tb3ZlVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksMCk7XG5cdFx0XHR0aGlzLmN0eC5saW5lVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksIFxuXHRcdFx0XHR0aGlzLnVuaXZlcnNlLmhlaWdodCp0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQpO1xuXHRcdFx0dGhpcy5jdHguc3Ryb2tlKCk7XG5cdFx0fVxuXHRcdC8vIGhvcml6b250YWwgbGluZXNcblx0XHRmb3IgKGxldCBpID0gMTsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRcdHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jdHgubW92ZVRvKDAsdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0KmkpO1xuXHRcdFx0dGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UubGVuZ3RoKnRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCwgXG5cdFx0XHRcdHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcblx0XHRcdHRoaXMuY3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBQcml2YXRlIG1ldGhvZHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIExvb3Agb3ZlciB0aGUgY2VsbHNcbmZ1bmN0aW9uIGxvb3BDZWxscyhlKSB7XG5cdHZhciB1bml2ZXJzZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcblx0dmFyIHBhZ2VYID0gZS5wYWdlWCAtIHVuaXZlcnNlRWxlbS5vZmZzZXRMZWZ0O1xuXHR2YXIgcGFnZVkgPSBlLnBhZ2VZIC0gdW5pdmVyc2VFbGVtLm9mZnNldFRvcDtcblxuXHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRmb3IgKGxldCBqPTA7IGo8dGhpcy51bml2ZXJzZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRsZXQgY2VsbCA9IHRoaXMudW5pdmVyc2UuY2VsbHNbaV1bal07XG5cdFx0XHRoYW5kbGVDbGljayh0aGlzLCBjZWxsLCBwYWdlWCwgcGFnZVkpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBnaXZlIGxpZmUgb3IgZGVhdGggdG8gdGhlIGNlbGwgY2xpY2tlZC5cbi8vIE5vdGU6IGJlY2F1c2UgbG9vcENlbGxzIGlzIGEgY2FsbGJhY2sgd2hpY2ggaGFzIHRoZSBjbGFzcyBjb250ZXh0XG4vLyBib3VuZCB0byBpdCwgdGhpcyBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgaW4gdGhlIGNhbGxiYWNrIGRvZXNuJ3QgZ2V0IHRoZVxuLy8gY29udGV4dCBpbXBsaWNpdGx5LCBzbyBJIG11c3QgcGFzcyBpdC4gRG9lc24ndCBmZWVsIGNsZWFuLi4uXG5mdW5jdGlvbiBoYW5kbGVDbGljayhzZWxmLCBjZWxsLCBwYWdlWCwgcGFnZVkpe1xuXHRpZiAocGFnZVggPiBjZWxsLnggJiYgcGFnZVggPCBjZWxsLngrc2VsZi51bml2ZXJzZS5jZWxsTGVuZ3RoICYmXG5cdFx0XHRcdHBhZ2VZID4gY2VsbC55ICYmIHBhZ2VZIDwgY2VsbC55K3NlbGYudW5pdmVyc2UuY2VsbEhlaWdodCApIHtcblx0XHRjb25zb2xlLmxvZyhjZWxsKVxuXHRcdGlmIChjZWxsLnN0YXRlID09PSAwKSB7XG5cdFx0XHQvLyBtYWtlIHRoZSBjZWxsIGFsaXZlXG5cdFx0XHRjZWxsLnN0YXRlID0gMTtcblx0XHRcdC8vIHBhaW50IHRoZSBibG9ja1xuXHRcdFx0c2VsZi5jdHguZmlsbFN0eWxlID0gJyMzMzMnO1xuXHRcdFx0c2VsZi5jdHguZmlsbFJlY3QoY2VsbC54KzEsIGNlbGwueSsxLCBcblx0XHRcdFx0c2VsZi51bml2ZXJzZS5jZWxsTGVuZ3RoLTIsIHNlbGYudW5pdmVyc2UuY2VsbEhlaWdodC0yKTtcblx0XHR9ZWxzZSB7XG5cdFx0XHQvLyBtYWtlIHRoZSBjZWxsIGRlYWRcblx0XHRcdGNlbGwuc3RhdGUgPSAwO1xuXHRcdFx0Ly8gcGFpbnQgdGhlIGJsb2NrXG5cdFx0XHRzZWxmLmN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0c2VsZi5jdHguZmlsbFJlY3QoY2VsbC54KzEsIGNlbGwueSsxLCBcblx0XHRcdFx0c2VsZi51bml2ZXJzZS5jZWxsTGVuZ3RoLTIsIHNlbGYudW5pdmVyc2UuY2VsbEhlaWdodC0yKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gMSBzdGVwID0gMSBnZW5lcmF0aW9uXG5mdW5jdGlvbiBzdGVwKCl7XG5cdHZhciBzZWxmID0gdGhpcztcblx0Zm9yIChsZXQgaSA9IDA7IGk8dGhpcy51bml2ZXJzZS5oZWlnaHQ7IGkrKyl7XG5cdFx0Zm9yIChsZXQgaj0wOyBqPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBqKyspe1xuXHRcdFx0bGV0IGNlbGwgPSB0aGlzLnVuaXZlcnNlLmNlbGxzW2ldW2pdO1xuXHRcdFx0dHJhbnNpdGlvbnMoc2VsZiwgY2VsbCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25zKHNlbGYsIGNlbGwpIHtcblx0aWYgKGNlbGwuc3RhdGUgPT09IDEpe1xuXHRcdC8vIHplIGxpZmUgcnVsZXNcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0dmFyIHVuaUxlbmd0aCA9IHNlbGYudW5pdmVyc2UubGVuZ3RoO1xuXHRcdHZhciB1bmlIZWlnaHQgPSBzZWxmLnVuaXZlcnNlLmhlaWdodDtcblx0XHR2YXIgbmVpZ2hib3Vyc0FsaXZlID0gMDtcblx0XHRmb3IgKGxldCBpPTA7IGk8ODsgaSsrKXtcblx0XHRcdGxldCBuZWlnaGJvdXJJRCA9IGNlbGwubmVpZ2hib3Vyc1tpXTtcblx0XHRcdGlmIChuZWlnaGJvdXJJRCA+PSB1bmlMZW5ndGgqdW5pSGVpZ2h0IHx8IG5laWdoYm91cklEIDwwKSBjb250aW51ZTtcblx0XHRcdGxldCByb3cgPSBNYXRoLmZsb29yKG5laWdoYm91cklEL3NlbGYudW5pdmVyc2UubGVuZ3RoKTtcblx0XHRcdGxldCBjb2x1bW4gPSBuZWlnaGJvdXJJRCAlIHNlbGYudW5pdmVyc2UubGVuZ3RoO1xuXHRcdFx0bGV0IG5laWdoYm91ciA9IHNlbGYudW5pdmVyc2UuY2VsbHNbcm93XVtjb2x1bW5dO1xuXHRcdFx0aWYgKG5laWdoYm91ci5zdGF0ZSA9PT0gMSkgbmVpZ2hib3Vyc0FsaXZlKys7XG5cdFx0fVxuXHRcdC8vIEFueSBsaXZlIGNlbGwgd2l0aCBmZXdlciB0aGFuIHR3byBsaXZlIG5laWdoYm91cnMgZGllcywgYXMgXG5cdFx0Ly8gaWYgY2F1c2VkIGJ5IHVuZGVyLXBvcHVsYXRpb24uXG5cdFx0aWYgKG5laWdoYm91cnNBbGl2ZSA8IDIpIHtcblx0XHRcdGNlbGwuc3RhdGUgPSAwO1xuXHRcdFx0c2VsZi5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRcdHNlbGYudW5pdmVyc2UuY2VsbExlbmd0aC0yLCBzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQtMik7XG5cdFx0fVxuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNsYXNzIFVuaXZlcnNlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0Ly8gdGhpcyB3aWxsIGJlIHRoZSB0aWxlbWFwLCAyRCBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSB1bml2ZXJzZVxuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmhlaWdodCA9IG9wdGlvbnMudW5pSGVpZ2h0O1xuXHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy51bmlMZW5ndGg7XG5cdFx0dGhpcy5jZWxsSGVpZ2h0ID0gb3B0aW9ucy5jZWxsSGVpZ2h0O1xuXHRcdHRoaXMuY2VsbExlbmd0aCA9IG9wdGlvbnMuY2VsbExlbmd0aDtcblx0fVxuXHRjcmVhdGUoKSB7XG5cdFx0Ly8gQXNzaWduIHRoZSB0aWxlbWFwIGluIHJlbGF0aW9uIHdpdGggdGhlIGxlbmd0aCBhbmQgaGVpZ2h0IG9mIHRoZSBcblx0XHQvLyB1bml2ZXJzZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLmhlaWdodDsgaSsrKSB7XG5cdFx0XHR0aGlzLmNlbGxzLnB1c2gobmV3IEFycmF5KCkpO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGo8dGhpcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHQvLyBhc3NpZ24gZWFjaCBjZWxsIGEgc3RydWN0dXJlIHdpdGggdGhlIGlkLCBzdGF0ZSBhbmQgXG5cdFx0XHRcdC8vIGNvb3JkaW5hdGVzIG9mIHRoYXQgY2VsbFxuXHRcdFx0XHRsZXQgaWQgPSBpKnRoaXMubGVuZ3RoK2pcblx0XHRcdFx0dGhpcy5jZWxsc1tpXS5wdXNoKHtcblx0XHRcdFx0XHRpZCwgXG5cdFx0XHRcdFx0c3RhdGU6MCxcblx0XHRcdFx0XHR4OmoqdGhpcy5jZWxsTGVuZ3RoLFxuXHRcdFx0XHRcdHk6aSp0aGlzLmNlbGxIZWlnaHQsXG5cdFx0XHRcdFx0bmVpZ2hib3VyczogW1xuXHRcdFx0XHRcdFx0Ly8gdG9wIG5laWdoYm91cnNcblx0XHRcdFx0XHRcdGlkLTE2LCBpZC0xNSwgaWQtMTQsXG5cdFx0XHRcdFx0XHQvLyBzaWRlIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQtMSwgaWQrMSxcblx0XHRcdFx0XHRcdC8vYm90dG9tIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQrMTQsIGlkKzE1LCBpZCsxNiBcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaXZlcnNlOyJdfQ==
