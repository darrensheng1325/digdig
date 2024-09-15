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

/***/ "./src/clientGame.ts":
/*!***************************!*\
  !*** ./src/clientGame.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ClientGame = void 0;\nclass ClientGame {\n    constructor(canvasId, initialState, socket) {\n        this.keysPressed = new Set();\n        this.canvas = document.getElementById(canvasId);\n        this.context = this.canvas.getContext('2d');\n        this.gameState = initialState;\n        this.socket = socket;\n    }\n    start() {\n        this.resizeCanvas();\n        this.gameLoop();\n    }\n    resizeCanvas() {\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n        this.canvas.style.display = 'block'; // Ensure the canvas is visible\n    }\n    gameLoop() {\n        this.update();\n        this.render();\n        requestAnimationFrame(() => this.gameLoop());\n    }\n    update() {\n        const dx = (this.keysPressed.has('ArrowRight') ? 1 : 0) - (this.keysPressed.has('ArrowLeft') ? 1 : 0);\n        const dy = (this.keysPressed.has('ArrowDown') ? 1 : 0) - (this.keysPressed.has('ArrowUp') ? 1 : 0);\n        if (dx !== 0 || dy !== 0) {\n            this.socket.send(JSON.stringify({ type: 'playerMove', data: { x: dx, y: dy } }));\n        }\n        if (this.keysPressed.has(' ')) {\n            this.socket.send(JSON.stringify({ type: 'playerDig' }));\n        }\n    }\n    render() {\n        // Clear the canvas\n        this.context.fillStyle = 'black';\n        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);\n        // Render terrain, players, and enemies based on gameState\n        this.renderTerrain();\n        this.renderPlayers();\n        this.renderEnemies();\n    }\n    renderTerrain() {\n        for (const tile of this.gameState.terrain) {\n            this.context.fillStyle = tile.type === 'dirt' ? 'brown' : 'gray';\n            this.context.fillRect(tile.x * 20, tile.y * 20, 20, 20);\n        }\n    }\n    renderPlayers() {\n        for (const playerId in this.gameState.players) {\n            const player = this.gameState.players[playerId];\n            this.context.fillStyle = 'blue';\n            this.context.fillRect(player.x * 20, player.y * 20, 20, 20);\n        }\n    }\n    renderEnemies() {\n        for (const enemy of this.gameState.enemies) {\n            this.context.fillStyle = 'red';\n            this.context.fillRect(enemy.x * 20, enemy.y * 20, 20, 20);\n        }\n    }\n    updateState(newState) {\n        this.gameState = newState;\n    }\n    handleKeyDown(event) {\n        this.keysPressed.add(event.key);\n    }\n    handleKeyUp(event) {\n        this.keysPressed.delete(event.key);\n    }\n}\nexports.ClientGame = ClientGame;\n\n\n//# sourceURL=webpack:///./src/clientGame.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst clientGame_1 = __webpack_require__(/*! ./clientGame */ \"./src/clientGame.ts\");\nconst socket = new WebSocket('ws://localhost:3000');\nlet clientGame;\nsocket.addEventListener('open', () => {\n    console.log('Connected to server');\n});\nsocket.addEventListener('message', (event) => {\n    const data = JSON.parse(event.data);\n    console.log('Received data:', data); // Add this line\n    if (data.type === 'initialState') {\n        clientGame = new clientGame_1.ClientGame('gameCanvas', data.gameState, socket);\n        clientGame.start();\n    }\n    else if (data.type === 'gameState') {\n        if (clientGame) {\n            clientGame.updateState(data.gameState);\n        }\n    }\n});\n// Handle player input\ndocument.addEventListener('keydown', (event) => {\n    if (clientGame) {\n        clientGame.handleKeyDown(event);\n    }\n});\ndocument.addEventListener('keyup', (event) => {\n    if (clientGame) {\n        clientGame.handleKeyUp(event);\n    }\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

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