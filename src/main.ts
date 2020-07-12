import * as PIXI from 'pixi.js';

import { Game } from './game/game';
import { Hud } from './ui/hud';
import { SplashScreenElement } from './ui/elements';

import { Input } from './game/input';

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
  document.getElementById('game-container').appendChild(app.view);

  // Load the Game
  const game = new Game(app);

  // Load the HUD
  const hud = new Hud(game);

  const splash = new SplashScreenElement();
  splash.create();

  // Call after loaded
  const checkStartGameCheckLoop = () => {
    // Check if space is pressed
    if (Input.instance.isPressed(Input.SPACE)) {
      splash.remove();
      // Start the game loop    
      app.ticker.add(delta => {
        hud.update();
        game.state.startGame();
        game.update();
      });
      return;
    }

    requestAnimationFrame(() => {
      checkStartGameCheckLoop();
    })
  }

  game.load(() => {
    requestAnimationFrame(()=>{
      splash.mount(document.getElementById('container'));
    })
    checkStartGameCheckLoop()
  });
})();
