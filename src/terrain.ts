export type BlockType = 'dirt' | 'diamond' | 'uranium' | 'lava' | 'quartz' | 'bedrock' | 'gold_ore' | 'portal' | 'grass' | 'concrete';

export interface Block {
    type: BlockType;
    present: boolean;
    durability?: number;
}

interface Wall {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Terrain {
    private width: number;
    private height: number;
    private blocks: Block[][];
    private dugColor: string = '#3D2817'; // Dark brown color for dug areas
    private portalLocation: { x: number, y: number };
    private grassyBiomeColor: string = '#4CAF50'; // A nice green color for the grassy biome
    private originalWidth: number;
    private originalHeight: number;
    private concreteColor: string = '#808080'; // Gray color for concrete walls
    private walls: Wall[] = [];

    constructor(width: number, height: number) {
        this.originalWidth = width;
        this.originalHeight = height;
        this.width = width * 2; // Double the width
        this.height = height * 2; // Double the height
        this.blocks = this.createBlocks();
        this.portalLocation = { x: Math.floor(this.originalWidth / 20), y: Math.floor(this.originalHeight / 20) };
        this.createPortal();
        this.generateWalls();
    }

    private createBlocks(): Block[][] {
        const blocks: Block[][] = [];
        for (let i = 0; i < this.width; i += 10) {
            const row: Block[] = [];
            for (let j = 0; j < this.height; j += 10) {
                if (i < this.originalWidth && j < this.originalHeight) {
                    row.push({ type: 'dirt', present: true });
                } else {
                    row.push({ type: 'grass', present: true });
                }
            }
            blocks.push(row);
        }

        // Generate clusters of ore types only in the original area
        this.generateClusters(blocks, 'diamond', 0.0001, 3, 7);
        this.generateClusters(blocks, 'uranium', 0.00005, 2, 5);
        this.generateClusters(blocks, 'lava', 0.0002, 3, 6);
        this.generateClusters(blocks, 'quartz', 0.0001, 3, 7);
        this.generateClusters(blocks, 'bedrock', 0.00005, 2, 5);
        this.generateClusters(blocks, 'gold_ore', 0.00015, 3, 6);
        this.generateGeodes(blocks, 0.000005, 5, 8);

        // Add concrete walls
        this.addConcreteWalls(blocks);

        return blocks;
    }

    private addConcreteWalls(blocks: Block[][]) {
        const wallThickness = 30; // Increased thickness for visibility
        const corridorWidth = 200; // Increased width for larger players
        const startX = Math.floor(this.originalWidth / 10);
        const startY = Math.floor(this.originalHeight / 10);
        const endX = Math.floor(this.width / 10);
        const endY = Math.floor(this.height / 10);

        // Create a grid of walls
        for (let x = startX; x < endX; x += corridorWidth + wallThickness) {
            for (let y = startY; y < endY; y++) {
                for (let w = 0; w < wallThickness; w++) {
                    if (x + w < endX) {
                        blocks[x + w][y] = { type: 'concrete', present: true };
                    }
                }
            }
        }

        for (let y = startY; y < endY; y += corridorWidth + wallThickness) {
            for (let x = startX; x < endX; x++) {
                for (let w = 0; w < wallThickness; w++) {
                    if (y + w < endY) {
                        blocks[x][y + w] = { type: 'concrete', present: true };
                    }
                }
            }
        }

        // Add some random openings in the walls
        this.createOpenings(startX, startY, endX, endY, wallThickness, corridorWidth, blocks);

        // Add some additional structures
        this.createAdditionalStructures(startX, startY, endX, endY, wallThickness, blocks);
    }

