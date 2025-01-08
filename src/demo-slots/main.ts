import { Application, Assets, Texture } from 'pixi.js';
import { Machine } from './machine';
import { UIContainer } from './ui';

const REEL_COUNT = 5;
const SYMBOL_COUNT = 4;
const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

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

    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

    const machine = new Machine(slotTextures, REEL_COUNT, SYMBOL_COUNT, REEL_WIDTH, SYMBOL_SIZE);
    machine.y = margin;
    machine.x = Math.round((app.screen.width - REEL_WIDTH * REEL_COUNT) / 2);
    app.stage.addChild(machine);

    const uiContainer = new UIContainer(app.screen.width, app.screen.height, margin, startPlay);
    app.stage.addChild(uiContainer);

    function startPlay(): void {
        machine.startPlay(() => {
            machine.running = false;
        });
    }

    app.ticker.add(() => {
        machine.update(slotTextures, SYMBOL_SIZE);
    });
})();
