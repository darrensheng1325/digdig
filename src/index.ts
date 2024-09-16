import { Game } from './game';
import { TitleScreen } from './titleScreen';

class GameManager {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private game: Game | null = null;
    private titleScreen: TitleScreen;
    private controlToggleButton: HTMLButtonElement;
    private minimapCanvas: HTMLCanvasElement;
    private minimapContext: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.titleScreen = new TitleScreen(this.canvas, this.context, () => this.startGame());
        this.controlToggleButton = document.createElement('button');
        this.controlToggleButton.textContent = 'Toggle Controls';
        this.controlToggleButton.style.position = 'absolute';
        this.controlToggleButton.style.top = '50px';
        this.controlToggleButton.style.right = '10px';
        this.controlToggleButton.style.zIndex = '1000';
        document.body.appendChild(this.controlToggleButton);

        // Create minimap canvas
        this.minimapCanvas = document.createElement('canvas');
        this.minimapCanvas.width = 200;
        this.minimapCanvas.height = 200;
        this.minimapCanvas.style.position = 'absolute';
        this.minimapCanvas.style.top = '100px';
        this.minimapCanvas.style.right = '10px';
        this.minimapCanvas.style.zIndex = '1000';
        this.minimapCanvas.style.border = '1px solid white';
        this.minimapCanvas.style.display = 'none'; // Initially hide the minimap
        document.body.appendChild(this.minimapCanvas);
        this.minimapContext = this.minimapCanvas.getContext('2d')!;
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
        this.controlToggleButton.style.display = 'none';
        this.minimapCanvas.style.display = 'none';
    }

    private startGame() {
        this.game = new Game('gameCanvas', this.titleScreen);
        this.setupFullscreenButton();
        this.setupControlToggleButton();
        this.controlToggleButton.style.display = 'block';
        // Remove this line: this.minimapCanvas.style.display = 'block';
        this.updateMinimap();
    }

    private setupFullscreenButton() {
        const fullscreenButton = document.getElementById('fullscreenButton')!;
        fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
    }

    private setupControlToggleButton() {
        this.controlToggleButton.addEventListener('click', () => {
            if (this.game) {
                this.game.toggleControls();
            }
        });
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    private updateMinimap() {
        if (this.game) {
            this.game.renderMinimap(this.minimapContext, this.minimapCanvas.width, this.minimapCanvas.height);
        }
        requestAnimationFrame(() => this.updateMinimap());
    }
}

window.onload = () => {
    const gameManager = new GameManager();
    gameManager.init();
};