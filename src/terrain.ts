export type BlockType = 'dirt' | 'diamond' | 'uranium' | 'lava' | 'quartz';

export interface Block {
    type: BlockType;
    present: boolean;
}

export interface TerrainTile {
    x: number;
    y: number;
    type: string;
}

export class Terrain {
    constructor(width: number, height: number) {
        // Initialize terrain
    }

    setTiles(tiles: TerrainTile[]) {
        // Set terrain tiles
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw terrain on the context
    }
}