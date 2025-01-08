import { BlurFilter, Container, Sprite, Texture } from 'pixi.js';
import { lerp } from './util';

export interface ReelTween {
    object: Reel;
    propertyBeginValue: number;
    target: number;
    easing: (t: number) => number;
    time: number;
    start: number;
    change?: (t: ReelTween) => void;
    complete?: (t: ReelTween) => void;
}

export class Reel extends Container {
    symbols: Sprite[];
    previousY: number;
    blur: BlurFilter;
    tweens: ReelTween[] = [];

    constructor(slotTextures: Texture[], symbolCount: number, symbolSize: number) {
        super();

        this.position._x = 0;
        this.position._y = 0;

        this.symbols = [];
        this.previousY = 0;
        this.blur = new BlurFilter();
        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.filters = [this.blur];

        for (let j = 0; j < symbolCount; j++) {
            const symbol = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * symbolSize;
            symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.width, symbolSize / symbol.height);
            symbol.x = Math.round((symbolSize - symbol.width) / 2);
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    tweenTo(
        target: number,
        time: number,
        easing: (t: number) => number,
        change?: (t: ReelTween) => void,
        complete?: (t: ReelTween) => void,
    ): ReelTween {
        const tween: ReelTween = {
            object: this,
            propertyBeginValue: this.position._y,
            target,
            easing,
            time,
            change,
            complete,
            start: Date.now(),
        };

        this.tweens.push(tween);
        return tween;
    }

    updateTweens(): void {
        const now = Date.now();
        const remove: ReelTween[] = [];

        for (const t of this.tweens) {
            const phase = Math.min(1, (now - t.start) / t.time);
            this.position._y = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            t.change?.(t);
            if (phase === 1) {
                this.position._y = t.target;
                t.complete?.(t);
                remove.push(t);
            }
        }

        for (const t of remove) {
            this.tweens.splice(this.tweens.indexOf(t), 1);
        }
    }

    updateBlur(): void {
        this.blur.blurY = (this.position._y - this.previousY) * 8;
        this.previousY = this.position._y;
    }
}
