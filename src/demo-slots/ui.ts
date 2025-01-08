import { Color, Container, FillGradient, Graphics, Text, TextStyle } from 'pixi.js';

export class UIContainer extends Container {
    constructor(screenWidth: number, screenHeight: number, margin: number, playClickCallback: () => void) {
        super();

        const top = new Graphics().rect(0, 0, screenWidth, margin).fill({ color: 0x0 });
        const bottom = new Graphics().rect(0, screenHeight - margin, screenWidth, margin).fill({ color: 0x0 });

        // Create gradient fill
        const fill = new FillGradient(0, 0, 0, 36 * 1.7);
        const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());
        colors.forEach((number, index) => {
            const ratio = index / colors.length;
            fill.addColorStop(ratio, number);
        });

        // Add play text
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: { fill },
            stroke: { color: 0x4a1850, width: 5 },
            dropShadow: {
                color: 0x000000,
                angle: Math.PI / 6,
                blur: 4,
                distance: 6,
            },
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const playText = new Text({ text: 'Spin the wheels!', style });
        playText.x = Math.round((bottom.width - playText.width) / 2);
        playText.y = screenHeight - margin + Math.round((margin - playText.height) / 2);
        bottom.addChild(playText);

        const headerText = new Text({ text: 'PIXI MONSTER SLOTS!', style });
        headerText.x = Math.round((top.width - headerText.width) / 2);
        headerText.y = Math.round((margin - headerText.height) / 2);
        top.addChild(headerText);

        this.addChild(top);
        this.addChild(bottom);

        // Set the interactivity.
        bottom.eventMode = 'static';
        bottom.cursor = 'pointer';
        bottom.addListener('pointerdown', playClickCallback);
    }
}
