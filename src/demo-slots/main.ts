import { Application, Assets, Container, Texture } from 'pixi.js';
import { createReels, Reel } from './reel';
import { tweenTo, updateTweens } from './tween';
import { UIContainer } from './ui';
import { backout } from './util';

const REEL_COUNT = 5;
const SYMBOL_COUNT = 4;
const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
const SPIN_EXTRA_MIN = 0;
const SPIN_EXTRA_MAX = 3;
const SPIN_BASE_TIME = 2500;
const SPIN_TIME_INCREMENT = 600;

const ASSET_URLS = {
    eggHead: 'https://pixijs.com/assets/eggHead.png',
    flowerTop: 'https://pixijs.com/assets/flowerTop.png',
    helmlok: 'https://pixijs.com/assets/helmlok.png',
    skully: 'https://pixijs.com/assets/skully.png',
};

(async () => {
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.getElementById('pixi-container')!.appendChild(app.canvas);

    await Assets.load(Object.values(ASSET_URLS));
    const slotTextures = [
        Texture.from(ASSET_URLS.eggHead),
        Texture.from(ASSET_URLS.flowerTop),
        Texture.from(ASSET_URLS.helmlok),
        Texture.from(ASSET_URLS.skully),
    ];

    // Build the reels
    const reels: Reel[] = createReels(slotTextures, REEL_COUNT, SYMBOL_COUNT, REEL_WIDTH, SYMBOL_SIZE);
    const reelContainer = new Container();
    reels.forEach((reel) => reelContainer.addChild(reel.container));
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round((app.screen.width - REEL_WIDTH * REEL_COUNT) / 2);

    // Create UI
    const uiContainer = new UIContainer(app.screen.width, app.screen.height, margin, startPlay);
    app.stage.addChild(uiContainer);

    let running: boolean = false;

    function startPlay(): void {
        if (running) {
            return;
        }
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * (SPIN_EXTRA_MAX - SPIN_EXTRA_MIN)) + SPIN_EXTRA_MIN;
            const target = r.position + 10 + i * 5 + extra;
            const time = SPIN_BASE_TIME + i * SPIN_TIME_INCREMENT + extra * SPIN_TIME_INCREMENT;

            tweenTo(
                r,
                'position',
                target,
                time,
                backout(0.5),
                undefined,
                i === reels.length - 1 ? reelsComplete : undefined,
            );
        }
    }

    // Reels done handler.
    function reelsComplete(): void {
        running = false;
    }

    // Listen for animate update.
    app.ticker.add(() => {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.

            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;

                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }

        // Update tweens.
        updateTweens();
    });
})();
