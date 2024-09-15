import { ClientGame } from './clientGame';
import { GameState } from './types';

async function startGame() {
    const playerId = Date.now().toString(); // Generate a unique player ID
    const response = await fetch(`/initialState?playerId=${playerId}`);
    const initialState: GameState = await response.json();

    const clientGame = new ClientGame('gameCanvas', initialState, playerId);
    clientGame.start();

    document.addEventListener('keydown', (event) => {
        clientGame.handleKeyDown(event);
    });

    document.addEventListener('keyup', (event) => {
        clientGame.handleKeyUp(event);
    });

    window.addEventListener('beforeunload', async () => {
        await fetch('/player', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId }),
        });
    });
}

startGame();