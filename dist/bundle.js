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

/***/ "./src/enemy.ts":
/*!**********************!*\
  !*** ./src/enemy.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Enemy = void 0;\nvar player_1 = __webpack_require__(/*! ./player */ \"./src/player.ts\");\nvar Enemy = /** @class */ (function (_super) {\n    __extends(Enemy, _super);\n    function Enemy(x, y, terrainWidth, terrainHeight, context, target, terrain) {\n        var _this = _super.call(this, x, y, 50, 5, context, terrain) || this;\n        _this.randomDirection = { x: 0, y: 0 };\n        _this.randomMovementDuration = 0;\n        _this.target = target;\n        _this.setSize(20); // Set initial size\n        return _this;\n    }\n    // Override the getSpeed method to make enemies much slower\n    Enemy.prototype.getSpeed = function () {\n        return _super.prototype.getSpeed.call(this) * 0.2; // 20% of the player's speed\n    };\n    Enemy.prototype.update = function (terrain, screenWidth, screenHeight, cameraX, cameraY) {\n        if (this.isOffScreen(screenWidth, screenHeight, cameraX, cameraY)) {\n            this.moveRandomly();\n        }\n        else {\n            this.moveTowardsTarget();\n        }\n        var dugBlocks = this.dig(terrain);\n        for (var _i = 0, dugBlocks_1 = dugBlocks; _i < dugBlocks_1.length; _i++) {\n            var block = dugBlocks_1[_i];\n            this.handleDugBlock(block);\n        }\n        this.updateRingRotation();\n    };\n    Enemy.prototype.isOffScreen = function (screenWidth, screenHeight, cameraX, cameraY) {\n        return this.getX() < cameraX || this.getX() > cameraX + screenWidth ||\n            this.getY() < cameraY || this.getY() > cameraY + screenHeight;\n    };\n    Enemy.prototype.moveRandomly = function () {\n        if (this.randomMovementDuration <= 0) {\n            var angle = Math.random() * 2 * Math.PI;\n            this.randomDirection = {\n                x: Math.cos(angle),\n                y: Math.sin(angle)\n            };\n            this.randomMovementDuration = Math.random() * 100 + 50;\n        }\n        var speed = this.getSpeed();\n        this.move(this.randomDirection.x * speed, this.randomDirection.y * speed);\n        this.randomMovementDuration--;\n    };\n    Enemy.prototype.moveTowardsTarget = function () {\n        var dx = this.target.getX() - this.getX();\n        var dy = this.target.getY() - this.getY();\n        var distance = Math.sqrt(dx * dx + dy * dy);\n        if (distance > 0) {\n            var speed = this.getSpeed();\n            var moveX = (dx / distance) * speed;\n            var moveY = (dy / distance) * speed;\n            this.move(moveX, moveY);\n        }\n    };\n    Enemy.prototype.handleDugBlock = function (block) {\n        if (block.type === 'uranium') {\n            this.adjustScore(-5);\n        }\n        else if (block.type === 'lava') {\n            this.adjustHealth(-20);\n        }\n        else if (block.type === 'quartz') {\n            this.adjustShield(10);\n        }\n        else {\n            this.adjustScore(1);\n        }\n        this.updateSize();\n    };\n    Enemy.prototype.updateSize = function () {\n        var growthRate = 0.03; // Increased growth rate (twice as fast as the player)\n        var newSize = this.getSize() + this.getScore() * growthRate;\n        this.setSize(newSize);\n    };\n    Enemy.prototype.setPosition = function (x, y) {\n        this.x = x;\n        this.y = y;\n    };\n    // Override the draw method to change the color of the enemy and make a shorter frown\n    Enemy.prototype.draw = function () {\n        var context = this.getContext();\n        var x = this.getX();\n        var y = this.getY();\n        var size = this.getSize();\n        // Draw curved ring pattern (filled with black, like the player)\n        context.strokeStyle = 'black';\n        context.fillStyle = 'black';\n        context.lineWidth = 5;\n        var ringRadius = size / 2 + size / 6;\n        var curveCount = 8;\n        var curveAngle = (Math.PI * 2) / curveCount;\n        var curveDepth = size / 4;\n        context.beginPath();\n        for (var i = 0; i < curveCount; i++) {\n            var startAngle = i * curveAngle + this.ringRotation;\n            var endAngle = (i + 1) * curveAngle + this.ringRotation;\n            var midAngle = (startAngle + endAngle) / 2;\n            var startX = x + Math.cos(startAngle) * ringRadius;\n            var startY = y + Math.sin(startAngle) * ringRadius;\n            var endX = x + Math.cos(endAngle) * ringRadius;\n            var endY = y + Math.sin(endAngle) * ringRadius;\n            var controlX = x + Math.cos(midAngle) * (ringRadius - curveDepth);\n            var controlY = y + Math.sin(midAngle) * (ringRadius - curveDepth);\n            if (i === 0) {\n                context.moveTo(startX, startY);\n            }\n            context.quadraticCurveTo(controlX, controlY, endX, endY);\n        }\n        context.closePath();\n        context.fill();\n        context.stroke();\n        // Draw enemy body (red circle)\n        context.fillStyle = 'red';\n        context.beginPath();\n        context.arc(x, y, size / 2, 0, Math.PI * 2);\n        context.fill();\n        // Draw face (similar to player but with a frown)\n        var eyeWidth = size / 6;\n        var eyeHeight = size / 4;\n        var eyeY = y - eyeHeight / 2;\n        // Left eye\n        context.fillStyle = 'white';\n        context.fillRect(x - size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Right eye\n        context.fillRect(x + size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Draw pupils (rectangular)\n        context.fillStyle = 'black';\n        var pupilWidth = eyeWidth * 0.6;\n        var pupilHeight = eyeHeight * 0.6;\n        var maxPupilOffset = (eyeWidth - pupilWidth) / 2;\n        // Calculate pupil offset based on movement direction\n        var pupilOffsetX = this.randomDirection.x * maxPupilOffset;\n        var pupilOffsetY = this.randomDirection.y * maxPupilOffset;\n        // Left pupil\n        context.fillRect(x - size / 6 - pupilWidth / 2 + pupilOffsetX, eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY, pupilWidth, pupilHeight);\n        // Right pupil\n        context.fillRect(x + size / 6 - pupilWidth / 2 + pupilOffsetX, eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY, pupilWidth, pupilHeight);\n        // Draw frown (inverted smile, moved down)\n        context.strokeStyle = 'black';\n        context.lineWidth = 2;\n        context.beginPath();\n        context.arc(x, y + size / 4, size / 5, 1.2 * Math.PI, 1.8 * Math.PI); // Changed y-coordinate\n        context.stroke();\n        // Draw health and shield bar\n        var barWidth = size * 2;\n        var barHeight = 5;\n        var healthPercentage = this.getHealth() / 100;\n        var shieldPercentage = this.getShield() / 100;\n        context.fillStyle = 'darkred';\n        context.fillRect(x - barWidth / 2, y - size / 2 - 10, barWidth, barHeight);\n        context.fillStyle = 'red';\n        context.fillRect(x - barWidth / 2, y - size / 2 - 10, barWidth * healthPercentage, barHeight);\n        context.fillStyle = 'purple';\n        context.fillRect(x - barWidth / 2 + barWidth * healthPercentage, y - size / 2 - 10, barWidth * shieldPercentage, barHeight);\n    };\n    return Enemy;\n}(player_1.Player));\nexports.Enemy = Enemy;\n\n\n//# sourceURL=webpack:///./src/enemy.ts?");

