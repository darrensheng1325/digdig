import { Terrain, Block } from './terrain';

export class Player {
    private x: number;
    private y: number;
    private size: number;
    private health: number;
    private maxHealth: number;
    private shield: number;
    private maxShield: number;
    private terrainWidth: number;
    private terrainHeight: number;

    constructor(x: number, y: number, terrainWidth: number, terrainHeight: number) {
        this.x = x;
        this.y = y;
        this.size = 10; // Initial size
        this.health = 100; // Initial health
        this.maxHealth = 100; // Maximum health
        this.shield = 0; // Initial shield
        this.maxShield = 50; // Maximum shield
        this.terrainWidth = terrainWidth;
        this.terrainHeight = terrainHeight;
    }

    public move(dx: number, dy: number) {
        // Adjust speed based on size: smaller size -> faster speed, larger size -> slower speed
        const speedFactor = 10 / this.size;
        const newX = this.x + dx * speedFactor;
        const newY = this.y + dy * speedFactor;

        // Boundary checks
        if (newX - this.size >= 0 && newX + this.size <= this.terrainWidth) {
            this.x = newX;
        }
        if (newY - this.size >= 0 && newY + this.size <= this.terrainHeight) {
            this.y = newY;
        }
    }

    public dig(terrain: Terrain): Block | null {
        let blockRemoved: Block | null = null;
        const radius = Math.ceil(this.size / 10); // Determine the radius of blocks to remove based on size

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    const block = terrain.removeBlock(this.x + dx * 10, this.y + dy * 10);
                    if (block) {
                        blockRemoved = block;
                    }
                }
            }
        }

        return blockRemoved;
    }

    public setSize(score: number) {
        this.size = 10 + score * 0.1; // Increase size based on score
    }

    public adjustHealth(amount: number) {
        if (amount < 0) {
            // If damage is taken, deplete shield first
            const shieldDamage = Math.min(this.shield, -amount);
            this.shield -= shieldDamage;
            amount += shieldDamage;
        }
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth; // Cap health at maxHealth
        if (this.health < 0) this.health = 0; // Prevent health from going below 0
    }

    public recoverHealth(amount: number) {
        this.adjustHealth(amount);
    }

    public adjustShield(amount: number) {
        this.shield += amount;
        if (this.shield > this.maxShield) this.shield = this.maxShield; // Cap shield at maxShield
        if (this.shield < 0) this.shield = 0; // Prevent shield from going below 0
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        this.drawHealthBar(context);
        this.drawShieldBar(context);
    }

    private drawHealthBar(context: CanvasRenderingContext2D) {
        const barWidth = 50;
        const barHeight = 5;
        const barX = this.x - barWidth / 2;
        const barY = this.y + this.size + 5; // Position the health bar below the player

        // Draw the background of the health bar
        context.fillStyle = 'red';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Draw the current health
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        context.fillStyle = 'green';
        context.fillRect(barX, barY, healthWidth, barHeight);
    }

    private drawShieldBar(context: CanvasRenderingContext2D) {
        const barWidth = 50;
        const barHeight = 5;
        const barX = this.x - barWidth / 2;
        const barY = this.y + this.size + 15; // Position the shield bar below the health bar

        // Draw the background of the shield bar
        context.fillStyle = 'gray';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Draw the current shield
        const shieldWidth = (this.shield / this.maxShield) * barWidth;
        context.fillStyle = 'blue';
        context.fillRect(barX, barY, shieldWidth, barHeight);
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getHealth(): number {
        return this.health;
    }

    public getShield(): number {
        return this.shield;
    }
}