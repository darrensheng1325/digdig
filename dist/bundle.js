/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nvar player_1 = __webpack_require__(/*! ./player */ \"./src/player.ts\");\nvar Game = /** @class */ (function () {\n    function Game(canvasId) {\n        this.canvas = document.getElementById(canvasId);\n        this.context = this.canvas.getContext('2d');\n        this.player = new player_1.Player(this.canvas.width / 2, this.canvas.height / 2);\n        this.init();\n    }\n    Game.prototype.init = function () {\n        var _this = this;\n        window.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });\n        this.gameLoop();\n    };\n    Game.prototype.handleKeyDown = function (event) {\n        switch (event.key) {\n            case 'ArrowUp':\n                this.player.move(0, -5);\n                break;\n            case 'ArrowDown':\n                this.player.move(0, 5);\n                break;\n            case 'ArrowLeft':\n                this.player.move(-5, 0);\n                break;\n            case 'ArrowRight':\n                this.player.move(5, 0);\n                break;\n        }\n    };\n    Game.prototype.gameLoop = function () {\n        var _this = this;\n        this.update();\n        this.render();\n        requestAnimationFrame(function () { return _this.gameLoop(); });\n    };\n    Game.prototype.update = function () {\n        // Update game state\n    };\n    Game.prototype.render = function () {\n        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\n        this.player.draw(this.context);\n    };\n    return Game;\n}());\nexports.Game = Game;\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar game_1 = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nwindow.onload = function () {\n    new game_1.Game('gameCanvas');\n};\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nvar Player = /** @class */ (function () {\n    function Player(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    Player.prototype.move = function (dx, dy) {\n        this.x += dx;\n        this.y += dy;\n    };\n    Player.prototype.draw = function (context) {\n        context.fillStyle = 'blue';\n        context.beginPath();\n        context.arc(this.x, this.y, 10, 0, Math.PI * 2);\n        context.fill();\n    };\n    return Player;\n}());\nexports.Player = Player;\n\n\n//# sourceURL=webpack:///./src/player.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;