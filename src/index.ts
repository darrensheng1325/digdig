import { Game } from './game';
import { TitleScreen } from './titleScreen';

class GameManager {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private game: Game | null = null;
    private titleScreen: TitleScreen;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.titleScreen = new TitleScreen(this.canvas, this.context, () => this.startGame());
    }

    public init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.showTitleScreen();
    }

    private resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.game) {
            this.game.resizeCanvas();
        }
    }

    private showTitleScreen() {
        this.titleScreen.show();
    }

    private startGame() {
        this.game = new Game('gameCanvas');
        this.setupFullscreenButton();
    }

    private setupFullscreenButton() {
        const fullscreenButton = document.getElementById('fullscreenButton')!;
        fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

window.onload = () => {
    const gameManager = new GameManager();
    gameManager.init();
};