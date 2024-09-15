import { Block } from './terrain';

export interface Player {
    id: string;
    x: number;
    y: number;
}

export interface Enemy {
    id: string;
    x: number;
    y: number;
    // Add other enemy properties as needed
}

export interface TerrainTile {
    x: number;
    y: number;
    type: string;
}

export interface GameState {
    players: { [id: string]: Player };
    enemies: Enemy[];
    terrain: TerrainTile[];
}