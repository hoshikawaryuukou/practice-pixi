export function lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
}

export function backout(amount: number): (t: number) => number {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}
