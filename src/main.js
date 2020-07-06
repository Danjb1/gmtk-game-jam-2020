import { Game } from './game.js';

/**
 * Game loop, based on:
 * https://developer.mozilla.org/en-US/docs/Games/Anatomy
 */
;(function () {

  let game;
  let prevTimestamp = 0;

  /**
   * Performs any one-off initialisation.
   */
  const init = () => {
    game = new Game();
  };

  /**
   * Simulates one frame.
   */
  const tick = (timestamp) => {
    window.requestAnimationFrame(tick);
    game.update(timestamp - prevTimestamp);
    prevTimestamp = timestamp;
  };

  init();
  tick(0); // Start the cycle
})();
