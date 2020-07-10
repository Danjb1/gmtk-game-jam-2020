import * as PIXI from 'pixi.js';

// Hello world
let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

// Create a Pixi Application
let app = new PIXI.Application({ width: 800, height: 600 });

// Add the canvas that Pixi automatically created for you to the HTML document
app.view.id = 'game-canvas';
document.body.appendChild(app.view);
