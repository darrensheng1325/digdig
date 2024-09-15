import { Player } from './player';
import { Enemy } from './enemy';
import { Terrain, Block } from './terrain';

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private player: Player;
    private terrain: Terrain;
    private score: number;
    private keysPressed: Set<string>;
    private cameraX: number;
    private cameraY: number;
    private lastHealthRecoveryTime: number;
    private enemies: Enemy[] = [];
    private maxEnemies: number = 40; // Changed from 20 to 40
    private isMouseControl: boolean = false;
    private zoom: number = 1;
    private minZoom: number = 0.01; // Minimum zoom (maximum zoom out)
    private maxZoom: number = 1; // Maximum zoom (no zoom out)
    private zoomCap: number = 0.4; // Set the zoom cap to 40%

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.terrain = new Terrain(10000, 10000); // Increased terrain size to 10000x10000
        this.player = new Player(5000, 5000, 100, 10, this.context, this.terrain); // Start player in the middle
        this.score = 0;
        this.keysPressed = new Set();
        this.cameraX = 0;
        this.cameraY = 0;
        this.lastHealthRecoveryTime = Date.now();
        this.enemies = [];
        this.spawnEnemies(20); // Increased initial spawn from 15 to 20

        this.init();
    }

    private init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.resizeCanvas();
        this.gameLoop();
    }

    public resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.keysPressed.add(event.key);
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.key);
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.isMouseControl) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left + this.cameraX;
            const y = event.clientY - rect.top + this.cameraY;
            const dx = x - this.player.getX();
            const dy = y - this.player.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 5) {  // Add a small threshold to prevent jittering
                const speed = this.player.getSpeed();
                const moveX = (dx / distance) * speed;
                const moveY = (dy / distance) * speed;
                this.player.move(moveX, moveY);
            }
        }
    }

    private handleMouseDown(event: MouseEvent) {
        if (this.isMouseControl) {
            this.player.startDigging();
        }
    }

    private handleMouseUp(event: MouseEvent) {
        if (this.isMouseControl) {
            this.player.stopDigging();
        }
    }

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        if (!this.isMouseControl) {
            // Existing keyboard control logic
            let dx = 0;
            let dy = 0;

            if (this.keysPressed.has('ArrowUp')) dy -= 1;
            if (this.keysPressed.has('ArrowDown')) dy += 1;
            if (this.keysPressed.has('ArrowLeft')) dx -= 1;
            if (this.keysPressed.has('ArrowRight')) dx += 1;

            if (dx !== 0 || dy !== 0) {
                const speed = this.player.getSpeed();
                this.player.move(dx * speed, dy * speed);
            }
        }

        // Call player's update method with all required arguments
        this.player.update(this.terrain, this.canvas.width, this.canvas.height, this.cameraX, this.cameraY);

        // Log player's position and digging status for debugging
        console.log(`Player position: (${this.player.getX()}, ${this.player.getY()}), Digging: ${this.player.isDigging()}`);

        // Health recovery over time
        const currentTime = Date.now();
        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds
            this.player.recoverHealth(2); // Recover 2 health points
            this.lastHealthRecoveryTime = currentTime;
        }

        // Update zoom based on player size
        this.updateZoom();

        // Update camera position to follow the player, but limit it to terrain boundaries
        const effectiveWidth = this.canvas.width / this.zoom;
        const effectiveHeight = this.canvas.height / this.zoom;
        this.cameraX = Math.max(0, Math.min(this.terrain.getWidth() - effectiveWidth, this.player.getX() - effectiveWidth / 2));
        this.cameraY = Math.max(0, Math.min(this.terrain.getHeight() - effectiveHeight, this.player.getY() - effectiveHeight / 2));

        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.terrain, this.canvas.width, this.canvas.height, this.cameraX, this.cameraY);
            
            // Check for collisions with player
            const dx = this.player.getX() - enemy.getX();
            const dy = this.player.getY() - enemy.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.player.getSize() + enemy.getSize()) / 2) {
                // Collision detected
                if (this.player.getSize() > enemy.getSize()) {
                    // Player wins
                    const scoreIncrease = Math.floor(enemy.getSize());
                    this.player.adjustScore(scoreIncrease);
                    console.log(`Player defeated enemy. Score increase: ${scoreIncrease}`); // Add this line for debugging
                    this.enemies.splice(index, 1);
                } else {
                    // Enemy wins
                    const damage = Math.floor(enemy.getSize() / 10); // Calculate damage based on enemy size
                    this.player.adjustHealth(-damage); // Deal damage to player
                    
                    // Optional: Make the enemy bounce away after dealing damage
                    const bounceDistance = 20;
                    const bounceX = enemy.getX() + (dx / distance) * bounceDistance;
                    const bounceY = enemy.getY() + (dy / distance) * bounceDistance;
                    enemy.setPosition(bounceX, bounceY);
                }
            }
        });

        // Spawn new enemies if needed
        if (this.enemies.length < this.maxEnemies) {
            const enemiesToSpawn = Math.min(5, this.maxEnemies - this.enemies.length); // Increased from 3 to 5
            this.spawnEnemies(enemiesToSpawn);
        }
    }

    private updateZoom() {
        const playerSize = this.player.getSize();
        const minPlayerSize = 20;
        const maxPlayerSize = 1000;
        
        // Calculate zoom factor based on player size using a logarithmic function
        const zoomFactor = Math.log(playerSize / minPlayerSize) / Math.log(maxPlayerSize / minPlayerSize);
        let newZoom = this.maxZoom * Math.pow(0.05, zoomFactor);
        
        // Apply the zoom cap
        newZoom = Math.max(this.zoomCap, newZoom);
        
        // Smooth transition to the new zoom level
        this.zoom = this.zoom * 0.9 + newZoom * 0.1;
        
        // Clamp zoom between minZoom and maxZoom
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    }

    private checkCollisions() {
        this.enemies.forEach((enemy, index) => {
            const dx = this.player.getX() - enemy.getX();
            const dy = this.player.getY() - enemy.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.player.getSize() + enemy.getSize()) / 2) {
                // Collision detected
                if (this.player.getSize() > enemy.getSize()) {
                    // Player wins
                    this.score += Math.floor(enemy.getSize());
                    this.enemies.splice(index, 1);
                } else {
                    // Enemy wins
                    this.player.adjustHealth(-10);
                }
            }
        });
    }

    private render() {
        // Clear the entire canvas
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();
        
        // Apply zoom and translation
        this.context.scale(this.zoom, this.zoom);
        
        // Adjust translation to keep player centered
        const centerX = this.canvas.width / (2 * this.zoom);
        const centerY = this.canvas.height / (2 * this.zoom);
        this.context.translate(centerX - this.player.getX(), centerY - this.player.getY());
        
        // Calculate visible area
        const visibleWidth = this.canvas.width / this.zoom;
        const visibleHeight = this.canvas.height / this.zoom;
        const startX = Math.floor((this.player.getX() - visibleWidth / 2) / 10);
        const startY = Math.floor((this.player.getY() - visibleHeight / 2) / 10);
        const endX = Math.ceil((this.player.getX() + visibleWidth / 2) / 10);
        const endY = Math.ceil((this.player.getY() + visibleHeight / 2) / 10);
        
        this.terrain.generateTerrain(this.context, startX, startY, endX, endY);
        this.enemies.forEach(enemy => enemy.draw());
        this.player.draw();
        
        this.context.restore();

        this.drawScore();
    }

    private drawScore() {
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        this.context.fillText(`Score: ${this.player.getScore()}`, 10, 30);
        this.context.fillText(`Zoom: ${this.zoom.toFixed(2)}`, 10, 60);
    }

    private spawnEnemies(count: number) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.terrain.getWidth();
            const y = Math.random() * this.terrain.getHeight();
            const enemy = new Enemy(x, y, this.terrain.getWidth(), this.terrain.getHeight(), this.context, this.player, this.terrain); // Pass terrain here
            this.enemies.push(enemy);
        }
    }

    public toggleControls() {
        this.isMouseControl = !this.isMouseControl;
        if (this.isMouseControl) {
            this.keysPressed.clear();  // Clear any pressed keys when switching to mouse control
        }
    }
}