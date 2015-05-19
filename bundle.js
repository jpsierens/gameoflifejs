(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsUniverse = require('./js/Universe');

var _jsUniverse2 = _interopRequireDefault(_jsUniverse);

var universe = new _jsUniverse2['default']();
universe.create();

},{"./js/Universe":2}],2:[function(require,module,exports){
//const cus I don't want them to change.
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UNIVERSE_LENGTH = 15;
var UNIVERSE_HEIGHT = 15;
var CELL_LENGTH = 32;
var CELL_HEIGHT = 32;

var Universe = (function () {
	function Universe() {
		_classCallCheck(this, Universe);

		// this will be the tilemap, 2D matrix representing the universe
		this.cells = [];
	}

	_createClass(Universe, [{
		key: "create",
		value: function create() {
			// Assign the tilemap in relation with the length and height of the universe.
			for (var i = 0; i < UNIVERSE_HEIGHT; i++) {
				this.cells.push(new Array());
				for (var j = 0; j < UNIVERSE_LENGTH; j++) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9hcHAuanMiLCIvaG9tZS9qcHNpZXJlbnMvU2l0ZXMvZ2FtZW9mbGlmZS9qcy9Vbml2ZXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7MEJDQXFCLGVBQWU7Ozs7QUFFcEMsSUFBSSxRQUFRLEdBQUcsNkJBQWMsQ0FBQztBQUM5QixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7QUNGbEIsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDOztJQUVqQixRQUFRO0FBQ0YsVUFETixRQUFRLEdBQ0E7d0JBRFIsUUFBUTs7O0FBR1osTUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7RUFDaEI7O2NBSkksUUFBUTs7U0FLUCxrQkFBRzs7QUFFUixRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFOztBQUV2QyxTQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQjtJQUNEO0dBQ0Q7OztRQWRJLFFBQVE7OztBQWlCZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi9qcy9Vbml2ZXJzZSc7XG5cbnZhciB1bml2ZXJzZSA9IG5ldyBVbml2ZXJzZSgpO1xudW5pdmVyc2UuY3JlYXRlKCk7XG5cblxuXG5cbiIsIi8vY29uc3QgY3VzIEkgZG9uJ3Qgd2FudCB0aGVtIHRvIGNoYW5nZS5cbmNvbnN0IFVOSVZFUlNFX0xFTkdUSCA9IDE1O1xuY29uc3QgVU5JVkVSU0VfSEVJR0hUID0gMTU7XG5jb25zdCBDRUxMX0xFTkdUSCA9IDMyO1xuY29uc3QgQ0VMTF9IRUlHSFQgPSAzMjtcblxuY2xhc3MgVW5pdmVyc2Uge1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdC8vIHRoaXMgd2lsbCBiZSB0aGUgdGlsZW1hcCwgMkQgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgdW5pdmVyc2Vcblx0XHR0aGlzLmNlbGxzID0gW107XG5cdH1cblx0Y3JlYXRlKCkge1xuXHRcdC8vIEFzc2lnbiB0aGUgdGlsZW1hcCBpbiByZWxhdGlvbiB3aXRoIHRoZSBsZW5ndGggYW5kIGhlaWdodCBvZiB0aGUgdW5pdmVyc2UuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGk8VU5JVkVSU0VfSEVJR0hUOyBpKyspIHtcblx0XHRcdHRoaXMuY2VsbHMucHVzaChuZXcgQXJyYXkoKSk7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgajxVTklWRVJTRV9MRU5HVEg7IGorKykge1xuXHRcdFx0XHQvLyBhdCB0aGUgaW5pdGlhbCB1bml2ZXJzZSwgZXZlcnkgY2VsbCBpcyBkZWFkICgwKVxuXHRcdFx0XHR0aGlzLmNlbGxzW2ldLnB1c2goMClcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVbml2ZXJzZTsiXX0=
