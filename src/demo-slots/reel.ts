import { BlurFilter, Container, Sprite, Texture } from 'pixi.js';

export class Reel {
    container: Container;
    symbols: Sprite[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;

    constructor(slotTextures: Texture[], symbolCount: number, symbolSize: number) {
        this.container = new Container();
        this.symbols = [];
        this.position = 0;
        this.previousPosition = 0;
        this.blur = new BlurFilter();
        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.container.filters = [this.blur];

        for (let j = 0; j < symbolCount; j++) {
            const symbol = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * symbolSize;
            symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.width, symbolSize / symbol.height);
            symbol.x = Math.round((symbolSize - symbol.width) / 2);
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }
}

export function createReels(
    slotTextures: Texture[],
    reelCount: number,
    symbolCount: number,
    reelWidth: number,
    symbolSize: number,
): Reel[] {
    const reels: Reel[] = [];
    const reelContainer = new Container();

    for (let i = 0; i < reelCount; i++) {
        const reel = new Reel(slotTextures, symbolCount, symbolSize);
        reel.container.x = i * reelWidth;
        reelContainer.addChild(reel.container);
        reels.push(reel);
    }

    return reels;
}
