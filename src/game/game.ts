// Libs
import * as createjs from 'createjs-module';
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
  SpawnerComponent,
  JailerComponent
} from './components';

// Factories
import { createCat } from './factory/cat.factory';
import { getHitboxFrom } from './utils';

import { GameState } from './store';

export class Game implements EntityContext {

  /*
   * Size of the game world.
   *
   * Entities positioned should be defined in "world units" instead of pixels.
   * The viewport will adjust the display accordingly.
   */
  public static readonly WORLD_WIDTH = 640;
  public static readonly WORLD_HEIGHT = 480;

  private viewport: Viewport;
  private entities: Entity[] = [];
  private input: Input = new Input();
  private count: number = 1;

  state: GameState = new GameState();

  constructor(private app: PIXI.Application) { }

  /**
   * Initialises the game.
   *
   * @param callbackFn Function to call when the game is loaded.
   */
  public load(callbackFn: any): void {

    // Load textures
    const p1 = new Promise<void>((resolve, reject) => {
      Assets.loadTextures(this.app.loader, () => {
        resolve();
      });
    });

    // Load sounds
    const p2 = new Promise<void>((resolve, reject) => {
      Assets.loadSounds(() => {
        resolve();
      });
    });

    // Wait for everything to complete
    Promise.all([p1, p2]).then(() => {
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
      .attach(new HitboxComponent(128, 128, 32, 32,
        { tags: ['player'] }))
      .attach(new SpriteComponent('player.png'))
      .attach(new ControllerComponent(this.input, 350))
      .attach(new ScarerComponent()));
      

    // Cat Spawner
    this.addEntity(new Entity()
      .attach(new HitboxComponent(0, 0, 100, 100))
      .attach(new SpawnerComponent({
        attemptsPerInterval: 2,
        chanceToSpawn: 0.5,
        createFn: createCat,
        interval: 1000,
        maxChildren: 50
      })));

    // Pen
    this.addEntity(new Entity()
      .attach(new HitboxComponent(
        (Game.WORLD_WIDTH / 2) - 50,
        (Game.WORLD_HEIGHT) - 100,
        100, 100,
        { blocks: ['player'] }
      ))
      .attach(new SpriteComponent('player.png'))
      .attach(new JailerComponent()));
  }

  /**
   * Adds an Entity to the world.
   */
  public addEntity(e: Entity): void {
    e.spawn(this);
    e.entityId = this.count;
    this.count++;
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

    if (this.isGameOver()) {
      return;
    }

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

    // Update our Entities again!
    [...this.entities].forEach(e => {
      e.lateUpdate(this.app.ticker.deltaMS);
    });
  }

  private isGameOver(): boolean {
    return this.state.lives <= 0;
  }

  private detectCollisions(): void {

    const collidingEntities = [...this.entities];

    // Check for collisions between every pair of Entities
    for (let i = 0; i < collidingEntities.length; i++) {

      const e1: Entity = collidingEntities[i];

      if (e1.deleted) {
        continue;
      }

      for (let j = i + 1; j < collidingEntities.length; j++) {

        const e2 = collidingEntities[j];

        if (e2.deleted) {
          continue;
        }

        const e1Hitbox = getHitboxFrom(e1);
        const e2Hitbox = getHitboxFrom(e2);

        if (e1Hitbox.intersects(e2Hitbox)) {
          e1Hitbox.collidedWith(e2Hitbox);
          e2Hitbox.collidedWith(e1Hitbox);
        }
      }
    }
  }

  public getViewport(): Viewport {
    return this.viewport;
  }

  public getState(): GameState {
    return this.state;
  }

}
