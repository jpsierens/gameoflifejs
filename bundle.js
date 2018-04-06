(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _Universe = require('./js/Universe');

var _Universe2 = _interopRequireDefault(_Universe);

var _Game = require('./js/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// in pixels
var CELL_LENGTH = 16;
var CELL_HEIGHT = 16;
// in cell units
var UNIVERSE_LENGTH = 40;
var UNIVERSE_HEIGHT = 40;

var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');

var universe = new _Universe2.default({
	uniLength: UNIVERSE_LENGTH,
	uniHeight: UNIVERSE_HEIGHT,
	cellLength: CELL_LENGTH,
	cellHeight: CELL_LENGTH
});
universe.create();

var game = new _Game2.default({
	// enhanced object literals
	// 'canvas,' is the same as 'canvas: canvas,'
	canvas: canvas,
	context: ctx,
	universe: universe,
	speed: 200
});

game.iniSetup();

},{"./js/Game":2,"./js/Universe":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    // set up instance variables
    function Game(options) {
        _classCallCheck(this, Game);

        this.timer = null;
        this.canvas = options.canvas;
        this.ctx = options.context;
        this.universe = options.universe;
        this.universeElem = document.getElementById('universe');
        this.speed = options.speed;

        // store refeences to bound listeners since otherwise you can't remove the listeners
        this.stopListener = this.stop.bind(this);
        this.playListener = this.play.bind(this);
        this.loopCellsListener = loopCells.bind(this);

        drawGrid.apply(this);
    }

    // initial setup


    _createClass(Game, [{
        key: 'iniSetup',
        value: function iniSetup() {
            var startBtn = document.getElementById('start');
            this.universeElem.addEventListener('click', this.loopCellsListener);
            // when user click, start the game
            startBtn.addEventListener('click', this.playListener);
            startBtn.disabled = false;
        }

        // start the game

    }, {
        key: 'play',
        value: function play(e) {
            var startBtn = document.getElementById('start');
            var stopBtn = document.getElementById('stop');
            // add click event to stop button
            stopBtn.addEventListener('click', this.stopListener);
            stopBtn.disabled = false;
            // remove the play click listener
            startBtn.removeEventListener('click', this.playListener);
            startBtn.disabled = true;
            // remove god mode
            this.universeElem.removeEventListener('click', this.loopCellsListener);
            // game loop, store handle for restart to stop the timer
            this.timer = setInterval(step.bind(this), this.speed);
        }

        // stop the game

    }, {
        key: 'stop',
        value: function stop(e) {
            var stopBtn = document.getElementById('stop');
            // remove restart listener, it'll be added again if game start clicked
            stopBtn.removeEventListener('click', this.stopListener);
            stopBtn.disabled = true;
            // stop the timer
            clearInterval(this.timer);
            // reinitialise the game
            this.iniSetup();
        }
    }]);

    return Game;
}();

// Private methods
// --------------------
// draw grid


function drawGrid() {
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
    for (var _i = 1; _i < this.universe.height; _i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.universe.cellHeight * _i);
        this.ctx.lineTo(this.universe.length * this.universe.cellLength, this.universe.cellHeight * _i);
        this.ctx.stroke();
    }
}

// Loop over the cells initialising cells when the grid is clicked
function loopCells(e) {
    var universeElem = this.universeElem;
    var pageX = e.pageX - universeElem.offsetLeft;
    var pageY = e.pageY - universeElem.offsetTop;

    for (var i = 0; i < this.universe.height; i++) {
        for (var j = 0; j < this.universe.length; j++) {
            var cell = this.universe.cells[i][j];
            // handle the click
            if (pageX > cell.x && pageX < cell.x + this.universe.cellLength && pageY > cell.y && pageY < cell.y + this.universe.cellHeight) {
                // chnage the cells
                changeCells.apply(this, [cell]);
            }
        }
    }
}

