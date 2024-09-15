import { Terrain } from './terrain';

export class Player {
    private x: number;
    private y: number;
    private size: number;
    private health: number;
    private shield: number;
    private context: CanvasRenderingContext2D;

    constructor(x: number, y: number, health: number, attack: number, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.size = 20; // Initial size
        this.health = health;
        this.shield = 0;
        this.context = context;
    }

    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    dig(terrain: Terrain) {
        // Implement digging logic here
        return terrain.removeBlock(this.x, this.y);
    }

    draw() {
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

        // Draw pupils
        this.context.fillStyle = 'black';
        const pupilSize = Math.min(eyeWidth, eyeHeight) / 2;
        this.context.fillRect(this.x - this.size / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);
        this.context.fillRect(this.x + this.size / 6 - pupilSize / 2, eyeY + eyeHeight / 2 - pupilSize / 2, pupilSize, pupilSize);

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
        this.size = Math.max(20, Math.min(40, 20 + score * 0.1));
    }

    public getSize(): number {
        return this.size;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }
}