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
	// ES6: enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas: canvas,
	context: ctx,
	universe: universe
});
game.drawGrid();
game.iniSetUp();

// ctx.strokeStyle = '#777';
// ctx.lineWidth = 1;
// // vertical lines
// for (let i = 1; i<UNIVERSE_LENGTH; i++){
// 	ctx.beginPath();
// 	ctx.moveTo(CELL_LENGTH*i,0);
// 	ctx.lineTo(CELL_LENGTH*i, UNIVERSE_HEIGHT*CELL_LENGTH);
// 	ctx.stroke();
// }
// // horizontal lines
// for (let i = 1; i<UNIVERSE_HEIGHT; i++){
// 	ctx.beginPath();
// 	ctx.moveTo(0,CELL_LENGTH*i);
// 	ctx.lineTo(UNIVERSE_LENGTH*CELL_LENGTH, CELL_LENGTH*i);
// 	ctx.stroke();
// }

},{"./js/Game":2,"./js/Universe":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Game = (function () {
	function Game(options) {
		_classCallCheck(this, Game);

		this.canvas = options.canvas;
		this.ctx = options.context;
		this.universe = options.universe;
		this.universeElem = document.getElementById('universe');
	}

	_createClass(Game, [{
		key: 'iniSetUp',

		// make a cell live (1) or die (0)
		value: function iniSetUp() {

			this.universeElem.addEventListener('click', loopCells.bind(this));

			// when user click, start the game
			document.getElementById('start').addEventListener('click', this.play.bind(this));
		}
	}, {
		key: 'play',

		// start the game
		value: function play() {
			// remove god mode
			console.log('play game!');
			this.universeElem.removeEventListener('click', loopCells);
			// loop over each cell
			for (var i = 0; i < this.universe.cellHeight; i++) {
				for (var j = 0; j < this.universe.cellLength; j++) {
					var cell = universe.cells[i][j];
					if (cell.state === 1) {}
				}
			}
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
// ----

function loopCells(e) {
	var universeElem = document.getElementById('universe');
	var pageX = e.pageX - universeElem.offsetLeft;
	var pageY = e.pageY - universeElem.offsetTop;
	console.log(pageX, pageY);

	for (var i = 0; i < this.universe.height; i++) {
		for (var j = 0; j < this.universe.length; j++) {
			var cell = this.universe.cells[i][j];
			handleClick(this, cell, pageX, pageY);
		}
	}
}

function handleClick(self, cell, pageX, pageY) {
	if (pageX > cell.x && pageX < cell.x + self.universe.cellLength && pageY > cell.y && pageY < cell.y + self.universe.cellHeight) {
		if (cell.state === 0) {
			// make the cell alive
			cell.state = 1;
			// paint the block
			self.ctx.fillStyle = '#333';
			self.ctx.fillRect(cell.x + 1, cell.y + 1, self.universe.cellLength - 2, self.universe.cellHeight - 2);
		} else {
			// make the cell alive
			cell.state = 0;
			// paint the block
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
					this.cells[i].push({
						id: i * this.length + j,
						state: 0,
						x: j * this.cellLength,
						y: i * this.cellHeight
					});
				}
			}
		}
	}]);

	return Universe;
})();

module.exports = Universe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanBzaWVyZW5zL1NpdGVzL3BlcnNvbmFsL2dhbWVvZmxpZmVqcy9hcHAuanMiLCIvVXNlcnMvanBzaWVyZW5zL1NpdGVzL3BlcnNvbmFsL2dhbWVvZmxpZmVqcy9qcy9HYW1lLmpzIiwiL1VzZXJzL2pwc2llcmVucy9TaXRlcy9wZXJzb25hbC9nYW1lb2ZsaWZlanMvanMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OzBCQ0FxQixlQUFlOzs7O3NCQUNuQixXQUFXOzs7OztBQUc1QixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOztBQUUzQixJQUFJLFFBQVEsR0FBRyw0QkFBYTtBQUMzQixVQUFTLEVBQUUsZUFBZTtBQUMxQixVQUFTLEVBQUUsZUFBZTtBQUMxQixXQUFVLEVBQUUsV0FBVztBQUN2QixXQUFVLEVBQUUsV0FBVztDQUN2QixDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWxCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxJQUFJLEdBQUcsd0JBQVM7OztBQUduQixPQUFNLEVBQU4sTUFBTTtBQUNOLFFBQU8sRUFBRSxHQUFHO0FBQ1osU0FBUSxFQUFSLFFBQVE7Q0FDUixDQUFDLENBQUM7QUFDSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7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QUFVLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQjtHQUNEOzs7UUFsREksSUFBSTs7Ozs7O0FBd0RWLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUNyQixLQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZELEtBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUM5QyxLQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDN0MsUUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTFCLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7QUFDekMsT0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsY0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3RDO0VBQ0Q7Q0FDRDs7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7QUFDN0MsS0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFDMUQsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUc7QUFDOUQsTUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTs7QUFFckIsT0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7O0FBRWYsT0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQzVCLE9BQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxDQUFDLENBQUM7R0FDekQsTUFBSzs7QUFFTCxPQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzs7QUFFZixPQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDN0IsT0FBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6RDtFQUNEO0NBQ0Q7O0FBR0QsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7OztJQzVGaEIsUUFBUTtBQUNGLFVBRE4sUUFBUSxDQUNELE9BQU8sRUFBQzt3QkFEZixRQUFROzs7QUFHWixNQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDaEMsTUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUNyQyxNQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7RUFDckM7O2NBUkksUUFBUTs7U0FTUCxrQkFBRzs7O0FBR1IsUUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzs7QUFHbkMsU0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEIsUUFBRSxFQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUM7QUFDbEIsV0FBSyxFQUFDLENBQUM7QUFDUCxPQUFDLEVBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVO0FBQ25CLE9BQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVU7TUFDbkIsQ0FBQyxDQUFDO0tBQ0g7SUFDRDtHQUNEOzs7UUF6QkksUUFBUTs7O0FBNEJkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL2pzL1VuaXZlcnNlJztcbmltcG9ydCBHYW1lIGZyb20gJy4vanMvR2FtZSc7XG5cbi8vIGluIHBpeGVsc1xuY29uc3QgQ0VMTF9MRU5HVEggPSAzMjtcbmNvbnN0IENFTExfSEVJR0hUID0gMzI7XG4vLyBpbiBjZWxsIHVuaXRzXG5jb25zdCBVTklWRVJTRV9MRU5HVEggPSAxNTtcbmNvbnN0IFVOSVZFUlNFX0hFSUdIVCA9IDE1O1xuXG52YXIgdW5pdmVyc2UgPSBuZXcgVW5pdmVyc2Uoe1xuXHR1bmlMZW5ndGg6IFVOSVZFUlNFX0xFTkdUSCwgXG5cdHVuaUhlaWdodDogVU5JVkVSU0VfSEVJR0hULFxuXHRjZWxsTGVuZ3RoOiBDRUxMX0xFTkdUSCxcblx0Y2VsbEhlaWdodDogQ0VMTF9MRU5HVEhcbn0pO1xudW5pdmVyc2UuY3JlYXRlKCk7XG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcbnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZSh7XG5cdC8vIEVTNjogZW5oYW5jZWQgb2JqZWN0IGxpdGVyYWxzXG5cdC8vICdjYW52YXMsJyBpcyB0aGUgc2FtZSBhcyAnY2FudmFzOiBjYW52YXMsJ1xuXHRjYW52YXMsXG5cdGNvbnRleHQ6IGN0eCxcblx0dW5pdmVyc2Vcbn0pO1xuZ2FtZS5kcmF3R3JpZCgpO1xuZ2FtZS5pbmlTZXRVcCgpO1xuXG4vLyBjdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG4vLyBjdHgubGluZVdpZHRoID0gMTtcbi8vIC8vIHZlcnRpY2FsIGxpbmVzXG4vLyBmb3IgKGxldCBpID0gMTsgaTxVTklWRVJTRV9MRU5HVEg7IGkrKyl7XG4vLyBcdGN0eC5iZWdpblBhdGgoKTtcbi8vIFx0Y3R4Lm1vdmVUbyhDRUxMX0xFTkdUSCppLDApO1xuLy8gXHRjdHgubGluZVRvKENFTExfTEVOR1RIKmksIFVOSVZFUlNFX0hFSUdIVCpDRUxMX0xFTkdUSCk7XG4vLyBcdGN0eC5zdHJva2UoKTtcbi8vIH1cbi8vIC8vIGhvcml6b250YWwgbGluZXNcbi8vIGZvciAobGV0IGkgPSAxOyBpPFVOSVZFUlNFX0hFSUdIVDsgaSsrKXtcbi8vIFx0Y3R4LmJlZ2luUGF0aCgpO1xuLy8gXHRjdHgubW92ZVRvKDAsQ0VMTF9MRU5HVEgqaSk7XG4vLyBcdGN0eC5saW5lVG8oVU5JVkVSU0VfTEVOR1RIKkNFTExfTEVOR1RILCBDRUxMX0xFTkdUSCppKTtcbi8vIFx0Y3R4LnN0cm9rZSgpO1xuLy8gfVxuXG4iLCJjbGFzcyBHYW1lIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0dGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcblx0XHR0aGlzLmN0eCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHR0aGlzLnVuaXZlcnNlID0gb3B0aW9ucy51bml2ZXJzZTtcblx0XHR0aGlzLnVuaXZlcnNlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml2ZXJzZScpO1xuXHR9XG5cdC8vIG1ha2UgYSBjZWxsIGxpdmUgKDEpIG9yIGRpZSAoMClcblx0aW5pU2V0VXAoKSB7XG5cblx0XHR0aGlzLnVuaXZlcnNlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvb3BDZWxscy5iaW5kKHRoaXMpKTtcblxuXHRcdC8vIHdoZW4gdXNlciBjbGljaywgc3RhcnQgdGhlIGdhbWVcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucGxheS5iaW5kKHRoaXMpKTtcblx0fVxuXHQvLyBzdGFydCB0aGUgZ2FtZVxuXHRwbGF5KCl7XG5cdFx0Ly8gcmVtb3ZlIGdvZCBtb2RlXG5cdFx0Y29uc29sZS5sb2coJ3BsYXkgZ2FtZSEnKTtcblx0XHR0aGlzLnVuaXZlcnNlRWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGxvb3BDZWxscyk7XG5cdFx0Ly8gbG9vcCBvdmVyIGVhY2ggY2VsbFxuXHRcdGZvciAobGV0IGkgPSAwOyBpPHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodDsgaSsrKXtcblx0XHRcdGZvciAobGV0IGo9MDsgajx0aGlzLnVuaXZlcnNlLmNlbGxMZW5ndGg7IGorKyl7XG5cdFx0XHRcdGxldCBjZWxsID0gdW5pdmVyc2UuY2VsbHNbaV1bal07XG5cdFx0XHRcdGlmIChjZWxsLnN0YXRlID09PSAxKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvLyBkcmF3IGdyaWRcblx0ZHJhd0dyaWQoKSB7XG5cdFx0dGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG5cdFx0dGhpcy5jdHgubGluZVdpZHRoID0gMTtcblx0XHQvLyB2ZXJ0aWNhbCBsaW5lc1xuXHRcdGZvciAobGV0IGkgPSAxOyBpPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmN0eC5tb3ZlVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksMCk7XG5cdFx0XHR0aGlzLmN0eC5saW5lVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksIFxuXHRcdFx0XHR0aGlzLnVuaXZlcnNlLmhlaWdodCp0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQpO1xuXHRcdFx0dGhpcy5jdHguc3Ryb2tlKCk7XG5cdFx0fVxuXHRcdC8vIGhvcml6b250YWwgbGluZXNcblx0XHRmb3IgKGxldCBpID0gMTsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcblx0XHRcdHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jdHgubW92ZVRvKDAsdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0KmkpO1xuXHRcdFx0dGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UubGVuZ3RoKnRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCwgXG5cdFx0XHRcdHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcblx0XHRcdHRoaXMuY3R4LnN0cm9rZSgpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBQcml2YXRlIG1ldGhvZHNcbi8vIC0tLS1cblxuZnVuY3Rpb24gbG9vcENlbGxzKGUpIHtcblx0dmFyIHVuaXZlcnNlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml2ZXJzZScpO1xuXHR2YXIgcGFnZVggPSBlLnBhZ2VYIC0gdW5pdmVyc2VFbGVtLm9mZnNldExlZnQ7XG5cdHZhciBwYWdlWSA9IGUucGFnZVkgLSB1bml2ZXJzZUVsZW0ub2Zmc2V0VG9wO1xuXHRjb25zb2xlLmxvZyhwYWdlWCwgcGFnZVkpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpPHRoaXMudW5pdmVyc2UuaGVpZ2h0OyBpKyspe1xuXHRcdGZvciAobGV0IGo9MDsgajx0aGlzLnVuaXZlcnNlLmxlbmd0aDsgaisrKXtcblx0XHRcdGxldCBjZWxsID0gdGhpcy51bml2ZXJzZS5jZWxsc1tpXVtqXTtcblx0XHRcdGhhbmRsZUNsaWNrKHRoaXMsIGNlbGwsIHBhZ2VYLCBwYWdlWSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKHNlbGYsIGNlbGwsIHBhZ2VYLCBwYWdlWSl7XG5cdGlmIChwYWdlWCA+IGNlbGwueCAmJiBwYWdlWCA8IGNlbGwueCtzZWxmLnVuaXZlcnNlLmNlbGxMZW5ndGggJiZcblx0XHRcdFx0cGFnZVkgPiBjZWxsLnkgJiYgcGFnZVkgPCBjZWxsLnkrc2VsZi51bml2ZXJzZS5jZWxsSGVpZ2h0ICkge1xuXHRcdGlmIChjZWxsLnN0YXRlID09PSAwKSB7XG5cdFx0XHQvLyBtYWtlIHRoZSBjZWxsIGFsaXZlXG5cdFx0XHRjZWxsLnN0YXRlID0gMTtcblx0XHRcdC8vIHBhaW50IHRoZSBibG9ja1xuXHRcdFx0c2VsZi5jdHguZmlsbFN0eWxlID0gJyMzMzMnO1xuXHRcdFx0c2VsZi5jdHguZmlsbFJlY3QoY2VsbC54KzEsIGNlbGwueSsxLCBcblx0XHRcdFx0c2VsZi51bml2ZXJzZS5jZWxsTGVuZ3RoLTIsIHNlbGYudW5pdmVyc2UuY2VsbEhlaWdodC0yKTtcblx0XHR9ZWxzZSB7XG5cdFx0XHQvLyBtYWtlIHRoZSBjZWxsIGFsaXZlXG5cdFx0XHRjZWxsLnN0YXRlID0gMDtcblx0XHRcdC8vIHBhaW50IHRoZSBibG9ja1xuXHRcdFx0c2VsZi5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdHNlbGYuY3R4LmZpbGxSZWN0KGNlbGwueCsxLCBjZWxsLnkrMSwgXG5cdFx0XHRcdHNlbGYudW5pdmVyc2UuY2VsbExlbmd0aC0yLCBzZWxmLnVuaXZlcnNlLmNlbGxIZWlnaHQtMik7XG5cdFx0fVxuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNsYXNzIFVuaXZlcnNlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0Ly8gdGhpcyB3aWxsIGJlIHRoZSB0aWxlbWFwLCAyRCBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSB1bml2ZXJzZVxuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmhlaWdodCA9IG9wdGlvbnMudW5pSGVpZ2h0O1xuXHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy51bmlMZW5ndGg7XG5cdFx0dGhpcy5jZWxsSGVpZ2h0ID0gb3B0aW9ucy5jZWxsSGVpZ2h0O1xuXHRcdHRoaXMuY2VsbExlbmd0aCA9IG9wdGlvbnMuY2VsbExlbmd0aDtcblx0fVxuXHRjcmVhdGUoKSB7XG5cdFx0Ly8gQXNzaWduIHRoZSB0aWxlbWFwIGluIHJlbGF0aW9uIHdpdGggdGhlIGxlbmd0aCBhbmQgaGVpZ2h0IG9mIHRoZSBcblx0XHQvLyB1bml2ZXJzZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaTx0aGlzLmhlaWdodDsgaSsrKSB7XG5cdFx0XHR0aGlzLmNlbGxzLnB1c2gobmV3IEFycmF5KCkpO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGo8dGhpcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHQvLyBhc3NpZ24gZWFjaCBjZWxsIGEgc3RydWN0dXJlIHdpdGggdGhlIGlkLCBzdGF0ZSBhbmQgXG5cdFx0XHRcdC8vIGNvb3JkaW5hdGVzIG9mIHRoYXQgY2VsbFxuXHRcdFx0XHR0aGlzLmNlbGxzW2ldLnB1c2goe1xuXHRcdFx0XHRcdGlkOmkqdGhpcy5sZW5ndGgraiwgXG5cdFx0XHRcdFx0c3RhdGU6MCxcblx0XHRcdFx0XHR4OmoqdGhpcy5jZWxsTGVuZ3RoLFxuXHRcdFx0XHRcdHk6aSp0aGlzLmNlbGxIZWlnaHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVW5pdmVyc2U7Il19