    private createOpenings(startX: number, startY: number, endX: number, endY: number, wallThickness: number, corridorWidth: number, blocks: Block[][]) {
        for (let x = startX; x < endX; x += corridorWidth + wallThickness) {
            for (let y = startY; y < endY; y += corridorWidth + wallThickness) {
                if (Math.random() < 0.7) { // 70% chance to create an opening
                    const openingSize = Math.floor(wallThickness / 2);
                    const openingStart = Math.floor(Math.random() * (wallThickness - openingSize));
                    
                    // Horizontal opening
                    if (x + wallThickness < endX) {
                        for (let w = openingStart; w < openingStart + openingSize; w++) {
                            for (let h = 0; h < corridorWidth; h++) {
                                if (y + h < endY) {
                                    blocks[x + w][y + h] = { type: 'grass', present: true };
                                }
                            }
                        }
                    }
                    
                    // Vertical opening
                    if (y + wallThickness < endY) {
                        for (let h = openingStart; h < openingStart + openingSize; h++) {
                            for (let w = 0; w < corridorWidth; w++) {
                                if (x + w < endX) {
                                    blocks[x + w][y + h] = { type: 'grass', present: true };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private createAdditionalStructures(startX: number, startY: number, endX: number, endY: number, wallThickness: number, blocks: Block[][]) {
        const structureCount = 5;
        for (let i = 0; i < structureCount; i++) {
            const structureX = startX + Math.floor(Math.random() * (endX - startX - wallThickness));
            const structureY = startY + Math.floor(Math.random() * (endY - startY - wallThickness));
            const structureWidth = Math.floor(Math.random() * 100) + 50;
            const structureHeight = Math.floor(Math.random() * 100) + 50;

            for (let x = structureX; x < structureX + structureWidth && x < endX; x++) {
                for (let y = structureY; y < structureY + structureHeight && y < endY; y++) {
                    blocks[x][y] = { type: 'concrete', present: true };
                }
            }
        }
    }

    private generateClusters(blocks: Block[][], type: BlockType, chance: number, minSize: number, maxSize: number) {
        for (let i = 0; i < this.originalWidth / 10; i++) {
            for (let j = 0; j < this.originalHeight / 10; j++) {
                if (Math.random() < chance) {
                    const clusterSize = this.getRandomClusterSize(minSize, maxSize);
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
                        // Use noise to determine if this block should be part of the cluster
                        if (this.noise(i, j, size) > 0.5) {
                            if (type === 'bedrock') {
                                blocks[i][j] = { type, present: true, durability: 50 }; // Increased durability for bedrock
                            } else {
                                blocks[i][j] = { type, present: true };
                            }
                        }
                    }
                }
            }
        }
    }

    private generateGeodes(blocks: Block[][], chance: number, minSize: number, maxSize: number) {
        for (let i = 0; i < this.originalWidth / 10; i++) {
            for (let j = 0; j < this.originalHeight / 10; j++) {
                if (Math.random() < chance) {
                    const geodeSize = this.getRandomClusterSize(minSize, maxSize);
                    this.createGeode(blocks, i, j, geodeSize);
                }
            }
        }
    }

    private createGeode(blocks: Block[][], x: number, y: number, size: number) {
        for (let dx = -size; dx <= size; dx++) {
            for (let dy = -size; dy <= size; dy++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= size) {
                    const i = x + dx;
                    const j = y + dy;
                    if (i >= 0 && i < blocks.length && j >= 0 && j < blocks[i].length) {
                        if (this.noise(i, j, size) > 0.5) {
                            if (distance <= size / 2) {
                                // Diamond core
                                blocks[i][j] = { type: 'diamond', present: true };
                            } else {
                                // Bedrock shell with higher durability
                                blocks[i][j] = { type: 'bedrock', present: true, durability: 100 };
                            }
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

    private getRandomClusterSize(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public generateTerrain(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
        // Ensure we're not trying to access blocks outside the terrain
        startX = Math.max(0, startX);
        startY = Math.max(0, startY);
        endX = Math.min(this.width / 10, endX);
        endY = Math.min(this.height / 10, endY);

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const block = this.blocks[x][y];
                if (block) {
                    if (block.type === 'grass') {
                        context.fillStyle = this.grassyBiomeColor;
                    } else if (block.type === 'concrete') {
                        context.fillStyle = this.concreteColor;
                    } else {
                        context.fillStyle = block.present ? this.getBlockColor(block.type) : this.dugColor;
                    }
                    context.fillRect(x * 10, y * 10, 10, 10);
                }
            }
        }

        // Draw walls
        context.fillStyle = '#808080'; // Gray color for walls
        for (const wall of this.walls) {
            if (wall.x + wall.width > startX * 10 && wall.x < endX * 10 &&
                wall.y + wall.height > startY * 10 && wall.y < endY * 10) {
                context.fillRect(wall.x, wall.y, wall.width, wall.height);
            }
        }
    }

    public removeBlock(x: number, y: number): Block | null {
        const blockX = Math.floor(x / 10);
        const blockY = Math.floor(y / 10);
        if (this.blocks[blockX] && this.blocks[blockX][blockY] && this.blocks[blockX][blockY].present) {
            const block = this.blocks[blockX][blockY];
            if (block.type === 'portal' || block.type === 'grass' || block.type === 'concrete') {
                return null; // Portal, grass, and concrete blocks cannot be removed
            }
            if (block.type === 'bedrock') {
                if (block.durability && block.durability > 1) {
                    this.blocks[blockX][blockY] = { ...block, durability: block.durability - 1 };
                    return null; // Return null to indicate the block wasn't fully removed
                }
            }
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
            case 'bedrock':
                return '#4A4A4A'; // Dark gray for bedrock
            case 'gold_ore':
                return '#FFD700'; // Gold color
            case 'portal':
                return '#8A2BE2'; // BlueViolet color for the portal
            default:
                return '#A9A9A9'; // Dark Gray
        }
    }

    public getBlock(x: number, y: number): Block | null {
        const blockX = Math.floor(x / 10);
        const blockY = Math.floor(y / 10);
        if (this.blocks[blockX] && this.blocks[blockX][blockY]) {
            return this.blocks[blockX][blockY];
        }
        return null;
    }

    public getPortalLocation(): { x: number, y: number } {
        return { x: this.portalLocation.x * 10, y: this.portalLocation.y * 10 };
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    private createPortal() {
        const portalSize = 5;
        for (let i = -portalSize; i <= portalSize; i++) {
            for (let j = -portalSize; j <= portalSize; j++) {
                if (i*i + j*j <= portalSize*portalSize) {
                    const x = this.portalLocation.x + i;
                    const y = this.portalLocation.y + j;
                    if (x >= 0 && x < this.width / 10 && y >= 0 && y < this.height / 10) {
                        this.blocks[x][y] = { type: 'portal', present: true };
                    }
                }
            }
        }
    }

    public getOriginalWidth(): number {
        return this.originalWidth;
    }

    public getOriginalHeight(): number {
        return this.originalHeight;
    }

    private generateWalls() {
        // Create more walls
        const wallThickness = 20;
        
        // Outer walls
        this.walls.push({ x: 0, y: 0, width: this.width, height: wallThickness });
        this.walls.push({ x: 0, y: 0, width: wallThickness, height: this.height });
        this.walls.push({ x: this.width - wallThickness, y: 0, width: wallThickness, height: this.height });
        this.walls.push({ x: 0, y: this.height - wallThickness, width: this.width, height: wallThickness });

        // Inner walls
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * (this.width - 200) + 100;
            const y = Math.random() * (this.height - 200) + 100;
            const width = Math.random() * 300 + 100;
            const height = Math.random() * 300 + 100;
            this.walls.push({ x, y, width, height });
        }

        // Add more complex structures
        this.addMazeStructure(this.width / 4, this.height / 4, this.width / 2, this.height / 2);
    }

    private addMazeStructure(startX: number, startY: number, width: number, height: number) {
        const cellSize = 100;
        const wallThickness = 20;

        for (let x = startX; x < startX + width; x += cellSize) {
            for (let y = startY; y < startY + height; y += cellSize) {
                if (Math.random() < 0.7) {
                    if (Math.random() < 0.5) {
                        this.walls.push({ x, y, width: wallThickness, height: cellSize });
                    } else {
                        this.walls.push({ x, y, width: cellSize, height: wallThickness });
                    }
                }
            }
        }
    }

    public checkCollision(x: number, y: number, size: number): boolean {
        for (const wall of this.walls) {
            if (x - size / 2 < wall.x + wall.width &&
                x + size / 2 > wall.x &&
                y - size / 2 < wall.y + wall.height &&
                y + size / 2 > wall.y) {
                return true;
            }
        }
        return false;
    }
}