import { Player } from './player';
import { Terrain, Block } from './terrain';

export class Enemy extends Player {
    private target: Player;
    private score: number = 0;
    private randomDirection: { x: number, y: number } = { x: 0, y: 0 };
    private randomMovementDuration: number = 0;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number, context: CanvasRenderingContext2D, target: Player, terrain: Terrain) {
        super(x, y, 50, 5, context, terrain);
        this.target = target;
        this.setSize(20); // Set initial size
    }

    // Override the getSpeed method to make enemies much slower
    protected getSpeed(): number {
        return 0.5;
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
            this.score -= 5;
        } else if (block.type === 'lava') {
            this.adjustHealth(-20);
        } else if (block.type === 'quartz') {
            this.adjustShield(10);
        } else {
            this.score += 1;
        }
        this.updateSize();
    }

    private updateSize() {
        const minSize = 20;
        const growthRate = 0.01;
        const newSize = Math.max(minSize, minSize + this.score * growthRate);
        this.setSize(newSize);
    }

    public setSize(newSize: number) {
        super.setSize(newSize);
    }

    public takeDamage(amount: number) {
        this.adjustHealth(-amount);
    }

    public isAlive(): boolean {
        return this.getHealth() > 0;
    }

    public draw() {
        super.draw();
    }
}