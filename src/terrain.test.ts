import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Terrain, BlockType } from './terrain';

describe('Terrain', () => {
    let terrain: Terrain;

    beforeEach(() => {
        terrain = new Terrain(1000, 1000);
    });

    test('constructor initializes terrain correctly', () => {
        expect(terrain.getWidth()).toBe(1000);
        expect(terrain.getHeight()).toBe(1000);
    });

    test('removeBlock removes a block and returns it', () => {
        const block = terrain.removeBlock(50, 50);
        expect(block).toBeDefined();
        expect(block?.present).toBe(false);
    });

    test('getBlock returns a block at given coordinates', () => {
        const block = terrain.getBlock(50, 50);
        expect(block).toBeDefined();
        expect(block?.type).toBeDefined();
        expect(block?.present).toBeDefined();
    });

    test('generateTerrain creates terrain within given bounds', () => {
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
        } as unknown as CanvasRenderingContext2D;

        terrain.generateTerrain(mockContext, 0, 0, 10, 10);
        expect(mockContext.fillRect).toHaveBeenCalled();
    });
});