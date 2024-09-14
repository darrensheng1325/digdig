import { Player } from './player';
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

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.player = new Player(400, 300, 2000, 2000); // Initial player position and terrain size
        this.terrain = new Terrain(2000, 2000); // Larger terrain size
        this.score = 0;
        this.keysPressed = new Set();
        this.cameraX = 0;
        this.cameraY = 0;
        this.lastHealthRecoveryTime = Date.now();

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

        const block = this.player.dig(this.terrain);
        if (block) {
            if (block.type === 'uranium') {
                this.score -= 5; // Decrease score when uranium is dug
            } else if (block.type === 'lava') {
                this.player.adjustHealth(-20); // Decrease health when lava is dug
            } else if (block.type === 'quartz') {
                this.player.adjustShield(10); // Increase shield when quartz is dug
            } else {
                this.score += 1; // Increase score when other blocks are dug
            }
            this.player.setSize(this.score); // Update player size based on score
        }

        // Health recovery over time
        const currentTime = Date.now();
        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds
            this.player.recoverHealth(2); // Recover 2 health points
            this.lastHealthRecoveryTime = currentTime;
        }

        // Update camera position to follow the player
        this.cameraX = this.player.getX() - this.canvas.width / 2;
        this.cameraY = this.player.getY() - this.canvas.height / 2;
    }

    private render() {
        // Clear the entire canvas with black color
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();
        this.context.translate(-this.cameraX, -this.cameraY);
        this.terrain.generateTerrain(this.context);
        this.player.draw(this.context);
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
}