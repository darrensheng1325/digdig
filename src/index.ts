import { ClientGame } from './clientGame';
import { GameState } from './types';

const socket = new WebSocket('ws://localhost:3000');
let clientGame: ClientGame;

socket.addEventListener('open', () => {
    console.log('Connected to server');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data);  // Add this line
    if (data.type === 'initialState') {
        clientGame = new ClientGame('gameCanvas', data.gameState, socket);
        clientGame.start();
    } else if (data.type === 'gameState') {
        if (clientGame) {
            clientGame.updateState(data.gameState);
        }
    }
});

// Handle player input
document.addEventListener('keydown', (event) => {
    if (clientGame) {
        clientGame.handleKeyDown(event);
    }
});

document.addEventListener('keyup', (event) => {
    if (clientGame) {
        clientGame.handleKeyUp(event);
    }
});