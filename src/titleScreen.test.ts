import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { TitleScreen } from './titleScreen';

describe('TitleScreen', () => {
    let titleScreen: TitleScreen;
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;
    let mockOnStart: jest.Mock;

    beforeEach(() => {
        mockCanvas = {
            width: 800,
            height: 600,
            getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 })),
        } as unknown as HTMLCanvasElement;

        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            font: '',
            textAlign: '',
            save: jest.fn(),
            restore: jest.fn(),
            setTransform: jest.fn(),
            beginPath: jest.fn(),
            arc: jest.fn(),
            stroke: jest.fn(),
            moveTo: jest.fn(),
            quadraticCurveTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
        } as unknown as CanvasRenderingContext2D;

        mockOnStart = jest.fn();

        titleScreen = new TitleScreen(mockCanvas, mockContext, mockOnStart);
    });

    test('show method sets up event listeners', () => {
        const spySetupEventListeners = jest.spyOn(titleScreen as any, 'setupEventListeners');
        titleScreen.show();
        expect(spySetupEventListeners).toHaveBeenCalled();
    });

    test('handleClick calls onStart when clicking start button', () => {
        const event = {
            clientX: 400, // Center of canvas
            clientY: 350, // Roughly where the start button should be
        } as MouseEvent;

        (titleScreen as any).handleClick(event);
        expect(mockOnStart).toHaveBeenCalled();
    });
});