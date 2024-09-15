import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { GameState, Player, Enemy, TerrainTile } from './types';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const gameState: GameState = {
    players: {},
    enemies: [],
    terrain: []
};

// Initialize terrain (example: 10x10 grid)
for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
        gameState.terrain.push({ x, y, type: 'dirt' });
    }
}

wss.on('connection', (socket: WebSocket) => {
    console.log('Client connected');

    // Create a new player and add to gameState
    const playerId = Date.now().toString();
    const newPlayer: Player = {
        id: playerId,
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10)
    };
    gameState.players[playerId] = newPlayer;

    // Send initial game state to the client
    socket.send(JSON.stringify({ type: 'initialState', gameState, playerId }));

    socket.on('message', (message: string) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'playerMove') {
            // Handle player movement
            const player = gameState.players[playerId];
            if (player) {
                player.x += data.data.x;
                player.y += data.data.y;
            }
        } else if (data.type === 'playerDig') {
            // Handle player digging
            // Update gameState.terrain
        }

        // Broadcast updated game state to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'gameState', gameState }));
            }
        });
    });

    socket.on('close', () => {
        console.log('Client disconnected');
        // Remove player from gameState
        delete gameState.players[playerId];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});