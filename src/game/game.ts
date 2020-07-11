import { Viewport } from 'pixi-viewport';

import { Assets } from './assets';
import { Entity } from './entity';
import { SpriteComponent, HitboxComponent } from './components';

export class Game {

  /*
   * Size of the game world.
   *
   * Entities positioned should be defined in "world units" instead of pixels.
   * The viewport will adjust the display accordingly.
   */
  public static readonly WORLD_WIDTH = 800;
  public static readonly WORLD_HEIGHT = 600;

  private viewport: Viewport;
  private entities: Entity[] = [];

  constructor(private app: PIXI.Application) {}

  /**
   * Initialises the game.
   *
   * @param callbackFn Function to call when the game is loaded.
   */
  load(callbackFn: any): void {
    Assets.loadTextures(this.app.loader, () => {
      this.setup();
      callbackFn();
    });
  }

  /**
   * Called when our Textures have finished loading.
   */
  setup(): void {
    this.initViewport();
    this.initEntities();
  }

  /**
   * Creates the Viewport.
   */
  initViewport(): void {
    this.viewport = new Viewport({
      worldWidth: Game.WORLD_WIDTH,
      worldHeight: Game.WORLD_HEIGHT
    }).fit();
    this.app.stage.addChild(this.viewport);
  }

  /**
   * Creates our initial Entities.
   */
  initEntities(): void {
    const player = new Entity()
        .attach(new HitboxComponent(64, 64, 100, 100))
        .attach(new SpriteComponent('player.png', this.viewport));
    this.addEntity(player);
  }

  /**
   * Adds an Entity to the world.
   */
  addEntity(e: Entity): void {
    e.spawn();
    this.entities.push(e);
  }

  /**
   * Updates the game by one frame.
   *
   * @param delta Amount of fractional lag between frames:
   *
   *  1 = frame is exactly on time
   *  2 = frame has taken twice as long as expected
   */
  update(delta: number): void {

    // Update our Entities.
    // We make a copy of the array in case the list is changed during iteration.
    [...this.entities].forEach(e => {
      e.update(delta);
    });

    // Destroy deleted Entities
    this.entities
        .filter(e => e.deleted)
        .forEach(e => e.destroy());

    // Remove deleted Entities
    this.entities = this.entities.filter(e => !e.deleted);
  }

}
