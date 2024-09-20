import { Player } from './player';
import { Terrain } from './terrain';

interface Island {
    x: number;
    y: number;
    radius: number;
}

export class BumbleBee {
    private x: number;
    private y: number;
    private size: number = 15;
    private context: CanvasRenderingContext2D;
    private player: Player;
    private terrain: Terrain;
    private isAngry: boolean = false;
    private angerDuration: number = 5000; // 5 seconds
    private angerTimer: number = 0;
    private health: number = 100;
    private attackCooldown: number = 0;
    private attackInterval: number = 1000; // 1 second between attacks
    private maxChaseDistance: number = 500; // Maximum distance to chase the player
    private currentIsland: Island;
    private idleAngle: number = Math.random() * Math.PI * 2;
    private idleSpeed: number = 30; // Idle speed

    constructor(x: number, y: number, context: CanvasRenderingContext2D, player: Player, terrain: Terrain, island: Island) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.player = player;
        this.terrain = terrain;
        this.currentIsland = island;
    }

    public update(deltaTime: number): void {
        const deltaSeconds = Math.min(deltaTime / 1000, 0.1); // Cap delta time to prevent large jumps
        const dx = this.player.getX() - this.x;
        const dy = this.player.getY() - this.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

        if (this.isAngry) {
            this.updateAngryBehavior(distanceToPlayer, deltaSeconds);
        } else {
            this.updateIdleBehavior(deltaSeconds);
            // Check if player is close enough to anger the bee
            if (distanceToPlayer < 100) {
                this.anger();
            }
        }

        // Keep within terrain boundaries
        this.x = Math.max(this.size, Math.min(this.x, this.terrain.getWidth() - this.size));
        this.y = Math.max(this.size, Math.min(this.y, this.terrain.getHeight() - this.size));
    }

    private updateAngryBehavior(distanceToPlayer: number, deltaSeconds: number): void {
        if (distanceToPlayer > this.maxChaseDistance) {
            this.isAngry = false;
            this.angerTimer = 0;
        } else {
            const moveSpeed = this.player.getSpeed() * 100; // 100 times player's speed
            const angle = Math.atan2(this.player.getY() - this.y, this.player.getX() - this.x);
            this.x += Math.cos(angle) * moveSpeed * deltaSeconds;
            this.y += Math.sin(angle) * moveSpeed * deltaSeconds;

            this.attackCooldown -= deltaSeconds * 1000;
            if (this.attackCooldown <= 0 && distanceToPlayer < this.size + 20) {
                this.attackPlayer();
                this.attackCooldown = this.attackInterval;
            }

            this.angerTimer += deltaSeconds * 1000;
            if (this.angerTimer >= this.angerDuration) {
                this.isAngry = false;
                this.angerTimer = 0;
            }
        }
    }

    private updateIdleBehavior(deltaSeconds: number): void {
        this.idleAngle += (Math.random() - 0.5) * 0.1;
        const newX = this.x + Math.cos(this.idleAngle) * this.idleSpeed * deltaSeconds;
        const newY = this.y + Math.sin(this.idleAngle) * this.idleSpeed * deltaSeconds;

        const distanceToIslandCenter = Math.sqrt(
            Math.pow(newX - this.currentIsland.x, 2) + 
            Math.pow(newY - this.currentIsland.y, 2)
        );

        if (distanceToIslandCenter <= this.currentIsland.radius - this.size) {
            this.x = newX;
            this.y = newY;
        } else {
            this.idleAngle = Math.atan2(
                this.currentIsland.y - this.y,
                this.currentIsland.x - this.x
            );
        }
    }

    private attackPlayer(): void {
        const playerMaxHealth = this.player.getMaxHealth();
        const damage = Math.floor(playerMaxHealth * 0.75); // 3/4 of player's max health
        this.player.takeDamage(damage);
        console.log(`Bee attacked player for ${damage} damage. Player health: ${this.player.getHealth()}`);
    }

    public draw(): void {
        this.context.save();
        
        // Draw the main body
        this.context.fillStyle = this.isAngry ? 'red' : 'yellow';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.context.fill();

        // Draw stripes
        this.context.fillStyle = 'black';
        const stripeCount = 3;
        const stripeWidth = this.size * 0.4; // Adjust this value to change stripe width
        const stripeSpacing = this.size * 0.5; // Adjust this value to change stripe spacing

        for (let i = 0; i < stripeCount; i++) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(Math.PI / 4); // Rotate stripes diagonally

            // Calculate stripe position
            const stripeX = -this.size + (i + 0.5) * stripeSpacing - stripeWidth / 2;

            // Use a clipping region to keep stripes inside the bee
            this.context.beginPath();
            this.context.arc(0, 0, this.size, 0, Math.PI * 2);
            this.context.clip();

            // Draw the stripe
            this.context.fillRect(
                stripeX,
                -this.size,
                stripeWidth,
                this.size * 2
            );

            this.context.restore();
        }

        // Draw antennae
        this.context.strokeStyle = 'black';
        this.context.lineWidth = this.size * 0.1;
        
        // Left antenna
        this.context.beginPath();
        this.context.moveTo(this.x + this.size * 0.3, this.y - this.size * 0.5);
        this.context.lineTo(this.x + this.size * 0.6, this.y - this.size * 0.9);
        this.context.stroke();

        // Right antenna
        this.context.beginPath();
        this.context.moveTo(this.x + this.size * 0.5, this.y - this.size * 0.3);
        this.context.lineTo(this.x + this.size * 0.9, this.y - this.size * 0.6);
        this.context.stroke();

        this.context.restore();
    }

    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    public getSize(): number { return this.size; }
    public anger(): void {
        this.isAngry = true;
        this.angerTimer = 0;
    }
    public isAngered(): boolean { return this.isAngry; }
    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
    public isDead(): boolean { return this.health <= 0; }
    public getHealth(): number { return this.health; }
}