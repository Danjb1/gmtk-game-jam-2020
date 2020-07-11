
/**
 * @description
 * Easing function: https://easings.net/#easeOutSine
 * 
 * @param x number between 1 and 0 to transform
 */
export const easeOutSine = (x: number): number => Math.sin((x * Math.PI) / 2);

export const easeInBounce = (x: number): number => 1 - easeOutBounce(1 - x);

export const easeOutBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}