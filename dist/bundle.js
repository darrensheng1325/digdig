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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nvar player_1 = __webpack_require__(/*! ./player */ \"./src/player.ts\");\nvar terrain_1 = __webpack_require__(/*! ./terrain */ \"./src/terrain.ts\");\nvar Game = /** @class */ (function () {\n    function Game(canvasId) {\n        this.canvas = document.getElementById(canvasId);\n        this.context = this.canvas.getContext('2d');\n        this.terrain = new terrain_1.Terrain(2000, 2000); // Larger terrain size\n        this.player = new player_1.Player(400, 300, 100, 10, this.context); // Initial player position, health, attack, and context\n        this.score = 0;\n        this.keysPressed = new Set();\n        this.cameraX = 0;\n        this.cameraY = 0;\n        this.lastHealthRecoveryTime = Date.now();\n        this.init();\n    }\n    Game.prototype.init = function () {\n        var _this = this;\n        window.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });\n        window.addEventListener('keyup', function (e) { return _this.handleKeyUp(e); });\n        this.resizeCanvas();\n        this.gameLoop();\n    };\n    Game.prototype.resizeCanvas = function () {\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n    };\n    Game.prototype.handleKeyDown = function (event) {\n        this.keysPressed.add(event.key);\n    };\n    Game.prototype.handleKeyUp = function (event) {\n        this.keysPressed.delete(event.key);\n    };\n    Game.prototype.gameLoop = function () {\n        var _this = this;\n        this.update();\n        this.render();\n        requestAnimationFrame(function () { return _this.gameLoop(); });\n    };\n    Game.prototype.update = function () {\n        // Update game state\n        var dx = 0;\n        var dy = 0;\n        if (this.keysPressed.has('ArrowUp'))\n            dy -= 5;\n        if (this.keysPressed.has('ArrowDown'))\n            dy += 5;\n        if (this.keysPressed.has('ArrowLeft'))\n            dx -= 5;\n        if (this.keysPressed.has('ArrowRight'))\n            dx += 5;\n        this.player.move(dx, dy);\n        var block = this.player.dig(this.terrain);\n        if (block) {\n            if (block.type === 'uranium') {\n                this.score -= 5; // Decrease score when uranium is dug\n            }\n            else if (block.type === 'lava') {\n                this.player.adjustHealth(-20); // Decrease health when lava is dug\n            }\n            else if (block.type === 'quartz') {\n                this.player.adjustShield(10); // Increase shield when quartz is dug\n            }\n            else {\n                this.score += 1; // Increase score when other blocks are dug\n            }\n            this.player.setSize(this.score); // Update player size based on score\n        }\n        // Health recovery over time\n        var currentTime = Date.now();\n        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds\n            this.player.recoverHealth(2); // Recover 2 health points\n            this.lastHealthRecoveryTime = currentTime;\n        }\n        // Update camera position to follow the player\n        this.cameraX = this.player.getX() - this.canvas.width / 2;\n        this.cameraY = this.player.getY() - this.canvas.height / 2;\n    };\n    Game.prototype.render = function () {\n        // Clear the entire canvas with black color\n        this.context.fillStyle = 'black';\n        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);\n        this.context.save();\n        this.context.translate(-this.cameraX, -this.cameraY);\n        this.terrain.generateTerrain(this.context);\n        this.player.draw(); // Remove the context argument\n        this.context.restore();\n        this.drawScore();\n        this.drawHealth();\n        this.drawShield();\n    };\n    Game.prototype.drawScore = function () {\n        this.context.fillStyle = 'white'; // Change score text color to white\n        this.context.font = '20px Arial';\n        this.context.fillText(\"Score: \".concat(this.score), 10, 20);\n    };\n    Game.prototype.drawHealth = function () {\n        this.context.fillStyle = 'white'; // Change health text color to white\n        this.context.font = '20px Arial';\n        this.context.fillText(\"Health: \".concat(this.player.getHealth()), 10, 50);\n    };\n    Game.prototype.drawShield = function () {\n        this.context.fillStyle = 'white'; // Change shield text color to white\n        this.context.font = '20px Arial';\n        this.context.fillText(\"Shield: \".concat(this.player.getShield()), 10, 80);\n    };\n    return Game;\n}());\nexports.Game = Game;\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar game_1 = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nwindow.onload = function () {\n    var game = new game_1.Game('gameCanvas');\n    var fullscreenButton = document.getElementById('fullscreenButton');\n    fullscreenButton.addEventListener('click', function () {\n        if (!document.fullscreenElement) {\n            document.documentElement.requestFullscreen();\n        }\n        else {\n            if (document.exitFullscreen) {\n                document.exitFullscreen();\n            }\n        }\n    });\n    window.addEventListener('resize', function () {\n        game.resizeCanvas();\n    });\n    game.resizeCanvas(); // Set initial canvas size\n};\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nvar Player = /** @class */ (function () {\n    function Player(x, y, health, attack, context) {\n        this.x = x;\n        this.y = y;\n        this.size = 20; // Initial size\n        this.health = health;\n        this.shield = 0;\n        this.context = context;\n    }\n    Player.prototype.move = function (dx, dy) {\n        this.x += dx;\n        this.y += dy;\n    };\n    Player.prototype.dig = function (terrain) {\n        // Implement digging logic here\n        return terrain.removeBlock(this.x, this.y);\n    };\n    Player.prototype.draw = function () {\n        // Draw player body (gray circle)\n        this.context.fillStyle = 'gray';\n        this.context.beginPath();\n        this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);\n        this.context.fill();\n        // Draw face\n        var eyeWidth = this.size / 6;\n        var eyeHeight = this.size / 4;\n        var eyeY = this.y - eyeHeight / 2;\n        // Left eye\n        this.context.fillStyle = 'white';\n        this.context.fillRect(this.x - this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Right eye\n        this.context.fillRect(this.x + this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Draw pupils\n        this.context.fillStyle = 'black';\n        var pupilSize = Math.min(eyeWidth, eyeHeight) / 2;\n        this.context.fillRect(this.x - this.size / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);\n        this.context.fillRect(this.x + this.size / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);\n        // Draw smile\n        this.context.strokeStyle = 'black';\n        this.context.lineWidth = 2;\n        this.context.beginPath();\n        this.context.arc(this.x, this.y + this.size / 8, this.size / 5, 0.2 * Math.PI, 0.8 * Math.PI);\n        this.context.stroke();\n    };\n    Player.prototype.getX = function () { return this.x; };\n    Player.prototype.getY = function () { return this.y; };\n    Player.prototype.getHealth = function () { return this.health; };\n    Player.prototype.getShield = function () { return this.shield; };\n    Player.prototype.adjustHealth = function (amount) {\n        this.health = Math.max(0, Math.min(100, this.health + amount));\n    };\n    Player.prototype.adjustShield = function (amount) {\n        this.shield = Math.max(0, Math.min(100, this.shield + amount));\n    };\n    Player.prototype.recoverHealth = function (amount) {\n        this.health = Math.min(100, this.health + amount);\n    };\n    Player.prototype.setSize = function (score) {\n        this.size = Math.max(20, Math.min(40, 20 + score * 0.1));\n    };\n    Player.prototype.getSize = function () {\n        return this.size;\n    };\n    Player.prototype.getContext = function () {\n        return this.context;\n    };\n    return Player;\n}());\nexports.Player = Player;\n\n\n//# sourceURL=webpack:///./src/player.ts?");

