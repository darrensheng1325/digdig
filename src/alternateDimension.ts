import { Player } from './player';
import { Enemy } from './enemy';

interface AlternateDimensionDot {
    x: number;
    y: number;
    present: boolean;
}

export class AlternateDimension {
    private width: number;
    private height: number;
    private context: CanvasRenderingContext2D;
    private portalLocation: { x: number, y: number };
    private dots: AlternateDimensionDot[];
    private dotRadius: number = 6; // Increased dot size

    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.portalLocation = { x: width / 2, y: height / 2 };
        this.dots = this.generateDots();
    }

    private generateDots(): AlternateDimensionDot[] {
        const dots: AlternateDimensionDot[] = [];
        const dotCount = 1000; // Adjust this number to change the density of dots
        for (let i = 0; i < dotCount; i++) {
            dots.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                present: true
            });
        }
        return dots;
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
    }

    public render(context: CanvasRenderingContext2D, player: Player, canvasWidth: number, canvasHeight: number, zoom: number) {
        // Fill the entire visible area with a dark background
        context.fillStyle = '#000033'; // Dark blue background
        context.fillRect(player.getX() - canvasWidth / (2 * zoom), player.getY() - canvasHeight / (2 * zoom), canvasWidth / zoom, canvasHeight / zoom);

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