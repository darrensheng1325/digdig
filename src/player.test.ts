import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Player, Emote } from './player';
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

// Mock Terrain
const mockTerrain = {
    getWidth: jest.fn(() => 1000),
    getHeight: jest.fn(() => 1000),
    removeBlock: jest.fn(),
} as unknown as Terrain;

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        // Initialize a new player before each test
        player = new Player(100, 100, 100, 10, mockContext, mockTerrain);
        
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
            writable: true
        });
    });

    test('constructor initializes player correctly', () => {
        expect(player.getX()).toBe(100);
        expect(player.getY()).toBe(100);
        expect(player.getHealth()).toBe(100);
        expect(player.getShield()).toBe(0);
    });

    test('move updates player position', () => {
        player.move(1, 1);
        expect(player.getX()).toBeGreaterThan(100);
        expect(player.getY()).toBeGreaterThan(100);
    });

    test('adjustHealth increases health', () => {
        player.adjustHealth(10);
        expect(player.getHealth()).toBe(100); // Health is capped at 100
    });

    test('takeDamage reduces health', () => {
        player.takeDamage(20);
        expect(player.getHealth()).toBe(80);
    });

    test('adjustShield increases shield', () => {
        player.adjustShield(50);
        expect(player.getShield()).toBe(50);
    });

    test('adjustScore increases score', () => {
        const initialScore = player.getScore();
        player.adjustScore(10);
        expect(player.getScore()).toBe(initialScore + 10);
    });

    test('adjustGoldScore increases gold score', () => {
        const initialGoldScore = player.getGoldScore();
        player.adjustGoldScore(5);
        expect(player.getGoldScore()).toBe(initialGoldScore + 5);
    });

    test('displayEmote sets current emote', () => {
        player.displayEmote(Emote.Happy);
        // You might need to expose currentEmote for testing, or test indirectly
    });

    test('buyEmote adds new emote if player has enough gold', () => {
        player.adjustGoldScore(300);
        expect(player.buyEmote(Emote.Cool)).toBe(true);
        expect(player.hasEmote(Emote.Cool)).toBe(true);
    });

    // Add more tests as needed
});