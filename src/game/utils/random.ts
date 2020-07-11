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