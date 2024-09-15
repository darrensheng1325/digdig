import { GameState } from './types';

export class ClientGame {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private gameState: GameState;
    private playerId: string;
    private keysPressed: Set<string> = new Set();

    constructor(canvasId: string, initialState: GameState, playerId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.gameState = initialState;
        this.playerId = playerId;
    }

    public start() {
        this.resizeCanvas();
        this.gameLoop();
        this.startPolling();
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

    private async update() {
        const dx = (this.keysPressed.has('ArrowRight') ? 1 : 0) - (this.keysPressed.has('ArrowLeft') ? 1 : 0);
        const dy = (this.keysPressed.has('ArrowDown') ? 1 : 0) - (this.keysPressed.has('ArrowUp') ? 1 : 0);
        if (dx !== 0 || dy !== 0) {
            await this.sendPlayerMove({ x: dx, y: dy });
        }
        if (this.keysPressed.has(' ')) {
            await this.sendPlayerDig();
        }
    }

    private render() {
        // Clear the canvas
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render terrain, players, and enemies based on gameState
        this.renderTerrain();
        this.renderPlayers();
        this.renderEnemies();
    }

    private renderTerrain() {
        // Implement terrain rendering
    }

    private renderPlayers() {
        // Implement player rendering
    }

    private renderEnemies() {
        // Implement enemy rendering
    }

    public updateState(newState: GameState) {
        this.gameState = newState;
    }

    public handleKeyDown(event: KeyboardEvent) {
        this.keysPressed.add(event.key);
    }

    public handleKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.key);
    }

    private async sendPlayerMove(direction: { x: number, y: number }) {
        const response = await fetch('/playerMove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: this.playerId, direction }),
        });
        const newState = await response.json();
        this.updateState(newState);
    }

    private async sendPlayerDig() {
        const response = await fetch('/playerDig', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: this.playerId }),
        });
        const newState = await response.json();
        this.updateState(newState);
    }

    private startPolling() {
        setInterval(async () => {
            const response = await fetch('/gameState');
            const newState = await response.json();
            this.updateState(newState);
        }, 1000); // Poll every second
    }
}