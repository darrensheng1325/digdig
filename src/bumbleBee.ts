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
        this.context.fillStyle = this.isAngry ? 'red' : 'yellow';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.context.fill();
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