/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nvar player_1 = __webpack_require__(/*! ./player */ \"./src/player.ts\");\nvar enemy_1 = __webpack_require__(/*! ./enemy */ \"./src/enemy.ts\");\nvar terrain_1 = __webpack_require__(/*! ./terrain */ \"./src/terrain.ts\");\nvar Game = /** @class */ (function () {\n    function Game(canvasId) {\n        this.enemies = [];\n        this.maxEnemies = 40; // Changed from 20 to 40\n        this.canvas = document.getElementById(canvasId);\n        this.context = this.canvas.getContext('2d');\n        this.terrain = new terrain_1.Terrain(10000, 10000); // Increased terrain size to 10000x10000\n        this.player = new player_1.Player(5000, 5000, 100, 10, this.context, this.terrain); // Start player in the middle\n        this.score = 0;\n        this.keysPressed = new Set();\n        this.cameraX = 0;\n        this.cameraY = 0;\n        this.lastHealthRecoveryTime = Date.now();\n        this.enemies = [];\n        this.spawnEnemies(20); // Increased initial spawn from 15 to 20\n        this.init();\n    }\n    Game.prototype.init = function () {\n        var _this = this;\n        window.addEventListener('keydown', function (e) { return _this.handleKeyDown(e); });\n        window.addEventListener('keyup', function (e) { return _this.handleKeyUp(e); });\n        this.resizeCanvas();\n        this.gameLoop();\n    };\n    Game.prototype.resizeCanvas = function () {\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n    };\n    Game.prototype.handleKeyDown = function (event) {\n        this.keysPressed.add(event.key);\n    };\n    Game.prototype.handleKeyUp = function (event) {\n        this.keysPressed.delete(event.key);\n    };\n    Game.prototype.gameLoop = function () {\n        var _this = this;\n        this.update();\n        this.render();\n        requestAnimationFrame(function () { return _this.gameLoop(); });\n    };\n    Game.prototype.update = function () {\n        var _this = this;\n        // Update game state\n        var dx = 0;\n        var dy = 0;\n        if (this.keysPressed.has('ArrowUp'))\n            dy -= 5;\n        if (this.keysPressed.has('ArrowDown'))\n            dy += 5;\n        if (this.keysPressed.has('ArrowLeft'))\n            dx -= 5;\n        if (this.keysPressed.has('ArrowRight'))\n            dx += 5;\n        this.player.move(dx, dy);\n        var dugBlocks = this.player.dig(this.terrain);\n        for (var _i = 0, dugBlocks_1 = dugBlocks; _i < dugBlocks_1.length; _i++) {\n            var block = dugBlocks_1[_i];\n            if (block.type === 'uranium') {\n                this.score -= 5; // Decrease score when uranium is dug\n            }\n            else if (block.type === 'lava') {\n                this.player.adjustHealth(-20); // Decrease health when lava is dug\n            }\n            else if (block.type === 'quartz') {\n                this.player.adjustShield(10); // Increase shield when quartz is dug\n            }\n            else {\n                this.score += 1; // Increase score when other blocks are dug\n            }\n        }\n        this.player.setSize(this.score); // Update player size based on score\n        // Health recovery over time\n        var currentTime = Date.now();\n        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds\n            this.player.recoverHealth(2); // Recover 2 health points\n            this.lastHealthRecoveryTime = currentTime;\n        }\n        // Update camera position to follow the player, but limit it to terrain boundaries\n        this.cameraX = Math.max(0, Math.min(this.terrain.getWidth() - this.canvas.width, this.player.getX() - this.canvas.width / 2));\n        this.cameraY = Math.max(0, Math.min(this.terrain.getHeight() - this.canvas.height, this.player.getY() - this.canvas.height / 2));\n        // Update enemies\n        this.enemies.forEach(function (enemy, index) {\n            enemy.update(_this.terrain, _this.canvas.width, _this.canvas.height, _this.cameraX, _this.cameraY);\n            // Check for collisions with player\n            var dx = _this.player.getX() - enemy.getX();\n            var dy = _this.player.getY() - enemy.getY();\n            var distance = Math.sqrt(dx * dx + dy * dy);\n            if (distance < (_this.player.getSize() + enemy.getSize()) / 2) {\n                // Collision detected\n                if (_this.player.getSize() > enemy.getSize()) {\n                    // Player wins\n                    _this.score += Math.floor(enemy.getSize());\n                    _this.enemies.splice(index, 1);\n                }\n                else {\n                    // Enemy wins\n                    var damage = Math.floor(enemy.getSize() / 10); // Calculate damage based on enemy size\n                    _this.player.adjustHealth(-damage); // Deal damage to player\n                    // Optional: Make the enemy bounce away after dealing damage\n                    var bounceDistance = 20;\n                    var bounceX = enemy.getX() + (dx / distance) * bounceDistance;\n                    var bounceY = enemy.getY() + (dy / distance) * bounceDistance;\n                    enemy.setPosition(bounceX, bounceY);\n                }\n            }\n        });\n        // Spawn new enemies if needed\n        if (this.enemies.length < this.maxEnemies) {\n            var enemiesToSpawn = Math.min(5, this.maxEnemies - this.enemies.length); // Increased from 3 to 5\n            this.spawnEnemies(enemiesToSpawn);\n        }\n    };\n    Game.prototype.checkCollisions = function () {\n        var _this = this;\n        this.enemies.forEach(function (enemy, index) {\n            var dx = _this.player.getX() - enemy.getX();\n            var dy = _this.player.getY() - enemy.getY();\n            var distance = Math.sqrt(dx * dx + dy * dy);\n            if (distance < (_this.player.getSize() + enemy.getSize()) / 2) {\n                // Collision detected\n                if (_this.player.getSize() > enemy.getSize()) {\n                    // Player wins\n                    _this.score += Math.floor(enemy.getSize());\n                    _this.enemies.splice(index, 1);\n                }\n                else {\n                    // Enemy wins\n                    _this.player.adjustHealth(-10);\n                }\n            }\n        });\n    };\n    Game.prototype.render = function () {\n        // Clear only the visible part of the canvas\n        this.context.fillStyle = 'black';\n        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);\n        this.context.save();\n        this.context.translate(-this.cameraX, -this.cameraY);\n        // Only render the visible part of the terrain\n        var startX = Math.floor(this.cameraX / 10);\n        var startY = Math.floor(this.cameraY / 10);\n        var endX = Math.ceil((this.cameraX + this.canvas.width) / 10);\n        var endY = Math.ceil((this.cameraY + this.canvas.height) / 10);\n        this.terrain.generateTerrain(this.context, startX, startY, endX, endY);\n        this.enemies.forEach(function (enemy) { return enemy.draw(); });\n        this.player.draw();\n        this.context.restore();\n        this.drawScore();\n    };\n    Game.prototype.drawScore = function () {\n        this.context.fillStyle = 'white'; // Change score text color to white\n        this.context.font = '20px Arial';\n        this.context.fillText(\"Score: \".concat(this.score), 10, 20);\n    };\n    Game.prototype.spawnEnemies = function (count) {\n        for (var i = 0; i < count; i++) {\n            var x = Math.random() * this.terrain.getWidth();\n            var y = Math.random() * this.terrain.getHeight();\n            var enemy = new enemy_1.Enemy(x, y, this.terrain.getWidth(), this.terrain.getHeight(), this.context, this.player, this.terrain); // Pass terrain here\n            this.enemies.push(enemy);\n        }\n    };\n    return Game;\n}());\nexports.Game = Game;\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar game_1 = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nvar titleScreen_1 = __webpack_require__(/*! ./titleScreen */ \"./src/titleScreen.ts\");\nvar GameManager = /** @class */ (function () {\n    function GameManager() {\n        var _this = this;\n        this.game = null;\n        this.canvas = document.getElementById('gameCanvas');\n        this.context = this.canvas.getContext('2d');\n        this.titleScreen = new titleScreen_1.TitleScreen(this.canvas, this.context, function () { return _this.startGame(); });\n    }\n    GameManager.prototype.init = function () {\n        var _this = this;\n        this.resizeCanvas();\n        window.addEventListener('resize', function () { return _this.resizeCanvas(); });\n        this.showTitleScreen();\n    };\n    GameManager.prototype.resizeCanvas = function () {\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n        if (this.game) {\n            this.game.resizeCanvas();\n        }\n    };\n    GameManager.prototype.showTitleScreen = function () {\n        this.titleScreen.show();\n    };\n    GameManager.prototype.startGame = function () {\n        this.game = new game_1.Game('gameCanvas');\n        this.setupFullscreenButton();\n    };\n    GameManager.prototype.setupFullscreenButton = function () {\n        var _this = this;\n        var fullscreenButton = document.getElementById('fullscreenButton');\n        fullscreenButton.addEventListener('click', function () { return _this.toggleFullscreen(); });\n    };\n    GameManager.prototype.toggleFullscreen = function () {\n        if (!document.fullscreenElement) {\n            document.documentElement.requestFullscreen();\n        }\n        else if (document.exitFullscreen) {\n            document.exitFullscreen();\n        }\n    };\n    return GameManager;\n}());\nwindow.onload = function () {\n    var gameManager = new GameManager();\n    gameManager.init();\n};\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nvar Player = /** @class */ (function () {\n    function Player(x, y, health, attack, context, terrain) {\n        this.movementDirection = { x: 0, y: 0 };\n        this.baseSpeed = 4; // Reduced from 6 to 4 for slightly slower movement\n        this.minSpeed = 0.5; // Reduced minimum speed\n        this.maxSpeed = 5; // Reduced maximum speed\n        this.optimalSize = 40; // Size at which the player is fastest\n        this.ringRotation = 0; // Change from private to protected\n        this.score = 0; // Add this line\n        this.x = x;\n        this.y = y;\n        this.size = 20; // Initial size\n        this.health = health;\n        this.shield = 0;\n        this.context = context;\n        this.terrain = terrain; // Add this line\n    }\n    Player.prototype.move = function (dx, dy) {\n        var speed = this.getSpeed();\n        var newX = this.x + dx * speed;\n        var newY = this.y + dy * speed;\n        // Check if the new position is within the terrain boundaries\n        if (newX >= 0 && newX < this.terrain.getWidth() && newY >= 0 && newY < this.terrain.getHeight()) {\n            this.x = newX;\n            this.y = newY;\n            // Update movement direction\n            var length_1 = Math.sqrt(dx * dx + dy * dy);\n            if (length_1 > 0) {\n                this.movementDirection = { x: dx / length_1, y: dy / length_1 };\n            }\n        }\n    };\n    // Calculate speed based on size\n    Player.prototype.getSpeed = function () {\n        var minSize = 20;\n        var speedDecrease = Math.pow((this.size - minSize) / 20, 1.5); // More rapid speed decrease\n        return Math.max(this.minSpeed, this.baseSpeed - speedDecrease);\n    };\n    Player.prototype.dig = function (terrain) {\n        var digRadius = Math.floor(this.size / 2); // Dig radius is now half the size (full diameter)\n        var dugBlocks = [];\n        for (var dx = -digRadius; dx <= digRadius; dx++) {\n            for (var dy = -digRadius; dy <= digRadius; dy++) {\n                if (dx * dx + dy * dy <= digRadius * digRadius) { // Check if within circular dig area\n                    var block = terrain.removeBlock(this.x + dx, this.y + dy);\n                    if (block) {\n                        dugBlocks.push(block);\n                    }\n                }\n            }\n        }\n        return dugBlocks;\n    };\n    Player.prototype.draw = function () {\n        this.updateRingRotation();\n        // Update ring rotation\n        this.ringRotation += Math.PI / 180; // Rotate 1 degree (in radians) per frame\n        if (this.ringRotation >= Math.PI * 2) {\n            this.ringRotation -= Math.PI * 2; // Reset rotation after a full circle\n        }\n        // Draw curved ring pattern (filled with black)\n        this.context.strokeStyle = 'black';\n        this.context.fillStyle = 'black';\n        this.context.lineWidth = 5; // Increased from 3 to 5 for a thicker ring\n        var ringRadius = this.size / 2 + this.size / 6; // Increased from this.size / 8 to this.size / 6\n        var curveCount = 8;\n        var curveAngle = (Math.PI * 2) / curveCount;\n        var curveDepth = this.size / 4;\n        this.context.beginPath();\n        for (var i = 0; i < curveCount; i++) {\n            var startAngle = i * curveAngle + this.ringRotation;\n            var endAngle = (i + 1) * curveAngle + this.ringRotation;\n            var midAngle = (startAngle + endAngle) / 2;\n            var startX = this.x + Math.cos(startAngle) * ringRadius;\n            var startY = this.y + Math.sin(startAngle) * ringRadius;\n            var endX = this.x + Math.cos(endAngle) * ringRadius;\n            var endY = this.y + Math.sin(endAngle) * ringRadius;\n            var controlX = this.x + Math.cos(midAngle) * (ringRadius - curveDepth);\n            var controlY = this.y + Math.sin(midAngle) * (ringRadius - curveDepth);\n            if (i === 0) {\n                this.context.moveTo(startX, startY);\n            }\n            this.context.quadraticCurveTo(controlX, controlY, endX, endY);\n        }\n        this.context.closePath();\n        this.context.fill();\n        this.context.stroke();\n        // Draw player body (gray circle)\n        this.context.fillStyle = 'gray';\n        this.context.beginPath();\n        this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);\n        this.context.fill();\n        // Draw face\n        var eyeWidth = this.size / 6;\n        var eyeHeight = this.size / 4;\n        var eyeY = this.y - eyeHeight / 2;\n        // Left eye\n        this.context.fillStyle = 'white';\n        this.context.fillRect(this.x - this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Right eye\n        this.context.fillRect(this.x + this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);\n        // Draw pupils (rectangular)\n        this.context.fillStyle = 'black';\n        var pupilWidth = eyeWidth * 0.6;\n        var pupilHeight = eyeHeight * 0.6;\n        var maxPupilOffset = (eyeWidth - pupilWidth) / 2;\n        // Calculate pupil offset based on movement direction\n        var pupilOffsetX = this.movementDirection.x * maxPupilOffset;\n        var pupilOffsetY = this.movementDirection.y * maxPupilOffset;\n        // Left pupil\n        this.context.fillRect(this.x - this.size / 6 - pupilWidth / 2 + pupilOffsetX, eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY, pupilWidth, pupilHeight);\n        // Right pupil\n        this.context.fillRect(this.x + this.size / 6 - pupilWidth / 2 + pupilOffsetX, eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY, pupilWidth, pupilHeight);\n        // Draw smile\n        this.context.strokeStyle = 'black';\n        this.context.lineWidth = 2;\n        this.context.beginPath();\n        this.context.arc(this.x, this.y + this.size / 8, this.size / 5, 0.2 * Math.PI, 0.8 * Math.PI);\n        this.context.stroke();\n        // Draw combined health and shield bar\n        var barWidth = this.size * 2;\n        var barHeight = 5;\n        var healthPercentage = this.health / 100;\n        var shieldPercentage = this.shield / 100;\n        // Background (red)\n        this.context.fillStyle = 'red';\n        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth, barHeight);\n        // Health (green)\n        this.context.fillStyle = 'green';\n        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth * healthPercentage, barHeight);\n        // Shield (blue)\n        this.context.fillStyle = 'blue';\n        this.context.fillRect(this.x - barWidth / 2 + barWidth * healthPercentage, this.y - this.size / 2 - 10, barWidth * shieldPercentage, barHeight);\n    };\n    Player.prototype.getX = function () { return this.x; };\n    Player.prototype.getY = function () { return this.y; };\n    Player.prototype.getHealth = function () { return this.health; };\n    Player.prototype.getShield = function () { return this.shield; };\n    Player.prototype.adjustHealth = function (amount) {\n        this.health = Math.max(0, Math.min(100, this.health + amount));\n    };\n    Player.prototype.adjustShield = function (amount) {\n        this.shield = Math.max(0, Math.min(100, this.shield + amount));\n    };\n    Player.prototype.recoverHealth = function (amount) {\n        this.health = Math.min(100, this.health + amount);\n    };\n    Player.prototype.setSize = function (score) {\n        var minSize = 20;\n        var growthRate = 0.015; // Slightly reduced growth rate\n        this.size = Math.max(minSize, minSize + score * growthRate);\n    };\n    Player.prototype.getSize = function () {\n        return this.size;\n    };\n    Player.prototype.getContext = function () {\n        return this.context;\n    };\n    Player.prototype.updateRingRotation = function () {\n        this.ringRotation += Math.PI / 180;\n        if (this.ringRotation >= Math.PI * 2) {\n            this.ringRotation -= Math.PI * 2;\n        }\n    };\n    Player.prototype.getScore = function () {\n        return this.score;\n    };\n    Player.prototype.adjustScore = function (amount) {\n        this.score += amount;\n    };\n    return Player;\n}());\nexports.Player = Player;\n\n\n//# sourceURL=webpack:///./src/player.ts?");

