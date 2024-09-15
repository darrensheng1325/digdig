import { Terrain } from './terrain';

export class Player {
    protected x: number;
    protected y: number;
    private size: number;
    private health: number;
    private shield: number;
    private context: CanvasRenderingContext2D;
    private movementDirection: { x: number, y: number } = { x: 0, y: 0 };
    private baseSpeed: number = 4; // Increased slightly from 3 to 4
    private minSpeed: number = 0.3; // Decreased from 0.5 to 0.3
    private maxSpeed: number = 5; // Reduced maximum speed
    private optimalSize: number = 40; // Size at which the player is fastest
    protected ringRotation: number = 0; // Change from private to protected
    protected terrain: Terrain; // Add this line
    private score: number = 0; // Add this line
    private _isDigging: boolean = false; // Changed from isDigging to _isDigging
    private maxSize: number = 1000; // Changed from 100 to 1000

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
            
            // Dig at the new position
            this.dig(this.terrain);
        }
    }

    // Calculate speed based on size
    public getSpeed(): number {
        const minSize = 20;
        const normalizedSize = Math.min((this.size - minSize) / (this.maxSize - minSize), 1);
        const speedDecrease = normalizedSize * 0.95; // Increased from 0.8 to 0.95 for more significant slowdown at larger sizes
        const speed = this.baseSpeed - this.baseSpeed * speedDecrease;
        return Math.max(this.minSpeed, speed);
    }

    dig(terrain: Terrain) {
        const digRadius = Math.floor(this.size / 2);
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

        // Handle dug blocks
        for (const block of dugBlocks) {
            if (block.type === 'uranium') {
                this.adjustHealth(-5);
            } else if (block.type === 'lava') {
                this.adjustHealth(-20);
            } else if (block.type === 'quartz') {
                this.adjustShield(10);
            } else {
                this.adjustScore(1); // Increase score for regular blocks
            }
        }

        this.setSize(this.getScore());
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

        // Draw combined health and shield bar
        const barWidth = this.size * 2;
        const barHeight = 5;
        const healthPercentage = this.health / 100;
        const shieldPercentage = this.shield / 100;

        // Background (red)
        this.context.fillStyle = 'red';
        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth, barHeight);

        // Health (green)
        this.context.fillStyle = 'green';
        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth * healthPercentage, barHeight);

        // Shield (blue)
        this.context.fillStyle = 'blue';
        this.context.fillRect(
            this.x - barWidth / 2 + barWidth * healthPercentage, 
            this.y - this.size / 2 - 10, 
            barWidth * shieldPercentage, 
            barHeight
        );
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
        const growthFactor = 1.5; // Increased from 0.5 to 1.5 to allow for larger growth

        // Calculate new size based on score
        const newSize = minSize + Math.sqrt(score) * growthFactor;

        // Clamp the size between minSize and maxSize
        this.size = Math.max(minSize, Math.min(this.maxSize, newSize));
        
        console.log(`Player size updated. Score: ${score}, New size: ${this.size}`);
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

    public getScore(): number {
        return this.score;
    }

    public adjustScore(amount: number) {
        this.score += amount;
        this.setSize(this.score);
        console.log(`Score adjusted. New score: ${this.score}`); // Add this line for debugging
    }

    public startDigging() {
        this._isDigging = true;
        console.log('Player started digging');
    }

    public stopDigging() {
        this._isDigging = false;
        console.log('Player stopped digging');
    }

    public isDigging(): boolean {
        return this._isDigging;
    }

    public update(terrain: Terrain, screenWidth: number, screenHeight: number, cameraX: number, cameraY: number) {
        if (this._isDigging) {
            this.dig(terrain);
        }
    }

    // Add a new method to handle enemy kills
    public onEnemyKill() {
        this.adjustScore(1); // Increase score by 1 for each enemy killed
        this.setSize(this.getScore());
    }
}