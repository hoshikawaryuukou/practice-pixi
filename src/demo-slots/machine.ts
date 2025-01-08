import { Container, Texture } from 'pixi.js';
import { Reel } from './reel';
import { backout } from './util';

const SPIN_EXTRA_MIN = 0;
const SPIN_EXTRA_MAX = 3;
const SPIN_BASE_TIME = 2500;
const SPIN_TIME_INCREMENT = 600;

export class Machine extends Container {
    reels: Reel[] = [];
    running: boolean = false;

    constructor(
        slotTextures: Texture[],
        reelCount: number,
        symbolCount: number,
        reelWidth: number,
        symbolSize: number,
    ) {
        super();

        for (let i = 0; i < reelCount; i++) {
            const reel = new Reel(slotTextures, symbolCount, symbolSize);
            reel.x = i * reelWidth;
            this.addChild(reel);
            this.reels.push(reel);
        }
    }

    startPlay(reelsComplete: () => void): void {
        if (this.running) {
            return;
        }

        this.running = true;

        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * (SPIN_EXTRA_MAX - SPIN_EXTRA_MIN)) + SPIN_EXTRA_MIN;
            const target = r.y + 10 + i * 5 + extra;
            const time = SPIN_BASE_TIME + i * SPIN_TIME_INCREMENT + extra * SPIN_TIME_INCREMENT;

            r.tweenTo(target, time, backout(0.5), undefined, i === this.reels.length - 1 ? reelsComplete : undefined);
        }
    }

    update(slotTextures: Texture[], symbolSize: number): void {
        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            r.updateBlur();

            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;

                s.y = ((r.y + j) % r.symbols.length) * symbolSize - symbolSize;
                if (s.y < 0 && prevy > symbolSize) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(symbolSize / s.texture.width, symbolSize / s.texture.height);
                    s.x = Math.round((symbolSize - s.width) / 2);
                }
            }
        }

        this.reels.forEach((reel) => reel.updateTweens());
    }
}
