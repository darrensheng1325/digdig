import { GameState } from './types';

export class ClientGame {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private gameState: GameState;
    private socket: WebSocket;
    private keysPressed: Set<string> = new Set();

    constructor(canvasId: string, initialState: GameState, socket: WebSocket) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.gameState = initialState;
        this.socket = socket;
    }

    public start() {
        this.resizeCanvas();
        this.gameLoop();
    }

    private resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = 'block';  // Ensure the canvas is visible
    }

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        const dx = (this.keysPressed.has('ArrowRight') ? 1 : 0) - (this.keysPressed.has('ArrowLeft') ? 1 : 0);
        const dy = (this.keysPressed.has('ArrowDown') ? 1 : 0) - (this.keysPressed.has('ArrowUp') ? 1 : 0);
        if (dx !== 0 || dy !== 0) {
            this.socket.send(JSON.stringify({ type: 'playerMove', data: { x: dx, y: dy } }));
        }
        if (this.keysPressed.has(' ')) {
            this.socket.send(JSON.stringify({ type: 'playerDig' }));
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
        for (const tile of this.gameState.terrain) {
            this.context.fillStyle = tile.type === 'dirt' ? 'brown' : 'gray';
            this.context.fillRect(tile.x * 20, tile.y * 20, 20, 20);
        }
    }

    private renderPlayers() {
        for (const playerId in this.gameState.players) {
            const player = this.gameState.players[playerId];
            this.context.fillStyle = 'blue';
            this.context.fillRect(player.x * 20, player.y * 20, 20, 20);
        }
    }

    private renderEnemies() {
        for (const enemy of this.gameState.enemies) {
            this.context.fillStyle = 'red';
            this.context.fillRect(enemy.x * 20, enemy.y * 20, 20, 20);
        }
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
}