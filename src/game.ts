import { Player } from './player';
import { Terrain } from './terrain';

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private player: Player;
    private terrain: Terrain;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.terrain = new Terrain(this.canvas, this.context);

        this.init();
    }

    private init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.gameLoop();
    }

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                this.player.move(0, -5);
                break;
            case 'ArrowDown':
                this.player.move(0, 5);
                break;
            case 'ArrowLeft':
                this.player.move(-5, 0);
                break;
            case 'ArrowRight':
                this.player.move(5, 0);
                break;
            case ' ':
                this.player.dig(this.context);
                break;
        }
    }

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        // Update game state
    }

    private render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.terrain.generateTerrain();
        this.player.draw(this.context);
    }
}