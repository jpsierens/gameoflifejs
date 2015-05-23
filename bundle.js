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
		// Any live cell with fewer than two live neighbours dies, as
		// if caused by under-population.
		var neighboursAlive = 0;
		for (var i = 0; i < 8; i++) {
			var neighbourID = cell.neighbours[i];
			var row = Math.floor(neighbourID / self.universe.length);
			var column = neighbourID % self.universe.length;
			var neighbour = self.universe.cells[row][column];
			if (neighbour.state === 1) neighboursAlive++;
		}
		if (neighboursAlive < 2) {
			console.log('kill!');
			console.log(cell.x);
			cell.state = 0;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9hcHAuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9qcy9HYW1lLmpzIiwiL2hvbWUvanBzaWVyZW5zL1NpdGVzL2dhbWVvZmxpZmUvanMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OzBCQ0FxQixlQUFlOzs7O3NCQUNuQixXQUFXOzs7OztBQUc1QixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOztBQUUzQixJQUFJLFFBQVEsR0FBRyw0QkFBYTtBQUMzQixVQUFTLEVBQUUsZUFBZTtBQUMxQixVQUFTLEVBQUUsZUFBZTtBQUMxQixXQUFVLEVBQUUsV0FBVztBQUN2QixXQUFVLEVBQUUsV0FBVztDQUN2QixDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWxCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxJQUFJLEdBQUcsd0JBQVM7OztBQUduQixPQUFNLEVBQU4sTUFBTTtBQUNOLFFBQU8sRUFBRSxHQUFHO0FBQ1osU0FBUSxFQUFSLFFBQVE7Q0FDUixDQUFDLENBQUM7QUFDSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7Ozs7SUM3QlYsSUFBSTs7O0FBRUUsVUFGTixJQUFJLENBRUcsT0FBTyxF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LEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7O0FBRTdDLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7QUFDekMsT0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsY0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3RDO0VBQ0Q7Q0FDRDs7Ozs7O0FBTUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQzdDLEtBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQzFELEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFHO0FBQzlELFNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakIsTUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTs7QUFFckIsT0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7O0FBRWYsT0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQzVCLE9BQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUMs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QUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi9qcy9Vbml2ZXJzZSc7XG5pbXBvcnQgR2FtZSBmcm9tICcuL2pzL0dhbWUnO1xuXG4vLyBpbiBwaXhlbHNcbmNvbnN0IENFTExfTEVOR1RIID0gMzI7XG5jb25zdCBDRUxMX0hFSUdIVCA9IDMyO1xuLy8gaW4gY2VsbCB1bml0c1xuY29uc3QgVU5JVkVSU0VfTEVOR1RIID0gMTU7XG5jb25zdCBVTklWRVJTRV9IRUlHSFQgPSAxNTtcblxudmFyIHVuaXZlcnNlID0gbmV3IFVuaXZlcnNlKHtcblx0dW5pTGVuZ3RoOiBVTklWRVJTRV9MRU5HVEgsIFxuXHR1bmlIZWlnaHQ6IFVOSVZFUlNFX0hFSUdIVCxcblx0Y2VsbExlbmd0aDogQ0VMTF9MRU5HVEgsXG5cdGNlbGxIZWlnaHQ6IENFTExfTEVOR1RIXG59KTtcbnVuaXZlcnNlLmNyZWF0ZSgpO1xuXG52YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciBnYW1lID0gbmV3IEdhbWUoe1xuXHQvLyBlbmhhbmNlZCBvYmplY3QgbGl0ZXJhbHNcblx0Ly8gJ2NhbnZhcywnIGlzIHRoZSBzYW1lIGFzICdjYW52YXM6IGNhbnZhcywnXG5cdGNhbnZhcyxcblx0Y29udGV4dDogY3R4LFxuXHR1bml2ZXJzZVxufSk7XG5nYW1lLmRyYXdHcmlkKCk7XG5nYW1lLmluaVNldFVwKCk7XG5cbiIsImNsYXNzIEdhbWUge1xuXHQvLyBzZXQgdXAgaW5zdGFuY2UgdmFyaWFibGVzXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuXHRcdHRoaXMuY2FudmFzID0gb3B0aW9ucy5jYW52YXM7XG5cdFx0dGhpcy5jdHggPSBvcHRpb25zLmNvbnRleHQ7XG5cdFx0dGhpcy51bml2ZXJzZSA9IG9wdGlvbnMudW5pdmVyc2U7XG5cdFx0dGhpcy51bml2ZXJzZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcblx0fVxuXHQvLyBpbml0aWFsIHNldCB1cFxuXHRpbmlTZXRVcCgpIHtcblx0XHQvLyBOb3RlOiB1c2luZyBiaW5kIHRvIHBhc3MgdGhlIGNsYXNzJyBjb250ZXh0IHRvIHRoZSBjYWxsYmFja3Ncblx0XHQvLyBub3Qgc3VyZSBpZiB0aGlzIGNhbiBiZSBpbXByb3ZlZC5cblx0XHR0aGlzLnVuaXZlcnNlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvb3BDZWxscy5iaW5kKHRoaXMpKTtcblx0XHQvLyB3aGVuIHVzZXIgY2xpY2ssIHN0YXJ0IHRoZSBnYW1lXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jylcblx0XHRcdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucGxheS5iaW5kKHRoaXMpKTtcblx0fVxuXHQvLyBzdGFydCB0aGUgZ2FtZVxuXHRwbGF5KGUpe1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHQvLyByZW1vdmUgZ29kIG1vZGVcblx0XHRjb25zb2xlLmxvZygncGxheSBnYW1lIScpO1xuXHRcdHRoaXMudW5pdmVyc2VFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9vcENlbGxzKTtcblx0XHQvLyBnYW1lIGxvb3Bcblx0XHRzZXRJbnRlcnZhbChzdGVwLmJpbmQodGhpcyksIDIwMCk7XG5cdH1cblx0Ly8gZHJhdyBncmlkXG5cdGRyYXdHcmlkKCkge1xuXHRcdHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJyM3NzcnO1xuXHRcdHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XG5cdFx0Ly8gdmVydGljYWwgbGluZXNcblx0XHRmb3IgKGxldCBpID0gMTsgaTx0aGlzLnVuaXZlcnNlLmxlbmd0aDsgaSsrKXtcblx0XHRcdHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jdHgubW92ZVRvKHRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCppLDApO1xuXHRcdFx0dGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCppLCBcblx0XHRcdFx0dGhpcy51bml2ZXJzZS5oZWlnaHQqdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0KTtcblx0XHRcdHRoaXMuY3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0XHQvLyBob3Jpem9udGFsIGxpbmVzXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGk8dGhpcy51bml2ZXJzZS5oZWlnaHQ7IGkrKyl7XG5cdFx0XHR0aGlzLmN0eC5iZWdpblBhdGgoKTtcblx0XHRcdHRoaXMuY3R4Lm1vdmVUbygwLHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcblx0XHRcdHRoaXMuY3R4LmxpbmVUbyh0aGlzLnVuaXZlcnNlLmxlbmd0aCp0aGlzLnVuaXZlcnNlLmNlbGxMZW5ndGgsIFxuXHRcdFx0XHR0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQqaSk7XG5cdFx0XHR0aGlzLmN0eC5zdHJva2UoKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gUHJpdmF0ZSBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBMb29wIG92ZXIgdGhlIGNlbGxzXG5mdW5jdGlvbiBsb29wQ2VsbHMoZSkge1xuXHR2YXIgdW5pdmVyc2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG5cdHZhciBwYWdlWCA9IGUucGFnZVggLSB1bml2ZXJzZUVsZW0ub2Zmc2V0TGVmdDtcblx0dmFyIHBhZ2VZID0gZS5wYWdlWSAtIHVuaXZlcnNlRWxlbS5vZmZzZXRUb3A7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGk8dGhpcy51bml2ZXJzZS5oZWlnaHQ7IGkrKyl7XG5cdFx0Zm9yIChsZXQgaj0wOyBqPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBqKyspe1xuXHRcdFx0bGV0IGNlbGwgPSB0aGlzLnVuaXZlcnNlLmNlbGxzW2ldW2pdO1xuXHRcdFx0aGFuZGxlQ2xpY2sodGhpcywgY2VsbCwgcGFnZVgsIHBhZ2VZKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gZ2l2ZSBsaWZlIG9yIGRlYXRoIHRvIHRoZSBjZWxsIGNsaWNrZWQuXG4vLyBOb3RlOiBiZWNhdXNlIGxvb3BDZWxscyBpcyBhIGNhbGxiYWNrIHdoaWNoIGhhcyB0aGUgY2xhc3MgY29udGV4dFxuLy8gYm91bmQgdG8gaXQsIHRoaXMgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHRoZSBjYWxsYmFjayBkb2Vzbid0IGdldCB0aGVcbi8vIGNvbnRleHQgaW1wbGljaXRseSwgc28gSSBtdXN0IHBhc3MgaXQuIERvZXNuJ3QgZmVlbCBjbGVhbi4uLlxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soc2VsZiwgY2VsbCwgcGFnZVgsIHBhZ2VZKXtcblx0aWYgKHBhZ2VYID4gY2VsbC54ICYmIHBhZ2VYIDwgY2VsbC54K3NlbGYudW5pdmVyc2UuY2VsbExlbmd0aCAmJlxuXHRcdFx0XHRwYWdlWSA+IGNlbGwueSAmJiBwYWdlWSA8IGNlbGwueStzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQgKSB7XG5cdFx0Y29uc29sZS5sb2coY2VsbClcblx0XHRpZiAoY2VsbC5zdGF0ZSA9PT0gMCkge1xuXHRcdFx0Ly8gbWFrZSB0aGUgY2VsbCBhbGl2ZVxuXHRcdFx0Y2VsbC5zdGF0ZSA9IDE7XG5cdFx0XHQvLyBwYWludCB0aGUgYmxvY2tcblx0XHRcdHNlbGYuY3R4LmZpbGxTdHlsZSA9ICcjMzMzJztcblx0XHRcdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRcdHNlbGYudW5pdmVyc2UuY2VsbExlbmd0aC0yLCBzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQtMik7XG5cdFx0fWVsc2Uge1xuXHRcdFx0Ly8gbWFrZSB0aGUgY2VsbCBkZWFkXG5cdFx0XHRjZWxsLnN0YXRlID0gMDtcblx0XHRcdC8vIHBhaW50IHRoZSBibG9ja1xuXHRcdFx0c2VsZi5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRcdHNlbGYudW5pdmVyc2UuY2VsbExlbmd0aC0yLCBzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQtMik7XG5cdFx0fVxuXHR9XG59XG5cbi8vIDEgc3RlcCA9IDEgZ2VuZXJhdGlvblxuZnVuY3Rpb24gc3RlcCgpe1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdGZvciAobGV0IGkgPSAwOyBpPHRoaXMudW5pdmVyc2UuaGVpZ2h0OyBpKyspe1xuXHRcdGZvciAobGV0IGo9MDsgajx0aGlzLnVuaXZlcnNlLmxlbmd0aDsgaisrKXtcblx0XHRcdGxldCBjZWxsID0gdGhpcy51bml2ZXJzZS5jZWxsc1tpXVtqXTtcblx0XHRcdHRyYW5zaXRpb25zKHNlbGYsIGNlbGwpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9ucyhzZWxmLCBjZWxsKSB7XG5cdGlmIChjZWxsLnN0YXRlID09PSAxKXtcblx0XHQvLyB6ZSBsaWZlIHJ1bGVzXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIEFueSBsaXZlIGNlbGwgd2l0aCBmZXdlciB0aGFuIHR3byBsaXZlIG5laWdoYm91cnMgZGllcywgYXMgXG5cdFx0Ly8gaWYgY2F1c2VkIGJ5IHVuZGVyLXBvcHVsYXRpb24uXG5cdFx0dmFyIG5laWdoYm91cnNBbGl2ZSA9IDA7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPDg7IGkrKyl7XG5cdFx0XHRsZXQgbmVpZ2hib3VySUQgPSBjZWxsLm5laWdoYm91cnNbaV07XG5cdFx0XHRsZXQgcm93ID0gTWF0aC5mbG9vcihuZWlnaGJvdXJJRC9zZWxmLnVuaXZlcnNlLmxlbmd0aCk7XG5cdFx0XHRsZXQgY29sdW1uID0gbmVpZ2hib3VySUQgJSBzZWxmLnVuaXZlcnNlLmxlbmd0aDtcblx0XHRcdGxldCBuZWlnaGJvdXIgPSBzZWxmLnVuaXZlcnNlLmNlbGxzW3Jvd11bY29sdW1uXTtcblx0XHRcdGlmIChuZWlnaGJvdXIuc3RhdGUgPT09IDEpIG5laWdoYm91cnNBbGl2ZSsrO1xuXHRcdH1cblx0XHRpZiAobmVpZ2hib3Vyc0FsaXZlIDwgMikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2tpbGwhJyk7XG5cdFx0XHRjb25zb2xlLmxvZyhjZWxsLngpXG5cdFx0XHRjZWxsLnN0YXRlID0gMDtcblx0XHRcdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRcdHNlbGYudW5pdmVyc2UuY2VsbExlbmd0aC0yLCBzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQtMik7XG5cdFx0fVxuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNsYXNzIFVuaXZlcnNlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0Ly8gdGhpcyB3aWxsIGJlIHRoZSB0aWxlbWFwLCAyRCBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSB1bml2ZXJzZVxuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmhlaWdodCA9IG9wdGlvbnMudW5pSGVpZ2h0O1xuXHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy51bmlMZW5ndGg7XG5cdFx0dGhpcy5jZWxsSGVpZ2h0ID0gb3B0aW9ucy5jZWxsSGVpZ2h0O1xuXHRcdHRoaXMuY2VsbExlbmd0aCA9IG9wdGlvbnMuY2VsbExlbmd0aDtcblx0fVxuXHRjcmVhdGUoKSB7XG5cdFx0Ly8gQXNzaWduIHRoZSB0aWxlbWFwIGluIHJlbGF0aW9uIHdpdGggdGhlIGxlbmd0aCBhbmQgaGVpZ2h0IG9mIHRoZSBcblx0XHQvLyB1bml2ZXJzZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLmhlaWdodDsgaSsrKSB7XG5cdFx0XHR0aGlzLmNlbGxzLnB1c2gobmV3IEFycmF5KCkpO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGo8dGhpcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHQvLyBhc3NpZ24gZWFjaCBjZWxsIGEgc3RydWN0dXJlIHdpdGggdGhlIGlkLCBzdGF0ZSBhbmQgXG5cdFx0XHRcdC8vIGNvb3JkaW5hdGVzIG9mIHRoYXQgY2VsbFxuXHRcdFx0XHRsZXQgaWQgPSBpKnRoaXMubGVuZ3RoK2pcblx0XHRcdFx0dGhpcy5jZWxsc1tpXS5wdXNoKHtcblx0XHRcdFx0XHRpZCwgXG5cdFx0XHRcdFx0c3RhdGU6MCxcblx0XHRcdFx0XHR4OmoqdGhpcy5jZWxsTGVuZ3RoLFxuXHRcdFx0XHRcdHk6aSp0aGlzLmNlbGxIZWlnaHQsXG5cdFx0XHRcdFx0bmVpZ2hib3VyczogW1xuXHRcdFx0XHRcdFx0Ly8gdG9wIG5laWdoYm91cnNcblx0XHRcdFx0XHRcdGlkLTE2LCBpZC0xNSwgaWQtMTQsXG5cdFx0XHRcdFx0XHQvLyBzaWRlIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQtMSwgaWQrMSxcblx0XHRcdFx0XHRcdC8vYm90dG9tIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQrMTQsIGlkKzE1LCBpZCsxNiBcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaXZlcnNlOyJdfQ==
