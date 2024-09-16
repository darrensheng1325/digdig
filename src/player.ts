import { Terrain, Block } from './terrain';

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
    private goldScore: number = 0;
    private level: number = 1;
    private xp: number = 0;
    private xpToNextLevel: number = 100;

    constructor(x: number, y: number, health: number, attack: number, context: CanvasRenderingContext2D, terrain: Terrain) {
        this.x = x;
        this.y = y;
        this.size = 20; // Initial size
        this.health = health;
        this.shield = 0;
        this.context = context;
        this.terrain = terrain; // Add this line
        this.loadGoldScore(); // Load the gold score from local storage
        this.calculateLevelAndXP();
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
        const baseSpeed = Math.max(this.minSpeed, this.baseSpeed - this.baseSpeed * speedDecrease);
        
        // Include level bonus
        return baseSpeed * (1 + (this.level - 1) * 0.05); // 5% speed increase per level
    }

    dig(terrain: Terrain) {
        const digRadius = Math.floor(this.size / 2);
        const dugBlocks: Block[] = [];

        for (let dx = -digRadius; dx <= digRadius; dx++) {
            for (let dy = -digRadius; dy <= digRadius; dy++) {
                if (dx * dx + dy * dy <= digRadius * digRadius) {
                    const block = terrain.removeBlock(this.x + dx, this.y + dy);
                    if (block) {
                        dugBlocks.push(block);
                    }
                }
            }
        }

        // Handle dug blocks
        for (const block of dugBlocks) {
            this.handleDugBlock(block);
        }

        return dugBlocks;
    }

    protected handleDugBlock(block: Block) {
        switch (block.type) {
            case 'uranium':
                this.adjustHealth(-5);
                break;
            case 'lava':
                this.adjustHealth(-20);
                break;
            case 'quartz':
                this.adjustShield(10);
                break;
            case 'bedrock':
                this.adjustScore(5);
                break;
            case 'gold_ore':
                this.adjustGoldScore(1);
                break;
            default:
                this.adjustScore(1);
        }
        this.setSize(this.getScore() + this.getGoldScore());
    }

    draw(screenWidth: number, screenHeight: number) {
        // Draw level in the top left corner
        this.context.fillStyle = 'white';
        this.context.font = '24px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Level: ${this.level}`, 10, 10);

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

        // Draw regular score and gold score
        this.context.font = `${this.size / 3}px Arial`;
        this.context.textAlign = 'center';
        
        this.context.fillStyle = 'white';
        this.context.fillText(`${this.getScore()}`, this.x - this.size / 2, this.y - this.size / 2 - 20);
        
        this.context.fillStyle = 'gold';
        this.context.fillText(`${this.goldScore}`, this.x + this.size / 2, this.y - this.size / 2 - 20);

        // Draw level and XP bar
        const xpPercentage = this.xp / this.xpToNextLevel;

        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 25, barWidth, barHeight);

        this.context.fillStyle = 'yellow';
        this.context.fillRect(this.x - barWidth / 2, this.y - this.size / 2 - 25, barWidth * xpPercentage, barHeight);

        this.context.fillStyle = 'white';
        this.context.font = `${this.size / 4}px Arial`;
        this.context.textAlign = 'center';
        this.context.fillText(`Lvl ${this.level}`, this.x, this.y - this.size / 2 - 30);
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
        const levelBonus = (this.level - 1) * 0.1; // 10% size increase per level

        // Calculate new size based on score and level
        const newSize = (minSize + Math.sqrt(score) * growthFactor) * (1 + levelBonus);

        // Clamp the size between minSize and maxSize
        this.size = Math.max(minSize, Math.min(this.maxSize, newSize));
        
        console.log(`Player size updated. Score: ${score}, Level: ${this.level}, New size: ${this.size}`);
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

    public getGoldScore(): number {
        return this.goldScore;
    }

    public adjustGoldScore(amount: number) {
        this.goldScore += amount;
        this.saveGoldScore(); // Save the gold score after each adjustment
        this.calculateLevelAndXP();
        console.log(`Gold score adjusted. New gold score: ${this.goldScore}`);
    }

    private saveGoldScore(): void {
        localStorage.setItem('playerGoldScore', this.goldScore.toString());
    }

    private loadGoldScore(): void {
        const savedGoldScore = localStorage.getItem('playerGoldScore');
        if (savedGoldScore !== null) {
            this.goldScore = parseInt(savedGoldScore, 10);
        }
    }

    private calculateLevelAndXP(): void {
        const oldLevel = this.level;
        this.level = Math.floor(Math.sqrt(this.goldScore / 100)) + 1;
        this.xp = this.goldScore % 100;
        this.xpToNextLevel = 100;

        if (this.level > oldLevel) {
            console.log(`Level up! New level: ${this.level}`);
            this.onLevelUp();
        }
    }

    private onLevelUp(): void {
        // Increase max health and shield
        const maxHealth = 100 + (this.level - 1) * 10;
        const maxShield = 100 + (this.level - 1) * 5;

        this.health = Math.min(this.health, maxHealth);
        this.shield = Math.min(this.shield, maxShield);

        // Increase base speed slightly
        this.baseSpeed = 4 + (this.level - 1) * 0.1;
    }

    public getLevel(): number {
        return this.level;
    }

    public getXP(): number {
        return this.xp;
    }

    public getXPToNextLevel(): number {
        return this.xpToNextLevel;
    }
}