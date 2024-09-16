import { Player, Emote } from './player';
import { Enemy } from './enemy';
import { Terrain, Block } from './terrain';
import { Shop } from './shop';

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private player: Player;
    private terrain: Terrain;
    private score: number;
    private keysPressed: Set<string>;
    private cameraX: number;
    private cameraY: number;
    private lastHealthRecoveryTime: number;
    private enemies: Enemy[] = [];
    private maxEnemies: number = 40; // Changed from 20 to 40
    private isMouseControl: boolean = false;
    private zoom: number = 1;
    private minZoom: number = 0.01; // Minimum zoom (maximum zoom out)
    private maxZoom: number = 1; // Maximum zoom (no zoom out)
    private zoomCap: number = 0.4; // Set the zoom cap to 40%
    private lastUpdateTime: number = 0;
    private isEmoteWheelOpen: boolean = false;
    private emoteWheelRadius: number = 100;
    private selectedEmote: Emote | null = null;
    private shop: Shop;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.terrain = new Terrain(10000, 10000); // Increased terrain size to 10000x10000
        this.player = new Player(5000, 5000, 100, 10, this.context, this.terrain); // Start player in the middle
        this.score = 0;
        this.keysPressed = new Set();
        this.cameraX = 0;
        this.cameraY = 0;
        this.lastHealthRecoveryTime = Date.now();
        this.enemies = [];
        this.spawnEnemies(20); // Increased initial spawn from 15 to 20
        this.shop = new Shop(this.player, this.context);

        this.init();
    }

    private init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('keydown', (e) => this.handleEmoteInput(e));
        this.resizeCanvas();
        this.gameLoop();
        this.lastUpdateTime = Date.now();
    }

    public resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'e') {
            this.toggleEmoteWheel();
        } else if (event.key === 's') {
            this.shop.toggleShop();
        }
        this.keysPressed.add(event.key);
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.key);
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.isEmoteWheelOpen) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.selectedEmote = this.getEmoteFromPosition(x, y);
        } else if (this.isMouseControl) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left + this.cameraX;
            const y = event.clientY - rect.top + this.cameraY;
            const dx = x - this.player.getX();
            const dy = y - this.player.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 5) {  // Add a small threshold to prevent jittering
                const speed = this.player.getSpeed();
                const moveX = (dx / distance) * speed;
                const moveY = (dy / distance) * speed;
                this.player.move(moveX, moveY);
            }
        }
    }

    private handleMouseDown(event: MouseEvent) {
        if (this.shop.isShopOpen()) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.shop.handleClick(x, y, this.canvas.width, this.canvas.height);
        } else if (this.isEmoteWheelOpen && this.selectedEmote !== null) {
            this.player.displayEmote(this.selectedEmote);
            this.toggleEmoteWheel();
        } else if (this.isMouseControl) {
            this.player.startDigging();
        }
    }

    private handleMouseUp(event: MouseEvent) {
        if (this.isMouseControl) {
            this.player.stopDigging();
        }
    }

    private handleEmoteInput(event: KeyboardEvent) {
        switch (event.key) {
            case '1': this.player.displayEmote(Emote.Happy); break;
            case '2': this.player.displayEmote(Emote.Sad); break;
            case '3': this.player.displayEmote(Emote.Angry); break;
            case '4': this.player.displayEmote(Emote.Surprised); break;
            case '5': this.player.displayEmote(Emote.Love); break;
            case '6': this.player.displayEmote(Emote.Cool); break;
            case '7': this.player.displayEmote(Emote.Thinking); break;
            case '8': this.player.displayEmote(Emote.Laughing); break;
            case '9': this.player.displayEmote(Emote.Wink); break;
            case '0': this.player.displayEmote(Emote.Confused); break;
            case 'q': this.player.displayEmote(Emote.Sleepy); break;
            case 'w': this.player.displayEmote(Emote.Excited); break;
            case 'e': this.player.displayEmote(Emote.Nervous); break;
            case 'r': this.player.displayEmote(Emote.Sick); break;
            case 't': this.player.displayEmote(Emote.Rich); break;
            case 'y': this.player.displayEmote(Emote.Strong); break;
            case 'u': this.player.displayEmote(Emote.Scared); break;
            case 'i': this.player.displayEmote(Emote.Crazy); break;
            case 'o': this.player.displayEmote(Emote.Evil); break;
            case 'p': this.player.displayEmote(Emote.Dead); break;
        }
    }

    private gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        if (!this.isMouseControl) {
            // Existing keyboard control logic
            let dx = 0;
            let dy = 0;

            if (this.keysPressed.has('ArrowUp')) dy -= 1;
            if (this.keysPressed.has('ArrowDown')) dy += 1;
            if (this.keysPressed.has('ArrowLeft')) dx -= 1;
            if (this.keysPressed.has('ArrowRight')) dx += 1;

            if (dx !== 0 || dy !== 0) {
                const speed = this.player.getSpeed();
                this.player.move(dx * speed, dy * speed);
            }
        }

        // Call player's update method with all required arguments
        this.player.update(this.terrain, this.canvas.width, this.canvas.height, this.cameraX, this.cameraY);

        // Log player's position and digging status for debugging
        console.log(`Player position: (${this.player.getX()}, ${this.player.getY()}), Digging: ${this.player.isDigging()}`);

        // Health recovery over time (shield does not recover)
        if (currentTime - this.lastHealthRecoveryTime > 500) { // Recover health every 0.5 seconds
            this.player.recoverHealth(2); // Recover 2 health points
            this.lastHealthRecoveryTime = currentTime;
        }

        // Update zoom based on player size
        this.updateZoom();

        // Update camera position to follow the player, but limit it to terrain boundaries
        const effectiveWidth = this.canvas.width / this.zoom;
        const effectiveHeight = this.canvas.height / this.zoom;
        this.cameraX = Math.max(0, Math.min(this.terrain.getWidth() - effectiveWidth, this.player.getX() - effectiveWidth / 2));
        this.cameraY = Math.max(0, Math.min(this.terrain.getHeight() - effectiveHeight, this.player.getY() - effectiveHeight / 2));

        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.terrain, this.canvas.width, this.canvas.height, this.cameraX, this.cameraY);
            
            // Check for collisions with player
            const dx = this.player.getX() - enemy.getX();
            const dy = this.player.getY() - enemy.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.player.getSize() + enemy.getSize()) / 2) {
                // Collision detected
                if (this.player.getSize() > enemy.getSize()) {
                    // Player wins
                    const scoreIncrease = Math.floor(enemy.getSize());
                    this.player.adjustScore(scoreIncrease);
                    console.log(`Player defeated enemy. Score increase: ${scoreIncrease}`); // Add this line for debugging
                    this.enemies.splice(index, 1);
                } else {
                    // Enemy wins
                    const damage = Math.floor(enemy.getSize() / 10); // Calculate damage based on enemy size
                    this.player.takeDamage(damage); // Use takeDamage instead of adjustHealth
                    
                    // Optional: Make the enemy bounce away after dealing damage
                    const bounceDistance = 20;
                    const bounceX = enemy.getX() + (dx / distance) * bounceDistance;
                    const bounceY = enemy.getY() + (dy / distance) * bounceDistance;
                    enemy.setPosition(bounceX, bounceY);
                }
            }
        });

        // Spawn new enemies if needed
        if (this.enemies.length < this.maxEnemies) {
            const enemiesToSpawn = Math.min(5, this.maxEnemies - this.enemies.length); // Increased from 3 to 5
            this.spawnEnemies(enemiesToSpawn);
        }

        // Update player's emote
        this.player.updateEmote(deltaTime);

        // Update enemies' emotes
        this.enemies.forEach(enemy => enemy.updateEmote(deltaTime));
    }

    private updateZoom() {
        const playerSize = this.player.getSize();
        const minPlayerSize = 20;
        const maxPlayerSize = 1000;
        
        // Calculate zoom factor based on player size using a logarithmic function
        const zoomFactor = Math.log(playerSize / minPlayerSize) / Math.log(maxPlayerSize / minPlayerSize);
        let newZoom = this.maxZoom * Math.pow(0.05, zoomFactor);
        
        // Apply the zoom cap
        newZoom = Math.max(this.zoomCap, newZoom);
        
        // Smooth transition to the new zoom level
        this.zoom = this.zoom * 0.9 + newZoom * 0.1;
        
        // Clamp zoom between minZoom and maxZoom
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    }

    private checkCollisions() {
        this.enemies.forEach((enemy, index) => {
            const dx = this.player.getX() - enemy.getX();
            const dy = this.player.getY() - enemy.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.player.getSize() + enemy.getSize()) / 2) {
                // Collision detected
                if (this.player.getSize() > enemy.getSize()) {
                    // Player wins
                    this.score += Math.floor(enemy.getSize());
                    this.enemies.splice(index, 1);
                } else {
                    // Enemy wins
                    this.player.adjustHealth(-10);
                }
            }
        });
    }

    private render() {
        // Clear the entire canvas
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();
        
        // Apply zoom and translation
        this.context.scale(this.zoom, this.zoom);
        
        // Adjust translation to keep player centered
        const centerX = this.canvas.width / (2 * this.zoom);
        const centerY = this.canvas.height / (2 * this.zoom);
        this.context.translate(centerX - this.player.getX(), centerY - this.player.getY());
        
        // Calculate visible area
        const visibleWidth = this.canvas.width / this.zoom;
        const visibleHeight = this.canvas.height / this.zoom;
        const startX = Math.floor((this.player.getX() - visibleWidth / 2) / 10);
        const startY = Math.floor((this.player.getY() - visibleHeight / 2) / 10);
        const endX = Math.ceil((this.player.getX() + visibleWidth / 2) / 10);
        const endY = Math.ceil((this.player.getY() + visibleHeight / 2) / 10);
        
        this.terrain.generateTerrain(this.context, startX, startY, endX, endY);
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            if (this.isEnemyVisible(enemy, visibleWidth, visibleHeight)) {
                enemy.draw(visibleWidth, visibleHeight);
            }
        });
        
        // Draw player
        this.player.draw(visibleWidth, visibleHeight);
        
        this.context.restore();

        // Comment out or remove this line if you're not using drawScore anymore
        // this.drawScore();

        if (this.shop.isShopOpen()) {
            this.shop.render(this.canvas.width, this.canvas.height);
        } else if (this.isEmoteWheelOpen) {
            this.renderEmoteWheel();
        }
    }

    private isEnemyVisible(enemy: Enemy, visibleWidth: number, visibleHeight: number): boolean {
        const enemyX = enemy.getX();
        const enemyY = enemy.getY();
        const playerX = this.player.getX();
        const playerY = this.player.getY();

        return (
            enemyX >= playerX - visibleWidth / 2 &&
            enemyX <= playerX + visibleWidth / 2 &&
            enemyY >= playerY - visibleHeight / 2 &&
            enemyY <= playerY + visibleHeight / 2
        );
    }

    private drawScore() {
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        // Remove the score display
        // this.context.fillText(`Score: ${this.player.getScore()}`, 10, 30);
        this.context.fillText(`Zoom: ${this.zoom.toFixed(2)}`, 10, 30);
    }

    private spawnEnemies(count: number) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.terrain.getWidth();
            const y = Math.random() * this.terrain.getHeight();
            const enemy = new Enemy(x, y, this.terrain.getWidth(), this.terrain.getHeight(), this.context, this.player, this.terrain); // Pass terrain here
            this.enemies.push(enemy);
        }
    }

    public toggleControls() {
        this.isMouseControl = !this.isMouseControl;
        if (this.isMouseControl) {
            this.keysPressed.clear();  // Clear any pressed keys when switching to mouse control
        }
    }

    private toggleEmoteWheel() {
        this.isEmoteWheelOpen = !this.isEmoteWheelOpen;
        if (!this.isEmoteWheelOpen) {
            this.selectedEmote = null;
        }
    }

    private getEmoteFromPosition(x: number, y: number): Emote | null {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.emoteWheelRadius) {
            const angle = Math.atan2(dy, dx);
            const index = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * Object.keys(Emote).length / 2);
            return index as Emote;
        }

        return null;
    }

    private renderEmoteWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const emoteCount = Object.keys(Emote).length / 2;
        const angleStep = (2 * Math.PI) / emoteCount;

        this.context.save();
        this.context.beginPath();
        this.context.arc(centerX, centerY, this.emoteWheelRadius, 0, 2 * Math.PI);
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fill();

        const ownedEmotes = this.player.getOwnedEmotes();
        for (let i = 0; i < ownedEmotes.length; i++) {
            const emote = ownedEmotes[i];
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * this.emoteWheelRadius * 0.8;
            const y = centerY + Math.sin(angle) * this.emoteWheelRadius * 0.8;

            this.context.font = '20px Arial';
            this.context.fillStyle = emote === this.selectedEmote ? 'yellow' : 'white';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(this.getEmoteText(emote), x, y);
        }

        this.context.restore();
    }

    private getEmoteText(emote: Emote): string {
        switch (emote) {
            case Emote.Happy: return '😊';
            case Emote.Sad: return '😢';
            case Emote.Angry: return '😠';
            case Emote.Surprised: return '😮';
            case Emote.Love: return '😍';
            case Emote.Cool: return '😎';
            case Emote.Thinking: return '🤔';
            case Emote.Laughing: return '😂';
            case Emote.Wink: return '😉';
            case Emote.Confused: return '😕';
            case Emote.Sleepy: return '😴';
            case Emote.Excited: return '🤩';
            case Emote.Nervous: return '😰';
            case Emote.Sick: return '🤢';
            case Emote.Rich: return '🤑';
            case Emote.Strong: return '💪';
            case Emote.Scared: return '😱';
            case Emote.Crazy: return '🤪';
            case Emote.Evil: return '😈';
            case Emote.Dead: return '💀';
            default: return '';
        }
    }
}