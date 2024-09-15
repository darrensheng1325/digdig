export type BlockType = 'dirt' | 'diamond' | 'uranium' | 'lava' | 'quartz';

export interface Block {
    type: BlockType;
    present: boolean;
}

export class Terrain {
    private width: number;
    private height: number;
    private blocks: Block[][];
    private dugColor: string = '#3D2817'; // Dark brown color for dug areas

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

        // Generate clusters of diamond, uranium, lava, and quartz with random sizes
        this.generateClusters(blocks, 'diamond', 0.0001, 3, 7); // 0.01% chance, cluster size 3-7
        this.generateClusters(blocks, 'uranium', 0.00005, 2, 5); // 0.005% chance, cluster size 2-5
        this.generateClusters(blocks, 'lava', 0.0002, 3, 6); // 0.02% chance, cluster size 3-6
        this.generateClusters(blocks, 'quartz', 0.0001, 3, 7); // 0.01% chance, cluster size 3-7

        return blocks;
    }

    private generateClusters(blocks: Block[][], type: BlockType, chance: number, minSize: number, maxSize: number) {
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                if (Math.random() < chance) {
                    const clusterSize = this.getRandomClusterSize(minSize, maxSize);
                    this.createCluster(blocks, i, j, type, clusterSize);
                }
            }
        }
    }

    private getRandomClusterSize(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private createCluster(blocks: Block[][], x: number, y: number, type: BlockType, size: number) {
        for (let dx = -size; dx <= size; dx++) {
            for (let dy = -size; dy <= size; dy++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= size) {
                    const i = x + dx;
                    const j = y + dy;
                    if (i >= 0 && i < blocks.length && j >= 0 && j < blocks[i].length) {
                        // Use noise to determine if this block should be part of the cluster
                        if (this.noise(i, j, size) > 0.5) {
                            blocks[i][j] = { type, present: true };
                        }
                    }
                }
            }
        }
    }

    private noise(x: number, y: number, size: number): number {
        // Simple noise function, you can replace this with a more sophisticated one if needed
        const value = Math.sin(x * 0.1) + Math.sin(y * 0.1) + Math.sin((x + y) * 0.1);
        return (Math.sin(value * size) + 1) / 2; // Normalize to 0-1 range
    }

    public generateTerrain(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
        // Ensure we're not trying to access blocks outside the terrain
        startX = Math.max(0, startX);
        startY = Math.max(0, startY);
        endX = Math.min(this.width / 10, endX);
        endY = Math.min(this.height / 10, endY);

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                if (!this.blocks[x]) {
                    this.blocks[x] = [];
                }
                if (!this.blocks[x][y]) {
                    this.blocks[x][y] = this.generateBlock(x, y);
                }
                const block = this.blocks[x][y];
                if (block) {
                    context.fillStyle = block.present ? this.getBlockColor(block.type) : this.dugColor;
                    context.fillRect(x * 10, y * 10, 10, 10);
                }
            }
        }
    }

    public removeBlock(x: number, y: number): Block | null {
        const blockX = Math.floor(x / 10);
        const blockY = Math.floor(y / 10);
        if (this.blocks[blockX] && this.blocks[blockX][blockY] && this.blocks[blockX][blockY].present) {
            const block = this.blocks[blockX][blockY];
            this.blocks[blockX][blockY] = { ...block, present: false };
            return block;
        }
        return null;
    }

    private generateBlock(x: number, y: number): Block {
        // You can implement more complex logic here if needed
        return { type: 'dirt', present: true };
    }

    private getBlockColor(type: BlockType): string {
        switch (type) {
            case 'dirt':
                return '#8B4513'; // Saddle Brown
            case 'diamond':
                return '#00FFFF'; // Cyan
            case 'uranium':
                return '#32CD32'; // Lime Green
            case 'lava':
                return '#FF4500'; // Orange Red
            case 'quartz':
                return '#F0F8FF'; // Alice Blue
            default:
                return '#A9A9A9'; // Dark Gray
        }
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}