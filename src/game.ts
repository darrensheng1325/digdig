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

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.terrain = new Terrain(2000, 2000); // Larger terrain size
        this.player = new Player(400, 300, 100, 10, this.context, this.terrain); // Pass terrain here
        this.score = 0;
        this.keysPressed = new Set();
        this.cameraX = 0;
        this.cameraY = 0;
        this.lastHealthRecoveryTime = Date.now();
        this.enemies = [];
        this.spawnEnemies(5); // Spawn 5 initial enemies

        this.init();
    }

    private init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
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

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        // Update game state
        let dx = 0;
        let dy = 0;

        if (this.keysPressed.has('ArrowUp')) dy -= 5;
        if (this.keysPressed.has('ArrowDown')) dy += 5;
        if (this.keysPressed.has('ArrowLeft')) dx -= 5;
        if (this.keysPressed.has('ArrowRight')) dx += 5;

        this.player.move(dx, dy);

        const dugBlocks = this.player.dig(this.terrain);
        for (const block of dugBlocks) {
            if (block.type === 'uranium') {
                this.score -= 5; // Decrease score when uranium is dug
            } else if (block.type === 'lava') {
                this.player.adjustHealth(-20); // Decrease health when lava is dug
            } else if (block.type === 'quartz') {
                this.player.adjustShield(10); // Increase shield when quartz is dug
            } else {
                this.score += 1; // Increase score when other blocks are dug
            }
        }
        this.player.setSize(this.score); // Update player size based on score

        // Health recovery over time
        const currentTime = Date.now();
        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds
            this.player.recoverHealth(2); // Recover 2 health points
            this.lastHealthRecoveryTime = currentTime;
        }

        // Update camera position to follow the player, but limit it to terrain boundaries
        this.cameraX = Math.max(0, Math.min(this.terrain.getWidth() - this.canvas.width, this.player.getX() - this.canvas.width / 2));
        this.cameraY = Math.max(0, Math.min(this.terrain.getHeight() - this.canvas.height, this.player.getY() - this.canvas.height / 2));

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
                    this.score += Math.floor(enemy.getSize());
                    this.enemies.splice(index, 1);
                } else {
                    // Enemy wins
                    this.player.adjustHealth(-10);
                }
            }
        });

        // Spawn new enemies if needed
        if (this.enemies.length < 5) {
            this.spawnEnemies(1);
        }
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
        // Clear only the visible part of the canvas
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();
        this.context.translate(-this.cameraX, -this.cameraY);
        
        // Only render the visible part of the terrain
        const startX = Math.floor(this.cameraX / 10);
        const startY = Math.floor(this.cameraY / 10);
        const endX = Math.ceil((this.cameraX + this.canvas.width) / 10);
        const endY = Math.ceil((this.cameraY + this.canvas.height) / 10);
        
        this.terrain.generateTerrain(this.context, startX, startY, endX, endY);
        this.enemies.forEach(enemy => enemy.draw());
        this.player.draw();
        this.context.restore();

        this.drawScore();
        this.drawHealth();
        this.drawShield();
    }

    private drawScore() {
        this.context.fillStyle = 'white'; // Change score text color to white
        this.context.font = '20px Arial';
        this.context.fillText(`Score: ${this.score}`, 10, 20);
    }

    private drawHealth() {
        this.context.fillStyle = 'white'; // Change health text color to white
        this.context.font = '20px Arial';
        this.context.fillText(`Health: ${this.player.getHealth()}`, 10, 50);
    }

    private drawShield() {
        this.context.fillStyle = 'white'; // Change shield text color to white
        this.context.font = '20px Arial';
        this.context.fillText(`Shield: ${this.player.getShield()}`, 10, 80);
    }

    private spawnEnemies(count: number) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.terrain.getWidth();
            const y = Math.random() * this.terrain.getHeight();
            const enemy = new Enemy(x, y, this.terrain.getWidth(), this.terrain.getHeight(), this.context, this.player, this.terrain); // Pass terrain here
            this.enemies.push(enemy);
        }
    }
}