// 1 step = 1 generation
function step() {
    var self = this;
    var cellsToChange = [];
    var lifeExists = void 0;
    for (var i = 0; i < this.universe.height; i++) {
        for (var j = 0; j < this.universe.length; j++) {
            var cell = this.universe.cells[i][j];
            transitions(self, cell, cellsToChange);
        }
    }

    lifeExists = cellsToChange.length > 0 ? true : false;

    if (lifeExists === true) {
        // update the cells that should be updated
        for (var _i2 = 0; _i2 < cellsToChange.length; _i2++) {
            var _cell = getCellById(self, cellsToChange[_i2]);
            // if the cell state was 0 change to 1, and vice versa.
            changeCells.apply(this, [_cell]);
        }
    } else {
        this.stop(null);
        console.log('life has ceased!');
    }
}

/*
*   pass the cell through the 4 rules.
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
        if (neighbourID >= uniLength * uniHeight || neighbourID < 0) {
            continue;
        }
        var neighbour = getCellById(self, neighbourID);
        if (neighbour.state === 1) {
            neighboursAlive++;
        }
    }
    if (cell.state === 1) {
        // ze life rules
        // -------------------
        // 1) Any live cell with fewer than two live neighbours dies, as
        // if caused by under-population.
        // 2) Any live cell with two or three live neighbours lives on to
        // the next generation.
        if (neighboursAlive < 2) {
            cellsToChange.push(cell.id);
        }
        // 3) Any live cell with more than three live neighbours dies, as if
        // by overcrowding.
        else if (neighboursAlive > 3) {
                cellsToChange.push(cell.id);
            }
    } else {
        // 4) Any dead cell with exactly three live neighbours becomes a
        // live cell, as if by reproduction.
        if (neighboursAlive === 3) {
            cellsToChange.push(cell.id);
        }
    }
}

// flip the state of a cell, changing its colour and its state
function changeCells(cell) {
    this.ctx.fillStyle = cell.state ? 'white' : '#333';
    this.ctx.fillRect(cell.x + 1, cell.y + 1, this.universe.cellLength - 2, this.universe.cellHeight - 2);
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Universe = function () {
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
}();

module.exports = Universe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJqcy9HYW1lLmpzIiwianMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTSxjQUFjLEVBQXBCO0FBQ0EsSUFBTSxjQUFjLEVBQXBCO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixFQUF4QjtBQUNBLElBQU0sa0JBQWtCLEVBQXhCOztBQUVBLElBQUksU0FBUyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBYjtBQUNBLElBQUksTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBVjs7QUFFQSxJQUFJLFdBQVcsdUJBQWE7QUFDM0IsWUFBVyxlQURnQjtBQUUzQixZQUFXLGVBRmdCO0FBRzNCLGFBQVksV0FIZTtBQUkzQixhQUFZO0FBSmUsQ0FBYixDQUFmO0FBTUEsU0FBUyxNQUFUOztBQUVBLElBQUksT0FBTyxtQkFBUztBQUNuQjtBQUNBO0FBQ0EsZUFIbUI7QUFJbkIsVUFBUyxHQUpVO0FBS25CLG1CQUxtQjtBQU1uQixRQUFPO0FBTlksQ0FBVCxDQUFYOztBQVNBLEtBQUssUUFBTDs7Ozs7Ozs7O0lDOUJNLEk7QUFDRjtBQUNBLGtCQUFZLE9BQVosRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLGFBQUssTUFBTCxHQUFjLFFBQVEsTUFBdEI7QUFDQSxhQUFLLEdBQUwsR0FBVyxRQUFRLE9BQW5CO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLFFBQVEsUUFBeEI7QUFDQSxhQUFLLFlBQUwsR0FBb0IsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQXBCO0FBQ0EsYUFBSyxLQUFMLEdBQWEsUUFBUSxLQUFyQjs7QUFFQTtBQUNBLGFBQUssWUFBTCxHQUFvQixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFwQjtBQUNBLGFBQUssWUFBTCxHQUFvQixLQUFL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QUNBOzs7OzJCQUNRO0FBQ1I7QUFDQTtBQUNBLFFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBRSxLQUFLLE1BQXZCLEVBQStCLEdBQS9CLEVBQW9DO0FBQ25DLFNBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBSSxLQUFKLEVBQWhCO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFFLEtBQUssTUFBdkIsRUFBK0IsR0FBL0IsRUFBb0M7QUFDbkM7QUFDQTtBQUNBLFNBQUksS0FBSyxJQUFFLEtBQUssTUFBUCxHQUFjLENBQXZCO0FBQ0EsVUFBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLElBQWQsQ0FBbUI7QUFDbEIsWUFEa0I7QUFFbEIsYUFBTSxDQUZZO0FBR2xCLFNBQUUsSUFBRSxLQUFLLFVBSFM7QUFJbEIsU0FBRSxJQUFFLEtBQUssVUFKUztBQUtsQixrQkFBWTtBQUNYO0FBQ0EsV0FBRyxLQUFLLE1BQVIsR0FBZSxDQUZKLEVBRU8sS0FBRyxLQUFLLE1BRmYsRUFFdUIsS0FBRyxLQUFLLE1BQVIsR0FBZSxDQUZ0QztBQUdYO0FBQ0EsV0FBRyxDQUpRLEVBSUwsS0FBRyxDQUpFO0FBS1g7QUFDQSxXQUFHLEtBQUssTUFBUixHQUFlLENBTkosRUFNTyxLQUFHLEtBQUssTUFOZixFQU11QixLQUFHLEtBQUssTUFBUixHQUFlLENBTnRDO0FBTE0sTUFBbkI7QUFjQTtBQUNEO0FBQ0Q7Ozs7OztBQUdGLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL2pzL1VuaXZlcnNlJztcbmltcG9ydCBHYW1lIGZyb20gJy4vanMvR2FtZSc7XG5cbi8vIGluIHBpeGVsc1xuY29uc3QgQ0VMTF9MRU5HVEggPSAxNjtcbmNvbnN0IENFTExfSEVJR0hUID0gMTY7XG4vLyBpbiBjZWxsIHVuaXRzXG5jb25zdCBVTklWRVJTRV9MRU5HVEggPSA0MDtcbmNvbnN0IFVOSVZFUlNFX0hFSUdIVCA9IDQwO1xuXG52YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciB1bml2ZXJzZSA9IG5ldyBVbml2ZXJzZSh7XG5cdHVuaUxlbmd0aDogVU5JVkVSU0VfTEVOR1RILCBcblx0dW5pSGVpZ2h0OiBVTklWRVJTRV9IRUlHSFQsXG5cdGNlbGxMZW5ndGg6IENFTExfTEVOR1RILFxuXHRjZWxsSGVpZ2h0OiBDRUxMX0xFTkdUSFxufSk7XG51bml2ZXJzZS5jcmVhdGUoKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZSh7XG5cdC8vIGVuaGFuY2VkIG9iamVjdCBsaXRlcmFsc1xuXHQvLyAnY2FudmFzLCcgaXMgdGhlIHNhbWUgYXMgJ2NhbnZhczogY2FudmFzLCdcblx0Y2FudmFzLFxuXHRjb250ZXh0OiBjdHgsXG5cdHVuaXZlcnNlLFxuXHRzcGVlZDogMjAwXG59KTtcblxuZ2FtZS5pbmlTZXR1cCgpO1xuXG4iLCJjbGFzcyBHYW1lIHtcbiAgICAvLyBzZXQgdXAgaW5zdGFuY2UgdmFyaWFibGVzXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG9wdGlvbnMuY2FudmFzO1xuICAgICAgICB0aGlzLmN0eCA9IG9wdGlvbnMuY29udGV4dDtcbiAgICAgICAgdGhpcy51bml2ZXJzZSA9IG9wdGlvbnMudW5pdmVyc2U7XG4gICAgICAgIHRoaXMudW5pdmVyc2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBvcHRpb25zLnNwZWVkO1xuXG4gICAgICAgIC8vIHN0b3JlIHJlZmVlbmNlcyB0byBib3VuZCBsaXN0ZW5lcnMgc2luY2Ugb3RoZXJ3aXNlIHlvdSBjYW4ndCByZW1vdmUgdGhlIGxpc3RlbmVyc1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lciA9IHRoaXMuc3RvcC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnBsYXlMaXN0ZW5lciA9IHRoaXMucGxheS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmxvb3BDZWxsc0xpc3RlbmVyID0gbG9vcENlbGxzLmJpbmQodGhpcyk7XG5cbiAgICAgICAgZHJhd0dyaWQuYXBwbHkodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbCBzZXR1cFxuICAgaW5pU2V0dXAoKSB7XG4gICAgICAgIGxldCBzdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuICAgICAgICB0aGlzLnVuaXZlcnNlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9vcENlbGxzTGlzdGVuZXIpO1xuICAgICAgICAvLyB3aGVuIHVzZXIgY2xpY2ssIHN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wbGF5TGlzdGVuZXIpO1xuICAgICAgICBzdGFydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHRoZSBnYW1lXG4gICAgcGxheShlKXtcbiAgICAgICAgbGV0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XG4gICAgICAgIGxldCBzdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcbiAgICAgICAgLy8gYWRkIGNsaWNrIGV2ZW50IHRvIHN0b3AgYnV0dG9uXG4gICAgICAgIHN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnN0b3BMaXN0ZW5lcik7XG4gICAgICAgIHN0b3BCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBwbGF5IGNsaWNrIGxpc3RlbmVyXG4gICAgICAgIHN0YXJ0QnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wbGF5TGlzdGVuZXIpO1xuICAgICAgICBzdGFydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIC8vIHJlbW92ZSBnb2QgbW9kZVxuICAgICAgICB0aGlzLnVuaXZlcnNlRWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9vcENlbGxzTGlzdGVuZXIpO1xuICAgICAgICAvLyBnYW1lIGxvb3AsIHN0b3JlIGhhbmRsZSBmb3IgcmVzdGFydCB0byBzdG9wIHRoZSB0aW1lclxuICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoc3RlcC5iaW5kKHRoaXMpLCB0aGlzLnNwZWVkKTtcbiAgICB9XG5cbiAgICAvLyBzdG9wIHRoZSBnYW1lXG4gICAgc3RvcChlKSB7XG4gICAgICAgIGxldCBzdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcbiAgICAgICAgLy8gcmVtb3ZlIHJlc3RhcnQgbGlzdGVuZXIsIGl0J2xsIGJlIGFkZGVkIGFnYWluIGlmIGdhbWUgc3RhcnQgY2xpY2tlZFxuICAgICAgICBzdG9wQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zdG9wTGlzdGVuZXIpO1xuICAgICAgICBzdG9wQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gc3RvcCB0aGUgdGltZXJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgLy8gcmVpbml0aWFsaXNlIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuaW5pU2V0dXAoKTtcbiAgICB9XG59XG5cbi8vIFByaXZhdGUgbWV0aG9kc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGRyYXcgZ3JpZFxuZnVuY3Rpb24gZHJhd0dyaWQoKSB7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gMTtcbiAgICAvLyB2ZXJ0aWNhbCBsaW5lc1xuICAgIGZvciAobGV0IGkgPSAxOyBpPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBpKyspe1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCppLCAwKTtcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCppLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bml2ZXJzZS5oZWlnaHQqdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIC8vIGhvcml6b250YWwgbGluZXNcbiAgICBmb3IgKGxldCBpID0gMTsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQqaSk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLnVuaXZlcnNlLmxlbmd0aCp0aGlzLnVuaXZlcnNlLmNlbGxMZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQqaSk7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgIH1cbn1cblxuXG4vLyBMb29wIG92ZXIgdGhlIGNlbGxzIGluaXRpYWxpc2luZyBjZWxscyB3aGVuIHRoZSBncmlkIGlzIGNsaWNrZWRcbmZ1bmN0aW9uIGxvb3BDZWxscyhlKSB7XG4gICAgY29uc3QgdW5pdmVyc2VFbGVtID0gdGhpcy51bml2ZXJzZUVsZW07XG4gICAgY29uc3QgcGFnZVggPSBlLnBhZ2VYIC0gdW5pdmVyc2VFbGVtLm9mZnNldExlZnQ7XG4gICAgY29uc3QgcGFnZVkgPSBlLnBhZ2VZIC0gdW5pdmVyc2VFbGVtLm9mZnNldFRvcDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMudW5pdmVyc2UuaGVpZ2h0OyBpKyspe1xuICAgICAgICBmb3IgKGxldCBqPTA7IGo8dGhpcy51bml2ZXJzZS5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMudW5pdmVyc2UuY2VsbHNbaV1bal07XG4gICAgICAgICAgICAvLyBoYW5kbGUgdGhlIGNsaWNrXG4gICAgICAgICAgICBpZiAocGFnZVggPiBjZWxsLnggJiYgcGFnZVggPCBjZWxsLngrdGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgcGFnZVkgPiBjZWxsLnkgJiYgcGFnZVkgPCBjZWxsLnkrdGhpcy51bml2ZXJzZS5jZWxsSGVpZ2h0ICkge1xuICAgICAgICAgICAgICAgIC8vIGNobmFnZSB0aGUgY2VsbHNcbiAgICAgICAgICAgICAgICBjaGFuZ2VDZWxscy5hcHBseSh0aGlzLCBbY2VsbF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyAxIHN0ZXAgPSAxIGdlbmVyYXRpb25cbmZ1bmN0aW9uIHN0ZXAoKXtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjZWxsc1RvQ2hhbmdlID0gW107XG4gICAgbGV0IGxpZmVFeGlzdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy51bml2ZXJzZS5oZWlnaHQ7IGkrKyl7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLnVuaXZlcnNlLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy51bml2ZXJzZS5jZWxsc1tpXVtqXTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25zKHNlbGYsIGNlbGwsIGNlbGxzVG9DaGFuZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlmZUV4aXN0cyA9IGNlbGxzVG9DaGFuZ2UubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmIChsaWZlRXhpc3RzID09PSB0cnVlKSB7XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgY2VsbHMgdGhhdCBzaG91bGQgYmUgdXBkYXRlZFxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8Y2VsbHNUb0NoYW5nZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBsZXQgY2VsbCA9IGdldENlbGxCeUlkKHNlbGYsIGNlbGxzVG9DaGFuZ2VbaV0pO1xuICAgICAgICAgICAgLy8gaWYgdGhlIGNlbGwgc3RhdGUgd2FzIDAgY2hhbmdlIHRvIDEsIGFuZCB2aWNlIHZlcnNhLlxuICAgICAgICAgICAgY2hhbmdlQ2VsbHMuYXBwbHkodGhpcywgW2NlbGxdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKG51bGwpO1xuICAgICAgICBjb25zb2xlLmxvZygnbGlmZSBoYXMgY2Vhc2VkIScpO1xuICAgIH1cbn1cblxuLypcbiogICBwYXNzIHRoZSBjZWxsIHRocm91Z2ggdGhlIDQgcnVsZXMuXG4gICAgTm90ZTogY2VsbHMgc2hvdWxkIG5vdCB1cGRhdGUgaGVyZSwgc2luY2UgYWx0ZXJpbmcgMSBiZWZvcmUgeW91IGNhblxuICAgIGFuYWx5emUgdGhlIG90aGVycyB3aWxsIGNhdXNlIGVycm9uZW91cyBvdXRjb21lcy5cbiovXG5mdW5jdGlvbiB0cmFuc2l0aW9ucyhzZWxmLCBjZWxsLCBjZWxsc1RvQ2hhbmdlKSB7XG4gICAgY29uc3QgdW5pTGVuZ3RoID0gc2VsZi51bml2ZXJzZS5sZW5ndGg7XG4gICAgY29uc3QgdW5pSGVpZ2h0ID0gc2VsZi51bml2ZXJzZS5oZWlnaHQ7XG4gICAgbGV0IG5laWdoYm91cnNBbGl2ZSA9IDA7XG4gICAgLy8gR28gdGhyb3VnaCB0aGUgbmVpZ2hib3VycyBvZiBlYWNoIGNlbGwuXG4gICAgZm9yIChsZXQgaT0wOyBpPDg7IGkrKyl7XG4gICAgICAgIGxldCBuZWlnaGJvdXJJRCA9IGNlbGwubmVpZ2hib3Vyc1tpXTtcbiAgICAgICAgaWYgKG5laWdoYm91cklEID49IHVuaUxlbmd0aCp1bmlIZWlnaHQgfHwgbmVpZ2hib3VySUQgPDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZWlnaGJvdXIgPSBnZXRDZWxsQnlJZChzZWxmLCBuZWlnaGJvdXJJRCk7XG4gICAgICAgIGlmIChuZWlnaGJvdXIuc3RhdGUgPT09IDEpIHtcbiAgICAgICAgICAgIG5laWdoYm91cnNBbGl2ZSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjZWxsLnN0YXRlID09PSAxKXtcbiAgICAgICAgLy8gemUgbGlmZSBydWxlc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIDEpIEFueSBsaXZlIGNlbGwgd2l0aCBmZXdlciB0aGFuIHR3byBsaXZlIG5laWdoYm91cnMgZGllcywgYXNcbiAgICAgICAgLy8gaWYgY2F1c2VkIGJ5IHVuZGVyLXBvcHVsYXRpb24uXG4gICAgICAgIC8vIDIpIEFueSBsaXZlIGNlbGwgd2l0aCB0d28gb3IgdGhyZWUgbGl2ZSBuZWlnaGJvdXJzIGxpdmVzIG9uIHRvXG4gICAgICAgIC8vIHRoZSBuZXh0IGdlbmVyYXRpb24uXG4gICAgICAgIGlmIChuZWlnaGJvdXJzQWxpdmUgPCAyKSB7XG4gICAgICAgICAgICBjZWxsc1RvQ2hhbmdlLnB1c2goY2VsbC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMykgQW55IGxpdmUgY2VsbCB3aXRoIG1vcmUgdGhhbiB0aHJlZSBsaXZlIG5laWdoYm91cnMgZGllcywgYXMgaWZcbiAgICAgICAgLy8gYnkgb3ZlcmNyb3dkaW5nLlxuICAgICAgICBlbHNlIGlmIChuZWlnaGJvdXJzQWxpdmUgPiAzKSB7IFxuICAgICAgICAgICAgY2VsbHNUb0NoYW5nZS5wdXNoKGNlbGwuaWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyA0KSBBbnkgZGVhZCBjZWxsIHdpdGggZXhhY3RseSB0aHJlZSBsaXZlIG5laWdoYm91cnMgYmVjb21lcyBhXG4gICAgICAgIC8vIGxpdmUgY2VsbCwgYXMgaWYgYnkgcmVwcm9kdWN0aW9uLlxuICAgICAgICBpZiAobmVpZ2hib3Vyc0FsaXZlID09PSAzKSB7XG4gICAgICAgICAgICBjZWxsc1RvQ2hhbmdlLnB1c2goY2VsbC5pZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGZsaXAgdGhlIHN0YXRlIG9mIGEgY2VsbCwgY2hhbmdpbmcgaXRzIGNvbG91ciBhbmQgaXRzIHN0YXRlXG5mdW5jdGlvbiBjaGFuZ2VDZWxscyhjZWxsKSB7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gKGNlbGwuc3RhdGUpID8gJ3doaXRlJyA6ICcjMzMzJztcbiAgICB0aGlzLmN0eC5maWxsUmVjdChjZWxsLngrMSxcbiAgICAgICAgICAgICAgICAgICAgICBjZWxsLnkrMSxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNlLmNlbGxMZW5ndGgtMixcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQtMlxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgY2VsbC5zdGF0ZSA9IChjZWxsLnN0YXRlKSA/IDAgOiAxO1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsQnlJZChzZWxmLCBpZCkge1xuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGlkL3NlbGYudW5pdmVyc2UubGVuZ3RoKTtcbiAgICBsZXQgY29sdW1uID0gaWQgJSBzZWxmLnVuaXZlcnNlLmxlbmd0aDtcbiAgICByZXR1cm4gc2VsZi51bml2ZXJzZS5jZWxsc1tyb3ddW2NvbHVtbl07XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuIiwiY2xhc3MgVW5pdmVyc2Uge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKXtcblx0XHQvLyB0aGlzIHdpbGwgYmUgdGhlIHRpbGVtYXAsIDJEIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIHVuaXZlcnNlXG5cdFx0dGhpcy5jZWxscyA9IFtdO1xuXHRcdHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy51bmlIZWlnaHQ7XG5cdFx0dGhpcy5sZW5ndGggPSBvcHRpb25zLnVuaUxlbmd0aDtcblx0XHR0aGlzLmNlbGxIZWlnaHQgPSBvcHRpb25zLmNlbGxIZWlnaHQ7XG5cdFx0dGhpcy5jZWxsTGVuZ3RoID0gb3B0aW9ucy5jZWxsTGVuZ3RoO1xuXHR9XG5cdGNyZWF0ZSgpIHtcblx0XHQvLyBBc3NpZ24gdGhlIHRpbGVtYXAgaW4gcmVsYXRpb24gd2l0aCB0aGUgbGVuZ3RoIGFuZCBoZWlnaHQgb2YgdGhlIFxuXHRcdC8vIHVuaXZlcnNlLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpPHRoaXMuaGVpZ2h0OyBpKyspIHtcblx0XHRcdHRoaXMuY2VsbHMucHVzaChuZXcgQXJyYXkoKSk7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgajx0aGlzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdC8vIGFzc2lnbiBlYWNoIGNlbGwgYSBzdHJ1Y3R1cmUgd2l0aCB0aGUgaWQsIHN0YXRlIGFuZCBcblx0XHRcdFx0Ly8gY29vcmRpbmF0ZXMgb2YgdGhhdCBjZWxsXG5cdFx0XHRcdGxldCBpZCA9IGkqdGhpcy5sZW5ndGgralxuXHRcdFx0XHR0aGlzLmNlbGxzW2ldLnB1c2goe1xuXHRcdFx0XHRcdGlkLCBcblx0XHRcdFx0XHRzdGF0ZTowLFxuXHRcdFx0XHRcdHg6aip0aGlzLmNlbGxMZW5ndGgsXG5cdFx0XHRcdFx0eTppKnRoaXMuY2VsbEhlaWdodCxcblx0XHRcdFx0XHRuZWlnaGJvdXJzOiBbXG5cdFx0XHRcdFx0XHQvLyB0b3AgbmVpZ2hib3Vyc1xuXHRcdFx0XHRcdFx0aWQtdGhpcy5sZW5ndGgtMSwgaWQtdGhpcy5sZW5ndGgsIGlkLXRoaXMubGVuZ3RoKzEsXG5cdFx0XHRcdFx0XHQvLyBzaWRlIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQtMSwgaWQrMSxcblx0XHRcdFx0XHRcdC8vYm90dG9tIG5laWdib3Vyc1xuXHRcdFx0XHRcdFx0aWQrdGhpcy5sZW5ndGgtMSwgaWQrdGhpcy5sZW5ndGgsIGlkK3RoaXMubGVuZ3RoKzEgXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVbml2ZXJzZTsiXX0=
