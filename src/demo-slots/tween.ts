import { lerp } from './util';

export interface Tween {
    object: any;
    property: string;
    propertyBeginValue: number;
    target: number;
    easing: (t: number) => number;
    time: number;
    change?: (t: Tween) => void;
    complete?: (t: Tween) => void;
    start: number;
}

const tweening: Tween[] = [];

export function tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    change?: (t: Tween) => void,
    complete?: (t: Tween) => void,
): Tween {
    const tween: Tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change,
        complete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

export function updateTweens(): void {
    const now = Date.now();
    const remove: Tween[] = [];

    for (const t of tweening) {
        const phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        t.change?.(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            t.complete?.(t);
            remove.push(t);
        }
    }

    for (const t of remove) {
        tweening.splice(tweening.indexOf(t), 1);
    }
}
