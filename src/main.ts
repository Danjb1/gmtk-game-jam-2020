import * as PIXI from 'pixi.js';

import { Game } from './game/game';

/**
 * Entry point for the application.
 */
(() => {

  // Create canvas
  const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas';
  PIXI.utils.sayHello(type);

  // Create a Pixi Application
  let app = new PIXI.Application({ width: 800, height: 600 });

  // Add Pixi canvas to the DOM
  app.view.id = 'game-canvas';
  document.body.appendChild(app.view);

  // Load the Game
  const game = new Game(app);
  game.load(() => {
    // Start the game loop
    app.ticker.add(delta => game.update());
  });

})();
