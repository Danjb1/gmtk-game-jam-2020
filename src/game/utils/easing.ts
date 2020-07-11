
/**
 * @description
 * Easing function: https://easings.net/#easeOutSine
 *
 * @param x number between 1 and 0 to transform
 */
export const easeOutSine = (x: number): number => Math.sin((x * Math.PI) / 2);
