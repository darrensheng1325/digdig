import { Game } from './game';

window.onload = () => {
    const game = new Game('gameCanvas');

    const fullscreenButton = document.getElementById('fullscreenButton')!;
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    window.addEventListener('resize', () => {
        game.resizeCanvas();
    });

    game.resizeCanvas(); // Set initial canvas size
};