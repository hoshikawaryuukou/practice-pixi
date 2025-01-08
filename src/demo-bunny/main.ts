import GUI from 'lil-gui';
import { Application, Assets, Sprite } from 'pixi.js';

(async () => {
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.getElementById('pixi-container')!.appendChild(app.canvas);

    const texture = await Assets.load('/assets/bunny.png');
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.on('pointerdown', () => {
        alert('clicked!');
    });
    bunny.eventMode = 'static';

    const gui = new GUI();
    const bunnyFolder = gui.addFolder('Bunny');
    bunnyFolder.add(bunny.anchor, 'x', 0, 1).name('Anchor X');
    bunnyFolder.add(bunny.anchor, 'y', 0, 1).name('Anchor Y');
    bunnyFolder.open();

    bunny.position.set(app.screen.width / 2, app.screen.height / 2);

    app.stage.addChild(bunny);
    app.ticker.add((time) => {
        bunny.rotation += 0.1 * time.deltaTime;
    });
})();