/***/ }),

/***/ "./src/terrain.ts":
/*!************************!*\
  !*** ./src/terrain.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Terrain = void 0;\nvar Terrain = /** @class */ (function () {\n    function Terrain(width, height) {\n        this.width = width;\n        this.height = height;\n        this.blocks = this.createBlocks();\n    }\n    Terrain.prototype.createBlocks = function () {\n        var blocks = [];\n        for (var i = 0; i < this.width; i += 10) {\n            var row = [];\n            for (var j = 0; j < this.height; j += 10) {\n                row.push({ type: 'dirt', present: true });\n            }\n            blocks.push(row);\n        }\n        // Generate clusters of diamond, uranium, lava, and quartz\n        this.generateClusters(blocks, 'diamond', 0.0001, 5); // 0.01% chance, cluster size 5\n        this.generateClusters(blocks, 'uranium', 0.00005, 3); // 0.005% chance, cluster size 3\n        this.generateClusters(blocks, 'lava', 0.0002, 4); // 0.02% chance, cluster size 4\n        this.generateClusters(blocks, 'quartz', 0.0001, 5); // 0.01% chance, cluster size 5\n        return blocks;\n    };\n    Terrain.prototype.generateClusters = function (blocks, type, chance, clusterSize) {\n        for (var i = 0; i < blocks.length; i++) {\n            for (var j = 0; j < blocks[i].length; j++) {\n                if (Math.random() < chance) {\n                    this.createCluster(blocks, i, j, type, clusterSize);\n                }\n            }\n        }\n    };\n    Terrain.prototype.createCluster = function (blocks, x, y, type, size) {\n        for (var dx = -size; dx <= size; dx++) {\n            for (var dy = -size; dy <= size; dy++) {\n                var distance = Math.sqrt(dx * dx + dy * dy);\n                if (distance <= size) {\n                    var i = x + dx;\n                    var j = y + dy;\n                    if (i >= 0 && i < blocks.length && j >= 0 && j < blocks[i].length) {\n                        blocks[i][j] = { type: type, present: true };\n                    }\n                }\n            }\n        }\n    };\n    Terrain.prototype.generateTerrain = function (context) {\n        for (var i = 0; i < this.blocks.length; i++) {\n            for (var j = 0; j < this.blocks[i].length; j++) {\n                var block = this.blocks[i][j];\n                if (block.present) {\n                    switch (block.type) {\n                        case 'dirt':\n                            context.fillStyle = '#8B4513'; // Brown color\n                            break;\n                        case 'diamond':\n                            context.fillStyle = 'blue';\n                            break;\n                        case 'uranium':\n                            context.fillStyle = 'yellow';\n                            break;\n                        case 'lava':\n                            context.fillStyle = 'red';\n                            break;\n                        case 'quartz':\n                            context.fillStyle = 'white';\n                            break;\n                    }\n                }\n                else {\n                    context.fillStyle = '#5C4033'; // Darker brown for dug areas\n                }\n                context.fillRect(i * 10, j * 10, 10, 10);\n            }\n        }\n    };\n    Terrain.prototype.removeBlock = function (x, y) {\n        var i = Math.floor(x / 10);\n        var j = Math.floor(y / 10);\n        if (i >= 0 && i < this.blocks.length && j >= 0 && j < this.blocks[i].length) {\n            var block = this.blocks[i][j];\n            if (block.present) {\n                block.present = false;\n                return block; // Return the removed block\n            }\n        }\n        return null; // No block was removed\n    };\n    return Terrain;\n}());\nexports.Terrain = Terrain;\n\n\n//# sourceURL=webpack:///./src/terrain.ts?");

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