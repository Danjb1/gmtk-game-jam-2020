// Libs
import * as createjs from 'createjs-module';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

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
  AnimatedSpriteComponent,
  HitboxComponent,
  ControllerComponent,
  ScarerComponent,
  SpawnerComponent,
  JailerComponent,
  WanderComponent,
  RescuerComponent,
  DifficultyCurveComponent,
  CatMetaComponent,
  WoofComponent,
  WhistlerComponent,
  WhistleListenerComponent
} from './components';

// Factories
import { CatFactory } from './factory/cat.factory';
import { getHitboxFrom } from './utils';

import { GameState } from './store';

import cfg from './config.json';

export class Game implements EntityContext {

  /*
   * Size of the game world.
   *
   * Entities positioned should be defined in "world units" instead of pixels.
   * The viewport will adjust the display accordingly.
   */
  public static readonly WORLD_WIDTH = 640;
  public static readonly WORLD_HEIGHT = 480;
  public static readonly CANVAS_WIDTH = 800;
  public static readonly CANVAS_HEIGHT = 600;

  private viewport: Viewport;
  private entities: Entity[] = [];
  private input: Input = Input.instance;
  private count: number = 1;
  private catFactory: CatFactory;
  private restartPixiText: PIXI.Text;
  private gameStarted: boolean = false;

  state: GameState = new GameState(cfg.player.lives);

  constructor(private app: PIXI.Application) {
    this.restartPixiText = new PIXI.Text(`Press SPACE to RESTART`, { fontFamily: 'Do Hyeon', fontSize: 24, fill: 0x8B4513, align: 'center' });
    this.restartPixiText.position.set((Game.CANVAS_WIDTH - this.restartPixiText.width) / 2, (Game.CANVAS_HEIGHT - this.restartPixiText.height) / 2);
  }

  /**
   * Initialises the game.
   *
   * @param callbackFn Function to call when the game is loaded.
   */
  public load(callbackFn: any): void {

    this.app.stage.sortableChildren = true;

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
    this.catFactory = new CatFactory(cfg.catBehavior);
    CatMetaComponent.configure(cfg.catMetadata);
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
      .attach(new HitboxComponent(
        Game.WORLD_WIDTH / 2 - 24,
        Game.WORLD_HEIGHT / 2 - 24,
        48, 48,
        { tags: ['player'] }))
      .attach(new AnimatedSpriteComponent(cfg.player.sprite, { animationSpeed: 0.3 }))
      .attach(new ControllerComponent(this.input, cfg.player.speed))
      .attach(new ScarerComponent())
      .attach(new WhistlerComponent(this.input)));

    // Dog
    if (cfg.dog.enabled) {
      this.addEntity(new Entity()
        .attach(new HitboxComponent(cfg.dog.startX, cfg.dog.startY, 48, 48,
          { tags: ['dog'] }))
        .attach(new AnimatedSpriteComponent(cfg.dog.sprite, { animationSpeed: 0.5 }))
        .attach(new ScarerComponent())
        .attach(new WanderComponent(cfg.dog.wandering))
        .attach(new WoofComponent(cfg.dog.woof.interval, cfg.dog.woof.chance))
        .attach(new WhistleListenerComponent(cfg.dog.maxSpeed)));
    }

    // Cat Spawner
    this.addEntity(new Entity()
      .attach(new HitboxComponent(0, 0, 100, 100))
      .attach(new SpawnerComponent(
        this.catFactory.create.bind(this.catFactory),
        {
          attemptsPerInterval: cfg.catSpawnerConfig.attemptsPerInterval.min,
          chanceToSpawn: cfg.catSpawnerConfig.chanceToSpawn.min,
          interval: cfg.catSpawnerConfig.interval.min,
          maxChildren: cfg.catSpawnerConfig.maxChildren.min
        }
      ))
      .attach(new DifficultyCurveComponent(cfg)));

    // Cat Rescuer
    this.addEntity(new Entity()
      .attach(new RescuerComponent())
    );

    // Pen
    this.addEntity(new Entity()
      .attach(new HitboxComponent(
        cfg.pen.positionX,
        cfg.pen.positionY,
        cfg.pen.width, cfg.pen.height,
        { blocks: ['player', 'dog'] }
      ))
      .attach(new SpriteComponent(cfg.pen.sprite))
      .attach(new JailerComponent(cfg.pen.chanceOfEscape, cfg.pen.minCaptureTime, cfg.pen.escapeAttemptFrequency)));

    // Left Table
    if (cfg.leftTable.enabled) {
      this.addEntity(new Entity()
        .attach(new HitboxComponent(
          cfg.leftTable.positionX,
          cfg.leftTable.positionY,
          cfg.leftTable.width,
          cfg.leftTable.height,
          { blocks: ['player'] }
        ))
        .attach(new SpriteComponent(cfg.leftTable.sprite, { zIndex: 1 })));
    }

    // Right Table
    if (cfg.rightTable.enabled) {
      this.addEntity(new Entity()
        .attach(new HitboxComponent(
          cfg.rightTable.positionX,
          cfg.rightTable.positionY,
          cfg.rightTable.width,
          cfg.rightTable.height,
          { blocks: ['player'] }
        ))
        .attach(new SpriteComponent(cfg.rightTable.sprite, { zIndex: 1 })));
    }

    // Background
    this.addEntity(new Entity()
      .attach(new HitboxComponent(0, 0, Game.WORLD_WIDTH, Game.WORLD_HEIGHT))
      .attach(new SpriteComponent(cfg.background.sprite, { zIndex: -1 }, true)));
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

    if (!this.gameStarted) {
      if (this.input.isPressed(Input.SPACE)) {
        this.gameStarted = true;
      }
      return;
    }

    if (this.isGameOver()) {
      this.app.stage.addChild(this.restartPixiText);
      if (this.input.isPressed(Input.SPACE)) {
        this.resetGame();
        this.app.stage.removeChild(this.restartPixiText);
      }
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

  public isGameOver(): boolean {
    return this.state.lives <= 0;
  }

  private resetGame(): void {
    this.entities.forEach(entity => entity.destroy());
    this.entities = [];
    this.state = new GameState(cfg.player.lives);
    this.initEntities();
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

        if (e1Hitbox && e2Hitbox && e1Hitbox.intersects(e2Hitbox)) {
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
