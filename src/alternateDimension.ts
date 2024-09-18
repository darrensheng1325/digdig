import { Player } from './player';
import { Enemy } from './enemy';
import { CloudMob } from './cloudMob';

interface AlternateDimensionDot {
    x: number;
    y: number;
    present: boolean;
}

interface Wall {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum DimensionType {
    Dark,
    Grass
}

export class AlternateDimension {
    private width: number;
    private height: number;
    private context: CanvasRenderingContext2D;
    private portalLocation: { x: number, y: number };
    private dots: AlternateDimensionDot[];
    private dotRadius: number = 25;
    private portalRadius: number = 25;
    private walls: Wall[];
    private dimensionType: DimensionType;
    private grassPatches: { x: number, y: number, radius: number }[];

    constructor(width: number, height: number, context: CanvasRenderingContext2D, dimensionType: DimensionType = DimensionType.Dark) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.dimensionType = dimensionType;
        this.walls = this.createFixedMap();
        this.portalLocation = this.findSafePortalLocation();
        this.dots = this.generateDots();
        this.grassPatches = this.generateGrassPatches();
    }

    private generateGrassPatches(): { x: number, y: number, radius: number }[] {
        const patches = [];
        const patchCount = 50;
        for (let i = 0; i < patchCount; i++) {
            patches.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 100 + 50
            });
        }
        return patches;
    }

    private generateDots(): AlternateDimensionDot[] {
        const dots: AlternateDimensionDot[] = [];
        const dotCount = 1000;
        let attempts = 0;
        const maxAttempts = 10000;

        while (dots.length < dotCount && attempts < maxAttempts) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            if (!this.isInsideWall(x, y) && !this.isOverlappingDots(x, y, dots) && !this.isOverlappingPortal(x, y)) {
                dots.push({
                    x: x,
                    y: y,
                    present: true
                });
            }
            attempts++;
        }
        return dots;
    }

    private isInsideWall(x: number, y: number): boolean {
        return this.walls.some(wall => 
            x - this.dotRadius < wall.x + wall.width &&
            x + this.dotRadius > wall.x &&
            y - this.dotRadius < wall.y + wall.height &&
            y + this.dotRadius > wall.y
        );
    }

    private isOverlappingDots(x: number, y: number, dots: AlternateDimensionDot[]): boolean {
        return dots.some(dot => 
            Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2)) < (this.dotRadius * 2)
        );
    }

    private isOverlappingPortal(x: number, y: number): boolean {
        const dx = x - this.portalLocation.x;
        const dy = y - this.portalLocation.y;
        return Math.sqrt(dx * dx + dy * dy) < (this.dotRadius + this.portalRadius);
    }

    private createFixedMap(): Wall[] {
        const walls: Wall[] = [
            // Outer walls with openings
            { x: 0, y: 0, width: this.width / 2 - 200, height: 200 },
            { x: this.width / 2 + 200, y: 0, width: this.width / 2 - 200, height: 200 },
            { x: 0, y: 0, width: 200, height: this.height / 2 - 200 },
            { x: 0, y: this.height / 2 + 200, width: 200, height: this.height / 2 - 200 },
            { x: this.width - 200, y: 0, width: 200, height: this.height / 2 - 200 },
            { x: this.width - 200, y: this.height / 2 + 200, width: 200, height: this.height / 2 - 200 },
            { x: 0, y: this.height - 200, width: this.width / 2 - 200, height: 200 },
            { x: this.width / 2 + 200, y: this.height - 200, width: this.width / 2 - 200, height: 200 },

            // Inner structures with openings
            { x: 1000, y: 1000, width: 800, height: 300 },
            { x: 1000, y: 1500, width: 300, height: 300 },
            { x: 1500, y: 1500, width: 300, height: 300 },
            { x: 1000, y: 1800, width: 800, height: 200 },

            { x: 3000, y: 3000, width: 1000, height: 400 },
            { x: 3000, y: 3400, width: 400, height: 600 },
            { x: 3600, y: 3400, width: 400, height: 600 },
            { x: 3000, y: 3900, width: 1000, height: 100 },

            { x: 6000, y: 2000, width: 1500, height: 200 },
            { x: 6000, y: 2200, width: 200, height: 300 },
            { x: 7300, y: 2200, width: 200, height: 300 },
            { x: 6000, y: 2400, width: 1500, height: 100 },

            { x: 2000, y: 6000, width: 200, height: 1500 },
            { x: 2200, y: 6000, width: 300, height: 200 },
            { x: 2200, y: 7300, width: 300, height: 200 },
            { x: 2400, y: 6000, width: 100, height: 1500 },

            { x: 7000, y: 7000, width: 1200, height: 400 },
            { x: 7000, y: 7400, width: 400, height: 800 },
            { x: 7800, y: 7400, width: 400, height: 800 },
            { x: 7000, y: 8100, width: 1200, height: 100 },

            // Maze-like structures with openings
            { x: 4000, y: 1000, width: 200, height: 800 },
            { x: 4000, y: 2000, width: 200, height: 1000 },
            { x: 4200, y: 1000, width: 800, height: 200 },
            { x: 5200, y: 1000, width: 200, height: 200 },
            { x: 5000, y: 1200, width: 200, height: 800 },
            { x: 5000, y: 2200, width: 200, height: 800 },
            { x: 4200, y: 2000, width: 600, height: 200 },

            { x: 1000, y: 4000, width: 800, height: 200 },
            { x: 2000, y: 4000, width: 1000, height: 200 },
            { x: 1000, y: 4200, width: 200, height: 800 },
            { x: 1000, y: 5200, width: 200, height: 200 },
            { x: 1200, y: 5000, width: 800, height: 200 },
            { x: 2200, y: 5000, width: 800, height: 200 },
            { x: 2000, y: 4200, width: 200, height: 600 },

            // Additional structures
            // Central complex
            { x: 4500, y: 4500, width: 1000, height: 1000 },
            { x: 4700, y: 4500, width: 600, height: 200 },
            { x: 4500, y: 4700, width: 200, height: 600 },
            { x: 5300, y: 4700, width: 200, height: 600 },
            { x: 4700, y: 5300, width: 600, height: 200 },

            // Northwest quadrant
            { x: 1000, y: 1000, width: 1500, height: 1500 },
            { x: 1200, y: 1200, width: 1100, height: 1100 },
            { x: 1400, y: 1000, width: 200, height: 200 },
            { x: 1000, y: 1400, width: 200, height: 200 },
            { x: 2300, y: 1400, width: 200, height: 200 },
            { x: 1400, y: 2300, width: 200, height: 200 },

            // Northeast quadrant
            { x: 7500, y: 1000, width: 1500, height: 1500 },
            { x: 7700, y: 1200, width: 1100, height: 1100 },
            { x: 7900, y: 1000, width: 200, height: 200 },
            { x: 7500, y: 1400, width: 200, height: 200 },
            { x: 8800, y: 1400, width: 200, height: 200 },
            { x: 7900, y: 2300, width: 200, height: 200 },

            // Southwest quadrant
            { x: 1000, y: 7500, width: 1500, height: 1500 },
            { x: 1200, y: 7700, width: 1100, height: 1100 },
            { x: 1400, y: 7500, width: 200, height: 200 },
            { x: 1000, y: 7900, width: 200, height: 200 },
            { x: 2300, y: 7900, width: 200, height: 200 },
            { x: 1400, y: 8800, width: 200, height: 200 },

            // Southeast quadrant
            { x: 7500, y: 7500, width: 1500, height: 1500 },
            { x: 7700, y: 7700, width: 1100, height: 1100 },
            { x: 7900, y: 7500, width: 200, height: 200 },
            { x: 7500, y: 7900, width: 200, height: 200 },
            { x: 8800, y: 7900, width: 200, height: 200 },
            { x: 7900, y: 8800, width: 200, height: 200 },

            // Additional maze-like structures
            { x: 3000, y: 3000, width: 1000, height: 100 },
            { x: 3000, y: 3000, width: 100, height: 1000 },
            { x: 3900, y: 3000, width: 100, height: 1000 },
            { x: 3000, y: 3900, width: 1000, height: 100 },
            { x: 3300, y: 3300, width: 400, height: 400 },

            { x: 6000, y: 3000, width: 1000, height: 100 },
            { x: 6000, y: 3000, width: 100, height: 1000 },
            { x: 6900, y: 3000, width: 100, height: 1000 },
            { x: 6000, y: 3900, width: 1000, height: 100 },
            { x: 6300, y: 3300, width: 400, height: 400 },

            { x: 3000, y: 6000, width: 1000, height: 100 },
            { x: 3000, y: 6000, width: 100, height: 1000 },
            { x: 3900, y: 6000, width: 100, height: 1000 },
            { x: 3000, y: 6900, width: 1000, height: 100 },
            { x: 3300, y: 6300, width: 400, height: 400 },

            { x: 6000, y: 6000, width: 1000, height: 100 },
            { x: 6000, y: 6000, width: 100, height: 1000 },
            { x: 6900, y: 6000, width: 100, height: 1000 },
            { x: 6000, y: 6900, width: 1000, height: 100 },
            { x: 6300, y: 6300, width: 400, height: 400 },

            // Connecting corridors
            { x: 2500, y: 4900, width: 5000, height: 200 },
            { x: 4900, y: 2500, width: 200, height: 5000 },
        ];

        return walls;
    }

    private findSafePortalLocation(): { x: number, y: number } {
        let x: number = 0;
        let y: number = 0;
        let isSafe = false;

        while (!isSafe) {
            x = Math.random() * this.width;
            y = Math.random() * this.height;

            isSafe = !this.walls.some(wall => 
                x - this.portalRadius < wall.x + wall.width &&
                x + this.portalRadius > wall.x &&
                y - this.portalRadius < wall.y + wall.height &&
                y + this.portalRadius > wall.y
            );

            // Remove the check for dots collision here, as dots are not generated yet
        }

        return { x, y };
    }

    public update(player: Player, entities: (Enemy | CloudMob)[]): void {
        // Check if player is digging any dots
        const playerRadius = player.getSize() / 2;
        this.dots.forEach(dot => {
            if (dot.present) {
                const dx = player.getX() - dot.x;
                const dy = player.getY() - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= playerRadius + this.dotRadius) {
                    dot.present = false;
                    player.adjustAlternateDimensionScore(10); // Give 10 points for each dot
                }
            }
        });

        // Check for collisions with walls
        this.walls.forEach(wall => {
            if (this.checkCollisionWithWall(player, wall)) {
                this.resolveCollision(player, wall);
            }
        });

        if (this.dimensionType === DimensionType.Grass) {
            this.updateGrassDimension(player);
        }

        // Update entities (enemies or cloud mobs)
        entities.forEach(entity => {
            if (this.checkCollision(entity, player)) {
                this.resolveEntityCollision(entity, player);
            }
        });
    }

    private updateGrassDimension(player: Player) {
        // Check if player is on grass
        const playerOnGrass = this.grassPatches.some(patch => {
            const dx = player.getX() - patch.x;
            const dy = player.getY() - patch.y;
            return Math.sqrt(dx * dx + dy * dy) <= patch.radius;
        });

        if (playerOnGrass) {
            player.recoverHealth(0.1); // Heal player slightly when on grass
        }
    }

    private checkCollision(entity1: { getX: () => number, getY: () => number, getSize: () => number }, entity2: { getX: () => number, getY: () => number, getSize: () => number }): boolean {
        const dx = entity1.getX() - entity2.getX();
        const dy = entity1.getY() - entity2.getY();
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (entity1.getSize() + entity2.getSize()) / 2;
    }

    private checkCollisionWithWall(entity: { getX: () => number, getY: () => number, getSize: () => number }, wall: Wall): boolean {
        const entityLeft = entity.getX() - entity.getSize() / 2;
        const entityRight = entity.getX() + entity.getSize() / 2;
        const entityTop = entity.getY() - entity.getSize() / 2;
        const entityBottom = entity.getY() + entity.getSize() / 2;

        return entityLeft < wall.x + wall.width &&
               entityRight > wall.x &&
               entityTop < wall.y + wall.height &&
               entityBottom > wall.y;
    }

    private resolveCollision(player: Player, wall: Wall) {
        const playerSize = player.getSize();
        const playerCenterX = player.getX();
        const playerCenterY = player.getY();
        const wallCenterX = wall.x + wall.width / 2;
        const wallCenterY = wall.y + wall.height / 2;

        const dx = playerCenterX - wallCenterX;
        const dy = playerCenterY - wallCenterY;

        if (Math.abs(dx / wall.width) > Math.abs(dy / wall.height)) {
            // Collision on the x-axis
            if (dx > 0) {
                player.setPosition(wall.x + wall.width + playerSize / 2, player.getY());
            } else {
                player.setPosition(wall.x - playerSize / 2, player.getY());
            }
        } else {
            // Collision on the y-axis
            if (dy > 0) {
                player.setPosition(player.getX(), wall.y + wall.height + playerSize / 2);
            } else {
                player.setPosition(player.getX(), wall.y - playerSize / 2);
            }
        }
    }

    private resolveEntityCollision(entity: Enemy | CloudMob, player: Player): void {
        // Handle collision based on entity type
        if (entity instanceof Enemy) {
            // Existing enemy collision logic
            const damage = Math.floor(entity.getSize() * 0.5);
            player.takeDamage(damage);
        } else if (entity instanceof CloudMob) {
            // Cloud mob collision logic (no damage, just bounce)
            const dx = player.getX() - entity.getX();
            const dy = player.getY() - entity.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            const bounceDistance = 20;
            const bounceX = entity.getX() + (dx / distance) * bounceDistance;
            const bounceY = entity.getY() + (dy / distance) * bounceDistance;
            entity.setPosition(bounceX, bounceY);
        }
    }

    public render(context: CanvasRenderingContext2D, player: Player, canvasWidth: number, canvasHeight: number, zoom: number) {
        if (this.dimensionType === DimensionType.Dark) {
            this.renderDarkDimension(context, player, canvasWidth, canvasHeight, zoom);
        } else {
            this.renderGrassDimension(context, player, canvasWidth, canvasHeight, zoom);
        }
    }

    private renderDarkDimension(context: CanvasRenderingContext2D, player: Player, canvasWidth: number, canvasHeight: number, zoom: number) {
        // Fill the entire visible area with a dark background
        context.fillStyle = '#000033'; // Dark blue background
        context.fillRect(player.getX() - canvasWidth / (2 * zoom), player.getY() - canvasHeight / (2 * zoom), canvasWidth / zoom, canvasHeight / zoom);

        // Draw the walls
        context.fillStyle = 'white';
        this.walls.forEach(wall => {
            context.fillRect(wall.x, wall.y, wall.width, wall.height);
        });

        // Draw the diggable dots
        context.fillStyle = '#FFD700'; // Gold color for the dots
        this.dots.forEach(dot => {
            if (dot.present) {
                context.beginPath();
                context.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
                context.fill();
            }
        });

        // Draw the portal back to the normal dimension (green)
        context.fillStyle = '#00FF00'; // Bright green color
        context.beginPath();
        context.arc(this.portalLocation.x, this.portalLocation.y, this.portalRadius, 0, Math.PI * 2);
        context.fill();
    }

    private renderGrassDimension(context: CanvasRenderingContext2D, player: Player, canvasWidth: number, canvasHeight: number, zoom: number) {
        // Fill the entire visible area with a light background
        context.fillStyle = '#87CEEB'; // Sky blue background
        context.fillRect(player.getX() - canvasWidth / (2 * zoom), player.getY() - canvasHeight / (2 * zoom), canvasWidth / zoom, canvasHeight / zoom);

        // Draw grass patches
        context.fillStyle = '#228B22'; // Forest green
        this.grassPatches.forEach(patch => {
            context.beginPath();
            context.arc(patch.x, patch.y, patch.radius, 0, Math.PI * 2);
            context.fill();
        });

        // Draw the walls (as trees or rocks in this dimension)
        context.fillStyle = '#8B4513'; // Saddle Brown for trees/rocks
        this.walls.forEach(wall => {
            context.fillRect(wall.x, wall.y, wall.width, wall.height);
        });

        // Draw the diggable dots (as flowers in this dimension)
        context.fillStyle = '#FF69B4'; // Hot Pink for flowers
        this.dots.forEach(dot => {
            if (dot.present) {
                context.beginPath();
                context.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
                context.fill();
            }
        });

        // Draw the portal back to the normal dimension (green)
        context.fillStyle = '#00FF00'; // Bright green color
        context.beginPath();
        context.arc(this.portalLocation.x, this.portalLocation.y, this.portalRadius, 0, Math.PI * 2);
        context.fill();
    }

    public getPortalLocation(): { x: number, y: number } {
        return this.portalLocation;
    }

    public getWalls(): Wall[] {
        return this.walls;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public generateNewPortalLocation(): void {
        this.portalLocation = this.findSafePortalLocation();
    }

    public setDimensionType(type: DimensionType) {
        this.dimensionType = type;
    }

    public getDimensionType(): DimensionType {
        return this.dimensionType;
    }

    public getGrassPatches(): { x: number, y: number, radius: number }[] {
        return this.grassPatches;
    }
}