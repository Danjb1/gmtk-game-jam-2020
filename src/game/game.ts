// Pixi
import { Viewport } from 'pixi-viewport';

// Player Input
import { Input } from './input';

// Assets
import { Assets } from './assets';

// Entities
import { Entity } from './entity';

// Components
import {
  SpriteComponent,
  HitboxComponent,
  ControllerComponent
} from './components';
import { WanderComponent } from './components/wander.component';

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
  private input: Input = new Input();

  constructor(private app: PIXI.Application) {}

  /**
   * Initialises the game.
   *
   * @param callbackFn Function to call when the game is loaded.
   */
  public load(callbackFn: any): void {
    Assets.loadTextures(this.app.loader, () => {
      this.setup();
      callbackFn();
    });
  }

  /**
   * Called when our Textures have finished loading.
   */
  private setup(): void {
    this.initViewport();
    this.initEntities();
  }

  /**
   * Creates the Viewport.
   */
  private initViewport(): void {
    this.viewport = new Viewport({
      worldWidth: Game.WORLD_WIDTH,
      worldHeight: Game.WORLD_HEIGHT
    }).fit();
    this.app.stage.addChild(this.viewport);
  }

  /**
   * Creates our initial Entities.
   */
  private initEntities(): void {
    const player = new Entity()
        .attach(new HitboxComponent(64, 64, 100, 100))
        .attach(new SpriteComponent('player.png', this.viewport))
        .attach(new ControllerComponent(this.input, 1.5));
    this.addEntity(player);
  }

  /**
   * Adds an Entity to the world.
   */
  public addEntity(e: Entity): void {
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
  public update(delta: number): void {

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
