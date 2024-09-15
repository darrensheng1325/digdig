import { Player } from './player';
import { Enemy } from './enemy';
import { Terrain, TerrainTile } from './terrain';

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private player: Player;
    private enemies: Enemy[];
    private terrain: Terrain;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        
        // Initialize terrain (10x10 grid for example)
        const terrainTiles: TerrainTile[] = [];
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                terrainTiles.push({ x, y, type: 'dirt' });
            }
        }
        this.terrain = new Terrain(10, 10);
        this.terrain.setTiles(terrainTiles);

        // Initialize player at a random position
        const playerX = Math.floor(Math.random() * 10);
        const playerY = Math.floor(Math.random() * 10);
        this.player = new Player(playerX, playerY, 100, 10, this.context);

        // Initialize enemies (for example, 3 enemies at random positions)
        this.enemies = [];
        for (let i = 0; i < 3; i++) {
            const enemyX = Math.floor(Math.random() * 10);
            const enemyY = Math.floor(Math.random() * 10);
            this.enemies.push(new Enemy(enemyX, enemyY, 50, 5, this.context));
        }
    }

    public start() {
        this.resizeCanvas();
        this.gameLoop();
    }

    private resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        // Update game state here
    }

    private render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.terrain.draw(this.context);
        this.player.draw();
        this.enemies.forEach(enemy => enemy.draw());
    }

    public handleKeyDown(event: KeyboardEvent) {
        // Handle key down events
        switch (event.key) {
            case 'ArrowUp':
                this.player.move(0, -1);
                break;
            case 'ArrowDown':
                this.player.move(0, 1);
                break;
            case 'ArrowLeft':
                this.player.move(-1, 0);
                break;
            case 'ArrowRight':
                this.player.move(1, 0);
                break;
            case ' ':
                this.player.dig(this.terrain);
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent) {
        // Handle key up events if needed
    }
}