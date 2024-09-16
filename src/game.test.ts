import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Game } from './game';

// Mock context first
const mockContext = {
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
} as unknown as CanvasRenderingContext2D;

// Then use mockContext in mockCanvas
const mockCanvas = {
    width: 800,
    height: 600,
    getContext: jest.fn().mockReturnValue(mockContext),
} as unknown as HTMLCanvasElement;

jest.mock('./player', () => ({
    Player: jest.fn().mockImplementation(() => ({
        update: jest.fn(),
        draw: jest.fn(),
        getX: jest.fn(() => 400),
        getY: jest.fn(() => 300),
        getSize: jest.fn(() => 20),
    })),
}));

jest.mock('./terrain', () => ({
    Terrain: jest.fn().mockImplementation(() => ({
        generateTerrain: jest.fn(),
        getWidth: jest.fn(() => 10000),
        getHeight: jest.fn(() => 10000),
    })),
}));

describe('Game', () => {
    let game: Game;

    beforeEach(() => {
        // Use type assertion to avoid TypeScript error
        (document.getElementById as jest.Mock) = jest.fn().mockReturnValue(mockCanvas);
        game = new Game('gameCanvas');
    });

    test('constructor initializes game correctly', () => {
        expect(game).toBeDefined();
    });

    test('resizeCanvas updates canvas dimensions', () => {
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        
        Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
        
        game.resizeCanvas();
        
        expect(mockCanvas.width).toBe(1000);
        expect(mockCanvas.height).toBe(800);
        
        Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: originalHeight, configurable: true });
    });

    test('toggleControls switches between mouse and keyboard controls', () => {
        const initialControlState = (game as any).isMouseControl;
        game.toggleControls();
        expect((game as any).isMouseControl).toBe(!initialControlState);
    });
});