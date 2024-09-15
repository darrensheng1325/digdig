import { Player } from './player';
import { Terrain, Block } from './terrain';

export class Enemy extends Player {
    private target: Player;
    private randomDirection: { x: number, y: number } = { x: 0, y: 0 };
    private randomMovementDuration: number = 0;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number, context: CanvasRenderingContext2D, target: Player, terrain: Terrain) {
        super(x, y, 50, 5, context, terrain);
        this.target = target;
        this.setSize(20); // Set initial size
    }

    // Override the getSpeed method to make enemies much slower
    protected getSpeed(): number {
        return super.getSpeed() * 0.2; // 20% of the player's speed
    }

    public update(terrain: Terrain, screenWidth: number, screenHeight: number, cameraX: number, cameraY: number) {
        if (this.isOffScreen(screenWidth, screenHeight, cameraX, cameraY)) {
            this.moveRandomly();
        } else {
            this.moveTowardsTarget();
        }

        const dugBlocks = this.dig(terrain);
        for (const block of dugBlocks) {
            this.handleDugBlock(block);
        }

        this.updateRingRotation();
    }

    private isOffScreen(screenWidth: number, screenHeight: number, cameraX: number, cameraY: number): boolean {
        return this.getX() < cameraX || this.getX() > cameraX + screenWidth ||
               this.getY() < cameraY || this.getY() > cameraY + screenHeight;
    }

    private moveRandomly() {
        if (this.randomMovementDuration <= 0) {
            const angle = Math.random() * 2 * Math.PI;
            this.randomDirection = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
            this.randomMovementDuration = Math.random() * 100 + 50;
        }

        const speed = this.getSpeed();
        this.move(this.randomDirection.x * speed, this.randomDirection.y * speed);
        this.randomMovementDuration--;
    }

    private moveTowardsTarget() {
        const dx = this.target.getX() - this.getX();
        const dy = this.target.getY() - this.getY();
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const speed = this.getSpeed();
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;
            this.move(moveX, moveY);
        }
    }

    private handleDugBlock(block: Block) {
        if (block.type === 'uranium') {
            this.adjustScore(-5);
        } else if (block.type === 'lava') {
            this.adjustHealth(-20);
        } else if (block.type === 'quartz') {
            this.adjustShield(10);
        } else {
            this.adjustScore(1);
        }
        this.updateSize();
    }

    private updateSize() {
        const growthRate = 0.03; // Increased growth rate (twice as fast as the player)
        const newSize = this.getSize() + this.getScore() * growthRate;
        this.setSize(newSize);
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Override the draw method to change the color of the enemy and make a shorter frown
    public draw() {
        const context = this.getContext();
        const x = this.getX();
        const y = this.getY();
        const size = this.getSize();

        // Draw curved ring pattern (filled with black, like the player)
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.lineWidth = 5;

        const ringRadius = size / 2 + size / 6;
        const curveCount = 8;
        const curveAngle = (Math.PI * 2) / curveCount;
        const curveDepth = size / 4;

        context.beginPath();
        for (let i = 0; i < curveCount; i++) {
            const startAngle = i * curveAngle + this.ringRotation;
            const endAngle = (i + 1) * curveAngle + this.ringRotation;
            const midAngle = (startAngle + endAngle) / 2;

            const startX = x + Math.cos(startAngle) * ringRadius;
            const startY = y + Math.sin(startAngle) * ringRadius;
            const endX = x + Math.cos(endAngle) * ringRadius;
            const endY = y + Math.sin(endAngle) * ringRadius;
            const controlX = x + Math.cos(midAngle) * (ringRadius - curveDepth);
            const controlY = y + Math.sin(midAngle) * (ringRadius - curveDepth);

            if (i === 0) {
                context.moveTo(startX, startY);
            }
            context.quadraticCurveTo(controlX, controlY, endX, endY);
        }
        context.closePath();
        context.fill();
        context.stroke();

        // Draw enemy body (red circle)
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fill();

        // Draw face (similar to player but with a frown)
        const eyeWidth = size / 6;
        const eyeHeight = size / 4;
        const eyeY = y - eyeHeight / 2;

        // Left eye
        context.fillStyle = 'white';
        context.fillRect(x - size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Right eye
        context.fillRect(x + size / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Draw pupils (rectangular)
        context.fillStyle = 'black';
        const pupilWidth = eyeWidth * 0.6;
        const pupilHeight = eyeHeight * 0.6;
        const maxPupilOffset = (eyeWidth - pupilWidth) / 2;

        // Calculate pupil offset based on movement direction
        const pupilOffsetX = this.randomDirection.x * maxPupilOffset;
        const pupilOffsetY = this.randomDirection.y * maxPupilOffset;

        // Left pupil
        context.fillRect(
            x - size / 6 - pupilWidth / 2 + pupilOffsetX,
            eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY,
            pupilWidth,
            pupilHeight
        );

        // Right pupil
        context.fillRect(
            x + size / 6 - pupilWidth / 2 + pupilOffsetX,
            eyeY + (eyeHeight - pupilHeight) / 2 + pupilOffsetY,
            pupilWidth,
            pupilHeight
        );

        // Draw frown (inverted smile, moved down)
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y + size / 4, size / 5, 1.2 * Math.PI, 1.8 * Math.PI); // Changed y-coordinate
        context.stroke();

        // Draw health and shield bar
        const barWidth = size * 2;
        const barHeight = 5;
        const healthPercentage = this.getHealth() / 100;
        const shieldPercentage = this.getShield() / 100;

        context.fillStyle = 'darkred';
        context.fillRect(x - barWidth / 2, y - size / 2 - 10, barWidth, barHeight);

        context.fillStyle = 'red';
        context.fillRect(x - barWidth / 2, y - size / 2 - 10, barWidth * healthPercentage, barHeight);

        context.fillStyle = 'purple';
        context.fillRect(
            x - barWidth / 2 + barWidth * healthPercentage, 
            y - size / 2 - 10, 
            barWidth * shieldPercentage, 
            barHeight
        );
    }
}