/***/ }),

/***/ "./src/terrain.ts":
/*!************************!*\
  !*** ./src/terrain.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Terrain = void 0;\nvar Terrain = /** @class */ (function () {\n    function Terrain(width, height) {\n        this.width = width;\n        this.height = height;\n        this.blocks = this.createBlocks();\n    }\n    Terrain.prototype.createBlocks = function () {\n        var blocks = [];\n        for (var i = 0; i < this.width; i += 10) {\n            var row = [];\n            for (var j = 0; j < this.height; j += 10) {\n                row.push({ type: 'dirt', present: true });\n            }\n            blocks.push(row);\n        }\n        // Generate clusters of diamond, uranium, lava, and quartz\n        this.generateClusters(blocks, 'diamond', 0.0001, 5); // 0.01% chance, cluster size 5\n        this.generateClusters(blocks, 'uranium', 0.00005, 3); // 0.005% chance, cluster size 3\n        this.generateClusters(blocks, 'lava', 0.0002, 4); // 0.02% chance, cluster size 4\n        this.generateClusters(blocks, 'quartz', 0.0001, 5); // 0.01% chance, cluster size 5\n        return blocks;\n    };\n    Terrain.prototype.generateClusters = function (blocks, type, chance, clusterSize) {\n        for (var i = 0; i < blocks.length; i++) {\n            for (var j = 0; j < blocks[i].length; j++) {\n                if (Math.random() < chance) {\n                    this.createCluster(blocks, i, j, type, clusterSize);\n                }\n            }\n        }\n    };\n    Terrain.prototype.createCluster = function (blocks, x, y, type, size) {\n        for (var dx = -size; dx <= size; dx++) {\n            for (var dy = -size; dy <= size; dy++) {\n                var distance = Math.sqrt(dx * dx + dy * dy);\n                if (distance <= size) {\n                    var i = x + dx;\n                    var j = y + dy;\n                    if (i >= 0 && i < blocks.length && j >= 0 && j < blocks[i].length) {\n                        blocks[i][j] = { type: type, present: true };\n                    }\n                }\n            }\n        }\n    };\n    Terrain.prototype.generateTerrain = function (context, startX, startY, endX, endY) {\n        for (var i = startX; i < endX && i < this.blocks.length; i++) {\n            for (var j = startY; j < endY && j < this.blocks[i].length; j++) {\n                var block = this.blocks[i][j];\n                if (block.present) {\n                    switch (block.type) {\n                        case 'dirt':\n                            context.fillStyle = '#8B4513'; // Brown color\n                            break;\n                        case 'diamond':\n                            context.fillStyle = 'blue';\n                            break;\n                        case 'uranium':\n                            context.fillStyle = '#00FF00'; // Changed to green\n                            break;\n                        case 'lava':\n                            context.fillStyle = 'red';\n                            break;\n                        case 'quartz':\n                            context.fillStyle = 'white';\n                            break;\n                    }\n                }\n                else {\n                    context.fillStyle = '#5C4033'; // Darker brown for dug areas\n                }\n                context.fillRect(i * 10, j * 10, 10, 10);\n            }\n        }\n    };\n    Terrain.prototype.removeBlock = function (x, y) {\n        var i = Math.floor(x / 10);\n        var j = Math.floor(y / 10);\n        if (i >= 0 && i < this.blocks.length && j >= 0 && j < this.blocks[i].length) {\n            var block = this.blocks[i][j];\n            if (block.present) {\n                block.present = false;\n                return block; // Return the removed block\n            }\n        }\n        return null; // No block was removed\n    };\n    Terrain.prototype.getWidth = function () {\n        return this.width;\n    };\n    Terrain.prototype.getHeight = function () {\n        return this.height;\n    };\n    return Terrain;\n}());\nexports.Terrain = Terrain;\n\n\n//# sourceURL=webpack:///./src/terrain.ts?");

/***/ }),

/***/ "./src/titleScreen.ts":
/*!****************************!*\
  !*** ./src/titleScreen.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.TitleScreen = void 0;\nvar player_1 = __webpack_require__(/*! ./player */ \"./src/player.ts\");\nvar enemy_1 = __webpack_require__(/*! ./enemy */ \"./src/enemy.ts\");\nvar terrain_1 = __webpack_require__(/*! ./terrain */ \"./src/terrain.ts\");\nvar TitleScreen = /** @class */ (function () {\n    function TitleScreen(canvas, context, onStart) {\n        this.canvas = canvas;\n        this.context = context;\n        this.onStart = onStart;\n    }\n    TitleScreen.prototype.show = function () {\n        this.draw();\n        this.setupEventListeners();\n    };\n    TitleScreen.prototype.draw = function () {\n        var tempTerrain = new terrain_1.Terrain(this.canvas.width, this.canvas.height);\n        // Background\n        this.context.fillStyle = 'black';\n        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);\n        // Draw some terrain\n        tempTerrain.generateTerrain(this.context, 0, 0, this.canvas.width / 10, this.canvas.height / 10);\n        // Create and draw a player\n        var player = new player_1.Player(this.canvas.width / 2, this.canvas.height / 2, 100, 10, this.context, tempTerrain);\n        player.setSize(40);\n        player.draw();\n        // Create and draw some enemies\n        for (var i = 0; i < 5; i++) {\n            var enemy = new enemy_1.Enemy(Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.canvas.width, this.canvas.height, this.context, player, tempTerrain);\n            enemy.setSize(30);\n            enemy.draw();\n        }\n        // Title\n        this.context.fillStyle = 'white';\n        this.context.font = '48px Arial';\n        this.context.textAlign = 'center';\n        this.context.fillText('DigDig', this.canvas.width / 2, this.canvas.height / 2 - 50);\n        // Start button\n        this.drawStartButton();\n    };\n    TitleScreen.prototype.drawStartButton = function () {\n        var buttonWidth = 200;\n        var buttonHeight = 50;\n        var buttonX = this.canvas.width / 2 - buttonWidth / 2;\n        var buttonY = this.canvas.height / 2 + 50;\n        this.context.fillStyle = 'green';\n        this.context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);\n        this.context.fillStyle = 'white';\n        this.context.font = '24px Arial';\n        this.context.fillText('Start Game', this.canvas.width / 2, buttonY + buttonHeight / 2 + 8);\n    };\n    TitleScreen.prototype.setupEventListeners = function () {\n        var _this = this;\n        this.canvas.onclick = function (event) { return _this.handleClick(event); };\n    };\n    TitleScreen.prototype.handleClick = function (event) {\n        var rect = this.canvas.getBoundingClientRect();\n        var x = event.clientX - rect.left;\n        var y = event.clientY - rect.top;\n        var buttonWidth = 200;\n        var buttonHeight = 50;\n        var buttonX = this.canvas.width / 2 - buttonWidth / 2;\n        var buttonY = this.canvas.height / 2 + 50;\n        if (x >= buttonX && x <= buttonX + buttonWidth &&\n            y >= buttonY && y <= buttonY + buttonHeight) {\n            this.canvas.onclick = null;\n            this.onStart();\n        }\n    };\n    return TitleScreen;\n}());\nexports.TitleScreen = TitleScreen;\n\n\n//# sourceURL=webpack:///./src/titleScreen.ts?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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