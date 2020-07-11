// Pixi
import { Viewport } from 'pixi-viewport';

// Global Stuff
import { Input } from './input';
import { EntityContext } from './entity-context';

// Assets
import { Assets } from './assets';

// Entities
import { Entity } from './entity';

// Components
import {
  SpriteComponent,
  HitboxComponent,
  ControllerComponent,
  ScarerComponent,
  SpawnerComponent
} from './components';
import { createCat } from './factory/cat.factory';

export class Game implements EntityContext {

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
      // These should match the internal canvas size
      // (the dimensions we used to initialise Pixi)
      screenWidth: 800,
      screenHeight: 600,
      worldWidth: Game.WORLD_WIDTH,
      worldHeight: Game.WORLD_HEIGHT
    }).fit();
    this.app.stage.addChild(this.viewport);
  }

  /**
   * Creates our initial Entities.
   */
  private initEntities(): void {

    // Player
    this.addEntity(new Entity()
      .attach(new HitboxComponent(64, 64, 32, 32))
      .attach(new SpriteComponent('player.png'))
      .attach(new ControllerComponent(this.input, 300))
      .attach(new ScarerComponent()));

    // Cat Spawner
    this.addEntity(new Entity()
      .attach(new HitboxComponent(0, 0, 100, 100))
      .attach(new SpawnerComponent({
        attemptsPerInterval: 1,
        chanceToSpawn: 0.5,
        createFn: createCat,
        interval: 1000,
        maxChildren: 15
      })));
  }

  /**
   * Adds an Entity to the world.
   */
  public addEntity(e: Entity): void {
    e.spawn(this);
    this.entities.push(e);
  }

  /**
   * Gets all Entities in the world.
   */
  public getEntities(): Entity[] {
    return this.entities;
  }

  /**
   * Updates the game by one frame.
   *
   * The precise amount of time that has passed can be obtained from
   * `app.ticker`.
   */
  public update(): void {

    // Update our Entities.
    // We make a copy of the array in case the list is changed during iteration.
    [...this.entities].forEach(e => {
      e.update(this.app.ticker.deltaMS);
    });

    // Destroy deleted Entities
    this.entities
        .filter(e => e.deleted)
        .forEach(e => e.destroy());

    // Remove deleted Entities
    this.entities = this.entities.filter(e => !e.deleted);

    this.detectCollisions();
  }

  private detectCollisions(): void {
    [...this.entities].forEach(e => {
      const eHitBox = <HitboxComponent>e.getComponent(HitboxComponent.KEY);
      [...this.entities].forEach(eOther => {
        const eOtherHitBox = <HitboxComponent>eOther.getComponent(HitboxComponent.KEY);
        if (eHitBox !== eOtherHitBox) {
          if (eHitBox.intersects(eOtherHitBox)) {
            eHitBox.collidedWith(eOtherHitBox);
          }
        }
      });
    });
  }

  public getViewport(): Viewport {
    return this.viewport;
  }

}
