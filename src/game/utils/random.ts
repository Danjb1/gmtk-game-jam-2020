/**
 * Returns a random number
 *
 * @param {number} precision The precision to use when generating a random number. Higher number improves how precise this method is, but reduces performance
 */
export const gaussianRandom = (precision = 6): number => {
  let rand = 0;
  for (let i = 0; i < precision; i += 1) {
    rand += Math.random();
  }
  return rand / precision;
};

/**
 * Returns a random number between min and max using gaussian random
 *
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 */
export const boundedGaussianRandom = (min: number, max: number) => {
  return Math.floor(min + gaussianRandom() * (max - min + 1));
};

/**
 * Gets a random integer between 2 values (inclusive).
 */
export const intBetween = (min: number, max: number): number => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const randomSign = (): number => {
  return Math.random() < 0.5 ? -1 : 1;
};
