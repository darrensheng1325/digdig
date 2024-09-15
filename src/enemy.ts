import { Player } from './player';
import { Terrain, Block } from './terrain';

export class Enemy extends Player {
    private target: Player;
    private score: number = 0;
    private randomDirection: { x: number, y: number } = { x: 0, y: 0 };
    private randomMovementDuration: number = 0;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number, context: CanvasRenderingContext2D, target: Player) {
        super(x, y, terrainWidth, terrainHeight, context);
        this.target = target;
        this.health = 50; // Now accessible
        this.maxHealth = 50; // Now accessible
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
        return this.x < cameraX || this.x > cameraX + screenWidth ||
               this.y < cameraY || this.y > cameraY + screenHeight;
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
        const dx = this.target.getX() - this.x;
        const dy = this.target.getY() - this.y;
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
        this.size = Math.min(10 + score * 0.1, maxSize);
    }

    public takeDamage(amount: number) {
        this.adjustHealth(-amount);
    }

    public isAlive(): boolean {
        return this.health > 0; // Now accessible
    }

    public draw() {
        super.draw(); // Call the parent draw method

        // Draw health bar
        const healthBarWidth = this.size * 2;
        const healthBarHeight = 5;
        const healthPercentage = this.health / this.maxHealth; // Now accessible

        this.context.fillStyle = 'red';
        this.context.fillRect(this.x - healthBarWidth / 2, this.y - this.size - 10, healthBarWidth, healthBarHeight);

        this.context.fillStyle = 'green';
        this.context.fillRect(this.x - healthBarWidth / 2, this.y - this.size - 10, healthBarWidth * healthPercentage, healthBarHeight);
    }
}