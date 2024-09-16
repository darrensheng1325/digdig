import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Enemy } from './enemy';
import { Player } from './player';
import { Terrain } from './terrain';

// Mock CanvasRenderingContext2D
const mockContext = {
    save: jest.fn(),
    restore: jest.fn(),
    setTransform: jest.fn(),
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillRect: jest.fn(),
    closePath: jest.fn(),
} as unknown as CanvasRenderingContext2D;

// Mock Player
const mockPlayer = {
    getX: jest.fn(() => 500),
    getY: jest.fn(() => 500),
} as unknown as Player;

// Mock Terrain
const mockTerrain = {
    getWidth: jest.fn(() => 1000),
    getHeight: jest.fn(() => 1000),
    removeBlock: jest.fn(),
    getBlock: jest.fn(),
} as unknown as Terrain;

describe('Enemy', () => {
    let enemy: Enemy;

    beforeEach(() => {
        enemy = new Enemy(100, 100, 1000, 1000, mockContext, mockPlayer, mockTerrain);
    });

    test('constructor initializes enemy correctly', () => {
        expect(enemy.getX()).toBe(100);
        expect(enemy.getY()).toBe(100);
    });

    test('getSpeed returns 20% of player speed', () => {
        const playerSpeed = 5;
        jest.spyOn(Player.prototype, 'getSpeed').mockReturnValue(playerSpeed);
        expect(enemy.getSpeed()).toBe(playerSpeed * 0.2);
    });

    test('update moves enemy towards player when on screen', () => {
        const initialX = enemy.getX();
        const initialY = enemy.getY();
        enemy.update(mockTerrain, 1000, 1000, 0, 0);
        expect(enemy.getX()).not.toBe(initialX);
        expect(enemy.getY()).not.toBe(initialY);
    });

    test('handleDugBlock adjusts enemy properties based on block type', () => {
        const initialHealth = enemy.getHealth();
        const initialShield = enemy.getShield();
        const initialGoldScore = enemy.getGoldScore();

        enemy.handleDugBlock({ type: 'uranium', present: true });
        expect(enemy.getHealth()).toBe(initialHealth - 5);

        enemy.handleDugBlock({ type: 'quartz', present: true });
        expect(enemy.getShield()).toBe(initialShield + 10);

        enemy.handleDugBlock({ type: 'gold_ore', present: true });
        expect(enemy.getGoldScore()).toBe(initialGoldScore + 1);
    });
});