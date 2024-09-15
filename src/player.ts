import { Terrain } from './terrain';

export class Player {
    private x: number;
    private y: number;
    private size: number;
    private health: number;
    private shield: number;
    private context: CanvasRenderingContext2D;
    private movementDirection: { x: number, y: number } = { x: 0, y: 0 };
    private baseSpeed: number = 4; // Reduced from 6 to 4 for slightly slower movement
    private minSpeed: number = 0.5; // Reduced minimum speed
    private maxSpeed: number = 5; // Reduced maximum speed
    private optimalSize: number = 40; // Size at which the player is fastest
    private ringRotation: number = 0; // New property to track ring rotation
    protected terrain: Terrain; // Add this line

    constructor(x: number, y: number, health: number, attack: number, context: CanvasRenderingContext2D, terrain: Terrain) {
        this.x = x;
        this.y = y;
        this.size = 20; // Initial size
        this.health = health;
        this.shield = 0;
        this.context = context;
        this.terrain = terrain; // Add this line
    }

    move(dx: number, dy: number) {
        const speed = this.getSpeed();
        const newX = this.x + dx * speed;
        const newY = this.y + dy * speed;

        // Check if the new position is within the terrain boundaries
        if (newX >= 0 && newX < this.terrain.getWidth() && newY >= 0 && newY < this.terrain.getHeight()) {
            this.x = newX;
            this.y = newY;
            // Update movement direction
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length > 0) {
                this.movementDirection = { x: dx / length, y: dy / length };
            }
        }
    }

    // Calculate speed based on size
    protected getSpeed(): number {
        const minSize = 20;
        const speedDecrease = Math.pow((this.size - minSize) / 20, 1.5); // More rapid speed decrease
        return Math.max(this.minSpeed, this.baseSpeed - speedDecrease);
    }

    dig(terrain: Terrain) {
        const digRadius = Math.floor(this.size / 2); // Dig radius is now half the size (full diameter)
        const dugBlocks = [];

        for (let dx = -digRadius; dx <= digRadius; dx++) {
            for (let dy = -digRadius; dy <= digRadius; dy++) {
                if (dx * dx + dy * dy <= digRadius * digRadius) { // Check if within circular dig area
                    const block = terrain.removeBlock(this.x + dx, this.y + dy);
                    if (block) {
                        dugBlocks.push(block);
                    }
                }
            }
        }

        return dugBlocks;
    }

    draw() {
        this.updateRingRotation();
        // Update ring rotation
        this.ringRotation += Math.PI / 180; // Rotate 1 degree (in radians) per frame
        if (this.ringRotation >= Math.PI * 2) {
            this.ringRotation -= Math.PI * 2; // Reset rotation after a full circle
        }

        // Draw curved ring pattern (filled with black)
        this.context.strokeStyle = 'black';
        this.context.fillStyle = 'black';
        this.context.lineWidth = 5; // Increased from 3 to 5 for a thicker ring

        const ringRadius = this.size / 2 + this.size / 6; // Increased from this.size / 8 to this.size / 6
        const curveCount = 8;
        const curveAngle = (Math.PI * 2) / curveCount;
        const curveDepth = this.size / 4;

        this.context.beginPath();
        for (let i = 0; i < curveCount; i++) {
            const startAngle = i * curveAngle + this.ringRotation;
            const endAngle = (i + 1) * curveAngle + this.ringRotation;
            const midAngle = (startAngle + endAngle) / 2;

            const startX = this.x + Math.cos(startAngle) * ringRadius;
            const startY = this.y + Math.sin(startAngle) * ringRadius;
            const endX = this.x + Math.cos(endAngle) * ringRadius;
            const endY = this.y + Math.sin(endAngle) * ringRadius;
            const controlX = this.x + Math.cos(midAngle) * (ringRadius - curveDepth);
            const controlY = this.y + Math.sin(midAngle) * (ringRadius - curveDepth);

            if (i === 0) {
                this.context.moveTo(startX, startY);
            }
            this.context.quadraticCurveTo(controlX, controlY, endX, endY);
        }
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        // Draw player body (gray circle)
        this.context.fillStyle = 'gray';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        this.context.fill();

        // Draw face
        const eyeWidth = this.size / 6;
        const eyeHeight = this.size / 4;
        const eyeY = this.y - eyeHeight / 2;

        // Left eye
        this.context.fillStyle = 'white';
        this.context.fillRect(this.x - this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Right eye
        this.context.fillRect(this.x + this.size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Draw pupils (rectangular)
        this.context.fillStyle = 'black';
        const pupilWidth = eyeWidth * 0.6;
        const pupilHeight = eyeHeight * 0.6;
        const maxPupilOffset = (eyeWidth - pupilWidth) / 2;

        // Calculate pupil offset based on movement direction
        const pupilOffsetX = this.movementDirection.x * maxPupilOffset;
        const pupilOffsetY = this.movementDirection.y * maxPupilOffset;

        // Left pupil
        this.context.fillRect(
            this.x - this.size / 6 - pupilWidth / 2 + pupilOffsetX,
            eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY,
            pupilWidth,
            pupilHeight
        );

        // Right pupil
        this.context.fillRect(
            this.x + this.size / 6 - pupilWidth / 2 + pupilOffsetX,
            eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY,
            pupilWidth,
            pupilHeight
        );

        // Draw smile
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(this.x, this.y + this.size / 8, this.size / 5, 0.2 * Math.PI, 0.8 * Math.PI);
        this.context.stroke();
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getHealth() { return this.health; }
    getShield() { return this.shield; }

    adjustHealth(amount: number) {
        this.health = Math.max(0, Math.min(100, this.health + amount));
    }

    adjustShield(amount: number) {
        this.shield = Math.max(0, Math.min(100, this.shield + amount));
    }

    recoverHealth(amount: number) {
        this.health = Math.min(100, this.health + amount);
    }

    setSize(score: number) {
        const minSize = 20;
        const growthRate = 0.015; // Slightly reduced growth rate
        this.size = Math.max(minSize, minSize + score * growthRate);
    }

    public getSize(): number {
        return this.size;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    protected updateRingRotation(): void {
        this.ringRotation += Math.PI / 180;
        if (this.ringRotation >= Math.PI * 2) {
            this.ringRotation -= Math.PI * 2;
        }
    }
}