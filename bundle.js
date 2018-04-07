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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJqcy9HYW1lLmpzIiwianMvVW5pdmVyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTSxjQUFjLEVBQXBCO0FBQ0EsSUFBTSxjQUFjLEVBQXBCO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixFQUF4QjtBQUNBLElBQU0sa0JBQWtCLEVBQXhCOztBQUVBLElBQU0sU0FBUyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBZjtBQUNBLElBQU0sTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjs7QUFFQSxJQUFNLFdBQVcsdUJBQWE7QUFDN0IsWUFBVyxlQURrQjtBQUU3QixZQUFXLGVBRmtCO0FBRzdCLGFBQVksV0FIaUI7QUFJN0IsYUFBWTtBQUppQixDQUFiLENBQWpCOztBQU9BLFNBQVMsTUFBVDs7QUFFQSxJQUFNLE9BQU8sbUJBQVM7QUFDckI7QUFDQTtBQUNBLGVBSHFCO0FBSXJCLFVBQVMsR0FKWTtBQUtyQixtQkFMcUI7QUFNckIsUUFBTztBQU5jLENBQVQsQ0FBYjs7QUFTQSxLQUFLLFFBQUw7Ozs7Ozs7OztJQy9CTSxJO0FBQ0Y7QUFDQSxrQkFBWSxPQUFaLEVBQW9CO0FBQUE7O0FBQ2hCLGFBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxhQUFLLE1BQUwsR0FBYyxRQUFRLE1BQXRCO0FBQ0EsYUFBSyxHQUFMLEdBQVcsUUFBUSxPQUFuQjtBQUNBLGFBQUssUUFBTCxHQUFnQixRQUFRLFFBQXhCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFwQjtBQUNBLGFBQUssS0FBTCxHQUFhLFFBQVEsS0FBckI7O0FBRUE7QUFDQSxhQUFLLFlBQUwsR0FBb0IsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBcEI7QUFDQSxhQUFLLFlBQUwsR0FBb0Is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MUI7QUFDQTs7OzsyQkFDUTtBQUNSO0FBQ0E7QUFDQSxRQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUUsS0FBSyxNQUF2QixFQUErQixHQUEvQixFQUFvQztBQUNuQyxTQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQUksS0FBSixFQUFoQjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBRSxLQUFLLE1BQXZCLEVBQStCLEdBQS9CLEVBQW9DO0FBQ25DO0FBQ0E7QUFDQSxTQUFJLEtBQUssSUFBRSxLQUFLLE1BQVAsR0FBYyxDQUF2QjtBQUNBLFVBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxJQUFkLENBQW1CO0FBQ2xCLFlBRGtCO0FBRWxCLGFBQU0sQ0FGWTtBQUdsQixTQUFFLElBQUUsS0FBSyxVQUhTO0FBSWxCLFNBQUUsSUFBRSxLQUFLLFVBSlM7QUFLbEIsa0JBQVk7QUFDWDtBQUNBLFdBQUcsS0FBSyxNQUFSLEdBQWUsQ0FGSixFQUVPLEtBQUcsS0FBSyxNQUZmLEVBRXVCLEtBQUcsS0FBSyxNQUFSLEdBQWUsQ0FGdEM7QUFHWDtBQUNBLFdBQUcsQ0FKUSxFQUlMLEtBQUcsQ0FKRTtBQUtYO0FBQ0EsV0FBRyxLQUFLLE1BQVIsR0FBZSxDQU5KLEVBTU8sS0FBRyxLQUFLLE1BTmYsRUFNdUIsS0FBRyxLQUFLLE1BQVIsR0FBZSxDQU50QztBQUxNLE1BQW5CO0FBY0E7QUFDRDtBQUNEOzs7Ozs7QUFHRixPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi9qcy9Vbml2ZXJzZSc7XG5pbXBvcnQgR2FtZSBmcm9tICcuL2pzL0dhbWUnO1xuXG4vLyBpbiBwaXhlbHNcbmNvbnN0IENFTExfTEVOR1RIID0gMTY7XG5jb25zdCBDRUxMX0hFSUdIVCA9IDE2O1xuLy8gaW4gY2VsbCB1bml0c1xuY29uc3QgVU5JVkVSU0VfTEVOR1RIID0gNDA7XG5jb25zdCBVTklWRVJTRV9IRUlHSFQgPSA0MDtcblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaXZlcnNlJyk7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY29uc3QgdW5pdmVyc2UgPSBuZXcgVW5pdmVyc2Uoe1xuXHR1bmlMZW5ndGg6IFVOSVZFUlNFX0xFTkdUSCwgXG5cdHVuaUhlaWdodDogVU5JVkVSU0VfSEVJR0hULFxuXHRjZWxsTGVuZ3RoOiBDRUxMX0xFTkdUSCxcblx0Y2VsbEhlaWdodDogQ0VMTF9MRU5HVEhcbn0pO1xuXG51bml2ZXJzZS5jcmVhdGUoKTtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKHtcblx0Ly8gZW5oYW5jZWQgb2JqZWN0IGxpdGVyYWxzXG5cdC8vICdjYW52YXMsJyBpcyB0aGUgc2FtZSBhcyAnY2FudmFzOiBjYW52YXMsJ1xuXHRjYW52YXMsXG5cdGNvbnRleHQ6IGN0eCxcblx0dW5pdmVyc2UsXG5cdHNwZWVkOiAyMDBcbn0pO1xuXG5nYW1lLmluaVNldHVwKCk7XG5cbiIsImNsYXNzIEdhbWUge1xuICAgIC8vIHNldCB1cCBpbnN0YW5jZSB2YXJpYWJsZXNcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy50aW1lciA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FudmFzID0gb3B0aW9ucy5jYW52YXM7XG4gICAgICAgIHRoaXMuY3R4ID0gb3B0aW9ucy5jb250ZXh0O1xuICAgICAgICB0aGlzLnVuaXZlcnNlID0gb3B0aW9ucy51bml2ZXJzZTtcbiAgICAgICAgdGhpcy51bml2ZXJzZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pdmVyc2UnKTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IG9wdGlvbnMuc3BlZWQ7XG5cbiAgICAgICAgLy8gc3RvcmUgcmVmZWVuY2VzIHRvIGJvdW5kIGxpc3RlbmVycyBzaW5jZSBvdGhlcndpc2UgeW91IGNhbid0IHJlbW92ZSB0aGUgbGlzdGVuZXJzXG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmVyID0gdGhpcy5zdG9wLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucGxheUxpc3RlbmVyID0gdGhpcy5wbGF5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubG9vcENlbGxzTGlzdGVuZXIgPSBsb29wQ2VsbHMuYmluZCh0aGlzKTtcblxuICAgICAgICBkcmF3R3JpZC5hcHBseSh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsIHNldHVwXG4gICBpbmlTZXR1cCgpIHtcbiAgICAgICAgbGV0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XG4gICAgICAgIHRoaXMudW5pdmVyc2VFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5sb29wQ2VsbHNMaXN0ZW5lcik7XG4gICAgICAgIC8vIHdoZW4gdXNlciBjbGljaywgc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnBsYXlMaXN0ZW5lcik7XG4gICAgICAgIHN0YXJ0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gc3RhcnQgdGhlIGdhbWVcbiAgICBwbGF5KGUpe1xuICAgICAgICBsZXQgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcbiAgICAgICAgbGV0IHN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuICAgICAgICAvLyBhZGQgY2xpY2sgZXZlbnQgdG8gc3RvcCBidXR0b25cbiAgICAgICAgc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc3RvcExpc3RlbmVyKTtcbiAgICAgICAgc3RvcEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAvLyByZW1vdmUgdGhlIHBsYXkgY2xpY2sgbGlzdGVuZXJcbiAgICAgICAgc3RhcnRCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnBsYXlMaXN0ZW5lcik7XG4gICAgICAgIHN0YXJ0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gcmVtb3ZlIGdvZCBtb2RlXG4gICAgICAgIHRoaXMudW5pdmVyc2VFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5sb29wQ2VsbHNMaXN0ZW5lcik7XG4gICAgICAgIC8vIGdhbWUgbG9vcCwgc3RvcmUgaGFuZGxlIGZvciByZXN0YXJ0IHRvIHN0b3AgdGhlIHRpbWVyXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChzdGVwLmJpbmQodGhpcyksIHRoaXMuc3BlZWQpO1xuICAgIH1cblxuICAgIC8vIHN0b3AgdGhlIGdhbWVcbiAgICBzdG9wKGUpIHtcbiAgICAgICAgbGV0IHN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuICAgICAgICAvLyByZW1vdmUgcmVzdGFydCBsaXN0ZW5lciwgaXQnbGwgYmUgYWRkZWQgYWdhaW4gaWYgZ2FtZSBzdGFydCBjbGlja2VkXG4gICAgICAgIHN0b3BCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnN0b3BMaXN0ZW5lcik7XG4gICAgICAgIHN0b3BCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAvLyBzdG9wIHRoZSB0aW1lclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAvLyByZWluaXRpYWxpc2UgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5pbmlTZXR1cCgpO1xuICAgIH1cbn1cblxuLy8gUHJpdmF0ZSBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gZHJhdyBncmlkXG5mdW5jdGlvbiBkcmF3R3JpZCgpIHtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjNzc3JztcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxO1xuICAgIC8vIHZlcnRpY2FsIGxpbmVzXG4gICAgZm9yIChsZXQgaSA9IDE7IGk8dGhpcy51bml2ZXJzZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksIDApO1xuICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy51bml2ZXJzZS5jZWxsTGVuZ3RoKmksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNlLmhlaWdodCp0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgLy8gaG9yaXpvbnRhbCBsaW5lc1xuICAgIGZvciAobGV0IGkgPSAxOyBpPHRoaXMudW5pdmVyc2UuaGVpZ2h0OyBpKyspe1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMudW5pdmVyc2UubGVuZ3RoKnRoaXMudW5pdmVyc2UuY2VsbExlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodCppKTtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxufVxuXG5cbi8vIExvb3Agb3ZlciB0aGUgY2VsbHMgaW5pdGlhbGlzaW5nIGNlbGxzIHdoZW4gdGhlIGdyaWQgaXMgY2xpY2tlZFxuZnVuY3Rpb24gbG9vcENlbGxzKGUpIHtcbiAgICBjb25zdCB1bml2ZXJzZUVsZW0gPSB0aGlzLnVuaXZlcnNlRWxlbTtcbiAgICBjb25zdCBwYWdlWCA9IGUucGFnZVggLSB1bml2ZXJzZUVsZW0ub2Zmc2V0TGVmdDtcbiAgICBjb25zdCBwYWdlWSA9IGUucGFnZVkgLSB1bml2ZXJzZUVsZW0ub2Zmc2V0VG9wO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy51bml2ZXJzZS5oZWlnaHQ7IGkrKyl7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLnVuaXZlcnNlLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy51bml2ZXJzZS5jZWxsc1tpXVtqXTtcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2xpY2tcbiAgICAgICAgICAgIGlmIChwYWdlWCA+IGNlbGwueCAmJiBwYWdlWCA8IGNlbGwueCt0aGlzLnVuaXZlcnNlLmNlbGxMZW5ndGggJiZcbiAgICAgICAgICAgICAgICBwYWdlWSA+IGNlbGwueSAmJiBwYWdlWSA8IGNlbGwueSt0aGlzLnVuaXZlcnNlLmNlbGxIZWlnaHQgKSB7XG4gICAgICAgICAgICAgICAgLy8gY2huYWdlIHRoZSBjZWxsc1xuICAgICAgICAgICAgICAgIGNoYW5nZUNlbGxzLmFwcGx5KHRoaXMsIFtjZWxsXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIDEgc3RlcCA9IDEgZ2VuZXJhdGlvblxuZnVuY3Rpb24gc3RlcCgpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNlbGxzVG9DaGFuZ2UgPSBbXTtcbiAgICBsZXQgbGlmZUV4aXN0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLnVuaXZlcnNlLmhlaWdodDsgaSsrKXtcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHRoaXMudW5pdmVyc2UubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgbGV0IGNlbGwgPSB0aGlzLnVuaXZlcnNlLmNlbGxzW2ldW2pdO1xuICAgICAgICAgICAgdHJhbnNpdGlvbnMoc2VsZiwgY2VsbCwgY2VsbHNUb0NoYW5nZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsaWZlRXhpc3RzID0gY2VsbHNUb0NoYW5nZS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgaWYgKGxpZmVFeGlzdHMgPT09IHRydWUpIHtcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBjZWxscyB0aGF0IHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxjZWxsc1RvQ2hhbmdlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGxldCBjZWxsID0gZ2V0Q2VsbEJ5SWQoc2VsZiwgY2VsbHNUb0NoYW5nZVtpXSk7XG4gICAgICAgICAgICAvLyBpZiB0aGUgY2VsbCBzdGF0ZSB3YXMgMCBjaGFuZ2UgdG8gMSwgYW5kIHZpY2UgdmVyc2EuXG4gICAgICAgICAgICBjaGFuZ2VDZWxscy5hcHBseSh0aGlzLCBbY2VsbF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AobnVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsaWZlIGhhcyBjZWFzZWQhJyk7XG4gICAgfVxufVxuXG4vKlxuKiAgIHBhc3MgdGhlIGNlbGwgdGhyb3VnaCB0aGUgNCBydWxlcy5cbiAgICBOb3RlOiBjZWxscyBzaG91bGQgbm90IHVwZGF0ZSBoZXJlLCBzaW5jZSBhbHRlcmluZyAxIGJlZm9yZSB5b3UgY2FuXG4gICAgYW5hbHl6ZSB0aGUgb3RoZXJzIHdpbGwgY2F1c2UgZXJyb25lb3VzIG91dGNvbWVzLlxuKi9cbmZ1bmN0aW9uIHRyYW5zaXRpb25zKHNlbGYsIGNlbGwsIGNlbGxzVG9DaGFuZ2UpIHtcbiAgICBjb25zdCB1bmlMZW5ndGggPSBzZWxmLnVuaXZlcnNlLmxlbmd0aDtcbiAgICBjb25zdCB1bmlIZWlnaHQgPSBzZWxmLnVuaXZlcnNlLmhlaWdodDtcbiAgICBsZXQgbmVpZ2hib3Vyc0FsaXZlID0gMDtcbiAgICAvLyBHbyB0aHJvdWdoIHRoZSBuZWlnaGJvdXJzIG9mIGVhY2ggY2VsbC5cbiAgICBmb3IgKGxldCBpPTA7IGk8ODsgaSsrKXtcbiAgICAgICAgbGV0IG5laWdoYm91cklEID0gY2VsbC5uZWlnaGJvdXJzW2ldO1xuICAgICAgICBpZiAobmVpZ2hib3VySUQgPj0gdW5pTGVuZ3RoKnVuaUhlaWdodCB8fCBuZWlnaGJvdXJJRCA8MCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5laWdoYm91ciA9IGdldENlbGxCeUlkKHNlbGYsIG5laWdoYm91cklEKTtcbiAgICAgICAgaWYgKG5laWdoYm91ci5zdGF0ZSA9PT0gMSkge1xuICAgICAgICAgICAgbmVpZ2hib3Vyc0FsaXZlKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNlbGwuc3RhdGUgPT09IDEpe1xuICAgICAgICAvLyB6ZSBsaWZlIHJ1bGVzXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gMSkgQW55IGxpdmUgY2VsbCB3aXRoIGZld2VyIHRoYW4gdHdvIGxpdmUgbmVpZ2hib3VycyBkaWVzLCBhc1xuICAgICAgICAvLyBpZiBjYXVzZWQgYnkgdW5kZXItcG9wdWxhdGlvbi5cbiAgICAgICAgLy8gMikgQW55IGxpdmUgY2VsbCB3aXRoIHR3byBvciB0aHJlZSBsaXZlIG5laWdoYm91cnMgbGl2ZXMgb24gdG9cbiAgICAgICAgLy8gdGhlIG5leHQgZ2VuZXJhdGlvbi5cbiAgICAgICAgaWYgKG5laWdoYm91cnNBbGl2ZSA8IDIpIHtcbiAgICAgICAgICAgIGNlbGxzVG9DaGFuZ2UucHVzaChjZWxsLmlkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzKSBBbnkgbGl2ZSBjZWxsIHdpdGggbW9yZSB0aGFuIHRocmVlIGxpdmUgbmVpZ2hib3VycyBkaWVzLCBhcyBpZlxuICAgICAgICAvLyBieSBvdmVyY3Jvd2RpbmcuXG4gICAgICAgIGVsc2UgaWYgKG5laWdoYm91cnNBbGl2ZSA+IDMpIHsgXG4gICAgICAgICAgICBjZWxsc1RvQ2hhbmdlLnB1c2goY2VsbC5pZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIDQpIEFueSBkZWFkIGNlbGwgd2l0aCBleGFjdGx5IHRocmVlIGxpdmUgbmVpZ2hib3VycyBiZWNvbWVzIGFcbiAgICAgICAgLy8gbGl2ZSBjZWxsLCBhcyBpZiBieSByZXByb2R1Y3Rpb24uXG4gICAgICAgIGlmIChuZWlnaGJvdXJzQWxpdmUgPT09IDMpIHtcbiAgICAgICAgICAgIGNlbGxzVG9DaGFuZ2UucHVzaChjZWxsLmlkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gZmxpcCB0aGUgc3RhdGUgb2YgYSBjZWxsLCBjaGFuZ2luZyBpdHMgY29sb3VyIGFuZCBpdHMgc3RhdGVcbmZ1bmN0aW9uIGNoYW5nZUNlbGxzKGNlbGwpIHtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAoY2VsbC5zdGF0ZSkgPyAnd2hpdGUnIDogJyMzMzMnO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KGNlbGwueCsxLFxuICAgICAgICAgICAgICAgICAgICAgIGNlbGwueSsxLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdmVyc2UuY2VsbExlbmd0aC0yLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdmVyc2UuY2VsbEhlaWdodC0yXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICBjZWxsLnN0YXRlID0gKGNlbGwuc3RhdGUpID8gMCA6IDE7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxCeUlkKHNlbGYsIGlkKSB7XG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaWQvc2VsZi51bml2ZXJzZS5sZW5ndGgpO1xuICAgIGxldCBjb2x1bW4gPSBpZCAlIHNlbGYudW5pdmVyc2UubGVuZ3RoO1xuICAgIHJldHVybiBzZWxmLnVuaXZlcnNlLmNlbGxzW3Jvd11bY29sdW1uXTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4iLCJjbGFzcyBVbml2ZXJzZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuXHRcdC8vIHRoaXMgd2lsbCBiZSB0aGUgdGlsZW1hcCwgMkQgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgdW5pdmVyc2Vcblx0XHR0aGlzLmNlbGxzID0gW107XG5cdFx0dGhpcy5oZWlnaHQgPSBvcHRpb25zLnVuaUhlaWdodDtcblx0XHR0aGlzLmxlbmd0aCA9IG9wdGlvbnMudW5pTGVuZ3RoO1xuXHRcdHRoaXMuY2VsbEhlaWdodCA9IG9wdGlvbnMuY2VsbEhlaWdodDtcblx0XHR0aGlzLmNlbGxMZW5ndGggPSBvcHRpb25zLmNlbGxMZW5ndGg7XG5cdH1cblx0Y3JlYXRlKCkge1xuXHRcdC8vIEFzc2lnbiB0aGUgdGlsZW1hcCBpbiByZWxhdGlvbiB3aXRoIHRoZSBsZW5ndGggYW5kIGhlaWdodCBvZiB0aGUgXG5cdFx0Ly8gdW5pdmVyc2UuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGk8dGhpcy5oZWlnaHQ7IGkrKykge1xuXHRcdFx0dGhpcy5jZWxscy5wdXNoKG5ldyBBcnJheSgpKTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqPHRoaXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0Ly8gYXNzaWduIGVhY2ggY2VsbCBhIHN0cnVjdHVyZSB3aXRoIHRoZSBpZCwgc3RhdGUgYW5kIFxuXHRcdFx0XHQvLyBjb29yZGluYXRlcyBvZiB0aGF0IGNlbGxcblx0XHRcdFx0bGV0IGlkID0gaSp0aGlzLmxlbmd0aCtqXG5cdFx0XHRcdHRoaXMuY2VsbHNbaV0ucHVzaCh7XG5cdFx0XHRcdFx0aWQsIFxuXHRcdFx0XHRcdHN0YXRlOjAsXG5cdFx0XHRcdFx0eDpqKnRoaXMuY2VsbExlbmd0aCxcblx0XHRcdFx0XHR5OmkqdGhpcy5jZWxsSGVpZ2h0LFxuXHRcdFx0XHRcdG5laWdoYm91cnM6IFtcblx0XHRcdFx0XHRcdC8vIHRvcCBuZWlnaGJvdXJzXG5cdFx0XHRcdFx0XHRpZC10aGlzLmxlbmd0aC0xLCBpZC10aGlzLmxlbmd0aCwgaWQtdGhpcy5sZW5ndGgrMSxcblx0XHRcdFx0XHRcdC8vIHNpZGUgbmVpZ2JvdXJzXG5cdFx0XHRcdFx0XHRpZC0xLCBpZCsxLFxuXHRcdFx0XHRcdFx0Ly9ib3R0b20gbmVpZ2JvdXJzXG5cdFx0XHRcdFx0XHRpZCt0aGlzLmxlbmd0aC0xLCBpZCt0aGlzLmxlbmd0aCwgaWQrdGhpcy5sZW5ndGgrMSBcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaXZlcnNlOyJdfQ==
