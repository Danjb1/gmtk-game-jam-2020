import * as PIXI from 'pixi.js';

import { Game } from './game/game';
import { PickupComponent } from './ui/pickup.component';

/**
 * Entry point for the application.
 */
(() => {

  // Create canvas
  const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas';
  PIXI.utils.sayHello(type);

  // Create a Pixi Application
  let app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x0c8b30
  });

  // Add Pixi canvas to the DOM
  app.view.id = 'game-canvas';
  document.body.appendChild(app.view);

  // Load the Game
  const game = new Game(app);

  // Load the pickup bar
  let pickup = new PickupComponent(game);
  let div = document.getElementById('ui');
  div.appendChild(pickup.create());

  game.load(() => {
    app.ticker.add(delta => pickup.update())

    // Start the game loop
    app.ticker.add(delta => game.update());
  });
})();
