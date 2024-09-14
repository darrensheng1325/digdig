export class Player {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    public dig(context: CanvasRenderingContext2D) {
        context.clearRect(this.x - 5, this.y - 5, 10, 10);
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, 10, 0, Math.PI * 2);
        context.fill();
    }
}