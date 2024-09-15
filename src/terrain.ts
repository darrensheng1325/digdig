export type BlockType = 'dirt' | 'diamond' | 'uranium' | 'lava' | 'quartz';

export interface Block {
    type: BlockType;
    present: boolean;
}

export class Terrain {
    private width: number;
    private height: number;
    private blocks: Block[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.blocks = this.createBlocks();
    }

    private createBlocks(): Block[][] {
        const blocks: Block[][] = [];
        for (let i = 0; i < this.width; i += 10) {
            const row: Block[] = [];
            for (let j = 0; j < this.height; j += 10) {
                row.push({ type: 'dirt', present: true });
            }
            blocks.push(row);
        }

        // Generate clusters of diamond, uranium, lava, and quartz
        this.generateClusters(blocks, 'diamond', 0.0001, 5); // 0.01% chance, cluster size 5
        this.generateClusters(blocks, 'uranium', 0.00005, 3); // 0.005% chance, cluster size 3
        this.generateClusters(blocks, 'lava', 0.0002, 4); // 0.02% chance, cluster size 4
        this.generateClusters(blocks, 'quartz', 0.0001, 5); // 0.01% chance, cluster size 5

        return blocks;
    }

    private generateClusters(blocks: Block[][], type: BlockType, chance: number, clusterSize: number) {
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                if (Math.random() < chance) {
                    this.createCluster(blocks, i, j, type, clusterSize);
                }
            }
        }
    }

    private createCluster(blocks: Block[][], x: number, y: number, type: BlockType, size: number) {
        for (let dx = -size; dx <= size; dx++) {
            for (let dy = -size; dy <= size; dy++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= size) {
                    const i = x + dx;
                    const j = y + dy;
                    if (i >= 0 && i < blocks.length && j >= 0 && j < blocks[i].length) {
                        blocks[i][j] = { type, present: true };
                    }
                }
            }
        }
    }

    public generateTerrain(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
        for (let i = startX; i < endX && i < this.blocks.length; i++) {
            for (let j = startY; j < endY && j < this.blocks[i].length; j++) {
                const block = this.blocks[i][j];
                if (block.present) {
                    switch (block.type) {
                        case 'dirt':
                            context.fillStyle = '#8B4513'; // Brown color
                            break;
                        case 'diamond':
                            context.fillStyle = 'blue';
                            break;
                        case 'uranium':
                            context.fillStyle = '#00FF00'; // Changed to green
                            break;
                        case 'lava':
                            context.fillStyle = 'red';
                            break;
                        case 'quartz':
                            context.fillStyle = 'white';
                            break;
                    }
                } else {
                    context.fillStyle = '#5C4033'; // Darker brown for dug areas
                }
                context.fillRect(i * 10, j * 10, 10, 10);
            }
        }
    }

    public removeBlock(x: number, y: number): Block | null {
        const i = Math.floor(x / 10);
        const j = Math.floor(y / 10);
        if (i >= 0 && i < this.blocks.length && j >= 0 && j < this.blocks[i].length) {
            const block = this.blocks[i][j];
            if (block.present) {
                block.present = false;
                return block; // Return the removed block
            }
        }
        return null; // No block was removed
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}