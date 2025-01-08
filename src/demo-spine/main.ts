import { Spine } from '@esotericsoftware/spine-pixi-v8';
import GUI from 'lil-gui';
import { Application, Assets, Container } from 'pixi.js';

const animations = {
    idle: 'dragon-idle',
    bubbles: 'dragon-bubbles',
    transition: 'dragon-transition',
};

const app = new Application();

const init = async () => {
    await app.init({
        resizeTo: window,
        background: '#1099bb',
    });
    document.getElementById('pixi-container')!.appendChild(app.canvas);

    // assets
    await Assets.load([
        {
            alias: 'modelSkeleton',
            src: `/assets/spines/dragon-skeleton.json`,
        },
        {
            alias: 'modelAtlas',
            src: `/assets/spines/dragon-skeleton.atlas`,
        },
    ]);

    const defalutScale = 0.25;
    const defalutAnimation = animations.idle;

    function spineRefresh(spine: Spine) {
        spine.pivot.set(0.5, 0.5);
        spine.position.set(0, spine.height / 2);
    }

    // spine
    const spine = Spine.from({
        skeleton: 'modelSkeleton',
        atlas: 'modelAtlas',
    });
    spine.scale.set(defalutScale);
    spine.state.setAnimation(0, defalutAnimation, true);
    spineRefresh(spine);

    // container
    const container = new Container();
    container.pivot.set(0.5, 0.5);
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    container.addChild(spine);
    app.stage.addChild(container);

    // lil-gui
    const gui = new GUI();
    const spineFolder = gui.addFolder('spine');
    spineFolder
        .add({ animation: animations.idle }, 'animation', Object.values(animations))
        .onChange((animation: string) => {
            spine.state.setAnimation(0, animation, true);
        });
    spineFolder.add({ scale: defalutScale }, 'scale', 0.1, 2, 0.01).onChange((value: number) => {
        spine.scale.set(value);
        spineRefresh(spine);
    });
};

init();
