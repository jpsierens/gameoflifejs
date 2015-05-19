(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsUniverse = require('./js/Universe');

var _jsUniverse2 = _interopRequireDefault(_jsUniverse);

//const cus I don't want them to change.
// in cell units
var UNIVERSE_LENGTH = 15;
var UNIVERSE_HEIGHT = 15;
// in pixels
var CELL_LENGTH = 32;
var CELL_HEIGHT = 32;

var universe = new _jsUniverse2['default']();
universe.create(UNIVERSE_LENGTH, UNIVERSE_HEIGHT);

// drawing the universe
var canvas = document.getElementById('universe');
var ctx = canvas.getContext('2d');
drawGrid();

// draw grid
function drawGrid() {
	// vertical lines
	for (var i = 1; i < UNIVERSE_LENGTH; i++) {
		ctx.beginPath();
		ctx.moveTo(CELL_LENGTH * i, 0);
		ctx.lineTo(CELL_LENGTH * i, UNIVERSE_HEIGHT * CELL_HEIGHT);
		ctx.stroke();
	}
}

},{"./js/Universe":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Universe = (function () {
	function Universe(length, height) {
		_classCallCheck(this, Universe);

		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
		this.height = height;
		this.length = length;
	}

	_createClass(Universe, [{
		key: "create",
		value: function create() {
			// Assign the tilemap in relation with the length and height of the universe.
			for (var i = 0; i < this.height; i++) {
				this.cells.push(new Array());
				for (var j = 0; j < this.length; j++) {
					// at the initial universe, every cell is dead (0)
					this.cells[i].push(0);
				}
			}
		}
	}]);

	return Universe;
})();

module.exports = Universe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanBzaWVyZW5zL1NpdGVzL3BlcnNvbmFsL2dhbWVvZmxpZmVqcy9hcHAuanMiLCIvVXNlcnMvanBzaWVyZW5zL1NpdGVzL3BlcnNvbmFsL2dhbWVvZmxpZmVqcy9qcy9Vbml2ZXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7MEJDQXFCLGVBQWU7Ozs7OztBQUlwQyxJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOztBQUUzQixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFJLFFBQVEsR0FBRyw2QkFBYyxDQUFDO0FBQzlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzs7QUFJbEQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsRUFBRSxDQUFDOzs7QUFHWCxTQUFTLFFBQVEsR0FBRzs7QUFFbkIsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBQztBQUN0QyxLQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsS0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLEtBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFDLENBQUMsRUFBRSxlQUFlLEdBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkQsS0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ2I7Q0FDRDs7Ozs7Ozs7O0lDNUJLLFFBQVE7QUFDRixVQUROLFFBQVEsQ0FDRCxNQUFNLEVBQUUsTUFBTSxFQUFDO3dCQUR0QixRQUFROzs7QUFHWixNQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztFQUNyQjs7Y0FOSSxRQUFROztTQU9QLGtCQUFHOztBQUVSLFFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFbkMsU0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckI7SUFDRDtHQUNEOzs7UUFoQkksUUFBUTs7O0FBbUJkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL2pzL1VuaXZlcnNlJztcblxuLy9jb25zdCBjdXMgSSBkb24ndCB3YW50IHRoZW0gdG8gY2hhbmdlLlxuLy8gaW4gY2VsbCB1bml0c1xuY29uc3QgVU5JVkVSU0VfTEVOR1RIID0gMTU7XG5jb25zdCBVTklWRVJTRV9IRUlHSFQgPSAxNTtcbi8vIGluIHBpeGVsc1xuY29uc3QgQ0VMTF9MRU5HVEggPSAzMjtcbmNvbnN0IENFTExfSEVJR0hUID0gMzI7XG5cbnZhciB1bml2ZXJzZSA9IG5ldyBVbml2ZXJzZSgpO1xudW5pdmVyc2UuY3JlYXRlKFVOSVZFUlNFX0xFTkdUSCwgVU5JVkVSU0VfSEVJR0hUKTtcblxuXG4vLyBkcmF3aW5nIHRoZSB1bml2ZXJzZVxudmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml2ZXJzZScpO1xudmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuZHJhd0dyaWQoKTtcblxuLy8gZHJhdyBncmlkXG5mdW5jdGlvbiBkcmF3R3JpZCgpIHtcblx0Ly8gdmVydGljYWwgbGluZXNcblx0Zm9yIChsZXQgaSA9IDE7IGk8VU5JVkVSU0VfTEVOR1RIOyBpKyspe1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKENFTExfTEVOR1RIKmksMCk7XG5cdFx0Y3R4LmxpbmVUbyhDRUxMX0xFTkdUSCppLCBVTklWRVJTRV9IRUlHSFQqQ0VMTF9IRUlHSFQpO1xuXHRcdGN0eC5zdHJva2UoKTtcblx0fVxufVxuXG5cblxuXG4iLCJjbGFzcyBVbml2ZXJzZSB7XG5cdGNvbnN0cnVjdG9yKGxlbmd0aCwgaGVpZ2h0KXtcblx0XHQvLyB0aGlzIHdpbGwgYmUgdGhlIHRpbGVtYXAsIDJEIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIHVuaXZlcnNlXG5cdFx0dGhpcy5jZWxscyA9IFtdO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHR9XG5cdGNyZWF0ZSgpIHtcblx0XHQvLyBBc3NpZ24gdGhlIHRpbGVtYXAgaW4gcmVsYXRpb24gd2l0aCB0aGUgbGVuZ3RoIGFuZCBoZWlnaHQgb2YgdGhlIHVuaXZlcnNlLlxuXHRcdGZvciAobGV0IGkgPSAwOyBpPHRoaXMuaGVpZ2h0OyBpKyspIHtcblx0XHRcdHRoaXMuY2VsbHMucHVzaChuZXcgQXJyYXkoKSk7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgajx0aGlzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdC8vIGF0IHRoZSBpbml0aWFsIHVuaXZlcnNlLCBldmVyeSBjZWxsIGlzIGRlYWQgKDApXG5cdFx0XHRcdHRoaXMuY2VsbHNbaV0ucHVzaCgwKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaXZlcnNlOyJdfQ==
