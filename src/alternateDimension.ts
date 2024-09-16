import { Player } from './player';
import { Enemy } from './enemy';

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

export class AlternateDimension {
    private width: number;
    private height: number;
    private context: CanvasRenderingContext2D;
    private portalLocation: { x: number, y: number };
    private dots: AlternateDimensionDot[];
    private dotRadius: number = 6; // Increased dot size
    private walls: Wall[];

    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.walls = this.createFixedMap();
        this.portalLocation = this.findSafePortalLocation();
        this.dots = this.generateDots();
    }

    private generateDots(): AlternateDimensionDot[] {
        const dots: AlternateDimensionDot[] = [];
        const dotCount = 3000; // Increased dot count for the larger, more complex map
        while (dots.length < dotCount) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            if (!this.isInsideWall(x, y)) {
                dots.push({
                    x: x,
                    y: y,
                    present: true
                });
            }
        }
        return dots;
    }

    private isInsideWall(x: number, y: number): boolean {
        return this.walls.some(wall => 
            x >= wall.x && x <= wall.x + wall.width &&
            y >= wall.y && y <= wall.y + wall.height
        );
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
        const portalRadius = 25; // Half the size of the portal
        let x: number = 0;
        let y: number = 0;
        let isSafe = false;

        while (!isSafe) {
            x = Math.random() * this.width;
            y = Math.random() * this.height;

            isSafe = !this.walls.some(wall => 
                x - portalRadius < wall.x + wall.width &&
                x + portalRadius > wall.x &&
                y - portalRadius < wall.y + wall.height &&
                y + portalRadius > wall.y
            );
        }

        return { x, y };
    }

    public update(player: Player, enemies: Enemy[]) {
        // Check if player is digging any dots
        const digRadius = player.getSize() / 2;
        this.dots.forEach(dot => {
            if (dot.present) {
                const dx = player.getX() - dot.x;
                const dy = player.getY() - dot.y;
                if (dx * dx + dy * dy <= digRadius * digRadius) {
                    dot.present = false;
                    player.adjustAlternateDimensionScore(10); // Give 10 points for each dot
                }
            }
        });

        // Check for collisions with walls
        this.walls.forEach(wall => {
            if (this.checkCollision(player, wall)) {
                this.resolveCollision(player, wall);
            }
        });
    }

    private checkCollision(player: Player, wall: Wall): boolean {
        const playerSize = player.getSize();
        const playerLeft = player.getX() - playerSize / 2;
        const playerRight = player.getX() + playerSize / 2;
        const playerTop = player.getY() - playerSize / 2;
        const playerBottom = player.getY() + playerSize / 2;

        return playerLeft < wall.x + wall.width &&
               playerRight > wall.x &&
               playerTop < wall.y + wall.height &&
               playerBottom > wall.y;
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

    public render(context: CanvasRenderingContext2D, player: Player, canvasWidth: number, canvasHeight: number, zoom: number) {
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
                context.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2); // Using dotRadius here
                context.fill();
            }
        });

        // Draw the portal back to the normal dimension (green)
        context.fillStyle = '#00FF00'; // Bright green color
        context.beginPath();
        context.arc(this.portalLocation.x, this.portalLocation.y, 25, 0, Math.PI * 2);
        context.fill();
    }

    public getPortalLocation(): { x: number, y: number } {
        return this.portalLocation;
    }
}