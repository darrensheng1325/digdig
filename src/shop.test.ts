import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Shop } from './shop';
import { Player, Emote } from './player';

describe('Shop', () => {
    let shop: Shop;
    let mockPlayer: Player;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        mockPlayer = {
            getOwnedEmotes: jest.fn(() => [Emote.Happy, Emote.Sad]),
            getGoldScore: jest.fn(() => 1000),
            buyEmote: jest.fn(() => true),
        } as unknown as Player;

        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            font: '',
            textAlign: '',
        } as unknown as CanvasRenderingContext2D;

        shop = new Shop(mockPlayer, mockContext);
    });

    test('toggleShop changes isOpen state', () => {
        expect(shop.isShopOpen()).toBe(false);
        shop.toggleShop();
        expect(shop.isShopOpen()).toBe(true);
        shop.toggleShop();
        expect(shop.isShopOpen()).toBe(false);
    });

    test('render method calls context methods when shop is open', () => {
        shop.toggleShop();
        shop.render(800, 600);
        expect(mockContext.fillRect).toHaveBeenCalled();
        expect(mockContext.fillText).toHaveBeenCalled();
    });

    test('handleClick buys emote when clicking on available emote', () => {
        shop.toggleShop();
        // Mock the getRandomEmotes method to return a known emote
        jest.spyOn(shop as any, 'getRandomEmotes').mockReturnValue([Emote.Cool]);
        shop.handleClick(150, 240, 800, 600); // Adjust these coordinates to hit an emote
        expect(mockPlayer.buyEmote).toHaveBeenCalledWith(Emote.Cool);
    });
});