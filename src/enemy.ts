import { Player } from './player';
import { Terrain, Block } from './terrain';

export class Enemy extends Player {
    private target: Player;
    private score: number = 0;
    private randomDirection: { x: number, y: number } = { x: 0, y: 0 };
    private randomMovementDuration: number = 0;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number, context: CanvasRenderingContext2D, target: Player) {
        super(x, y, 50, 5, context);
        this.target = target;
    }

    public update(terrain: Terrain, screenWidth: number, screenHeight: number, cameraX: number, cameraY: number) {
        if (this.isOffScreen(screenWidth, screenHeight, cameraX, cameraY)) {
            this.moveRandomly();
        } else {
            this.moveTowardsTarget();
        }

        // Attempt to dig
        const dugBlocks = this.dig(terrain);
        for (const block of dugBlocks) {
            this.handleDugBlock(block);
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
            this.randomMovementDuration = Math.random() * 100 + 50;
        }

        const speed = this.getSpeed(); // This should now work
        this.move(this.randomDirection.x * speed, this.randomDirection.y * speed);
        this.randomMovementDuration--;
    }

    private moveTowardsTarget() {
        const dx = this.target.getX() - this.getX();
        const dy = this.target.getY() - this.getY();
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const speed = this.getSpeed(); // This should now work
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;
            this.move(moveX, moveY);
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

    // We don't need to override setSize anymore, as it will use the Player's method
    // which now allows unlimited growth

    public takeDamage(amount: number) {
        this.adjustHealth(-amount);
    }

    public isAlive(): boolean {
        return this.getHealth() > 0;
    }

    public draw() {
        super.draw(); // Call the parent draw method

        // Draw health bar
        const healthBarWidth = this.getSize() * 2;
        const healthBarHeight = 5;
        const healthPercentage = this.getHealth() / 100;

        this.getContext().fillStyle = 'red';
        this.getContext().fillRect(this.getX() - healthBarWidth / 2, this.getY() - this.getSize() - 10, healthBarWidth, healthBarHeight);

        this.getContext().fillStyle = 'green';
        this.getContext().fillRect(this.getX() - healthBarWidth / 2, this.getY() - this.getSize() - 10, healthBarWidth * healthPercentage, healthBarHeight);
    }
}