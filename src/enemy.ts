import { Player } from './player';
import { Terrain, Block } from './terrain';

export class Enemy extends Player {
    private target: Player;
    private score: number = 0;
    private randomDirection: { x: number, y: number } = { x: 0, y: 0 };
    private randomMovementDuration: number = 0;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number, context: CanvasRenderingContext2D, target: Player) {
        super(x, y, 50, 5, context); // Call Player constructor with initial health of 50 and attack of 5
        this.target = target;
    }

    public update(terrain: Terrain, screenWidth: number, screenHeight: number, cameraX: number, cameraY: number) {
        if (this.isOffScreen(screenWidth, screenHeight, cameraX, cameraY)) {
            this.moveRandomly();
        } else {
            this.moveTowardsTarget();
        }

        // Attempt to dig
        const dugBlock = this.dig(terrain);
        if (dugBlock) {
            this.handleDugBlock(dugBlock);
        }
    }

    private isOffScreen(screenWidth: number, screenHeight: number, cameraX: number, cameraY: number): boolean {
        return this.getX() < cameraX || this.getX() > cameraX + screenWidth ||
               this.getY() < cameraY || this.getY() > cameraY + screenHeight;
    }

    private moveRandomly() {
        if (this.randomMovementDuration <= 0) {
            // Generate new random direction
            const angle = Math.random() * 2 * Math.PI;
            this.randomDirection = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
            this.randomMovementDuration = Math.random() * 100 + 50; // Random duration between 50 and 150 frames
        }

        const speed = 2;
        this.move(this.randomDirection.x * speed, this.randomDirection.y * speed);
        this.randomMovementDuration--;
    }

    private moveTowardsTarget() {
        const dx = this.target.getX() - this.getX();
        const dy = this.target.getY() - this.getY();
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const speed = 2;
            this.move((dx / distance) * speed, (dy / distance) * speed);
        }
    }

    private handleDugBlock(block: Block) {
        if (block.type === 'uranium') {
            this.score -= 5; // Decrease score when uranium is dug
        } else if (block.type === 'lava') {
            this.adjustHealth(-20); // Decrease health when lava is dug
        } else if (block.type === 'quartz') {
            this.adjustShield(10); // Increase shield when quartz is dug
        } else {
            this.score += 1; // Increase score when other blocks are dug
        }
        this.setSize(this.score); // Update enemy size based on score
    }

    // Override setSize method to limit the maximum size
    public setSize(score: number) {
        const maxSize = 40; // Set a maximum size for enemies
        super.setSize(Math.min(score, maxSize));
    }

    public takeDamage(amount: number) {
        this.adjustHealth(-amount);
    }

    public isAlive(): boolean {
        return this.getHealth() > 0;
    }

    public draw() {
        // Draw enemy body (gray circle)
        this.getContext().fillStyle = 'gray';
        this.getContext().beginPath();
        this.getContext().arc(this.getX(), this.getY(), this.getSize() / 2, 0, Math.PI * 2);
        this.getContext().fill();

        // Draw face
        const eyeWidth = this.getSize() / 6;
        const eyeHeight = this.getSize() / 4;
        const eyeY = this.getY() - eyeHeight / 2;

        // Left eye
        this.getContext().fillStyle = 'white';
        this.getContext().fillRect(this.getX() - this.getSize() / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Right eye
        this.getContext().fillRect(this.getX() + this.getSize() / 6 - eyeWidth / 2, eyeY, eyeWidth, eyeHeight);

        // Draw pupils
        this.getContext().fillStyle = 'black';
        const pupilSize = Math.min(eyeWidth, eyeHeight) / 2;
        this.getContext().fillRect(this.getX() - this.getSize() / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);
        this.getContext().fillRect(this.getX() + this.getSize() / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);

        // Draw neutral mouth (straight line)
        this.getContext().strokeStyle = 'black';
        this.getContext().lineWidth = 2;
        this.getContext().beginPath();
        this.getContext().moveTo(this.getX() - this.getSize() / 5, this.getY() + this.getSize() / 8);
        this.getContext().lineTo(this.getX() + this.getSize() / 5, this.getY() + this.getSize() / 8);
        this.getContext().stroke();

        // Draw health bar
        const healthBarWidth = this.getSize() * 2;
        const healthBarHeight = 5;
        const healthPercentage = this.getHealth() / 100; // Assuming max health is 100

        this.getContext().fillStyle = 'red';
        this.getContext().fillRect(this.getX() - healthBarWidth / 2, this.getY() - this.getSize() - 10, healthBarWidth, healthBarHeight);

        this.getContext().fillStyle = 'green';
        this.getContext().fillRect(this.getX() - healthBarWidth / 2, this.getY() - this.getSize() - 10, healthBarWidth * healthPercentage, healthBarHeight);
    }
}